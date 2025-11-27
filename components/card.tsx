import { ForwardedRef, HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
}

export const Card = forwardRef(function Card(
  { className, children, as: Component = "div", ...props }: CardProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <Component
      ref={ref}
      className={cn(
        "border-2 border-border-heavy rounded-md bg-bg-beige shadow-posthog px-6 py-5 transition-all duration-200",
        "hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
        "focus-within:outline focus-within:-outline-offset-2 focus-within:outline-accent-orange",
        "focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-accent-orange",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
