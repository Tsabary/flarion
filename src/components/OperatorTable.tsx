import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge";

interface OperatorTableProps {
  operators: SparkOperator[];
}

export function OperatorTable({ operators }: OperatorTableProps) {
  const formatDuration = (seconds: number) => {
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-neutral-400">Operator ID</TableHead>
          <TableHead className="text-neutral-400">Type</TableHead>
          <TableHead className="text-neutral-400">Duration</TableHead>
          <TableHead className="text-neutral-400">Dependencies</TableHead>
          <TableHead className="text-neutral-400">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operators.map((operator) => (
          <TableRow className="text-white text-xs" key={operator.operatorId}>
            <TableCell className="font-medium">{operator.operatorId}</TableCell>
            <TableCell>{operator.operatorType}</TableCell>
            <TableCell>{formatDuration(operator.duration)}</TableCell>
            <TableCell>
              {(operator.dependencies || []).join(", ") || "None"}
            </TableCell>
            <TableCell>
              <Badge
                status={
                  (operator.errors || []).length === 0 ? "success" : "error"
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
