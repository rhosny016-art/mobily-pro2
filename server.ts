import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { buildReply } from "./src/lib/chatEngine";

// Load environment variables for local development (Vite handles the client env)
dotenv.config();
dotenv.config({ path: ".env.local" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // Simple in-memory rate limiter for the chat API
  const chatHits = new Map<string, { count: number; resetAt: number }>();
  app.use("/api/chat", (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const entry = chatHits.get(ip);
    if (!entry || entry.resetAt < now) {
      chatHits.set(ip, { count: 1, resetAt: now + 60_000 });
      return next();
    }
    entry.count += 1;
    if (entry.count > 30) {
      return res.status(429).json({ error: "طلبات كثيرة جداً، حاول مرة أخرى بعد قليل." });
    }
    next();
  });

  // API Route for the rules-based Chat Assistant
  app.post("/api/chat", (req, res) => {
    try {
      const { message } = req.body;
      if (typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "الرسالة مطلوبة" });
      }
      if (message.length > 500) {
        return res.status(400).json({ error: "الرسالة طويلة جداً، يرجى اختصارها." });
      }
      const text = buildReply(message);
      res.json({ text });
    } catch (err: any) {
      console.error("Chat assistant error:", err);
      res.status(500).json({ error: "حدث خطأ أثناء معالجة طلبك، يرجى المحاولة مرة أخرى." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
