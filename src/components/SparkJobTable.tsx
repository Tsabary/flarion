// SparkJobTable.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
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
import axios from "../config/axios";

interface SparkJob {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  numExecutors: number;
  status: string;
  errors: string[];
  // ... plus any additional fields
}

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
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logs, setLogs] = useState<SparkJob[]>([]);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/logs", {
        params: {
          page,
          pageSize: itemsPerPage,
        },
      });
      // Expected response shape: { page, pageSize, totalFiles, logs }
      setLogs(response.data.logs);
      setTotalFiles(response.data.totalFiles);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs when currentPage changes
  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  // If filters change, reset to page 1 and refetch (assuming you'd extend the API to support filtering)
  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1);
  }, [search, status, dateRange]);

  const totalPages = Math.ceil(totalFiles / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalFiles);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchLogs(1);
  };

  return (
    <div>
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <LoaderCircle className="h-6 w-6 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <>
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
              {logs.length > 0 ? (
                logs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/job/${job.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {job.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {new Date(job.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{formatDuration(job.duration)}</TableCell>
                    <TableCell>{job.numExecutors}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "success" ? "success" : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(job.errors || []).length > 0 ? job.errors[0] : "None"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No Spark job logs available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {startIndex}-{endIndex} of {totalFiles} jobs
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
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
