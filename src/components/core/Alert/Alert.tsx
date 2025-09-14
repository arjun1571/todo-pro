import React from "react";
import Button from "../Button/Button";
import ButtonLoader from "../Button/ButtonLoader";

interface AlertProps {
  isOpen: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: any;
  onCancel: () => void;
  children: any;
  confirmBtn?: string;
  isLoading?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  isOpen,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  children,
  confirmBtn,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden transform transition-all duration-200 scale-100 opacity-100">
        <div className="p-6 space-y-6">
          <div className="text-gray-700 leading-relaxed text-[15px]">
            {children}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onCancel}
              className="px-5 py-2 text-sm cursor-pointer font-medium !text-black bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-150 shadow-sm"
            >
              {cancelLabel}
            </Button>
            <Button
              disabled={isLoading}
              onClick={onConfirm}
              className={`px-5 py-2 cursor-pointer text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 shadow-sm ${
                confirmBtn
                  ? confirmBtn
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200"
              }`}
            >
              {isLoading ? <ButtonLoader /> : confirmLabel}
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-100 overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-red-400 animate-loading-bar"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
