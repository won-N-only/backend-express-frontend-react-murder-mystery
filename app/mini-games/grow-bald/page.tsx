"use client";

export default function GrowBaldPage() {
    return (
        <div>
            {/* 1. Game Area */}
            <div className="mb-24 p-6 sm:p-8 bg-[url('/mini-games/grow-bald/background.png')] bg-cover bg-center flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
                <div className="text-2xl font-bold text-head-white py-3 px-6 bg-head-brown rounded-full">
                    대머리 강화하기
                </div>
                <div className="text-3xl font-bold text-head-text">최고의 대머리로 강화하세요!</div>
                <img src="/favicon_face.png" alt="대머리 그림" className="w-72 aspect-square" />
                <div className="w-full p-6 sm:p-10 rounded-2xl bg-white/80 gap-5 flex flex-col">
                    <div className="font-bold text-3xl text-head-text">+ 0 그냥 대머리</div>
                    <div className=" flex items-center justify-between w-full">
                        <div className="flex gap-2">
                            <div className="py-2.5 px-5 font-semibold text-lg text-head-white rounded-full bg-[#EDA234]">
                                강화비용 n 원
                            </div>
                            <div className="py-2.5 px-5 font-semibold text-lg text-head-white rounded-full bg-[#EDA234]">
                                판매가격 n 원
                            </div>
                        </div>
                        <div className="py-2.5 px-5 font-semibold text-lg text-[#EDA234] rounded-full bg-head-white">
                            내돈 n원
                        </div>
                    </div>
                    <div className="font-medium text-xl text-head-gray-500">현상황 설명</div>
                </div>
                <div className="flex gap-4">
                    <button className="font-semibold text-2xl text-head-white bg-head-brown rounded-2xl py-3 px-6">
                        강화하기
                    </button>
                    <button className="font-semibold text-2xl text-head-brown bg-head-white rounded-2xl py-3 px-6">
                        판매하기
                    </button>
                </div>
            </div>
        </div>
    );
}
