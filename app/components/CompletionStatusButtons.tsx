import {
    CompletionStatus,
    CompletionStatusLabel,
} from "@completion/domain/valueObjects/CompletionStatus";

interface CompletionStatusButtonsProps {
    currentStatus: CompletionStatus;
    onStatusChange: (status: CompletionStatus) => void;
}

export default function CompletionStatusButtons({
    currentStatus,
    onStatusChange,
}: CompletionStatusButtonsProps) {
    const statuses = [CompletionStatus.DONE, CompletionStatus.NOT_DONE] as const;

    return (
        <div className="flex gap-1">
            {statuses.map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => onStatusChange(s)}
                    className={`px-2 py-1 text-xs rounded ${
                        currentStatus === s
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                    }`}
                >
                    {CompletionStatusLabel[s]}
                </button>
            ))}
        </div>
    );
}
