import React from "react";

interface ModalProps {
  isOpen: boolean; // 是否打开
  onClose: () => void; // 关闭事件
  children: React.ReactNode; // 模态框内容
  className?: string; // 自定义样式
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-sm ${className}`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
