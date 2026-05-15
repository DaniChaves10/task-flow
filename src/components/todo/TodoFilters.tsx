import { useRecoilState, useRecoilValue } from "recoil";
import { type TodoFilter, todoListFilterState } from "@/atoms/todoAtoms";
import { todoListStatsState } from "@/selectors/todoSelectors";
import { Button } from "@/components/ui/button";

const filters: TodoFilter[] = ["Todas", "Pendentes", "Concluídas"];

export function TodoFilters() {
  const [filter, setFilter] = useRecoilState(todoListFilterState);
  const stats = useRecoilValue(todoListStatsState);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "ghost"}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">
        {stats.completed}/{stats.total} concluídas · {stats.percent}%
      </div>
    </div>
  );
}
