// src\app\(dashboard)\components\ui\ActionButton.tsx
import React from "react";

interface SingleActionProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "purple" | "blue" | "green";
  disabled?: boolean;
  className?: string;
  mode?: "single";
}

interface Action {
  label: string;
  onClick: () => void;
  icon?: React.ElementType;
  variant?: "view" | "edit" | "delete";
  disabled?: boolean;
}

interface MultipleActionsProps {
  actions: Action[];
  mode: "multiple";
  className?: string;
}

type ActionButtonProps = SingleActionProps | MultipleActionsProps;

export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  // Jika mode multiple, render action buttons
  if (props.mode === "multiple") {
    const { actions, className = "" } = props;

    const getVariantClass = (variant?: string) => {
      switch (variant) {
        case "view":
          return "text-blue-600 hover:text-blue-800 hover:bg-blue-100";
        case "edit":
          return "text-green-600 hover:text-green-800 hover:bg-green-100";
        case "delete":
          return "text-red-600 hover:text-red-800 hover:bg-red-100";
        default:
          return "text-gray-600 hover:text-gray-800 hover:bg-gray-100";
      }
    };

    return (
      <div
        className={`flex items-center justify-center space-x-1 ${className}`}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`p-1 rounded transition-colors ${getVariantClass(
              action.variant
            )} disabled:opacity-50`}
            title={action.label}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
          </button>
        ))}
      </div>
    );
  }

  // Mode single (default)
  const {
    onClick,
    children,
    variant = "purple",
    disabled = false,
    className = "",
  } = props;

  const variants = {
    purple:
      "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
    blue: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    green: "from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r ${variants[variant]} text-white px-3 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ${className}`}
    >
      {children}
    </button>
  );
};
