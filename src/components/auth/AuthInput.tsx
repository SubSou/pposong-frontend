import { useState } from "react";
import type { HTMLInputTypeAttribute } from "react";

interface AuthInputProps {
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: string;
  error?: string;
}

function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
}: AuthInputProps) {
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div
        className={`flex items-center rounded-lg border px-3 focus-within:border-[#8B7CF6] ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      >
        <i className={`bi bi-${icon} text-gray-400`} />

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-3 text-sm outline-none"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
          >
            <i
              className={`bi bi-eye${visible ? "-slash" : ""} text-gray-400`}
            />
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default AuthInput;
