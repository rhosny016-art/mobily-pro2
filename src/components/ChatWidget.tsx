import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, RefreshCw } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildReply } from "@/lib/chatEngine";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const WELCOME: ChatMessage = {
  role: "model",
  text: "أهلاً بك في **دلّني** 👋 أنا **دَلّوب**، مستشارك التسويقي الذكي.\n\nاسألني عن أي شيء: تصدّر خرائط Google، إدارة الحملات الإعلانية، عرض مخصص لنشاطك، أو احجز استشارتك المجانية فوراً. 🚀",
};

const QUICK_REPLIES = [
  "كيف ترفع ترتيبي على خرائط Google؟",
  "كيف أحصل على أفضل نتيجة؟",
  "كيف أحصل على عرض مخصص لخدماتكم؟",
  "كيف أدير حملة إعلانية مربحة؟",
  "أريد حجز استشارة مجانية",
];

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-night-900">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

function ChatContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flushList = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key} className="space-y-1.5 my-2">
          {list.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[13px] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-500 mt-[7px] shrink-0" aria-hidden="true" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      list.push(trimmed.slice(2));
    } else {
      flushList(`ul-${i}`);
      if (trimmed) {
        blocks.push(
          <p key={i} className="text-[13px] leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      }
    }
  });
  flushList("ul-final");

  return <div className="space-y-1">{blocks}</div>;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem("dalni_chat");
      if (saved) return JSON.parse(saved) as ChatMessage[];
    } catch {
      /* ignore */
    }
    return [WELCOME];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(true);
  const [teaser, setTeaser] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (unread && !open) {
      const t = window.setTimeout(() => setTeaser(true), 4500);
      return () => window.clearTimeout(t);
    }
    setTeaser(false);
  }, [unread, open]);

  const persist = (msgs: ChatMessage[]) => {
    try {
      sessionStorage.setItem("dalni_chat", JSON.stringify(msgs.slice(-40)));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setUnread(false);
    };
    window.addEventListener("dalni:open-chat", onOpen);
    return () => window.removeEventListener("dalni:open-chat", onOpen);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      window.setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;
    setTeaser(false);
    setError("");
    const next: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(next);
    persist(next);
    setInput("");
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 550));
      const reply: ChatMessage = { role: "model", text: buildReply(text) };
      const final = [...next, reply];
      setMessages(final);
      persist(final);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Teaser bubble */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-[70] glass-strong text-slate-200 text-sm font-semibold px-4 py-3 rounded-2xl rounded-br-sm shadow-glass max-w-[240px]"
          >
            <span className="text-brass-300 font-extrabold">مرحباً!</span> أنا دلّوب — اسألني أي شيء عن خدماتنا 👋
            <button
              type="button"
              onClick={() => setTeaser(false)}
              aria-label="إغلاق"
              className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:bg-white/20 transition"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setUnread(false);
        }}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full text-night-950 shadow-[0_14px_40px_-10px_rgba(237,155,47,0.8)]"
        style={{ background: "linear-gradient(135deg,#ffe9bf 0%,#f7b955 50%,#ed9b2f 100%)" }}
        aria-label={open ? "إغلاق محادثة دَلّوب" : "افتح محادثة دَلّوب الذكي"}
      >
        {unread && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-mint-500 border-2 border-night-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </span>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-[380px] flex flex-col h-[min(600px,calc(100dvh-8rem))] rounded-[26px] overflow-hidden bg-night-950 border border-white/10 shadow-glass"
            role="dialog"
            aria-label="محادثة دَلّوب المساعد الذكي"
          >
            {/* Header */}
            <div className="relative px-4 sm:px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-l from-night-800 to-night-900">
              <div className="relative shrink-0">
                <span className="absolute inset-0 rounded-full bg-brass-400/25 animate-ping-ring" />
                <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-night-950">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-white font-extrabold text-sm flex items-center gap-1.5">
                  دَلّوب
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-mint-400 bg-mint-500/10 border border-mint-500/25 rounded-full px-2 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-mint-400 animate-pulse-soft" />
                    متصل
                  </span>
                </p>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">مستشارك التسويقي الذكي</p>
              </div>
              <div className="ms-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMessages([WELCOME]);
                    persist([WELCOME]);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/8 transition"
                  aria-label="إعادة تعيين المحادثة"
                  title="محادثة جديدة"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/8 transition"
                  aria-label="إغلاق المحادثة"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-aurora">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-start flex-row-reverse" : "justify-start"}`}>
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                      m.role === "user"
                        ? "bg-gradient-to-l from-brass-600 to-brass-500 text-night-950 rounded-bl-sm font-bold"
                        : "bg-white/95 text-night-800 border border-white/10 rounded-br-sm"
                    }`}
                  >
                    {m.role === "model" ? <ChatContent text={m.text} /> : <p className="text-[13px] leading-relaxed">{m.text}</p>}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/95 border border-white/10 rounded-2xl rounded-br-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="typing-dot w-1.5 h-1.5 rounded-full bg-brass-500"
                        style={{ animationDelay: `${d * 0.18}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-[11px] text-rose-300 font-bold px-1">{error}</p>
              )}
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="text-[11px] font-bold text-brass-300 bg-brass-500/10 border border-brass-500/25 rounded-full px-3 py-1.5 hover:bg-brass-500/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={onSubmit} className="p-3 pt-2 border-t border-white/10 bg-night-900/80">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 min-w-0 rounded-full bg-white/6 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brass-500/50 focus:ring-2 focus:ring-brass-500/20 transition"
                  aria-label="اكتب رسالتك"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-l from-brass-600 to-brass-500 text-night-950 shadow-[0_8px_20px_-6px_rgba(237,155,47,0.6)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="إرسال"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-center">
                <a
                  href={buildWhatsAppLink("مرحباً، أريد التحدث مع فريق دلّني مباشرة 🙏")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-mint-400 hover:text-mint-300 transition-colors"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" />
                  تفضّل التحدث مع فريق حقيقي؟ واتساب مباشرة
                </a>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
