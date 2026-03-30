import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Quote {
    id: bigint;
    text: string;
    author: string;
}
export interface Question {
    id: bigint;
    moduleId: bigint;
    explanation: string;
    createdAt: bigint;
    questionText: string;
    correctOptionIndex: bigint;
    options: Array<string>;
}
export interface Module {
    id: bigint;
    name: string;
    orderIndex: bigint;
}
export interface backendInterface {
    addModule(id: bigint, name: string, orderIndex: bigint): Promise<void>;
    addQuestion(id: bigint, moduleId: bigint, questionText: string, options: Array<string>, correctOptionIndex: bigint, explanation: string, createdAt: bigint): Promise<void>;
    addQuote(id: bigint, text: string, author: string): Promise<void>;
    deleteQuestion(id: bigint): Promise<void>;
    getModules(): Promise<Array<Module>>;
    getQuestionsByModule(moduleId: bigint): Promise<Array<Question>>;
    getQuotes(): Promise<Array<Quote>>;
    isAdminPasswordCorrect(password: string): Promise<boolean>;
}
