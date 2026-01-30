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
                    className={`px-2 py-1 text-sm rounded transition-colors ${
                        currentStatus === s
                            ? "bg-head-accent-brown text-head-white"
                            : "bg-head-gray-100 text-head-gray-700 hover:bg-head-gray-200"
                    }`}
                >
                    {CompletionStatusLabel[s]}
                </button>
            ))}
        </div>
    );
}
