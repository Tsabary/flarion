import { useEffect, useRef, useState } from "react";
import {
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
} from "lucide-react";
import axios from "../config/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SparkJobTableRow from "./SparkJobTableRow";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const rowHeight = 36; // Estimated height per row in pixels
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default value until measured

  const [currentPage, setCurrentPage] = useState(1);
  const [logs, setLogs] = useState<any[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Measure the container height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        setContainerHeight(height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Recalculate itemsPerPage whenever containerHeight changes
  useEffect(() => {
    const calculatedItems = Math.floor(containerHeight / rowHeight);
    setItemsPerPage(calculatedItems > 0 ? calculatedItems : 1);
  }, [containerHeight, rowHeight]);

  // Debounced filters so that API calls are not made on every keystroke/change
  const debouncedSearch = useDebounce(search, 1000);
  const debouncedStatus = useDebounce(status, 1000);
  const debouncedDateRange = useDebounce(dateRange, 1000);

  // Fetch logs using the calculated itemsPerPage
  const fetchLogs = async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { page, size };
      if (debouncedSearch) params.search = debouncedSearch;
      if (debouncedStatus && debouncedStatus !== "all")
        params.status = debouncedStatus;
      if (debouncedDateRange.startDate)
        params.startDate = debouncedDateRange.startDate.toISOString();
      if (debouncedDateRange.endDate)
        params.endDate = debouncedDateRange.endDate.toISOString();

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

  // Refetch logs when filters or itemsPerPage changes (once calculated)
  useEffect(() => {
    if (itemsPerPage > 0) {
      setCurrentPage(1);
      fetchLogs(1, itemsPerPage);
    }
  }, [debouncedSearch, debouncedStatus, debouncedDateRange, itemsPerPage]);

  // Refetch logs when page changes
  useEffect(() => {
    if (itemsPerPage > 0) {
      fetchLogs(currentPage, itemsPerPage);
    }
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalFiles / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalFiles);

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchLogs(1, itemsPerPage);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
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
                className="h-7 rounded-md px-2.5 text-xs flex items-center"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-3" />
                Newer
              </Button>
              <Button
                variant="outline"
                className="h-7 rounded-md px-2.5 text-xs flex items-center"
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
                className="h-7 rounded-md px-2.5 text-xs flex items-center"
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

export default SparkJobTable;
