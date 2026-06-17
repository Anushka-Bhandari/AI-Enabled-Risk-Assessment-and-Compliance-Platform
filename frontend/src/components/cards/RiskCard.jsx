export default function RiskCard({
    title,
    value,
    icon,
    color,
}) {
    return (
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-slate-400 text-sm">
                        {title}
                    </p>

                    <h2 className="text-white text-3xl font-bold mt-2">
                        {value}
                    </h2>
                </div>

                <div className={`${color} p-3 rounded-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}