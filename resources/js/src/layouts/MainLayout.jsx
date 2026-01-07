import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import React from "react";

export default function MainLayout({ children, onSignOut }) {
    return (
        <div className="min-h-screen bg-sky-50">
            <Navbar onSignOut={onSignOut} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex mt-6 -mt-8 gap-6">
                    <Sidebar />
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
