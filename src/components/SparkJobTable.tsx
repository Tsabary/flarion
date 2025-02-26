import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import axios from "../config/axios";
import SparkJobTableRow from "./SparkJobTableRow";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
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
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [logs, setLogs] = useState<SparkJob[]>([]);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced filters
  const debouncedSearch = useDebounce(search, 1000);
  const debouncedStatus = useDebounce(status, 1000);
  const debouncedDateRange = useDebounce(dateRange, 1000);

  const fetchLogs = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page,
        size: itemsPerPage,
      };
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      if (debouncedStatus && debouncedStatus !== "all") {
        params.status = debouncedStatus;
      }
      if (debouncedDateRange.startDate) {
        params.startDate = debouncedDateRange.startDate.toISOString();
      }
      if (debouncedDateRange.endDate) {
        params.endDate = debouncedDateRange.endDate.toISOString();
      }

      const response = await axios.get("/logs", { params });
      setLogs(response.data.logs);
      setTotalFiles(response.data.totalFiles);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs when filters change with debounce
  useEffect(() => {
    setCurrentPage(1);
    fetchLogs(1);
  }, [debouncedSearch, debouncedStatus, debouncedDateRange]);

  // Fetch logs when page changes
  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalFiles / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalFiles);

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchLogs(1);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <LoaderCircle className="h-6 w-6 animate-spin text-white" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <>
          <div className="flex-1 h-full overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-none">
                  <TableHead className="w-6" />
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
                  logs.map((job) => <SparkJobTableRow job={job} key={job.id} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No Spark job logs available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-neutral-400 text-sm">
              Showing {startIndex}-{endIndex} of {totalFiles} jobs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-7 rounded-md px-2.5 text-xs flex items-center bg-neutral-100 hover:bg-neutral-300 text-neutral-900 transition-colors"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-3" />
                Newer
              </Button>
              <Button
                variant="outline"
                className="h-7 rounded-md px-2.5 text-xs flex items-center bg-neutral-100 hover:bg-neutral-300 text-neutral-900 transition-colors"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Older
                <ChevronRight className="size-3" />
              </Button>
              <Button
                variant="outline"
                className="h-7 rounded-md px-2.5 text-xs flex items-center bg-neutral-100 hover:bg-neutral-300 text-neutral-900 transition-colors"
                onClick={handleRefresh}
              >
                <RefreshCcw className="size-3" />
                Refresh
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
