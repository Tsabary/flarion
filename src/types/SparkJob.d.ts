interface SparkJob {
    jobId: string;              // Unique identifier for the Spark job
    startTime: string;          // ISO timestamp of when the job started
    endTime: string;            // ISO timestamp of when the job ended
    duration: number;           // Total job duration in seconds
    numExecutors: number;       // Number of executors used
    status: "success" | "error"; // Job completion status
    errors: string[];           // Errors encountered at the job level
    operators: SparkOperator[]; // List of operators executed in the job
  }