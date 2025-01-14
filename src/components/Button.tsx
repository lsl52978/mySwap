import React from "react";

interface ButtonProps {
  onClick?: () => void; // 点击事件
  className?: string; // 自定义样式
  disabled?: boolean; // 是否禁用
  children: React.ReactNode; // 按钮文本或内容
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  disabled,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 rounded-lg font-medium transition ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
