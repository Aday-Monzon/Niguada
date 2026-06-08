import { PropsWithChildren } from "react";
import { cn } from "../../lib/utils/cn";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export const Card = ({ children, className }: CardProps) => {
  return <section className={cn("glass-panel min-w-0 overflow-hidden p-5 sm:p-6", className)}>{children}</section>;
};
