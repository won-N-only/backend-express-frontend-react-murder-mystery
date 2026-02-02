interface GraduationChartProps {
    rate: number;
}

const TRACK_COLOR = "#EAEAEA"; /* 원형 차트 배경(미완료) */
const FILL_COLOR = "#6B473A"; /* 원형 차트 채움 - 다크 브라운 (globals --color-accent-brown) */

export default function GraduationChart({ rate }: GraduationChartProps) {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (rate / 100) * circumference;
    return (
        <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke={TRACK_COLOR} strokeWidth="12" />
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={FILL_COLOR}
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="square"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-head-brown">{Math.round(rate)}%</span>
            </div>
        </div>
    );
}
