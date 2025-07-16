"use client";
import { createContext } from "react";

export const MenuContext = createContext<{ open: boolean; toggle: () => void }>({
  open: false,
  toggle: () => {},
});
