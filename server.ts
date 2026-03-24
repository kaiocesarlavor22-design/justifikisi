import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// PayPal Config
app.get("/api/paypal-config", (req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// PayPal Order Creation
app.post("/api/paypal/create-order", async (req, res) => {
  const { planId } = req.body;
  const plans: Record<string, { name: string, amount: string }> = {
    'standard': { name: 'Plano Standard', amount: '180.00' },
    'premium': { name: 'Plano Premium', amount: '280.00' },
  };

  const plan = plans[planId];
  if (!plan) return res.status(400).json({ error: 'Plano inválido' });

  // In a real app, you'd call PayPal API here to create an order
  // For this demo, we'll return the data needed for the client-side SDK
  res.json({ 
    purchase_units: [{
      amount: {
        currency_code: 'BRL',
        value: plan.amount
      },
      description: plan.name
    }]
  });
});

// Datajud Proxy
app.post("/api/datajud", async (req, res) => {
  const { tribunal, body } = req.body;
  const API_KEY = process.env.DATAJUD_API_KEY || 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==';
  const API_BASE_URL = 'https://api-publica.datajud.cnj.jus.br/';
  const endpoint = `${API_BASE_URL}api_publica_${tribunal}/_search`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `APIKey ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('[Server] Datajud Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Erro ao consultar Datajud no servidor' });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*all", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
