import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import MCQPage from "./pages/MCQPage";

type Page = "home" | "mcq" | "admin";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen bg-background font-nunito">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-comic">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0"
            onClick={() => setPage("home")}
          >
            <div className="w-10 h-10 bg-primary rounded-xl border-2 border-black flex items-center justify-center shadow-comic-sm">
              <span className="text-white text-lg font-black">K</span>
            </div>
            <div className="leading-tight">
              <div className="text-base font-black text-foreground uppercase tracking-wide">
                KUHS
              </div>
              <div className="text-xs font-black text-primary uppercase tracking-widest">
                MCQ DRILL
              </div>
            </div>
          </button>

          {/* Nav */}
          <nav className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="nav.home.link"
              onClick={() => setPage("home")}
              className={`px-4 py-2 rounded-xl border-2 border-black font-black text-sm uppercase transition-all ${
                page === "home"
                  ? "bg-primary text-white shadow-comic-sm"
                  : "bg-white text-foreground hover:bg-secondary"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              data-ocid="nav.mcq.link"
              onClick={() => setPage("mcq")}
              className={`px-4 py-2 rounded-xl border-2 border-black font-black text-sm uppercase transition-all ${
                page === "mcq"
                  ? "bg-primary text-white shadow-comic-sm"
                  : "bg-white text-foreground hover:bg-secondary"
              }`}
            >
              MCQ Drill
            </button>
            <button
              type="button"
              data-ocid="nav.admin.link"
              onClick={() => setPage("admin")}
              className={`px-4 py-2 rounded-xl border-2 border-black font-black text-sm uppercase transition-all ${
                page === "admin"
                  ? "bg-primary text-white shadow-comic-sm"
                  : "bg-white text-foreground hover:bg-secondary"
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main>
        {page === "home" && <HomePage onStartDrilling={() => setPage("mcq")} />}
        {page === "mcq" && <MCQPage />}
        {page === "admin" && <AdminPage />}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
