import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex h-screen bg-slate-950">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar />

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}