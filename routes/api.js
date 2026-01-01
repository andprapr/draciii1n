import { Router } from 'express';
// Import Database & Model Settings
import { Settings } from '../lib/db.js'; 

// Import NetShort & DramaBox
import { allepisode, search, foryou, theaters } from '../lib/netshort.js';
import * as db from '../lib/dramabox.js'; 

const router = Router();

// Helper Error Handler
const handleRequest = async (handler, req, res) => {
    try {
        const result = await handler(req);
        res.json(result);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

// ==========================================
// 🔴 BAGIAN 1: JALUR ADMIN (WAJIB ADA)
// ==========================================

// Cek Config
router.get('/admin/config', async (req, res) => {
    console.log("✅ Akses Admin Config Berhasil!"); // Log ini akan muncul di terminal
    try {
        let config = await Settings.findOne();
        if (!config) config = await Settings.create({}); 
        res.json(config);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Database Error" });
    }
});

// Update Config
router.post('/admin/update-name', async (req, res) => {
    console.log("✅ Akses Update Nama Berhasil!");
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
// 🔵 BAGIAN 2: JALUR NETSHORT
// ==========================================
router.get('/netshort/theaters', (req, res) => handleRequest(theaters, req, res));
router.get('/netshort/foryou', (req, res) => handleRequest(() => foryou(parseInt(req.query.page)||1), req, res));
router.get('/netshort/search', (req, res) => handleRequest(() => search(req.query.query), req, res));
router.get('/netshort/allepisode', (req, res) => handleRequest(() => allepisode(req.query.shortPlayId), req, res));

// ==========================================
// 🟠 BAGIAN 3: JALUR DRAMABOX
// ==========================================
router.get('/dramabox/foryou', (req, res) => handleRequest(() => db.foryou(parseInt(req.query.page)||1), req, res));
router.get('/dramabox/search', (req, res) => handleRequest(() => db.search(req.query.query), req, res));
router.get('/dramabox/allepisode', (req, res) => handleRequest(() => db.allepisode(req.query.shortPlayId), req, res));
router.get('/dramabox/trending', (req, res) => handleRequest(() => db.trending(parseInt(req.query.page)||1), req, res));
router.get('/dramabox/dubindo', (req, res) => handleRequest(() => db.dubindo(parseInt(req.query.page)||1), req, res));
router.get('/dramabox/vip', (req, res) => handleRequest(db.vip, req, res));
router.get('/dramabox/randomdrama', (req, res) => handleRequest(db.randomdrama, req, res));
router.get('/dramabox/latest', (req, res) => handleRequest(db.latest, req, res));
router.get('/dramabox/populersearch', (req, res) => handleRequest(db.populersearch, req, res));
router.get('/dramabox/detail', (req, res) => handleRequest(() => db.detail(req.query.shortPlayId), req, res));

export default router;