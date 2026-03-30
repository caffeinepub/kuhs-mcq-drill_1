import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Module, Question, Quote } from "../backend.d";
import { useActor } from "./useActor";

export function useGetQuotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Quote[]>({
    queryKey: ["quotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetModules() {
  const { actor, isFetching } = useActor();
  return useQuery<Module[]>({
    queryKey: ["modules"],
    queryFn: async () => {
      if (!actor) return [];
      const modules = await actor.getModules();
      return [...modules].sort(
        (a, b) => Number(a.orderIndex) - Number(b.orderIndex),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuestionsByModule(moduleId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Question[]>({
    queryKey: ["questions", moduleId?.toString()],
    queryFn: async () => {
      if (!actor || moduleId === null) return [];
      const qs = await actor.getQuestionsByModule(moduleId);
      return [...qs].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
    },
    enabled: !!actor && !isFetching && moduleId !== null,
  });
}

export function useAddModule() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      orderIndex,
    }: { id: bigint; name: string; orderIndex: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.addModule(id, name, orderIndex);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
}

export function useDeleteModule() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteModule(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modules"] }),
  });
}

export function useAddQuestion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      moduleId: bigint;
      questionText: string;
      options: string[];
      correctOptionIndex: bigint;
      explanation: string;
      createdAt: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addQuestion(
        params.id,
        params.moduleId,
        params.questionText,
        params.options,
        params.correctOptionIndex,
        params.explanation,
        params.createdAt,
      );
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["questions", vars.moduleId.toString()],
      }),
  });
}

export function useDeleteQuestion() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      moduleId: _moduleId,
    }: { id: bigint; moduleId: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteQuestion(id);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["questions", vars.moduleId.toString()],
      }),
  });
}

export function useCheckAdminPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("No actor");
      return actor.isAdminPasswordCorrect(password);
    },
  });
}
