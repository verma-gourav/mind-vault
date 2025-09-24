import type { ReactNode } from "react";

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
};

export const SidebarItem = ({
  icon,
  label,
  className = "",
  onClick,
}: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 ${className}`}
    >
      {icon}
      <span className="text-lg font-medium">{label}</span>
    </button>
  );
};
