import mongoose from 'mongoose';

// URL KONEKSI MONGODB (SUDAH DIPERBAIKI)
// Username: jasitusnet_db_user
// Password: nt7YA4Reik6NN21G
// Cluster: dracindb.2wwsnmc.mongodb.net
const MONGODB_URI = "mongodb+srv://jasitusnet_db_user:nt7YA4Reik6NN21G@dracindb.2wwsnmc.mongodb.net/?retryWrites=true&w=majority&appName=DracinDB";

const connectDB = async () => {
    try {
        // Cek status koneksi: 0 = disconnected, 1 = connected
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        // Mulai koneksi
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Sukses Konek ke MongoDB Atlas");
    } catch (error) {
        console.error("❌ Gagal Konek MongoDB:", error);
    }
};

// --- MODEL DATABASE (TABEL) ---

// 1. Pengaturan Web
const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: "StreamHub Indo" },
    logoUrl: { type: String, default: "" },
    adminPassword: { type: String, default: "admin123" }
});

// Jika model sudah ada, pakai yang lama. Jika belum, buat baru.
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export { connectDB, Settings };