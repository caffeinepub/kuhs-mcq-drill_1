import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Module, Question } from "../backend.d";
import { useGetModules, useGetQuestionsByModule } from "../hooks/useQueries";

const OPTION_LABELS = ["A", "B", "C", "D"];

function QuestionCard({
  question,
  questionNumber,
  total,
  onNext,
}: {
  question: Question;
  questionNumber: number;
  total: number;
  onNext: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correctIdx = Number(question.correctOptionIndex);

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
  }

  function getOptionStyle(idx: number): string {
    const base =
      "w-full text-left px-5 py-4 rounded-xl font-black text-base transition-all";
    if (!answered) {
      return `${base} bg-white hover:bg-secondary hover:shadow-comic-sm cursor-pointer`;
    }
    if (idx === correctIdx) {
      return `${base} bg-green-500 text-white`;
    }
    if (idx === selected) {
      return `${base} bg-red-500 text-white`;
    }
    return `${base} bg-white opacity-60`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="bg-white rounded-2xl shadow-comic p-6 md:p-8"
      style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "#000" }}
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm font-black text-muted-foreground uppercase">
          Question {questionNumber} of {total}
        </span>
        <div className="bg-primary text-white text-sm font-black px-3 py-1 rounded-full border-2 border-black">
          {Math.round(((questionNumber - 1) / total) * 100)}%
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 border-2 border-black mb-6">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${((questionNumber - 1) / total) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-xl md:text-2xl font-black mb-6 leading-snug">
        {question.questionText}
      </h3>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-6">
        {question.options.map((opt, idx) => (
          <button
            type="button"
            key={`opt-${question.id.toString()}-${idx}`}
            data-ocid={`mcq.option.${idx + 1}`}
            onClick={() => handleSelect(idx)}
            className={getOptionStyle(idx)}
            style={{
              borderWidth: "3px",
              borderStyle: "solid",
              borderColor:
                answered && idx === correctIdx
                  ? "#15803d"
                  : answered && idx === selected
                    ? "#b91c1c"
                    : "#000",
            }}
          >
            <span className="inline-flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg border-2 border-black font-black text-sm flex items-center justify-center flex-shrink-0 ${
                  answered && idx === correctIdx
                    ? "bg-white text-green-700"
                    : answered && idx === selected && idx !== correctIdx
                      ? "bg-white text-red-700"
                      : "bg-secondary"
                }`}
              >
                {OPTION_LABELS[idx]}
              </span>
              {opt}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="bg-secondary rounded-xl p-4 mb-5"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: "#000",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">
                  {selected === correctIdx ? "✅" : "❌"}
                </span>
                <span className="font-black uppercase text-sm">
                  {selected === correctIdx ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="font-bold text-sm text-foreground">
                {question.explanation}
              </p>
            </div>

            <button
              type="button"
              data-ocid="mcq.next.button"
              onClick={() => onNext(selected === correctIdx)}
              className="w-full bg-primary text-white font-black uppercase text-base px-6 py-4 rounded-xl shadow-comic hover:translate-y-[-2px] hover:shadow-comic-lg transition-all duration-150"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: "#000",
              }}
            >
              {questionNumber < total ? "NEXT QUESTION →" : "FINISH SESSION 🏁"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CompletionScreen({
  score,
  total,
  onRestart,
}: { score: number; total: number; onRestart: () => void }) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪";
  const msg =
    pct >= 80
      ? "Excellent Work!"
      : pct >= 60
        ? "Good Effort!"
        : "Keep Practicing!";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-comic-lg p-8 text-center"
      style={{ borderWidth: "3px", borderStyle: "solid", borderColor: "#000" }}
    >
      <div className="text-7xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-black uppercase mb-2">{msg}</h2>
      <p className="text-muted-foreground font-bold mb-6">You scored</p>
      <div className="text-6xl font-black text-primary mb-2">
        {score}/{total}
      </div>
      <div className="text-2xl font-black text-foreground mb-8">{pct}%</div>
      <button
        type="button"
        data-ocid="mcq.restart.button"
        onClick={onRestart}
        className="w-full bg-primary text-white font-black uppercase text-base px-6 py-4 rounded-xl shadow-comic hover:translate-y-[-2px] transition-all"
        style={{
          borderWidth: "3px",
          borderStyle: "solid",
          borderColor: "#000",
        }}
      >
        TRY AGAIN 🔁
      </button>
    </motion.div>
  );
}

function ModuleQuestions({ module }: { module: Module }) {
  const { data: questions, isLoading } = useGetQuestionsByModule(module.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  function handleNext(correct: boolean) {
    const newScore = correct ? score + 1 : score;
    if (currentIndex + 1 >= (questions?.length ?? 0)) {
      setScore(newScore);
      setFinished(true);
    } else {
      setScore(newScore);
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
  }

  if (isLoading) {
    return (
      <div
        data-ocid="mcq.loading_state"
        className="flex items-center justify-center py-20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black uppercase text-muted-foreground">
            Loading Questions...
          </p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div data-ocid="mcq.empty_state" className="text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-2xl font-black uppercase mb-2">No Questions Yet</h3>
        <p className="text-muted-foreground font-bold">
          Ask your admin to add questions for this module.
        </p>
      </div>
    );
  }

  if (finished) {
    return (
      <CompletionScreen
        score={score}
        total={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <QuestionCard
        key={`${module.id}-${currentIndex}`}
        question={questions[currentIndex]}
        questionNumber={currentIndex + 1}
        total={questions.length}
        onNext={handleNext}
      />
    </AnimatePresence>
  );
}

export default function MCQPage() {
  const { data: modules, isLoading } = useGetModules();
  const [activeModuleId, setActiveModuleId] = useState<bigint | null>(null);

  const activeModule =
    modules?.find((m) => m.id === activeModuleId) ?? modules?.[0] ?? null;

  if (isLoading) {
    return (
      <div
        data-ocid="mcq.loading_state"
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-black uppercase text-muted-foreground">
            Loading Modules...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase mb-1">
          MCQ <span className="text-primary">DRILL</span>
        </h1>
        <p className="text-muted-foreground font-bold">
          Select a module and start practicing
        </p>
      </div>

      {modules && modules.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2 mb-8" data-ocid="mcq.tab">
            {modules.map((mod) => {
              const isActive = (activeModuleId ?? modules[0]?.id) === mod.id;
              return (
                <button
                  type="button"
                  key={mod.id.toString()}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`px-4 py-2 rounded-xl font-black text-sm uppercase transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-comic-sm"
                      : "bg-white text-foreground hover:bg-secondary"
                  }`}
                  style={{
                    borderWidth: "3px",
                    borderStyle: "solid",
                    borderColor: "#000",
                  }}
                >
                  {mod.name}
                </button>
              );
            })}
          </div>
          {activeModule && (
            <ModuleQuestions
              key={activeModule.id.toString()}
              module={activeModule}
            />
          )}
        </>
      ) : (
        <div data-ocid="mcq.empty_state" className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-black uppercase mb-2">No Modules Yet</h3>
          <p className="text-muted-foreground font-bold">
            Ask your admin to add modules and questions.
          </p>
        </div>
      )}
    </div>
  );
}
