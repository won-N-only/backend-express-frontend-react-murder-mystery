export enum CompletionStatus {
    X = 0,
    DONE = 1,
    PLANNED = 2,
    ERROR = 3,
}

export const CompletionStatusLabel: Record<CompletionStatus, string> = {
    [CompletionStatus.X]: "X",
    [CompletionStatus.DONE]: "완료",
    [CompletionStatus.PLANNED]: "예정",
    [CompletionStatus.ERROR]: "에러플💦",
};
