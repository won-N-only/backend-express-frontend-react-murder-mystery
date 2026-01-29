import { useId, type ReactNode } from "react";

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: ReactNode;
    id?: string;
}

const CHECKBOX_VISUAL_CLASS =
    "relative w-4 h-4 shrink-0 rounded border-2 border-head-brown flex items-center justify-center after:absolute after:inset-1 after:rounded-[2px] after:bg-head-brown after:content-[''] after:opacity-0 peer-checked:after:opacity-100";

/**
 * 공용 체크박스 (바깥 테두리 + 체크 시 안쪽 진한 사각형).
 */
export default function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
        <label htmlFor={inputId} className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="peer sr-only"
            />
            <span className={CHECKBOX_VISUAL_CLASS} aria-hidden />
            <span className="select-none text-head-gray-800">{label}</span>
        </label>
    );
}
