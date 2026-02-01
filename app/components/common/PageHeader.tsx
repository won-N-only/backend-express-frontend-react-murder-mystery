interface PageHeaderProps {
    /** 페이지 제목 */
    title: string;
    /** 상세 설명 (선택) */
    description?: string;
}

/**
 * 페이지 상단 헤더 공통 스타일.
 * 제목 + 상세설명 규격 통일 (사건 수색, 게임 기록 등).
 */
export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <header className="pt-section">
            <h1 className="text-4xl font-bold text-head-text">{title}</h1>
            {description != null && description !== "" && (
                <p className="text-md font-semibold text-head-text mt-2">{description}</p>
            )}
        </header>
    );
}
