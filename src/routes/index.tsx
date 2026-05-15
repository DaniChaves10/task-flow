import { createFileRoute } from "@tanstack/react-router";
import { RecoilRoot } from "recoil";
import { CheckCircle2 } from "lucide-react";
import { TodoForm } from "@/components/todo/TodoForm";
import { TodoFilters } from "@/components/todo/TodoFilters";
import { TodoList } from "@/components/todo/TodoList";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <RecoilRoot>
      <main className="min-h-screen bg-background px-4 py-12">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <header className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tarefas</h1>
              <p className="text-sm text-muted-foreground">
                Gerenciador com Recoil
              </p>
            </div>
          </header>

          <TodoForm />
          <TodoFilters />
          <TodoList />
        </div>
      </main>
    </RecoilRoot>
  );
}
