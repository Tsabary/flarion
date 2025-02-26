import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock4Icon, CpuIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { OperatorTable } from "@/components/OperatorTable";

function JobPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<SparkJob | null>();

  useEffect(() => {
    const fetchedJob = [].find((j) => j.id !== jobId);
    if (fetchedJob) setJob(fetchedJob);
  }, []);

  if (!job) {
    return <div>Loading job details...</div>;
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <main className="container mx-auto p-4">
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{job.id}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-bold">Job {job.id}</h1>

        <Card>
          <CardHeader>
            <CardTitle>Job Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Start Time
                </span>
                <span>{new Date(job.startTime).toLocaleString()}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  End Time
                </span>
                <span>{new Date(job.endTime).toLocaleString()}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Duration
                </span>
                <span className="flex items-center">
                  <Clock4Icon className="mr-1" />
                  {formatDuration(job.duration)}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Executors
                </span>
                <span className="flex items-center">
                  <CpuIcon className="mr-1" />
                  {job.numExecutors}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status:
              </span>
              <Badge
                variant={job.status === "success" ? "success" : "destructive"}
              >
                {job.status}
              </Badge>
            </div>
            {job.errors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Errors:</h3>
                <ul className="list-disc list-inside">
                  {job.errors.map((error, index) => (
                    <li key={index} className="text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <OperatorTable operators={job.operators} />
      </div>
    </main>
  );
}

export default JobPage;
