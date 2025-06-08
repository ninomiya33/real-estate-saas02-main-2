import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface CardCustomProps extends React.ComponentProps<typeof Card> {
  status?: 'new' | 'inProgress' | 'completed';
  hoverEffect?: boolean;
}

export function CardCustom({
  className,
  status,
  hoverEffect = true,
  children,
  ...props
}: CardCustomProps) {
  const statusClasses = {
    new: 'border-l-4 border-l-blue-500',
    inProgress: 'border-l-4 border-l-amber-500',
    completed: 'border-l-4 border-l-green-500',
  };

  return (
    <Card
      className={cn(
        "overflow-hidden",
        hoverEffect && "transition-all duration-200 hover:shadow-lg",
        status && statusClasses[status],
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}