import Image from "next/image";

export default function FAQPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Image
                src="/onConstruction.png"
                alt="faq"
                width={300}
                height={300}
                className="mx-auto mt-section w-1/2"
            />
        </div>
    );
}
