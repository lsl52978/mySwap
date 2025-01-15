import React from "react";

interface ButtonProps {
  onClick?: () => void; // 点击事件
  className?: string; // 自定义样式
  disabled?: boolean; // 是否禁用
  children: React.ReactNode; // 按钮文本或内容
  type?: "button" | "submit" | "reset"; // 按钮的类型，默认是 "button"
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  className,
  disabled,
  children,
  type = "button", // 默认类型为 "button"
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type} // 使用传入的 type 属性 避免按钮在form里面 会触发form提交之后 刷新页面的事件
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
