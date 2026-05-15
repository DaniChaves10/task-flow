import { useState } from "react";
import { useRecoilState } from "recoil";
import { Plus } from "lucide-react";
import { todoListState } from "@/atoms/todoAtoms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TodoForm() {
  const [todos, setTodos] = useRecoilState(todoListState);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos([
      ...todos,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ]);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="O que precisa ser feito?"
        className="h-12"
      />
      <Button type="submit" size="lg" className="gap-2">
        <Plus className="h-4 w-4" />
        Adicionar
      </Button>
    </form>
  );
}
