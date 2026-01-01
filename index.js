import express from 'express';
// import cors from 'cors'; 
import apiRoutes from './routes/api.js'; 
import { connectDB, Settings } from './lib/db.js'; 

const app = express();
const PORT = 4001;

// 1. Nyalakan Database
connectDB();

// 2. PENYADAP (Logger) - MENCATAT SEMUA YANG MASUK
app.use((req, res, next) => {
    console.log(`🔔 [MASUK] ${req.method} ke alamat: ${req.url}`);
    next();
});

// 3. Middleware Standar
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());
app.use(express.static('public')); 

// ==========================================
// RUTE DARURAT (LANGSUNG DI INDEX.JS)
// ==========================================

// Tes Server Sederhana
app.get('/tes-server', (req, res) => {
    console.log("✅ Rute /tes-server berhasil dipanggil!");
    res.send("<h1>Server 4001 Jalan & Sehat!</h1>");
});

// Tes Admin Config (Tanpa /api biar simple dulu)
app.get('/cek-admin', async (req, res) => {
    console.log("✅ Rute /cek-admin berhasil dipanggil!");
    try {
        let config = await Settings.findOne();
        if (!config) config = await Settings.create({}); 
        res.json(config);
    } catch (e) {
        res.status(500).json({ error: "DB Error" });
    }
});

// Admin Config Asli (Target Kita)
app.get('/api/admin/config', async (req, res) => {
    console.log("✅ Rute ASLI /api/admin/config berhasil dipanggil!");
    try {
        let config = await Settings.findOne();
        if (!config) config = await Settings.create({}); 
        res.json(config);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "DB Error" });
    }
});

// Update Nama
app.post('/api/admin/update-name', async (req, res) => {
    console.log("✅ Request Update Nama Masuk!");
    const { newName, password } = req.body;
    try {
        const config = await Settings.findOne();
        if (config.adminPassword !== password) {
            return res.status(401).json({ success: false, message: "Password Salah!" });
        }
        config.siteName = newName;
        await config.save();
        res.json({ success: true, message: "Nama berhasil diganti!" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Gagal menyimpan." });
    }
});

// ==========================================
// Sambungan ke File Lain
// ==========================================
app.use('/api', apiRoutes); 

app.listen(PORT, () => {
    console.log(`🚀 Server SIAP di http://localhost:${PORT}`);
    console.log(`-------------------------------------------`);
    console.log(`COBA BUKA: http://localhost:${PORT}/tes-server`);
    console.log(`COBA BUKA: http://localhost:${PORT}/cek-admin`);
    console.log(`TARGET:    http://localhost:${PORT}/api/admin/config`);
    console.log(`-------------------------------------------`);
});