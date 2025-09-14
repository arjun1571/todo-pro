import React from "react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  value,
  onChange,
  placeholder = "Add tags",
  className = "",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value.trim();
    if ((e.key === "Enter" || e.key === ",") && input) {
      e.preventDefault();
      if (!value.includes(input)) {
        onChange([...value, input]);
      }
      e.currentTarget.value = "";
    } else if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, value.length - 1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div
      className={`border rounded px-2 py-1 flex flex-wrap gap-1 ${className}`}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="bg-blue-100 text-blue-800 rounded px-2 py-0.5 flex items-center gap-1 text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 text-red-500"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 border-none focus:ring-0 outline-none px-1 py-1"
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TagsInput;
