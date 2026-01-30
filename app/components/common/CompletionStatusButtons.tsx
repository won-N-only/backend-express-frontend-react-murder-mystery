import type { CompletionStatusValue } from "@app/types";
import { CompletionStatus, CompletionStatusLabel } from "@app/types";

interface CompletionStatusButtonsProps {
    currentStatus: CompletionStatusValue;
    onStatusChange: (status: CompletionStatusValue) => void;
}

export default function CompletionStatusButtons({
    currentStatus,
    onStatusChange,
}: CompletionStatusButtonsProps) {
    const statuses: CompletionStatusValue[] = [CompletionStatus.DONE, CompletionStatus.NOT_DONE];

    return (
        <div className="flex gap-1">
            {statuses.map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => onStatusChange(s)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        currentStatus === s
                            ? "bg-head-text text-white"
                            : "bg-head-gray-100 text-head-text hover:bg-head-gray-200"
                    }`}
                >
                    {CompletionStatusLabel[s]}
                </button>
            ))}
        </div>
    );
}
