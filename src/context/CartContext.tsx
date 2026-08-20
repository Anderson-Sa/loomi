"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  size: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
  totalCents: number;
  totalQuantity: number;
  /** true quando o carrinho já terminou de ler o localStorage (evita corridas com efeitos que dependem do estado inicial). */
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "loomi:cart";

function itemKey(productId: string, size: string) {
  return `${productId}::${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hidrata o carrinho do localStorage, que só existe no client (evita mismatch de SSR)
        setItems(JSON.parse(raw));
      } catch {
        // ignora carrinho corrompido
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const key = itemKey(item.productId, item.size);
      const existing = prev.find(
        (i) => itemKey(i.productId, i.size) === key
      );
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.size) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (productId, size) => {
    setItems((prev) =>
      prev.filter((i) => itemKey(i.productId, i.size) !== itemKey(productId, size))
    );
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (
    productId,
    size,
    quantity
  ) => {
    if (quantity <= 0) return removeItem(productId, size);
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.productId, i.size) === itemKey(productId, size)
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clear = () => setItems([]);

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items]
  );
  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalCents,
        totalQuantity,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
