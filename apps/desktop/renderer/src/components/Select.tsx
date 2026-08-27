import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number | null;
}

interface SelectProps {
  id?: string;
  label?: string;
  description?: string;
  options: SelectOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  disabled?: boolean;
  className?: string;
}

export function Select({
  id,
  label,
  description,
  options,
  value,
  onChange,
  disabled,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const open = () => {
    setIsOpen(true);
    setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const close = () => setIsOpen(false);

  const selectOption = (opt: SelectOption) => {
    onChange(opt.value);
    close();
  };

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const el = optionRefs.current[highlighted];
    if (el) {
      el.scrollIntoView({ block: "nearest" });
      el.focus({ preventScroll: true });
    }
  }, [isOpen, highlighted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        open();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[highlighted]) selectOption(options[highlighted]);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>
      )}
      {description && (
        <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
      )}

      <div
        ref={containerRef}
        className="relative mt-2 w-full max-w-xs"
        onKeyDown={handleKeyDown}
      >
        {/* Trigger */}
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => (isOpen ? close() : open())}
          className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white dark:bg-[#0d1624] pl-3.5 pr-3 text-sm font-medium text-slate-900 dark:text-slate-200 shadow-sm dark:shadow-card transition-all hover:bg-slate-50 dark:hover:bg-[#111c2e] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            isOpen
              ? "border-sky-400/60 ring-2 ring-sky-400/15"
              : "border-slate-200 dark:border-white/[0.1] hover:border-slate-300 dark:hover:border-white/[0.18]"
          }`}
        >
          <span className="block truncate">
            {selectedOption ? selectedOption.label : "Select an option"}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div
            role="listbox"
            aria-label={label}
            className="animate-dropdown-in origin-top absolute z-10 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#1a2332] p-1.5 shadow-lg shadow-slate-900/10 dark:shadow-black/40"
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              const isHighlighted = i === highlighted;
              
              let itemClasses = "text-slate-600 dark:text-slate-300";
              if (isSelected && isHighlighted) {
                itemClasses =
                  "bg-sky-500/15 dark:bg-sky-400/20 text-sky-700 dark:text-sky-400 font-medium";
              } else if (isSelected) {
                itemClasses =
                  "bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-400 font-medium";
              } else if (isHighlighted) {
                itemClasses =
                  "bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white";
              }

              return (
                <button
                  key={String(opt.value)}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => selectOption(opt)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${itemClasses}`}
                >
                  <span className="block truncate">{opt.label}</span>
                  {isSelected && (
                    <Check
                      size={16}
                      strokeWidth={2.5}
                      className="shrink-0 text-sky-500 dark:text-sky-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}