import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "@/redux/features/todos/todosApi";
import TodoItem from "@/components/pages/Todos/TodoItem";
import Pagination from "@/components/Pagination";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeleton";
import { ToastService } from "@/utils/toastr.service";
import Button from "@/components/core/Button/Button";
import TodoFormModal from "@/components/pages/Todos/TodosModal";
import { Filters, SortBy, SortOrder, Status, Todo } from "@/types";
import Icon from "@/components/core/Icon/Icon";
import SelectComponent from "@/components/core/Select/Select";
import { sortByOptions, sortOrderOptions, statusOptions } from "@/utils/data";

export default function TodosPage() {
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const queryParams = {
    page,
    limit: 10,
    status: filters.status === "all" ? undefined : filters.status,
    search: filters.search.trim() === "" ? undefined : filters.search.trim(),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  const { data, isLoading, isError, refetch } = useGetTodosQuery(queryParams);

  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"Create" | "Edit">("Create");
  const [editingTodo, setEditingTodo] = useState<Partial<Todo> | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id?: string }>({
    open: false,
  });

  const handleCreate = async (values: any) => {
    try {
      await addTodo(values).unwrap();
      ToastService.success("Todo created");
      refetch();
    } catch (e: any) {
      ToastService.error(e?.data?.message || "Failed to create");
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await updateTodo({ id: editingTodo?.id, ...values }).unwrap();
      ToastService.success("Todo updated");
      refetch();
    } catch (e: any) {
      ToastService.error(e?.data?.message || "Failed to update");
    } finally {
      setEditingTodo(null);
    }
  };

  const onToggle = async (t: Todo) => {
    try {
      await updateTodo({
        id: t.id,
        status: t.status === "done" ? "todo" : "done",
      }).unwrap();
      refetch();
    } catch {
      ToastService.error("Toggle failed");
    }
  };

  const onDelete = (t: Todo) => setConfirm({ open: true, id: t.id });

  const onConfirmDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteTodo(confirm.id).unwrap();
      ToastService.success("Deleted");
      refetch();
    } catch (e: any) {
      ToastService.error(e?.data?.message || "Delete failed");
    } finally {
      setConfirm({ open: false });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950">
      <Navbar />
      <main className="min-w-container py-6 space-y-6 lg:px-10 md:px-6 px-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              className="border rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-900   md:w-52 w-full"
            />

            <SelectComponent
              className="md:w-44 w-full "
              value={
                statusOptions.find((o) => o.value === filters.status) || null
              }
              onChange={(opt) =>
                setFilters((f) => ({ ...f, status: opt.value as Status }))
              }
              options={statusOptions}
            />

            <SelectComponent
              className="md:w-44 w-full"
              value={
                sortByOptions.find((o) => o.value === filters.sortBy) || null
              }
              onChange={(opt) =>
                setFilters((f) => ({ ...f, sortBy: opt.value as SortBy }))
              }
              options={sortByOptions}
            />

            <SelectComponent
              className="md:w-44 w-full"
              value={
                sortOrderOptions.find((o) => o.value === filters.sortOrder) ||
                null
              }
              onChange={(opt) =>
                setFilters((f) => ({ ...f, sortOrder: opt.value as SortOrder }))
              }
              options={sortOrderOptions}
            />
          </div>

          <Button
            className="flex items-center gap-2 bg-blue-600 text-center"
            onClick={() => {
              setModalMode("Create");
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
          >
            <Icon name="add" variant="outlined" size={20} />
            Create Todos
          </Button>
        </div>

        {/* List */}
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <div className="text-red-600">Failed to load. Try again.</div>
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No todos found"
            subtitle="Try adjusting filters or add a new todo."
          />
        ) : (
          <>
            <div className="space-y-3">
              {data.data.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={(t) => {
                    setModalMode("Edit");
                    setEditingTodo(t);
                    setIsModalOpen(true);
                  }}
                  onToggle={onToggle}
                  onDelete={onDelete}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-300">
                Total: {data?.total ?? 0}
              </div>
              <Pagination
                page={data?.page ?? 1}
                total={data?.total ?? 0}
                limit={data?.limit ?? 10}
                onChange={setPage}
              />
            </div>
          </>
        )}

        {/* Modal */}
        <TodoFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          modalMode={modalMode}
          initial={editingTodo || undefined}
          onSubmit={async (values) => {
            if (modalMode === "Edit" && editingTodo) {
              await handleUpdate(values);
            } else {
              await handleCreate(values);
            }
            setIsModalOpen(false);
          }}
        />

        {/* Confirm Delete */}
        <ConfirmDialog
          open={confirm.open}
          title="Delete Todo"
          message="Are you sure you want to delete this todo?"
          onConfirm={onConfirmDelete}
          onCancel={() => setConfirm({ open: false })}
        />
      </main>
    </div>
  );
}
