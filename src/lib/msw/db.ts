import type { Todo, User } from "@/types";

type DB = {
  users: User[] & { password?: string }[];
  todos: Todo[];
};

const demoUser: User & { password: string } = {
  id: "u1",
  email: "test@gmail.com",
  password: "123456",
};

function seedTodos(): Todo[] {
  const now = Date.now();
  const arr: Todo[] = [];
  for (let i = 1; i <= 24; i++) {
    const status = i % 3 === 0 ? "done" : i % 2 === 0 ? "in_progress" : "todo";
    const priority = (["low", "medium", "high"] as const)[i % 3];
    const createdAt = new Date(now - i * 86400000).toISOString();
    const dueDate = new Date(now + (i % 10) * 86400000).toISOString();
    arr.push({
      id: String(i),
      title: `Sample Todo #${i}`,
      description: i % 2 === 0 ? "This is a sample description." : undefined,
      status,
      priority,
      tags: i % 4 === 0 ? ["work", "urgent"] : ["personal"],
      dueDate,
      createdAt,
      updatedAt: createdAt,
    });
  }
  return arr;
}

export const db: DB = {
  users: [demoUser],
  todos: seedTodos(),
};
