import {
    LayoutDashboard,
    ShieldAlert,
    FileText,
    Bot,
    Settings,
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: ShieldAlert, label: "Risk Analysis" },
    { icon: FileText, label: "Reports" },
    { icon: Bot, label: "AI Models" },
    { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white">
                    AI Risk
                </h1>
            </div>

            <nav className="px-3">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800 transition"
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}