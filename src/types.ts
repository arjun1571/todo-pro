export type TodoStatus = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority?: Priority;
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface IOption {
  label: string;
  value: string;
}

export type Status = "all" | "todo" | "in_progress" | "done";
export type SortBy = "createdAt" | "dueDate" | "priority";
export type SortOrder = "asc" | "desc";

export interface Filters {
  status: Status;
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
