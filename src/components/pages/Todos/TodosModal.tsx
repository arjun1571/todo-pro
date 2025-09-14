import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, TodoInput } from "@/schemas/todo";
import Modal from "@/components/core/Modal/Modal";
import Button from "@/components/core/Button/Button";
import Icon from "@/components/core/Icon/Icon";
import ButtonLoader from "@/components/core/Button/ButtonLoader";
import Input from "@/components/core/Input/Input";
import SelectComponent, { Option } from "@/components/core/Select/Select";
import DatePicker from "@/components/core/DatePicker/DatePicker";
import TagsInput from "@/components/core/Input/TagsInput";

type TodoFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initial?: Partial<TodoInput>;
  modalMode?: "Create" | "Edit";
  onSubmit: (v: TodoInput) => Promise<void> | void;
};

const statusOptions: Option[] = [
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

const priorityOptions: Option[] = [
  { label: "None", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const TodoFormModal: React.FC<TodoFormModalProps> = ({
  isOpen,
  onClose,
  initial,
  modalMode = "Create",
  onSubmit,
}) => {
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      status: "todo",
      description: "",
      priority: undefined,
      tags: [],
      dueDate: "",
      ...initial,
    },
  });

  useEffect(() => {
    reset({
      title: "",
      status: "todo",
      description: "",
      priority: undefined,
      tags: [],
      dueDate: "",
      ...initial,
    });
  }, [initial, reset]);

  const formSubmit = async (data: TodoInput) => {
    setIsSubmit(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        width="w-full md:w-3/4"
        maxWidth="max-w-2xl"
      >
        <Modal.Header className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {modalMode === "Edit" ? "Edit Todo" : "Create New Todo"}
          </h3>
          <Icon
            name="close"
            onClick={onClose}
            className="text-gray-600 cursor-pointer"
          />
        </Modal.Header>

        <Modal.Body>
          <div className="space-y-3">
            <Input
              label="Title"
              placeholder="Enter your title"
              registerProperty={register("title")}
              errorText={errors?.title?.message}
              isRequired
            />

            <Input
              label="Description"
              placeholder="Enter your description"
              registerProperty={register("description")}
              errorText={errors?.description?.message}
              type="textarea"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Status *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <SelectComponent
                      options={statusOptions}
                      value={
                        statusOptions.find((o) => o.value === field.value) ||
                        null
                      }
                      onChange={(option: any) => field.onChange(option?.value)}
                      placeholder="Select Status"
                      isRequired
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Priority
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <SelectComponent
                      options={priorityOptions}
                      value={
                        priorityOptions.find((o) => o.value === field.value) ||
                        null
                      }
                      onChange={(option: any) => field.onChange(option?.value)}
                      placeholder="Select Priority"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add tags"
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value || ""}
                    onChange={(v) =>
                      field.onChange(v ? new Date(v).toISOString() : "")
                    }
                  />
                )}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="flex justify-end space-x-2">
          <Button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
            disabled={isSubmit}
          >
            {isSubmit ? (
              <ButtonLoader />
            ) : modalMode === "Edit" ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
};

export default TodoFormModal;
