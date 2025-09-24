export interface IconProps {
  size: "sm" | "md" | "lg" | "xl" | "xxl";
}

export const iconSizeClasses: Record<NonNullable<IconProps["size"]>, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-10",
  xxl: "size-20",
};
