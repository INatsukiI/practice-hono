import { Hono } from "hono";

const app = new Hono();
type Todo = {
  id: number;
  title: string;
  is_deleted: boolean;
};

let todos: Todo[] = [
  { id: 1, title: "Buy milk", is_deleted: false },
  { id: 2, title: "Buy eggs", is_deleted: false },
  { id: 3, title: "Buy bread", is_deleted: false },
];

/**
 * Todo一覧取得API
 */
app.get("/", (c) => c.json(todos.filter((todo) => !todo.is_deleted)));

/**
 * Todo登録API
 */
app.post("/", async (c) => {
  const { title } = await c.req.json<{ title: string }>();
  if (!title) {
    return c.json({ message: "title is required" }, 400);
  }
  const newId = todos[todos.length - 1].id + 1;
  const newTodo = { id: newId, title, is_deleted: false };
  todos = [...todos, newTodo];
  return c.json(newTodo, 201);
});

/**
 * Todo更新API
 */
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json({ message: "Todo not found" }, 404);
  }

  const { title } = await c.req.json<{ title: string }>();
  if (!title) {
    return c.json({ message: "title is required" }, 400);
  }
  todos[index] = { ...todos[index], title };
  return c.json(todos[index]);
});

/**
 * Todo削除API
 */
app.delete("/:id", (c) => {
  const id = c.req.param("id");
  const index = todos.findIndex((todo) => todo.id === Number(id));

  if (index === -1) {
    return c.json({ message: "Todo not found" }, 404);
  }

  todos[index] = { ...todos[index], is_deleted: true };
  return c.json(todos[index]);
});

export default app;
