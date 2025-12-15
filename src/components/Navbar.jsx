import Logo from "../assets/images/logo-kemlu.png"; // optional: add logo file or remove

export default function Navbar({ onSignOut }) {
  return (
    <header className="w-full pt-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-305 mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 h-20 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-32 w-42 flex items-center justify-center">
              <img src={Logo} alt="logo" className="max-h-14 object-contain" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative inline-flex items-center p-2 rounded-lg hover:bg-slate-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                />
              </svg>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-black text-sm">
              <span className="hidden sm:inline cursor-text">BSDM</span>
              <div className="h-6 w-28 rounded-full bg-white/20 flex items-center justify-center text-xs cursor-text">
                Super Admin
              </div>
            </button>
            <button onClick={() => onSignOut?.()} className="size-10 bg-sky-100 rounded-full flex items-center justify-center">
              {/* icon sign out */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-red-600 hover:text-slate-900 cursor-pointer"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
