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
      primary: "bg-ink text-white hover:bg-slate-800",
      secondary: "bg-accent-500 text-white hover:bg-accent-600",
      ghost: "bg-white text-ink hover:bg-slate-100 border border-slate-200",
      danger: "bg-rose-500 text-white hover:bg-rose-600"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
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
