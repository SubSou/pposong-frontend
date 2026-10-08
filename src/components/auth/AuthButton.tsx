import type { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

function ActionButton({
  children,
  type = "button",
  disabled = false,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="
        w-full rounded-lg
        bg-[#8B7CF6] py-3
        font-semibold text-white
        hover:bg-[#7868E6]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {children}
    </button>
  );
}

export default ActionButton;
