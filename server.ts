import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Lazy Supabase client initialization
let supabase: any = null;
function getSupabase() {
  if (!supabase) {
    let url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (url && key && url !== "https://your-project-id.supabase.co" && key !== "your-anon-public-key") {
      try {
        // Clean trailing rest/v1 paths injected by environment template if present
        if (url.endsWith("/rest/v1/")) {
          url = url.slice(0, -9);
        } else if (url.endsWith("/rest/v1")) {
          url = url.slice(0, -8);
        }
        supabase = createClient(url, key);
        console.log("Supabase client initialized successfully with base URL:", url);
      } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
      }
    }
  }
  return supabase;
}

// Local Orders Persistence File
const ORDERS_FILE = path.join(process.cwd(), "orders_local.json");
let localOrders: any[] = [];

try {
  if (fs.existsSync(ORDERS_FILE)) {
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    localOrders = JSON.parse(content);
  } else {
    // Seed with some mock reviews/orders for premium visualization on first load
    localOrders = [
      {
        id: "ord_1",
        created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
        customer_name: "Amina Diallo",
        customer_phone: "+221 77 123 45 67",
        city: "Dakar",
        address: "Mermoz, Villa 45",
        bundle_id: "bundle_3",
        bundle_name: "Cure Intense - 3 Flacons (Livraison Gratuite)",
        quantity: 3,
        total_price: 17850,
        status: "Livré",
        notes: "Souhaite être livrée l'après-midi"
      },
      {
        id: "ord_2",
        created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
        customer_name: "Koffi Mensah",
        customer_phone: "+225 07 89 01 23 45",
        city: "Abidjan",
        address: "Cocody, Angré 8ème tranche",
        bundle_id: "bundle_2",
        bundle_name: "Duo Croissance - 2 Flacons (-10%)",
        quantity: 2,
        total_price: 12600,
        status: "En cours",
        notes: "Appeler avant la livraison"
      }
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(localOrders, null, 2), "utf-8");
  }
} catch (err) {
  console.error("Failed to load local orders file:", err);
}

function saveOrdersLocal() {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(localOrders, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local orders file:", err);
  }
}

// Secure Admin Authentication Middleware
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const providedPassword = req.headers["x-admin-password"] || req.query.password;
  const actualPassword = process.env.ADMIN_PASSWORD || "golden_admin_2026";
  if (providedPassword !== actualPassword) {
    return res.status(401).json({ success: false, error: "Accès non autorisé. Mot de passe administrateur incorrect." });
  }
  next();
};

// API: Verify Admin Credentials
app.post("/api/admin/verify", (req, res) => {
  const { password } = req.body;
  const actualPassword = process.env.ADMIN_PASSWORD || "golden_admin_2026";
  if (password === actualPassword) {
    res.json({ success: true, message: "Authentification réussie." });
  } else {
    res.status(401).json({ success: false, error: "Mot de passe incorrect." });
  }
});

// API: Get all orders (for Admin Dashboard - SECURED)
app.get("/api/orders", adminAuth, (req, res) => {
  res.json({ success: true, orders: localOrders });
});

// API: Create new order (Saves to local + Supabase if available)
app.post("/api/orders", async (req, res) => {
  const { customer_name, customer_phone, city, address, bundle_id, bundle_name, quantity, total_price, notes } = req.body;

  if (!customer_name || !customer_phone || !city) {
    return res.status(400).json({ success: false, error: "Nom, téléphone et ville requis." });
  }

  const newOrder = {
    id: `ord_${Date.now()}`,
    created_at: new Date().toISOString(),
    customer_name,
    customer_phone,
    city,
    address: address || "Non spécifié",
    bundle_id: bundle_id || "bundle_1",
    bundle_name: bundle_name || "1 Flacon - Découverte",
    quantity: Number(quantity) || 1,
    total_price: Number(total_price) || 7000,
    status: "Nouveau",
    notes: notes || ""
  };

  // Add to local memory and save
  localOrders.unshift(newOrder);
  saveOrdersLocal();

  // Try to write to Supabase if configured
  const supabaseClient = getSupabase();
  let supabaseSynced = false;
  let supabaseError = null;

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("orders")
        .insert([{
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          city: newOrder.city,
          address: newOrder.address,
          bundle_id: newOrder.bundle_id,
          bundle_name: newOrder.bundle_name,
          quantity: newOrder.quantity,
          total_price: newOrder.total_price,
          notes: newOrder.notes,
          status: "Nouveau"
        }]);

      if (error) {
        supabaseError = error.message;
        console.error("Supabase insert error details:", JSON.stringify(error, null, 2));
        if (error.code === 'PGRST205' || (error.message && error.message.includes('Could not find the table'))) {
          console.error("\n=========================================================");
          console.error("⚠️ TABLE 'orders' MANQUANTE DANS SUPABASE ⚠️");
          console.error("Pour corriger cette erreur et synchroniser vos commandes :");
          console.error("1. Copiez le contenu du fichier '/supabase_schema.sql'");
          console.error("2. Collez-le dans le 'SQL Editor' de votre tableau de bord Supabase");
          console.error("3. Cliquez sur 'Run' pour créer la table et configurer l'accès public.");
          console.error("=========================================================\n");
          supabaseError = "Table 'orders' manquante dans votre base Supabase. Veuillez appliquer le schéma SQL de /supabase_schema.sql dans votre tableau de bord Supabase.";
        }
      } else {
        supabaseSynced = true;
        console.log("Order successfully synced to Supabase.");
      }
    } catch (e: any) {
      supabaseError = e.message;
      console.error("Exception during Supabase sync:", e);
    }
  }

  res.json({
    success: true,
    order: newOrder,
    supabaseSynced,
    supabaseError
  });
});

