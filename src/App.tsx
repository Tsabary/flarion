import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import JobPage from "./pages/JobPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job/:jobId" element={<JobPage />} />
      </Routes>
    </Router>
  );
}

export default App;
