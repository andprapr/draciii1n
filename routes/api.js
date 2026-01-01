import { Router } from 'express';
// Import NetShort
import { allepisode, search, foryou, theaters } from '../lib/netshort.js';
// Import DramaBox (INI YANG SEBELUMNYA HILANG)
import * as db from '../lib/dramabox.js'; 

const router = Router();

const handleRequest = async (handler, req, res) => {
    try {
        const result = await handler(req);
        res.json(result);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

// =======================
// 1. JALUR NETSHORT
// =======================
router.get('/netshort/theaters', (req, res) => handleRequest(theaters, req, res));
router.get('/netshort/foryou', (req, res) => handleRequest(() => foryou(parseInt(req.query.page)||1), req, res));
router.get('/netshort/search', (req, res) => handleRequest(() => search(req.query.query), req, res));
router.get('/netshort/allepisode', (req, res) => handleRequest(() => allepisode(req.query.shortPlayId), req, res));

// =======================
// 2. JALUR DRAMABOX (WAJIB ADA BIAR TIDAK ERROR)
router.get('/dramabox/foryou', (req, res) => {
    console.log("!!! TES: Ada yang memanggil /dramabox/foryou !!!"); // <--- TAMBAHAN DEBUG
    handleRequest(() => db.foryou(parseInt(req.query.page)||1), req, res);
});
// =======================

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