import { atom } from "recoil";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type TodoFilter = "Todas" | "Concluídas" | "Pendentes";

export const todoListState = atom<Todo[]>({
  key: "todoListState",
  default: [],
});

export const todoListFilterState = atom<TodoFilter>({
  key: "todoListFilterState",
  default: "Todas",
});
