import React, { useEffect, useState } from "react";
import Select, { components, StylesConfig } from "react-select";

export interface Option {
  value: string;
  label: string;
}

interface SelectComponentProps {
  options: Option[];
  value: Option | Option[] | null;
  onChange: (value: any) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  isMulti?: boolean;
  isRequired?: boolean;
  showDropdownIndicator?: boolean;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  className = "",
  isMulti = false,
  isRequired = false,
  showDropdownIndicator = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const isDarkMode = false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const customStyles: StylesConfig<Option, boolean> = {
    control: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
      borderColor: isFocused
        ? isDarkMode
          ? "#10B981"
          : "#22C55E"
        : isDarkMode
        ? "#374151"
        : "#D1D5DB",
      minHeight: 38,
      borderRadius: 8,
      cursor: isDisabled ? "not-allowed" : "pointer",
      boxShadow: isFocused
        ? `0 0 0 1px ${isDarkMode ? "#10B981" : "#22C55E"}`
        : undefined,
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? isDarkMode
          ? "#10B981"
          : "#22C55E"
        : isFocused
        ? isDarkMode
          ? "#374151"
          : "#F3F4F6"
        : isDarkMode
        ? "#1F2937"
        : "#FFFFFF",
      color: isSelected ? "#fff" : isDarkMode ? "#F9FAFB" : "#111827",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: isDarkMode ? "#1F2937" : "#fff",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const customComponents = {
    DropdownIndicator: showDropdownIndicator
      ? components.DropdownIndicator
      : () => null,
    IndicatorSeparator: showDropdownIndicator
      ? components.IndicatorSeparator
      : () => null,
  };

  if (!mounted) {
    return (
      <div className={`${className} relative`}>
        <div
          className={`h-[38px] rounded-lg border flex items-center px-3 py-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <span
            className={`${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            } truncate`}
          >
            {placeholder}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Select
      required={isRequired}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      className={className}
      isMulti={isMulti}
      styles={customStyles}
      components={customComponents}
      menuPortalTarget={document.body}
      menuPosition="fixed"
    />
  );
};

export default SelectComponent;
