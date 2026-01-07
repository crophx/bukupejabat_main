import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgImage from "../assets/images/gedung-pancasila.jpg";
import React from "react";

export default function Login({ onLogin }) {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            className="relative min-h-screen flex items-center justify-center p-6"
            style={{
                backgroundImage: `url(${BgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div />
            <div className="relative w-full max-w-md">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="px-8 py-10">
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

                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (onLogin) onLogin();
                                navigate("/dashboard");
                            }}
                        >
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="jeanskaret@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label="Toggle show password"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 px-2 py-1"
                                        onClick={() => setShow((s) => !s)}
                                    >
                                        {show ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.477 0-8.268-2.943-9.542-7a10.05 10.05 0 0 1 1.66-3.149M6.21 6.21 3 3m18 18-3.21-3.21"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-200"
                                    />
                                    <span className="text-slate-600">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-sky-600 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Don’t have an account?{" "}
                            <a
                                href="#"
                                className="text-sky-600 font-medium hover:underline"
                            >
                                Sign up
                            </a>
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
                        Property of Kementerian Luar Negeri - Biro Sumber Daya
                        Manusia
                    </div>
                </div>
            </div>
        </div>
    );
}
