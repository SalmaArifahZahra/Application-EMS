"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;

  onChange: (
    value: string,
  ) => void;

  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <Input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="pl-10"
      />
    </div>
  );
}