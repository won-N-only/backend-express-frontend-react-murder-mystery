import type { CompletionStatusValue } from "@app/types";
import { CompletionStatus, CompletionStatusLabel } from "@app/types";

interface CompletionStatusButtonsProps {
    currentStatus: CompletionStatusValue;
    onStatusChange: (status: CompletionStatusValue) => void;
    isEditable: boolean;
}

export default function CompletionStatusButtons({
    currentStatus,
    onStatusChange,
    isEditable,
}: CompletionStatusButtonsProps) {
    const statuses: CompletionStatusValue[] = [CompletionStatus.DONE, CompletionStatus.NOT_DONE];

    return (
        <div className="flex gap-1">
            {statuses.map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => onStatusChange(s)}
                    disabled={!isEditable}
                    className={`text-md font-medium transition-colors btn-standard-padding ${
                        currentStatus === s
                            ? "bg-head-brown text-white"
                            : "bg-head-main text-head-text hover:bg-head-gray-200"
                    }`}
                >
                    {CompletionStatusLabel[s]}
                </button>
            ))}
        </div>
    );
}
