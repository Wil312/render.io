"use client";

import { useState } from "react";
import { Files, Search, GitBranch, Package, Database, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "files",    icon: Files,     label: "Files"    },
  { id: "search",   icon: Search,    label: "Search"   },
  { id: "git",      icon: GitBranch, label: "Git"      },
  { id: "packages", icon: Package,   label: "Packages" },
  { id: "database", icon: Database,  label: "Database" },
];

export default function Rail() {
  const [active, setActive] = useState("files");

  return (
    <aside className="flex w-12 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--surface)]">
      <nav className="flex flex-1 flex-col py-1">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              title={label}
              className={`relative flex h-10 w-full items-center justify-center transition-colors ${
                isActive
                  ? "bg-[var(--accent-2)] text-[var(--accent)]"
                  : "text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]"
              }`}
            >
              {isActive && (
                <span className="absolute inset-y-2 left-0 w-[2px] rounded-r-full bg-[var(--accent)]" />
              )}
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[var(--line)] py-1">
        <button
          title="Settings"
          className="flex h-10 w-full items-center justify-center text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink-2)]"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
