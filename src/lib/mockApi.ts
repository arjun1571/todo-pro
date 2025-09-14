import type { Todo, PagedResponse, User } from "@/types";

type AuthUser = User & { password: string };
type LoginReq = { email: string; password: string };
type RegisterReq = { email: string; password: string };
type TodosQuery = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
  priority?: "low" | "medium" | "high";
  tags?: string[];
};

// In-memory DB
const demoUser: AuthUser = {
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

const db = {
  users: [demoUser] as AuthUser[],
  todos: seedTodos() as Todo[],
};

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function maybeFail(prob = 0.1) {
  if (Math.random() < prob) {
    const err: any = new Error("Random failure");
    err.status = 500;
    throw err;
  }
}

function ensureAuth(token?: string) {
  if (!token) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  const parts = token.split("-");
  const exp = Number(parts[1]);
  if (!exp || Date.now() > exp) {
    const err: any = new Error("Token expired");
    err.status = 401;
    throw err;
  }
}

export const mockApi = {
  async login(body: LoginReq) {
    await delay(500);
    maybeFail(0.05);
    const user = db.users.find(
      (u) => u.email === body.email && u.password === body.password
    );
    if (!user) {
      const err: any = new Error("Invalid credentials");
      err.status = 400;
      throw err;
    }
    const exp = Date.now() + 60 * 60 * 1000; // 1 hour
    const token = `mock-${exp}`;
    const { password, ...safeUser } = user;
    return { user: safeUser, token, exp };
  },
  async register(body: RegisterReq) {
    await delay(600);
    maybeFail(0.05);
    if (db.users.find((u) => u.email === body.email)) {
      const err: any = new Error("User exists");
      err.status = 400;
      throw err;
    }
    const u: AuthUser = {
      id: "u" + (db.users.length + 1),
      email: body.email,
      password: body.password,
    };
    db.users.push(u);
    const exp = Date.now() + 60 * 60 * 1000;
    const token = `mock-${exp}`;
    const { password, ...safeUser } = u;
    return { user: safeUser, token, exp };
  },
  async getTodos(
    query: TodosQuery,
    token?: string
  ): Promise<PagedResponse<Todo>> {
    await delay(400 + Math.random() * 600);
    maybeFail(0.06);
    ensureAuth(token);
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      priority,
      tags,
    } = query;
    let items = [...db.todos];
    if (status && status !== "all")
      items = items.filter((t) => t.status === status);
    if (priority) items = items.filter((t) => t.priority === priority);
    if (tags && tags.length)
      items = items.filter((t) => t.tags?.some((x) => tags.includes(x)));
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (t) =>
          t.title.toLowerCase().includes(s) ||
          t.description?.toLowerCase().includes(s)
      );
    }
    items.sort((a, b) => {
      const dir = sortOrder === "asc" ? 1 : -1;
      const av = (a as any)[sortBy] ?? "";
      const bv = (b as any)[sortBy] ?? "";
      return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
    });
    const start = (page - 1) * limit;
    const slice = items.slice(start, start + limit);
    return { data: slice, total: items.length, page, limit };
  },
  async addTodo(body: Partial<Todo>, token?: string): Promise<Todo> {
    await delay(400 + Math.random() * 600);
    maybeFail(0.15);
    ensureAuth(token);
    const now = new Date().toISOString();
    const t: Todo = {
      id: (Math.max(0, ...db.todos.map((t) => Number(t.id))) + 1).toString(),
      title: body.title || "",
      description: body.description,
      status: (body.status as any) || "todo",
      priority: body.priority,
      tags: body.tags ?? [],
      dueDate: body.dueDate,
      createdAt: now,
      updatedAt: now,
    };
    db.todos.unshift(t);
    return t;
  },
  async updateTodo(
    id: string,
    body: Partial<Todo>,
    token?: string
  ): Promise<Todo> {
    await delay(300 + Math.random() * 500);
    maybeFail(0.12);
    ensureAuth(token);
    const idx = db.todos.findIndex((t) => t.id === id);
    if (idx < 0) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }
    db.todos[idx] = {
      ...db.todos[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return db.todos[idx];
  },
  async deleteTodo(id: string, token?: string) {
    await delay(300 + Math.random() * 500);
    maybeFail(0.12);
    ensureAuth(token);
    const idx = db.todos.findIndex((t) => t.id === id);
    if (idx < 0) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }
    db.todos.splice(idx, 1);
    return { success: true };
  },
};
