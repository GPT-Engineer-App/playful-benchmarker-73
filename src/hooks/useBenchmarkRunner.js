import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { useBenchmarkScenarios, useAddRun, useAddResult, useUpdateRun, useUserSecrets, useRuns } from "../integrations/supabase";
import { supabase } from "../integrations/supabase";
import { impersonateUser } from "../lib/userImpersonation";
import { callOpenAILLM } from "../lib/anthropic";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const useBenchmarkRunner = () => {
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [systemVersion, setSystemVersion] = useState("http://localhost:8000");
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const addRun = useAddRun();
  const addResult = useAddResult();
  const updateRun = useUpdateRun();
  const { data: runs } = useRuns();
  const { data: userSecrets } = useUserSecrets();
  const { data: scenarios } = useBenchmarkScenarios();

  const sendChatMessage = async (projectId, message, systemVersion, gptEngineerTestToken) => {
    const response = await fetch(`${systemVersion}/projects/${projectId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptEngineerTestToken}`,
      },
      body: JSON.stringify({ message, images: [], mode: 'instant' }),
    });
    if (!response.ok) {
      throw new Error('Failed to send chat message');
    }
    return response.json();
  };

  const handleSingleIteration = useCallback(async (gptEngineerTestToken) => {
    // ... (keep the existing handleSingleIteration logic)
  }, [runs, updateRun, addResult, systemVersion, sendChatMessage, supabase, toast]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (isRunning && userSecrets && userSecrets.length > 0) {
        const secrets = JSON.parse(userSecrets[0].secret);
        const gptEngineerTestToken = secrets.GPT_ENGINEER_TEST_TOKEN;
        if (gptEngineerTestToken) {
          await handleSingleIteration(gptEngineerTestToken);
        } else {
          console.error("GPT Engineer test token not found in user secrets");
          setIsRunning(false);
          toast.error("GPT Engineer test token not found. Please set it up in your secrets.");
        }
      }
    }, 5000); // Run every 5 seconds

    return () => clearInterval(intervalId);
  }, [isRunning, handleSingleIteration, userSecrets, setIsRunning, toast]);

  const handleStartBenchmark = useCallback(async () => {
    // ... (keep the existing handleStartBenchmark logic)
  }, [selectedScenarios, scenarios, systemVersion, session, addRun, addResult, userSecrets]);

  return {
    selectedScenarios,
    setSelectedScenarios,
    systemVersion,
    setSystemVersion,
    isRunning,
    handleStartBenchmark
  };
};
