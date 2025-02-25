interface SparkOperator {
  operatorId: string; // Unique identifier for the operator
  operatorType: string; // Type of operation (Read, Sort, Filter, Join, etc.)
  duration: number; // Execution time in seconds
  dependencies: string[]; // List of operator IDs this operator depends on
  errors: string[]; // Any errors specific to this operator
}
