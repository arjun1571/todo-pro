import React from "react";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
}) => {
  return (
    <input
      type="date"
      value={value ? value.split("T")[0] : ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border rounded px-3 py-2 bg-white dark:bg-zinc-900 ${className}`}
    />
  );
};

export default DatePicker;
