import { selector } from "recoil";
import { todoListFilterState, todoListState } from "@/atoms/todoAtoms";

export const filteredTodoListState = selector({
  key: "filteredTodoListState",
  get: ({ get }) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);
    switch (filter) {
      case "Concluídas":
        return list.filter((t) => t.completed);
      case "Pendentes":
        return list.filter((t) => !t.completed);
      default:
        return list;
    }
  },
});

export const todoListStatsState = selector({
  key: "todoListStatsState",
  get: ({ get }) => {
    const list = get(todoListState);
    const total = list.length;
    const completed = list.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, percent };
  },
});
