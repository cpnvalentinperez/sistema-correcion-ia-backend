import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import multer from "multer";
import { parseFile } from "././services/fileParser";
import { generateFeedback } from "./services/aiService";

const app = express();
app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL!,
];

app.use(cors({
  origin: (origin, callback) => {
    // permite Postman/server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked by CORS:", origin);

    return callback(new Error("CORS no permitido"));
  },
    methods: ["GET", "POST"],
}));

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato no permitido"));
    }
  },
});

const SALUDO_FINAL = "\n\nBuen Trabajo. Saludos.";

const PORT = process.env.PORT || 3001;

// app.post("/evaluate", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No se envió archivo" });
//     }

//     // 🔥 parseo real
//     const text = await parseFile(req.file);

//     // debug
//     console.log("Archivo recibido:", req.file.originalname);
//     console.log("Texto (preview):", text.slice(0, 200));

//     res.json({
//       feedback: text.slice(0, 300) // temporal
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error procesando archivo" });
//   }
// });

const templates = [
  "El trabajo cumple con la consigna y se nota el uso de IA. Excelente trabajo. Saludos.",
  "Se observa que realizaste la actividad utilizando IA correctamente. Excelente trabajo. Saludos.",
  "La entrega responde a la consigna y evidencia uso de herramientas de IA. Excelente trabajo. Saludos.",
  "El trabajo está completo y cumple el objetivo de la actividad. Excelente trabajo. Saludos.",
];

app.post("/evaluate", upload.single("file"), async (req, res) => {
  let trimmed = "";
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: "No se envió archivo" });
    }
    
    const text = await parseFile(req.file);

    const cleaned = text
  .replace(/\n{2,}/g, '\n')
  .replace(/IA para la Gestión.*?\n/g, '')
  .replace(/Nombre y apellido:.*?\n/g, '');

    // 🔥 control de tamaño
    trimmed = cleaned.slice(0, 3000);

    // 🔥 validación mínima
    if (!trimmed || trimmed.length < 50) {
    return res.json({
        feedback: "El archivo no tiene contenido suficiente para analizar."
        });
    }

    const feedbackIA = await generateFeedback(
      req.body.consigna || "Análisis de decreto con IA",
      trimmed
    );

    res.json({ feedback: `${feedbackIA}${SALUDO_FINAL}` });

  } catch (error: any) {
  console.error(error);

  // 🔥 fallback sin IA
  if (
    error?.code === "insufficient_quota" ||
    error?.code === "model_not_found" ||
    error?.status === 429
  ) {
     // 🔥 fallback inteligente

  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  const lowerText = trimmed.toLowerCase();

  let extra = "";

  if (!lowerText.includes("objetivo")) {
    extra += " Podrías reforzar la parte del objetivo del decreto.";
  }

  if (!lowerText.includes("recomendaciones")) {
    extra += " También podrías ampliar las recomendaciones.";
  }

  if (!lowerText.includes("consideraciones")) {
    extra += " Faltaría desarrollar un poco más las consideraciones.";
  }

  return res.json({
    feedback: `${randomTemplate}${extra}${SALUDO_FINAL}`
  });
}

  res.status(500).json({
    error: "Error generando devolución"
  });
}
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "El archivo excede el tamaño permitido",
    });
  }

  res.status(500).json({
    error: err.message || "Error interno",
  });
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});

