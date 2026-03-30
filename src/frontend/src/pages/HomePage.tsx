import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Quote } from "../backend.d";
import { useGetQuotes } from "../hooks/useQueries";

const FALLBACK_QUOTES: Quote[] = [
  {
    id: 1n,
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    id: 2n,
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    id: 3n,
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    id: 4n,
    text: "Hard work beats talent when talent doesn't work hard.",
    author: "Tim Notke",
  },
  {
    id: 5n,
    text: "Your only limit is your mind. Study with purpose, succeed with passion.",
    author: "Unknown",
  },
  {
    id: 6n,
    text: "Medicine is learned by the bedside and not in the classroom.",
    author: "Sir William Osler",
  },
];

const FEATURES = [
  {
    icon: "📚",
    title: "Module-Based Learning",
    desc: "Questions organized by day and module for systematic study",
  },
  {
    icon: "✅",
    title: "Instant Feedback",
    desc: "Green for correct, red for wrong — learn from every answer immediately",
  },
  {
    icon: "📊",
    title: "Track Progress",
    desc: "Score tracking after each module session to measure your improvement",
  },
];

// Launch page color palette
const HERO_BG = "#d4edda"; // soft light green
const HERO_TEXT = "#1a3d2b"; // deep green for readability
const ACCENT_BTN = "#f9e04b"; // warm yellow
const ACCENT_BTN_HOVER = "#f5d200";
const DOT_BORDER = "#1a3d2b";

interface HomePageProps {
  onStartDrilling: () => void;
}

export default function HomePage({ onStartDrilling }: HomePageProps) {
  const { data: backendQuotes } = useGetQuotes();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [btnHover, setBtnHover] = useState(false);

  const quotes =
    backendQuotes && backendQuotes.length > 0 ? backendQuotes : FALLBACK_QUOTES;

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const currentQuote = quotes[quoteIndex];

  return (
    <div>
      {/* Hero */}
      <section
        style={{ backgroundColor: HERO_BG }}
        className="min-h-[80vh] flex items-center"
      >
        <div className="max-w-6xl mx-auto px-4 py-16 w-full">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Quote Side */}
            <div style={{ color: HERO_TEXT }}>
              <div className="mb-4">
                <span
                  style={{
                    backgroundColor: ACCENT_BTN,
                    color: HERO_TEXT,
                    border: `2px solid ${HERO_TEXT}`,
                  }}
                  className="inline-block text-xs font-black uppercase px-3 py-1 rounded-full shadow-comic-sm"
                >
                  💡 Daily Motivation
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <blockquote
                    style={{ color: HERO_TEXT }}
                    className="text-3xl md:text-4xl font-black leading-tight mb-4"
                  >
                    "{currentQuote.text}"
                  </blockquote>
                  <p
                    style={{ color: HERO_TEXT, opacity: 0.75 }}
                    className="text-lg font-bold"
                  >
                    — {currentQuote.author}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Quote dots */}
              <div className="flex gap-2 mt-8">
                {quotes.map((q, i) => (
                  <button
                    type="button"
                    key={q.id.toString()}
                    onClick={() => setQuoteIndex(i)}
                    style={{
                      borderColor: DOT_BORDER,
                      backgroundColor:
                        i === quoteIndex ? DOT_BORDER : "transparent",
                    }}
                    className="w-3 h-3 rounded-full border-2 transition-all"
                  />
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div
                style={{ border: `4px solid ${HERO_TEXT}` }}
                className="bg-white rounded-2xl shadow-comic-lg p-8 text-center"
              >
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase leading-tight mb-3">
                  READY TO ACE YOUR EXAMS?
                </h2>
                <p className="text-muted-foreground font-bold mb-6">
                  Practice KUHS MCQs module by module. Track your progress and
                  master every topic!
                </p>
                <button
                  type="button"
                  data-ocid="home.start_drilling.primary_button"
                  onClick={onStartDrilling}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  style={{
                    backgroundColor: btnHover ? ACCENT_BTN_HOVER : ACCENT_BTN,
                    color: HERO_TEXT,
                    borderWidth: "3px",
                    borderStyle: "solid",
                    borderColor: HERO_TEXT,
                  }}
                  className="w-full font-black uppercase text-lg px-8 py-4 rounded-xl shadow-comic hover:translate-y-[-2px] hover:shadow-comic-lg transition-all duration-150 active:translate-y-[2px] active:shadow-none"
                >
                  START DRILLING →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black uppercase text-center mb-10">
            Why <span className="text-primary">KUHS MCQ DRILL</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-comic p-6 text-center"
                style={{
                  borderWidth: "3px",
                  borderStyle: "solid",
                  borderColor: "#000",
                }}
              >
                <div className="text-5xl mb-3">{f.icon}</div>
                <h3 className="font-black uppercase text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground font-bold text-sm">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
