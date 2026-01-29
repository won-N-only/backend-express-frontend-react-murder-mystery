interface PageHeaderProps {
    /** 페이지 제목 */
    title: string;
    /** 상세 설명 (선택) */
    description?: string;
}

/**
 * 페이지 상단 헤더 공통 스타일.
 * 제목 + 상세설명 규격 통일 (사건 수색, 전과 기록 등).
 */
export default function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <header>
            <h1 className="text-3xl font-bold text-head-gray-800">{title}</h1>
            {description != null && description !== "" && (
                <p className="text-base text-head-gray-700 mt-1">{description}</p>
            )}
        </header>
    );
}