// API: Update order status (for admin - SECURED)
app.patch("/api/orders/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const orderIndex = localOrders.findIndex(o => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ success: false, error: "Commande non trouvée." });
  }

  localOrders[orderIndex].status = status;
  saveOrdersLocal();

  res.json({ success: true, order: localOrders[orderIndex] });
});

// API: Clear/reset orders (useful for testing - SECURED)
app.post("/api/orders/reset", adminAuth, (req, res) => {
  localOrders = [];
  saveOrdersLocal();
  res.json({ success: true, message: "Toutes les commandes locales ont été réinitialisées." });
});

// API: AI Hair Care Diagnostic (Gemini integration)
app.post("/api/gemini/diagnostic", async (req, res) => {
  const { hairType, scalpState, mainConcern, routineComplexity } = req.body;

  if (!hairType || !scalpState || !mainConcern) {
    return res.status(400).json({ success: false, error: "Veuillez spécifier le type de cheveux, l'état du cuir chevelu et la préoccupation principale." });
  }

  try {
    const prompt = `L'utilisateur réalise un diagnostic capillaire interactif. Voici ses informations:
- Type de cheveux: ${hairType}
- État du cuir chevelu: ${scalpState}
- Préoccupation principale: ${mainConcern}
- Complexité de routine souhaitée: ${routineComplexity || "intermédiaire"}

Génère un plan de soin capillaire personnalisé et optimisé qui met en valeur l'utilisation de l'huile capillaire naturelle "Golden Circle Hair Growth Oil".
L'huile est 100% naturelle, formule premium de 100ml, conçue pour stimuler la croissance, fortifier la fibre capillaire, nourrir en profondeur et donner de l'épaisseur.

Tu dois répondre STRICTEMENT au format JSON avec la structure suivante:
{
  "diagnosticSummary": "Une analyse scientifique et bienveillante en 2-3 phrases sur les besoins actuels de leur cuir chevelu.",
  "recommendations": [
    "Conseil pratique 1 spécifique à son problème",
    "Conseil pratique 2 spécifique à son problème",
    "Conseil pratique 3 spécifique à son problème"
  ],
  "routine": {
    "frequency": "La fréquence recommandée pour l'application de l'huile Golden Circle (ex: 3 fois par semaine).",
    "morning": "Routine matinale ou préparation.",
    "evening": "Routine du soir avec application de l'huile Golden Circle.",
    "massageTips": "Conseils d'auto-massage du cuir chevelu pour activer la circulation sanguine."
  },
  "timeline": {
    "week2": "Ce qu'ils vont observer après 2 semaines (ex: cuir chevelu apaisé, moins de démangeaisons).",
    "month1": "Ce qu'ils vont observer après 1 mois (ex: réduction de la chute, cheveux plus forts).",
    "month3": "Ce qu'ils vont observer après 3 mois (ex: repousse visible, longueur et densité accrues)."
  },
  "keyIngredientsTip": "Une explication de comment un soin 100% naturel comme Golden Circle est parfait pour leur état."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un trichologue expert (spécialiste de la santé du cheveu et du cuir chevelu). Tu rédiges en français de manière professionnelle, rassurante, claire et très incitative à l'achat de l'huile Golden Circle.",
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text.trim());

    res.json({
      success: true,
      diagnostic: parsedData
    });
  } catch (error: any) {
    console.error("Gemini Diagnostic Error:", error);
    res.status(500).json({
      success: false,
      error: "Impossible de générer le diagnostic IA pour le moment.",
      details: error.message
    });
  }
});

// Serve assets and setup Vite development server middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT} under ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
