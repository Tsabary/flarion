import React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SparkJobTable } from "@/components/SparkJobTable";
import { DateRangePicker } from "@/components/DateRangePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function HomePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

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
    <main className="p-8 bg-neutral-800 min-h-screen flex flex-col">
      <Card className="flex-1  flex flex-col bg-neutral-900 border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Spark Job Dashboard
          </CardTitle>
          <CardDescription className="text-white">
            View all your logs and monitor your service performence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by Job ID or keyword"
              value={search}
              onChange={handleSearch}
              className="w-full sm:w-64 bg-white"
            />
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
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
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
          <SparkJobTable
            search={search}
            status={status}
            dateRange={dateRange}
          />
        </CardContent>
      </Card>
    </main>
  );
}

export default HomePage;
