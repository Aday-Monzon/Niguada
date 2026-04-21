import { PropsWithChildren } from "react";
import { cn } from "../../lib/utils/cn";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export const Card = ({ children, className }: CardProps) => {
  return <section className={cn("glass-panel p-5", className)}>{children}</section>;
};
