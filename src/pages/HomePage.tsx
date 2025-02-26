import { useState } from "react";

import { SparkJobTable } from "@/components/SparkJobTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import SparkJobTableFilters from "../components/SparkJobTableFilters";
import logo from '../assets/flarion-logo.png'

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

  return (
    <main className="p-8 bg-neutral-900 h-screen flex flex-col gap-4 overflow-hidden">
      <img src={logo} alt="Flarion logo" className="w-32 aspect-auto opacity-50" />
      <Card className="h-full flex-1 flex flex-col bg-neutral-800 border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Spark Job Dashboard
          </CardTitle>
          <CardDescription className="text-white">
            View all your logs and monitor your service performence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col h-full overflow-hidden">
          <SparkJobTableFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
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
