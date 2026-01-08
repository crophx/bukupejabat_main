import { useState } from "react";
import Logo from "../assets/images/logo-kemlu.png"; // optional: add logo file or remove

export default function Navbar({ onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 h-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="h-32 w-42 flex items-center justify-center">
              <img src={Logo} alt="logo" className="max-h-14 object-contain" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative inline-flex items-center p-2 rounded-lg hover:bg-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
              </svg>
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">3</span>
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-sm text-slate-700">BSDM</div>
              <div className="text-xs text-slate-500">Super Admin</div>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((s) => !s)}
                className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-slate-50"
                aria-expanded={menuOpen}
              >
                <div className="h-8 w-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-sm">B</div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-600">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-md z-20">
                  <button onClick={() => { setMenuOpen(false); onSignOut?.(); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-slate-200 rounded-2xl">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
