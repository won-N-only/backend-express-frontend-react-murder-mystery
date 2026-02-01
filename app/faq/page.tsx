import PageHeader from "@app/components/common/PageHeader";
import type { ReactNode } from "react";

interface FaqSectionProps {
    title: string;
    children: ReactNode;
}

function FaqSection({ title, children }: FaqSectionProps) {
    return (
        <div className="mt-[50px]">
            <h1 className="text-3xl font-extrabold text-head-text mb-6">{title}</h1>
            {children}
        </div>
    );
}

interface FaqItemProps {
    question: string;
    description: string;
    additionalInfo?: string;
}

function FaqItem({ question, description, additionalInfo }: FaqItemProps) {
    return (
        <div className="mb-5 section-card">
            <h2 className="text-xl font-bold text-head-text mb-2">Q. {question}</h2>

            <p className="text-gray-700 leading-relaxed mb-2">{description}</p>

            {additionalInfo && (
                <p className="text-gray-500 text-[12px] leading-relaxed whitespace-pre-line">
                    {additionalInfo}
                </p>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="container mx-auto px-4">
            <PageHeader
                title="자주 묻는 질문"
                description="궁금한 점이 있으신가요? 대머리 모임 FAQ입니다."
            />

            <FaqSection title="1. 가입 및 정회원 등업">
                <FaqItem
                    question="정식 모임원이 되려면 어떻게 해야 하나요?"
                    description="처음 오신 분은 게스트 자격으로 참여하게 됩니다. 오프라인 모임에 2회 이상 참여하시면 기존 회원들의 투표를 거쳐 정식 모임원으로 등업 됩니다."
                />

                <FaqItem
                    question="모임 일정은 언제인가요?"
                    description="매월 2회, 토요일에 정기 모임이 진행됩니다."
                />

                <FaqItem
                    question="모임 공지와 투표는 어디서 확인하나요?"
                    description="모든 모임의 주관과 투표는 밴드 어플을 통해 진행됩니다."
                />
            </FaqSection>

            <FaqSection title="2. 회비 및 운영">
                <FaqItem
                    question="월 회비는 얼마인가요?"
                    description="월 회비는 1만원입니다. 매월 10일까지 본인의 활동명으로 입금해 주셔야 합니다."
                    additionalInfo={`신입 회원 - 정식 전환 된 달의 회비는 면제되나, 가입비 1만원을 납부해야 합니다.
입금 계좌 - 카카오뱅크 7942-06-93578 (예금주: 대머리 모임통장)`}
                />

                <FaqItem
                    question="투표는 꼭 해야 하나요?"
                    description="네, 필수입니다. '대머리' 공식 행사 및 운영진 주관 안건 투표는 모임원의 의무입니다."
                    additionalInfo={`사유 없이 투표나 회비 납부를 위반할 경우 경고 없이 퇴출될 수 있습니다.
단, 비공식 벙개 등의 행사는 투표 의무가 없습니다.`}
                />
            </FaqSection>

            <FaqSection title="3. 매너와 에티켓">
                <FaqItem
                    question="회원 간 호칭은 어떻게 하나요?"
                    description="나이를 불문하고 상호 존칭 사용이 원칙입니다."
                    additionalInfo={`상호 협의 하에 말을 놓을 수는 있으나, 나이나 신분을 이유로 반말을 강요하면 제재 대상입니다.`}
                />

                <FaqItem
                    question="게임 중에도 존댓말을 써야 하나요?"
                    description="머더미스터리 특성상 게임 진행 중인 연기 상황에서는 존칭 규칙이 적용되지 않습니다."
                    additionalInfo={`단, 방장 판단하에 설정을 과도하게 넘어서는 무례한 행동은 제재될 수 있습니다.`}
                />

                <FaqItem
                    question="따로 연락하거나 벙개를 열어도 되나요?"
                    description="원칙적으로 금지됩니다."
                    additionalInfo={`운영진에게 신고되지 않은 벙개, 사전 합의 없는 목적 외 행사 금지.
당사자 허락 없는 개인적인 사적 연락 금지.`}
                />
            </FaqSection>

            <FaqSection title="4. 안전 및 페널티 규정">
                <FaqItem
                    question="모임 중 술을 마셔도 되나요?"
                    description="사전 약속되지 않은 음주는 금지입니다."
                    additionalInfo={`모임 집합 전 음주도 삼가주세요. 현장 운영진이나 모임원 판단하에 안전을 위해 퇴장을 요구할 수 있으며, 이에 응해야 합니다.`}
                />

                <FaqItem
                    question="갑작스러운 사정으로 불참하면 어떻게 되나요?"
                    description="약속된 모임에 노쇼 시 경고 없이 퇴출되며 재가입이 불가합니다."
                    additionalInfo={`개인 사정으로 불참 시 즉시 운영진에게 알리고, 발생한 손실액 전액을 변상해야 합니다.
단, 천재지변이나 친지 조사 등 불가피한 사유가 인정될 경우 공금으로 처리될 수 있습니다.`}
                />
            </FaqSection>

            <FaqSection title="5. 사진 촬영 및 초상권">
                <FaqItem
                    question="모임 사진이 촬영되나요?"
                    description="운영진이 밴드 기록용으로 촬영할 수 있습니다."
                    additionalInfo="본인이 사진에 나오는 것을 원치 않으시면 모임장에게 말씀해 주세요."
                />

                <FaqItem
                    question="찍은 사진을 외부에 올려도 되나요?"
                    description="절대 불가합니다. 모임 내 사진은 비공개 밴드 내에서만 공유 가능합니다."
                    additionalInfo={`무단 외부 유출 시 경고 없이 추방될 수 있습니다.
사진에 나온 모든 인원의 승인을 받았거나, 철저하게 가리기(블러) 처리 후 모임장 승인을 받은 경우에만 업로드 가능합니다.`}
                />
            </FaqSection>
        </div>
    );
}
