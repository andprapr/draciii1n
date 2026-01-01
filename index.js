import express from 'express';
// import cors from 'cors'; <--- Kita matikan dulu biar gak error module not found
import apiRoutes from './routes/api.js'; 

const app = express();
const PORT = 4000;

// Middleware Manual (Pengganti CORS)
// Ini bikin frontend bisa akses data tanpa perlu install library tambahan
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.static('public')); 

// === BAGIAN PENYEBAB MASALAH (SUDAH DIPERBAIKI) ===
// Dulu: app.use('/api/netshort', apiRoutes); <--- INI SALAH
// Sekarang:
app.use('/api', apiRoutes); 
// Artinya: Server menerima '/api/netshort' DAN '/api/dramabox'
// ==================================================

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});