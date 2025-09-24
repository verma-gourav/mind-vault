import { iconSizeClasses, type IconProps } from "./IconProperty";

interface LoadingIconProps extends IconProps {
  color?: string;
}

export const LoadingIcon = ({
  size = "md",
  color = "#FF156D",
}: LoadingIconProps) => {
  const iconClass = iconSizeClasses[size];

  return (
    <div className={`flex items-center justify-center ${iconClass}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="w-full h-full"
      >
        {[40, 100, 160].map((cx, i) => (
          <circle
            key={i}
            fill={color}
            stroke={color}
            strokeWidth="15"
            r="15"
            cx={cx}
            cy="100"
          >
            <animate
              attributeName="opacity"
              calcMode="spline"
              dur="2"
              values="1;0;1;"
              keySplines=".5 0 .5 1;.5 0 .5 1"
              repeatCount="indefinite"
              begin={`${-0.2 * i}s`}
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};
