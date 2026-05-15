import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Listener = () => void;

interface AtomNode<T> {
  kind: "atom";
  key: string;
  default: T;
}

interface SelectorNode<T> {
  kind: "selector";
  key: string;
  get: (opts: { get: <V>(node: RecoilValue<V>) => V }) => T;
}

export type RecoilValue<T> = AtomNode<T> | SelectorNode<T>;

class Store {
  private values = new Map<string, unknown>();
  private listeners = new Map<string, Set<Listener>>();
  private deps = new Map<string, Set<string>>(); // selectorKey -> atom/selector keys it depends on

  getValue<T>(node: RecoilValue<T>): T {
    if (node.kind === "atom") {
      if (!this.values.has(node.key)) this.values.set(node.key, node.default);
      return this.values.get(node.key) as T;
    }
    // selector — recompute each call (cheap; tracks deps)
    const depSet = new Set<string>();
    const get = <V,>(dep: RecoilValue<V>): V => {
      depSet.add(dep.key);
      return this.getValue(dep);
    };
    const result = node.get({ get });
    this.deps.set(node.key, depSet);
    return result;
  }

  setAtom<T>(node: AtomNode<T>, next: T | ((prev: T) => T)) {
    const prev = this.getValue(node);
    const value =
      typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    if (Object.is(prev, value)) return;
    this.values.set(node.key, value);
    this.notify(node.key);
    // notify selectors that depend on this atom
    for (const [selKey, deps] of this.deps) {
      if (deps.has(node.key)) this.notify(selKey);
    }
  }

  subscribe(key: string, l: Listener) {
    let set = this.listeners.get(key);
    if (!set) {
      set = new Set();
      this.listeners.set(key, set);
    }
    set.add(l);
    return () => set!.delete(l);
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach((l) => l());
  }
}

const StoreContext = createContext<Store | null>(null);

export function RecoilRoot({ children }: { children: ReactNode }) {
  const ref = useRef<Store | null>(null);
  if (!ref.current) ref.current = new Store();
  return (
    <StoreContext.Provider value={ref.current}>
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("RecoilRoot is missing");
  return s;
}

export function atom<T>(opts: { key: string; default: T }): AtomNode<T> {
  return { kind: "atom", key: opts.key, default: opts.default };
}

export function selector<T>(opts: {
  key: string;
  get: (o: { get: <V>(n: RecoilValue<V>) => V }) => T;
}): SelectorNode<T> {
  return { kind: "selector", key: opts.key, get: opts.get };
}

export function useRecoilValue<T>(node: RecoilValue<T>): T {
  const store = useStore();
  // Re-subscribe whenever deps change for selectors
  const depsRef = useRef<Set<string>>(new Set([node.key]));

  return useSyncExternalStore(
    (cb) => {
      const unsubs: Array<() => void> = [];
      const subscribeAll = () => {
        unsubs.forEach((u) => u());
        unsubs.length = 0;
        const keys =
          node.kind === "atom"
            ? [node.key]
            : [node.key, ...Array.from(depsRef.current)];
        for (const k of keys) unsubs.push(store.subscribe(k, wrapped));
      };
      const wrapped = () => {
        // recompute deps on change
        if (node.kind === "selector") {
          store.getValue(node);
          
          depsRef.current = (store as any).deps.get(node.key) ?? new Set();
          subscribeAll();
        }
        cb();
      };
      // initial deps for selector
      if (node.kind === "selector") {
        store.getValue(node);
        
        depsRef.current = (store as any).deps.get(node.key) ?? new Set();
      }
      subscribeAll();
      return () => unsubs.forEach((u) => u());
    },
    () => store.getValue(node),
    () => store.getValue(node),
  );
}

export function useSetRecoilState<T>(node: AtomNode<T>) {
  const store = useStore();
  return (next: T | ((prev: T) => T)) => store.setAtom(node, next);
}

export function useRecoilState<T>(
  node: AtomNode<T>,
): [T, (next: T | ((prev: T) => T)) => void] {
  return [useRecoilValue(node), useSetRecoilState(node)];
}
