"use client";

import { useState, ReactNode } from "react";
import SideMenu from "./SideMenu";
import { MenuContext } from "@/contexts/MenuContext";

/**
 * AppShell – wraps the sidebar + main content.
 * No explicit margin‑left: the flex container lets <main> shrink while
 * the sidebar grows, keeping the right edge fixed and eliminating extra space.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);

  return (
    <MenuContext.Provider value={{ open, toggle }}>
      {/* The flex container never exceeds 100vw; sidebar + main fit inside */}
      <div className="flex min-h-screen overflow-x-hidden">
        <SideMenu />

        {/* Main content – flex‑1 fills remaining space, transitions smoothly */}
        <main className="flex-1 min-h-screen min-w-0 transition-all duration-300">
          {children}
        </main>
      </div>
    </MenuContext.Provider>
  );
}
