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
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                        currentStatus === s
                            ? "bg-head-blue text-head-white"
                            : "bg-head-gray-100 text-head-gray-700 hover:bg-head-gray-200"
                    }`}
                >
                    {CompletionStatusLabel[s]}
                </button>
            ))}
        </div>
    );
}
