import type { Todo } from "@/types";
import clsx from "clsx";
import Icon from "../../core/Icon/Icon";

export default function TodoItem({
  todo,
  onEdit,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onEdit: (t: Todo) => void;
  onToggle: (t: Todo) => void;
  onDelete: (t: Todo) => void;
}) {
  const bgColor = clsx("p-4 rounded border flex justify-between", {
    "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700":
      todo.status === "done",
    "bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700":
      todo.status === "in_progress",
    "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700":
      todo.status === "todo",
    "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800":
      !todo.status,
  });

  const textColor = "text-zinc-600 dark:text-gray-400 text-sm";

  return (
    <div className={bgColor}>
      <div className="space-y-1">
        <div className="font-medium">{todo.title}</div>
        {todo.description && (
          <div className={textColor}>{todo.description}</div>
        )}
        <div className="text-xs text-zinc-500 dark:text-gray-400">
          Status: {todo.status} • Priority: {todo.priority || "—"} • Due:{" "}
          {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "—"}
        </div>
        {!!todo.tags?.length && (
          <div className="text-xs text-zinc-500 dark:text-gray-400">
            Tags: {todo.tags.join(", ")}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Icon
          name="edit_square"
          variant="filled"
          className="text-blue-500 cursor-pointer"
          onClick={() => onEdit(todo)}
        />
        <Icon
          name={todo.status === "done" ? "done_all" : "task_alt"}
          variant="filled"
          className={
            todo.status === "done"
              ? "text-green-500 cursor-pointer"
              : "text-gray-500 cursor-pointer"
          }
          onClick={() => onToggle(todo)}
        />
        <Icon
          name={"delete"}
          variant="filled"
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(todo)}
        />
      </div>
    </div>
  );
}
