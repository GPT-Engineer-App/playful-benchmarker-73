import { useState } from "react";
import ScenarioSelection from "./ScenarioSelection";
import SystemVersionSelection from "./SystemVersionSelection";
import { Button } from "@/components/ui/button";
import useBenchmarkLogic from "../hooks/useBenchmarkLogic";

const BenchmarkForm = () => {
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [systemVersion, setSystemVersion] = useState("http://localhost:8000");
  const { isRunning, startBenchmark } = useBenchmarkLogic(selectedScenarios, systemVersion);

  return (
    <>
      <ScenarioSelection
        selectedScenarios={selectedScenarios}
        setSelectedScenarios={setSelectedScenarios}
      />
      <SystemVersionSelection
        systemVersion={systemVersion}
        setSystemVersion={setSystemVersion}
      />
      <Button 
        onClick={startBenchmark} 
        className="mt-8 w-full"
        disabled={isRunning}
      >
        {isRunning ? "Running Benchmark..." : "Start Benchmark"}
      </Button>
    </>
  );
};

export default BenchmarkForm;
