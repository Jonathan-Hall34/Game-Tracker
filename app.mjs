import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import { connectToDB } from './db/connection.mjs';
import gameRoutes from './routes/gameRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);

// DB + Server Startup
connectToDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
