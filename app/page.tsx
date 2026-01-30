import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center px-4 pt-6 pb-12">
                <div className="relative w-full max-w-md aspect-[4/3] mb-6">
                    <Image
                        src="/detective_office.png"
                        alt="탐정 사무실"
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 448px"
                    />
                </div>

                <p
                    className="text-center text-4xl   text-[#333] mb-6 font-medium"
                    style={{ fontFamily: '"Tom\'s Handwriting", Georgia, cursive' }}
                >
                    Don&apos;t worry, we have hair.
                </p>

                <div className="text-center text-head-gray-800 space-y-3 max-w-lg mx-auto text-[15px] leading-7 font-medium">
                    <p>&quot;머리숱 없는 사람만 가입하나요?&quot;</p>
                    <p>
                        아아- 오해입니다. 오해예요.
                        <br />
                        우리의 대머리는 대구 머더 미스터리의 줄임말일 뿐,
                        <br />
                        당신의 소중한 머리카락은 건드리지 않습니다. (아마도요..?)
                    </p>
                    <p className="pt-2">
                        다만, 사건을 파헤치느라 머리를 좀 많이 써야 할 수는 있습니다.
                        <br />
                        평범한 대구 시민인 당신이 천재 탐정이 되거나, 소름 돋는 살인마가 되는 곳!
                        <br />
                        함께 머리를 맞대고(가발 아님) 추리의 세계로 빠져보시죠!
                    </p>
                </div>
            </div>
        </div>
    );
}
