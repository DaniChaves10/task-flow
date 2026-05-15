import { useRecoilState } from "recoil";
import { Trash2 } from "lucide-react";
import { type Todo, todoListState } from "@/atoms/todoAtoms";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TodoItem({ todo }: { todo: Todo }) {
  const [todos, setTodos] = useRecoilState(todoListState);

  const toggle = () =>
    setTodos(
      todos.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)),
    );

  const remove = () => setTodos(todos.filter((t) => t.id !== todo.id));

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <Checkbox checked={todo.completed} onCheckedChange={toggle} />
      <span
        className={cn(
          "flex-1 text-sm transition-all",
          todo.completed && "text-muted-foreground line-through",
        )}
      >
        {todo.text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={remove}
        className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
