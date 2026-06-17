import { Bell } from "lucide-react";

export default function Navbar() {
    return (
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex justify-between items-center px-6">
            <h2 className="text-white font-semibold text-lg">
                Dashboard
            </h2>

            <div className="flex items-center gap-4">
                <Bell className="text-slate-400" />

                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    K
                </div>
            </div>
        </header>
    );
}