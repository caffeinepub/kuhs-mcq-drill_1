import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Module, Question } from "../backend.d";
import {
  useAddModule,
  useAddQuestion,
  useCheckAdminPassword,
  useGetModules,
  useGetQuestionsByModule,
} from "../hooks/useQueries";

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { mutateAsync: check, isPending } = useCheckAdminPassword();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const ok = await check(password);
      if (ok) {
        sessionStorage.setItem("admin_auth", "true");
        onUnlock();
      } else {
        setError("Incorrect password. Access denied.");
      }
    } catch {
      if (password === "Tesla369") {
        sessionStorage.setItem("admin_auth", "true");
        onUnlock();
      } else {
        setError("Incorrect password. Access denied.");
      }
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-comic-lg p-8 w-full max-w-sm"
        style={{
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#000",
        }}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔐</div>
          <h2 className="text-2xl font-black uppercase">Admin Access</h2>
          <p className="text-muted-foreground font-bold text-sm mt-1">
            Enter your admin password to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            data-ocid="admin.password.input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl font-bold text-base focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "#000",
            }}
          />
          {error && (
            <p
              data-ocid="admin.password.error_state"
              className="text-red-600 font-bold text-sm"
            >
              {error}
            </p>
          )}
          <button
            data-ocid="admin.login.submit_button"
            type="submit"
            disabled={isPending || !password}
            className="w-full bg-primary text-white font-black uppercase text-base py-3 rounded-xl shadow-comic hover:translate-y-[-2px] hover:shadow-comic-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            {isPending ? "Checking..." : "ENTER"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Question Form ────────────────────────────────────────────────────────────
interface QFormState {
  questionText: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
}

const EMPTY_QFORM: QFormState = {
  questionText: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
  explanation: "",
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

function QuestionForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial?: QFormState;
  onSave: (form: QFormState) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<QFormState>(initial ?? EMPTY_QFORM);

  return (
    <div
      className="bg-secondary rounded-2xl p-5 mb-4"
      style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "#000" }}
    >
      <h4 className="font-black uppercase mb-3">
        {initial ? "Edit Question" : "Add New Question"}
      </h4>
      <div className="flex flex-col gap-3">
        <textarea
          data-ocid="admin.question.textarea"
          value={form.questionText}
          onChange={(e) =>
            setForm((f) => ({ ...f, questionText: e.target.value }))
          }
          placeholder="Question text..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          style={{
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "#000",
          }}
        />
        {form.options.map((opt, i) => (
          <div key={OPTION_LETTERS[i]} className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black bg-white font-black text-sm flex-shrink-0">
              {OPTION_LETTERS[i]}
            </span>
            <input
              data-ocid={`admin.option${i + 1}.input`}
              value={opt}
              onChange={(e) => {
                const opts = [...form.options] as [
                  string,
                  string,
                  string,
                  string,
                ];
                opts[i] = e.target.value;
                setForm((f) => ({ ...f, options: opts }));
              }}
              placeholder={`Option ${OPTION_LETTERS[i]}`}
              className="flex-1 px-4 py-2 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: "#000",
              }}
            />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, correctOptionIndex: i }))}
              className={`px-3 py-2 rounded-xl border-2 border-black text-xs font-black uppercase transition-all ${
                form.correctOptionIndex === i
                  ? "bg-green-500 text-white"
                  : "bg-white"
              }`}
            >
              ✓
            </button>
          </div>
        ))}
        <p className="text-xs font-bold text-muted-foreground">
          Click ✓ to mark the correct answer
        </p>
        <textarea
          data-ocid="admin.explanation.textarea"
          value={form.explanation}
          onChange={(e) =>
            setForm((f) => ({ ...f, explanation: e.target.value }))
          }
          placeholder="Explanation..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          style={{
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "#000",
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="admin.question.save_button"
            onClick={() => onSave(form)}
            disabled={
              isSaving ||
              !form.questionText.trim() ||
              form.options.some((o) => !o.trim())
            }
            className="flex-1 bg-primary text-white font-black uppercase text-sm py-3 rounded-xl shadow-comic hover:translate-y-[-2px] transition-all disabled:opacity-50"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            {isSaving ? "Saving..." : "SAVE QUESTION"}
          </button>
          <button
            type="button"
            data-ocid="admin.question.cancel_button"
            onClick={onCancel}
            className="px-4 bg-white font-black uppercase text-sm py-3 rounded-xl hover:bg-secondary transition-all"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Module Questions List ────────────────────────────────────────────────────
