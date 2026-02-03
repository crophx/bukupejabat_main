import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // JANGAN LUPA: npm install axios
import BgImage from "../assets/images/gedung-pancasila.jpg";

export default function Login({ onLogin }) {
    const navigate = useNavigate();

    // State Input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // State loading agar user tahu sedang memproses (Opsional, tidak merubah tampilan dasar)
    const [isLoading, setIsLoading] = useState(false);

    // --- LOGIC BARU (TERHUBUNG DATABASE) ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error lama
        setIsLoading(true); // Mulai proses

        try {
            // 1. TEMBAK API LARAVEL
            const response = await axios.post(
                "http://127.0.0.1:8000/api/login",
                {
                    email: email,
                    password: password,
                },
            );

            // 2. JIKA SUKSES
            if (response.data.success) {
                const { token, user } = response.data.data;

                // 3. SIMPAN DATA DARI DATABASE KE BROWSER
                localStorage.setItem("token", token);
                // Kita ambil 'username' karena di database kolomnya username
                localStorage.setItem("user_name", user.username);
                // Ambil nama unit kerja (jika ada relasinya), kalau tidak ada set "Pusat"
                localStorage.setItem(
                    "user_divisi",
                    user.unit_kerja?.nama_unit_kerja || "Pusat",
                );

                // 4. UPDATE STATE LOGIN UTAMA (APP.JSX)
                if (onLogin) onLogin();

                // 5. PINDAH KE DASHBOARD
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login Error:", err);
            // Ambil pesan error dari Laravel jika ada, atau pesan default
            setError(
                err.response?.data?.message ||
                    "Login Gagal. Periksa Email/Password atau Server.",
            );
        } finally {
            setIsLoading(false); // Selesai proses
        }
    };
    // ---------------------------------------

    return (
        <div
            className="relative min-h-screen flex items-center justify-center p-6"
            style={{
                backgroundImage: `url(${BgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* TAMPILAN TETAP SAMA (Z-INDEX SUDAH BENAR) */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            <div className="relative w-full max-w-md z-20">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="px-8 py-10">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
                                A
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900">
                                    Buku Pejabat
                                </h1>
                                <p className="text-sm text-slate-500">
                                    Sign in to your admin account
                                </p>
                            </div>
                        </div>

                        {/* Pesan Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    // Placeholder contoh pakai akun database
                                    placeholder="sdm@kemenlu.go.id"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter password"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-300"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn w-full rounded-xl text-white font-semibold mt-4 cursor-pointer transition-colors py-3
                                        ${isLoading ? "bg-slate-400 cursor-not-allowed" : "btn-info hover:bg-sky-600"}
                                    `}
                                >
                                    {isLoading ? "Memproses..." : "Sign in"}
                                </button>
                            </div>
                        </form>

                        <div className="px-8 py-4 mt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
                            Gunakan akun database: <br />
                            <b>sdm@kemenlu.go.id</b> (sdm123)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
