import { cn } from "@/lib/utils";

export type BadgeVariant = 'in_stock' | 'low_stock' | 'out_of_stock' | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  const variantStyles = {
    in_stock: "bg-[#D1E6D3] text-[#1E3F20]",
    low_stock: "bg-[#FEF3C7] text-[#92400E]",
    out_of_stock: "bg-[#FEE2E2] text-[#991B1B]",
    default: "bg-[#F3F4F6] text-[#1F2937]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[6px] px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors whitespace-nowrap",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
