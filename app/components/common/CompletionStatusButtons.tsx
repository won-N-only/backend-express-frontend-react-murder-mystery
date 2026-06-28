import type { CompletionStatusValue } from "@app/types";
import { CompletionStatus } from "@app/types";

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
    const isDone = currentStatus === CompletionStatus.DONE;

    return (
        <button
            type="button"
            onClick={() => onStatusChange(isDone ? CompletionStatus.NOT_DONE : CompletionStatus.DONE)}
            disabled={!isEditable}
            className={`text-xs font-bold transition-colors btn-standard-padding ${
                isDone
                    ? "bg-head-brown text-white"
                    : "bg-head-main text-head-text hover:bg-head-gray-200"
            }`}
        >
            {isDone ? "완료" : "미완료"}
        </button>
    );
}
