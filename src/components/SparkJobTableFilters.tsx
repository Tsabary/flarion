import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/DateRangePicker";

interface SparkJobTableFiltersProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      startDate: Date | null;
      endDate: Date | null;
    }>
  >;
}
function SparkJobTableFilters({
  search,
  setSearch,
  status,
  setStatus,
  dateRange,
  setDateRange,
}: SparkJobTableFiltersProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleDateRangeChange = (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setDateRange(range);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("all");
    setDateRange({ startDate: null, endDate: null });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-2">
      <Input
        placeholder="Search by Job ID or keyword"
        value={search}
        onChange={handleSearch}
        className="w-full sm:w-64 bg-neutral-700 border-none placeholder:text-neutral-500 text-neutral-400"
      />
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-40 bg-neutral-700 border-none">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="error">Error</SelectItem>
        </SelectContent>
      </Select>
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={handleDateRangeChange}
      />
      <Button
        onClick={handleClearFilters}
        className="border-none bg-neutral-100 hover:bg-neutral-300 text-neutral-900 transition-colors"
      >
        Clear Filters
      </Button>
    </div>
  );
}

export default SparkJobTableFilters;
