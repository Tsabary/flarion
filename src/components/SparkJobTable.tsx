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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import mockData from "../data/mock-data";

interface SparkJobTableProps {
  search: string;
  status: string;
  dateRange: { startDate: Date | null; endDate: Date | null };
}

export function SparkJobTable({
  search,
  status,
  dateRange,
}: SparkJobTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = mockData.filter((job) => {
    const matchesSearch = job.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || job.status === status;
    const matchesDateRange =
      !dateRange.startDate ||
      !dateRange.endDate ||
      (new Date(job.startTime) >= dateRange.startDate &&
        new Date(job.endTime) <= dateRange.endDate);
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Executors</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Errors</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                <Link
                  to={`/job/${job.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {job.id}
                </Link>
              </TableCell>
              <TableCell>{new Date(job.startTime).toLocaleString()}</TableCell>
              <TableCell>{formatDuration(job.duration)}</TableCell>
              <TableCell>{job.numExecutors}</TableCell>
              <TableCell>
                <Badge
                  variant={job.status === "success" ? "success" : "destructive"}
                >
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell>
                {job.errors.length > 0 ? job.errors[0] : "None"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredData.length === 0 && (
        <div className="text-center py-4">No Spark job logs available.</div>
      )}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of{" "}
          {filteredData.length} jobs
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
