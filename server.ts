import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL, -- 'main' or 'supporting'
    description TEXT,
    problem TEXT,
    strategy TEXT,
    result TEXT,
    insight TEXT,
    images TEXT, -- Store as JSON array string
    order_index INTEGER DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

// Seed initial settings if empty
const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("profileImageUrl", "");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("bio", "공간 기반 문제 해결 기획자 장다현입니다.");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("resumeData", JSON.stringify({
    education: [{ school: "연세대학교 실내건축학 전공", period: "2024 - Present", degree: "Interior Architecture & Built Environment" }],
    experience: [
      { title: "제1회 실건인의 밤 총괄 기획", period: "2025", description: "행사 컨셉 도출, 프로그램 기획 및 운영 프로세스 설계" },
      { title: "실내건축학회 HIDDEN 33기 전시 기획", period: "2025", description: "전시 기획, 전시장 동선 및 공간 계획, 전시 굿즈 제작" }
    ],
    skills: ["Spatial Planning", "UX Research", "Strategy Proposal", "AutoCAD", "Rhino", "Adobe Illustrator", "Adobe Photoshop", "Figma"]
  }));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects ORDER BY order_index ASC, id DESC").all();
    const formattedProjects = projects.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || "[]")
    }));
    res.json(formattedProjects);
  });

  app.post("/api/upload", upload.array("images"), (req, res) => {
    const files = req.files as Express.Multer.File[];
    const urls = files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
  });

  app.post("/api/projects", (req, res) => {
    const { password, ...project } = req.body;
    if (password !== "2005") return res.status(401).json({ error: "Unauthorized" });

    const stmt = db.prepare(`
      INSERT INTO projects (title, category, type, description, problem, strategy, result, insight, images, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      project.title,
      project.category,
      project.type,
      project.description,
      project.problem,
      project.strategy,
      project.result,
      project.insight,
      JSON.stringify(project.images || []),
      project.order_index || 0
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { password, ...project } = req.body;
    if (password !== "2005") return res.status(401).json({ error: "Unauthorized" });

    const stmt = db.prepare(`
      UPDATE projects 
      SET title = ?, category = ?, type = ?, description = ?, problem = ?, strategy = ?, result = ?, insight = ?, images = ?, order_index = ?
      WHERE id = ?
    `);
    stmt.run(
      project.title,
      project.category,
      project.type,
      project.description,
      project.problem,
      project.strategy,
      project.result,
      project.insight,
      JSON.stringify(project.images || []),
      project.order_index,
      req.params.id
    );
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { password } = req.body;
    if (password !== "2005") return res.status(401).json({ error: "Unauthorized" });

    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Settings Routes
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const formattedSettings: any = {};
    settings.forEach((s: any) => {
      formattedSettings[s.key] = s.value;
    });
    res.json(formattedSettings);
  });

  app.post("/api/settings", (req, res) => {
    const { password, profileImageUrl, bio, resumeData } = req.body;
    if (password !== "2005") return res.status(401).json({ error: "Unauthorized" });

    try {
      const stmt = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
      if (profileImageUrl !== undefined) stmt.run(profileImageUrl, "profileImageUrl");
      if (bio !== undefined) stmt.run(bio, "bio");
      if (resumeData !== undefined) stmt.run(resumeData, "resumeData");
      res.json({ success: true });
    } catch (err) {
      console.error("Settings update error:", err);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Seed initial data if empty
  const count = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
  if (count.count === 0) {
    const initialProjects = [
      {
        title: "LUSH 브랜드 경험 설계",
        category: "브랜드 경험 설계",
        type: "main",
        description: "LUSH의 브랜드 가치를 공간에 녹여낸 상업공간 기획",
        problem: "단순 판매 공간을 넘어 브랜드의 철학을 체험할 수 있는 접점 부족",
        strategy: "고객 여정 맵(Customer Journey) 기반의 체험 요소 배치 및 동선 전략",
        result: "브랜드 몰입도를 높이는 공간 전략 도출",
        insight: "공간은 브랜드의 메시지를 전달하는 가장 강력한 미디어임을 깨달음",
        images: ["https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1000"],
        order_index: 1
      },
      {
        title: "학회 전시 기획",
        category: "콘텐츠 + 공간 + 브랜딩",
        type: "main",
        description: "학회 성과를 효과적으로 전달하기 위한 전시 기획",
        problem: "딱딱한 학술 내용을 일반 관람객에게 친숙하게 전달하기 어려움",
        strategy: "타겟 관람객 정의 및 스토리텔링 중심의 전시 동선 기획",
        result: "방문객 수 및 긍정적 반응 지표 확보",
        insight: "콘텐츠의 성격에 맞는 공간 언어의 중요성 확인",
        images: ["https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=1000"],
        order_index: 2
      },
      {
        title: "제1회 실건인의 밤",
        category: "운영 기획",
        type: "main",
        description: "실내건축 전공자들을 위한 네트워킹 행사 기획 및 운영",
        problem: "선후배 간 교류 단절 및 전공 소속감 저하",
        strategy: "참여형 프로그램 기획 및 효율적인 운영 플로우 설계",
        result: "높은 만족도의 네트워킹 플랫폼 구축",
        insight: "사람을 모으는 것은 공간이 아니라 그 안의 프로그램과 운영 전략임",
        images: ["https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000"],
        order_index: 3
      },
      {
        title: "캠퍼스 셔틀버스 개편",
        category: "공공 서비스 개선",
        type: "main",
        description: "데이터 기반의 효율적인 셔틀버스 운영 시스템 제안",
        problem: "심야 시간대 이동 불편 및 기존 노선의 비효율성",
        strategy: "이용 불편 사례 데이터 수집 및 심야 셔틀 편성 제안서 작성",
        result: "실제 심야 셔틀 편성 및 운영 반영",
        insight: "작은 데이터가 실제 정책과 서비스의 변화를 이끌어내는 힘을 경험",
        images: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000"],
        order_index: 4
      }
    ];

    const insert = db.prepare(`
      INSERT INTO projects (title, category, type, description, problem, strategy, result, insight, images, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    initialProjects.forEach(p => insert.run(
      p.title, p.category, p.type, p.description, p.problem, p.strategy, p.result, p.insight, JSON.stringify(p.images), p.order_index
    ));
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
