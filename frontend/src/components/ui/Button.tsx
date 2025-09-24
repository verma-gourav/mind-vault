import type { ReactNode } from "react";
import { LoadingIcon } from "../../icons/LoadingIcon";

interface ButtonProps {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-800",
  secondary: "bg-blue-200 text-blue-800 hover:bg-blue-400",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button = ({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  className,
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  const loaderColor = variant === "primary" ? "white" : "blue-800";

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all
        ${variantClasses[variant]} ${sizeClasses[size]} 
        ${
          disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }
        ${fullWidth ? "w-full" : ""}
        ${className}`}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {loading ? (
        <LoadingIcon size="lg" color={loaderColor} />
      ) : (
        <span>{text}</span>
      )}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};
