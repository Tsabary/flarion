import { cn } from "../../lib/utils";

function Badge({ status }: { status: "success" | "error" }) {
  return (
    <div
      className={cn(
        "text-xs inline-flex items-center justify-center rounded-md bg-neutral-900 px-2 py-0.5",
        status === "success" ? "text-emerald-600" : "text-red-700"
      )}
    >
      {status}
    </div>
  );
}

export default Badge;
