// src/components/ui/status-badge.tsx

type Props = {
  status?: "new" | "inProgress" | "completed";
};

export const StatusBadge = ({ status = "new" }: Props) => {
  const className: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    inProgress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  };

  const label: Record<string, string> = {
    new: "新規",
    inProgress: "対応中",
    completed: "完了",
  };

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${className[status]}`}>
      {label[status]}
    </span>
  );
};