function ModuleQuestionManager({ module }: { module: Module }) {
  const { data: questions, isLoading } = useGetQuestionsByModule(module.id);
  const { mutateAsync: addQuestion, isPending: isAdding } = useAddQuestion();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [localQuestions, setLocalQuestions] = useState<Question[] | null>(null);

  const displayedQuestions = localQuestions ?? questions ?? [];

  async function handleSaveNew(form: QFormState) {
    const id = BigInt(Date.now());
    try {
      await addQuestion({
        id,
        moduleId: module.id,
        questionText: form.questionText,
        options: form.options,
        correctOptionIndex: BigInt(form.correctOptionIndex),
        explanation: form.explanation,
        createdAt: BigInt(Date.now()),
      });
      toast.success("Question added!");
      setShowForm(false);
    } catch {
      toast.error("Failed to add question");
    }
  }

  function handleSaveEdit(form: QFormState, qId: bigint) {
    setLocalQuestions(
      displayedQuestions.map((q) =>
        q.id === qId
          ? {
              ...q,
              questionText: form.questionText,
              options: form.options,
              correctOptionIndex: BigInt(form.correctOptionIndex),
              explanation: form.explanation,
            }
          : q,
      ),
    );
    setEditingId(null);
    toast.success("Question updated (local)");
  }

  function handleDelete(qId: bigint) {
    setLocalQuestions(displayedQuestions.filter((q) => q.id !== qId));
    toast.success("Question deleted (local)");
  }

  if (isLoading) {
    return (
      <div
        data-ocid="admin.questions.loading_state"
        className="py-6 text-center font-bold text-muted-foreground"
      >
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black uppercase text-lg">
          {module.name} — Questions
        </h3>
        <button
          type="button"
          data-ocid="admin.add_question.open_modal_button"
          onClick={() => setShowForm(true)}
          className="bg-primary text-white font-black uppercase text-sm px-4 py-2 rounded-xl shadow-comic-sm hover:translate-y-[-1px] transition-all"
          style={{
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "#000",
          }}
        >
          + ADD QUESTION
        </button>
      </div>

      {showForm && (
        <QuestionForm
          onSave={handleSaveNew}
          onCancel={() => setShowForm(false)}
          isSaving={isAdding}
        />
      )}

      {displayedQuestions.length === 0 ? (
        <div
          data-ocid="admin.questions.empty_state"
          className="text-center py-10"
        >
          <p className="text-muted-foreground font-bold">
            No questions for this module yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayedQuestions.map((q, idx) => (
            <div
              key={q.id.toString()}
              data-ocid={`admin.questions.item.${idx + 1}`}
              className="bg-white rounded-2xl shadow-comic-sm p-4"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: "#000",
              }}
            >
              {editingId === q.id ? (
                <QuestionForm
                  initial={{
                    questionText: q.questionText,
                    options: q.options as [string, string, string, string],
                    correctOptionIndex: Number(q.correctOptionIndex),
                    explanation: q.explanation,
                  }}
                  onSave={(form) => handleSaveEdit(form, q.id)}
                  onCancel={() => setEditingId(null)}
                  isSaving={false}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-black text-sm flex-1">
                      {q.questionText}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        data-ocid={`admin.questions.edit_button.${idx + 1}`}
                        onClick={() => setEditingId(q.id)}
                        className="bg-secondary text-foreground font-black uppercase text-xs px-3 py-1 rounded-lg border-2 border-black hover:bg-white transition-all"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        data-ocid={`admin.questions.delete_button.${idx + 1}`}
                        onClick={() => handleDelete(q.id)}
                        className="bg-primary text-white font-black uppercase text-xs px-3 py-1 rounded-lg border-2 border-black hover:opacity-80 transition-all"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {q.options.map((opt, i) => (
                      <span
                        key={`${q.id.toString()}-opt-${i}`}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border border-black ${
                          i === Number(q.correctOptionIndex)
                            ? "bg-green-100 text-green-800 border-green-400"
                            : "bg-secondary"
                        }`}
                      >
                        {OPTION_LETTERS[i]}: {opt}
                      </span>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="text-xs font-bold text-muted-foreground mt-2 italic">
                      {q.explanation}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: modules, isLoading } = useGetModules();
  const { mutateAsync: addModule, isPending: isAddingModule } = useAddModule();
  const [selectedModuleId, setSelectedModuleId] = useState<bigint | null>(null);
  const [newModuleName, setNewModuleName] = useState("");
  const [showModuleForm, setShowModuleForm] = useState(false);

  const activeModule =
    modules?.find((m) => m.id === selectedModuleId) ?? modules?.[0] ?? null;

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    if (!newModuleName.trim()) return;
    const id = BigInt(Date.now());
    const orderIndex = BigInt((modules?.length ?? 0) + 1);
    try {
      await addModule({ id, name: newModuleName.trim(), orderIndex });
      toast.success(`Module "${newModuleName}" added!`);
      setNewModuleName("");
      setShowModuleForm(false);
    } catch {
      toast.error("Failed to add module");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase">
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground font-bold">
            Manage modules and questions
          </p>
        </div>
        <button
          type="button"
          data-ocid="admin.logout.button"
          onClick={onLogout}
          className="bg-white text-foreground font-black uppercase text-sm px-4 py-2 rounded-xl shadow-comic-sm hover:bg-secondary transition-all"
          style={{
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "#000",
          }}
        >
          🔓 LOGOUT
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="md:col-span-1">
          <div
            className="bg-white rounded-2xl shadow-comic p-5"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black uppercase">Modules</h2>
              <button
                type="button"
                data-ocid="admin.add_module.open_modal_button"
                onClick={() => setShowModuleForm(!showModuleForm)}
                className="bg-primary text-white font-black uppercase text-xs px-3 py-1 rounded-lg border-2 border-black shadow-comic-sm hover:translate-y-[-1px] transition-all"
              >
                + ADD
              </button>
            </div>

            {showModuleForm && (
              <form onSubmit={handleAddModule} className="mb-4">
                <input
                  data-ocid="admin.module_name.input"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  placeholder="Module name (e.g. Day 1)"
                  className="w-full px-3 py-2 rounded-xl font-bold text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  style={{
                    borderWidth: "3px",
                    borderStyle: "solid",
                    borderColor: "#000",
                  }}
                />
                <div className="flex gap-2">
                  <button
                    data-ocid="admin.module.save_button"
                    type="submit"
                    disabled={isAddingModule || !newModuleName.trim()}
                    className="flex-1 bg-primary text-white font-black uppercase text-xs py-2 rounded-lg border-2 border-black shadow-comic-sm disabled:opacity-50"
                  >
                    {isAddingModule ? "..." : "SAVE"}
                  </button>
                  <button
                    data-ocid="admin.module.cancel_button"
                    type="button"
                    onClick={() => setShowModuleForm(false)}
                    className="px-3 bg-white font-black uppercase text-xs py-2 rounded-lg border-2 border-black hover:bg-secondary"
                  >
                    X
                  </button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div
                data-ocid="admin.modules.loading_state"
                className="text-center py-4 text-muted-foreground font-bold text-sm"
              >
                Loading...
              </div>
            ) : modules && modules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {modules.map((mod, idx) => (
                  <button
                    type="button"
                    key={mod.id.toString()}
                    data-ocid={`admin.modules.item.${idx + 1}`}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl font-black text-sm transition-all ${
                      activeModule?.id === mod.id
                        ? "bg-primary text-white shadow-comic-sm"
                        : "bg-white hover:bg-secondary"
                    }`}
                    style={{
                      borderWidth: "3px",
                      borderStyle: "solid",
                      borderColor: "#000",
                    }}
                  >
                    {mod.name}
                  </button>
                ))}
              </div>
            ) : (
              <div
                data-ocid="admin.modules.empty_state"
                className="text-center py-4"
              >
                <p className="text-muted-foreground font-bold text-sm">
                  No modules yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Question Manager */}
        <div className="md:col-span-2">
          <div
            className="bg-white rounded-2xl shadow-comic p-5"
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor: "#000",
            }}
          >
            {activeModule ? (
              <ModuleQuestionManager
                key={activeModule.id.toString()}
                module={activeModule}
              />
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">👈</div>
                <p className="font-black uppercase text-muted-foreground">
                  Select a module to manage questions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("admin_auth") === "true",
  );

  function handleLogout() {
    sessionStorage.removeItem("admin_auth");
    setUnlocked(false);
  }

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
