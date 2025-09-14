import { IOption } from "@/types";

export const statusOptions: IOption[] = [
  { label: "All", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export const sortByOptions: IOption[] = [
  { label: "Created", value: "createdAt" },
  { label: "Due Date", value: "dueDate" },
  { label: "Priority", value: "priority" },
];

export const sortOrderOptions: IOption[] = [
  { label: "Desc", value: "desc" },
  { label: "Asc", value: "asc" },
];
