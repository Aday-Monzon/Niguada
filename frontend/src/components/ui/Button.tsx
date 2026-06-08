import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  busy?: boolean;
  busyLabel?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", busy, busyLabel = "Guardando...", children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-zinc-950 text-white shadow-sm hover:bg-zinc-800",
      secondary: "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800",
      ghost: "border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50 hover:text-zinc-950",
      danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          className
        )}
        disabled={disabled || busy}
        {...props}
      >
        {busy ? busyLabel : children}
      </button>
    );
  }
);

Button.displayName = "Button";
