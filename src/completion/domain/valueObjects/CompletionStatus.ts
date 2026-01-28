export enum CompletionStatus {
    NOT_DONE = 0,
    DONE = 1,
}

export const CompletionStatusLabel: Record<CompletionStatus, string> = {
    [CompletionStatus.NOT_DONE]: "미완료",
    [CompletionStatus.DONE]: "완료",
};
