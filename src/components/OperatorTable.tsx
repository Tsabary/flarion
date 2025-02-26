"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OperatorTableProps {
  operators: SparkOperator[];
}

export function OperatorTable({ operators }: OperatorTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (operatorId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(operatorId)) {
      newExpandedRows.delete(operatorId);
    } else {
      newExpandedRows.add(operatorId);
    }
    setExpandedRows(newExpandedRows);
  };

  const formatDuration = (seconds: number) => {
    return `${seconds.toFixed(2)}s`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Operator Details</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Operator ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Dependencies</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operators.map((operator) => (
            <>
              <TableRow key={operator.operatorId}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(operator.operatorId)}
                  >
                    {expandedRows.has(operator.operatorId) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  {operator.operatorId}
                </TableCell>
                <TableCell>{operator.operatorType}</TableCell>
                <TableCell>{formatDuration(operator.duration)}</TableCell>
                <TableCell>
                  {operator.dependencies.join(", ") || "None"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      operator.errors.length === 0 ? "success" : "destructive"
                    }
                  >
                    {operator.errors.length === 0 ? "Success" : "Error"}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRows.has(operator.operatorId) && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="p-4 bg-muted">
                      <h4 className="font-semibold mb-2">Details:</h4>
                      <p>
                        <strong>Dependencies:</strong>{" "}
                        {operator.dependencies.length > 0
                          ? operator.dependencies.join(", ")
                          : "None"}
                      </p>
                      {operator.errors.length > 0 && (
                        <div>
                          <strong>Errors:</strong>
                          <ul className="list-disc list-inside">
                            {operator.errors.map((error, index) => (
                              <li key={index} className="text-red-600">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
