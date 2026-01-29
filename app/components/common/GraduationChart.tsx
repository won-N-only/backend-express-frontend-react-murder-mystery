interface GraduationChartProps {
    rate: number;
}

export default function GraduationChart({ rate }: GraduationChartProps) {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (rate / 100) * circumference;
    return (
        <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#d1d5db" strokeWidth="8" />
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-head-gray-800">{Math.round(rate)}%</span>
            </div>
        </div>
    );
}
