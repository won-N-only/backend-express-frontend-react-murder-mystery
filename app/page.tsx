import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center px-4 pt-[100px]">
                <div className="relative w-full max-w-md aspect-[4/3]">
                    <Image
                        src="/detective_office.png"
                        alt="탐정 사무실"
                        className="object-contain"
                        width={544}
                        height={420}
                        priority
                    />
                </div>

                <p
                    className="pt-section text-center text-5xl text-head-text font-medium"
                    style={{ fontFamily: '"Tom\'s Handwriting", Georgia, cursive' }}
                >
                    Don&apos;t worry, we have hair.
                </p>

                <Link
                    href="/brick-breaker"
                    className="mt-section flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
                    aria-label="머리 깨기 미니게임"
                >
                    <div className="flex gap-4">
                        <Image
                            src="/favicon_face.png"
                            alt=""
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                        <Image
                            src="/favicon_hair.png"
                            alt=""
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                    </div>
                    <span className="text-sm font-medium text-head-text/80">
                        클릭 → 머리 깨기 미니게임
                    </span>
                </Link>

                <div className="pt-section text-center text-head-text text-lg font-medium">
                    <p>&quot;머리숱 없는 사람만 가입하나요?&quot;</p>
                    <p>
                        <br />
                        아아- 오해입니다. 오해예요.
                        <br />
                        우리의 대머리는 대구 머더 미스터리의 줄임말일 뿐,
                        <br />
                        당신의 소중한 머리카락은 건드리지 않습니다. (아마도요..?)
                        <br />
                        <br />
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
