import { useState } from "react";
import { Link } from "react-router-dom";
import { MinusSquareIcon, PlusSquareIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

import { cn } from "../lib/utils";

interface SparkJobTableRowProps {
  job: SparkJob;
}
function SparkJobTableRow({ job }: SparkJobTableRowProps) {
  const [expended, setExpended] = useState(false);
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <>
      <TableRow
        className="group text-xs border-none hover:bg-neutral-700 rounded-2xl overflow-hidden"
        key={job.id}
      >
        <TableCell className="opacity-0 group-hover:opacity-100 w-6 p-1">
          <button
            onClick={() => setExpended((preState) => !preState)}
            className="cursor-pointer"
          >
            {expended ? (
              <MinusSquareIcon className="size-4 text-neutral-400" />
            ) : (
              <PlusSquareIcon className="size-4 text-neutral-400" />
            )}
          </button>
        </TableCell>
        <TableCell className="font-medium flex items-center gap-2">
          <div
            className={cn(
              "h-4 w-1.5 rounded transition-colors",
              job.status === "success"
                ? "bg-emerald-700 group-hover:bg-emerald-600"
                : "bg-red-700 group-hover:bg-red-600"
            )}
          />
          <Link
            to={`/job/${job.id}`}
            className="text-white font-bold hover:underline"
          >
            {job.id}
          </Link>
        </TableCell>
        <TableCell className="text-neutral-300">
          {new Date(job.startTime).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "numeric",
          })}
        </TableCell>
        <TableCell className="text-neutral-300">
          {formatDuration(job.duration)}
        </TableCell>
        <TableCell className="text-neutral-300">{job.numExecutors}</TableCell>
        <TableCell className="py-0">
          <div
            className={cn(
              "inline-flex items-center justify-center rounded-md bg-neutral-900 px-2 py-0.5",
              job.status === "success" ? "text-emerald-600" : "text-red-700"
            )}
          >
            {job.status}
          </div>
        </TableCell>
        <TableCell className="text-neutral-300">
          {(job.errors || []).length > 0 ? job.errors[0] : "None"}
        </TableCell>
      </TableRow>
      {expended && (
        <TableRow className="border-none">
          <TableCell colSpan={7} className="p-3">
            <div className="bg-neutral-600 rounded-lg p-3">
              <h3 className="font-semibold mb-2">Additional Information</h3>
              <p>This is where you can display more details about</p>
              <p>
                You can include any additional information or even other
                components here.
              </p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default SparkJobTableRow;
