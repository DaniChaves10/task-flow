import { useRecoilValue } from "recoil";
import { filteredTodoListState } from "@/selectors/todoSelectors";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const todos = useRecoilValue(filteredTodoListState);

  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Nenhuma tarefa por aqui ainda.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </div>
  );
}
