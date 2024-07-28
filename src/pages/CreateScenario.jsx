import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useAddBenchmarkScenario, useAddReviewer, useReviewDimensions } from "../integrations/supabase";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase";
import { toast } from "sonner";

const CreateScenario = () => {
  const navigate = useNavigate();
  const { session, logout } = useSupabaseAuth();
  const addBenchmarkScenario = useAddBenchmarkScenario();
  const addReviewer = useAddReviewer();
  const { data: reviewDimensions, isLoading: isLoadingDimensions } = useReviewDimensions();

  const [scenario, setScenario] = useState(() => {
    const savedScenario = localStorage.getItem('draftScenario');
    return savedScenario ? JSON.parse(savedScenario) : {
      name: "",
      description: "",
      prompt: "",
      llm_model: "gpt-4o-mini",
      llm_temperature: 0.5,
    };
  });

  const [reviewers, setReviewers] = useState(() => {
    const savedReviewers = localStorage.getItem('draftReviewers');
    return savedReviewers ? JSON.parse(savedReviewers) : [];
  });

  const saveDraft = useCallback(() => {
    localStorage.setItem('draftScenario', JSON.stringify(scenario));
    localStorage.setItem('draftReviewers', JSON.stringify(reviewers));
  }, [scenario, reviewers]);

  useEffect(() => {
    window.addEventListener('beforeunload', saveDraft);
    return () => {
      window.removeEventListener('beforeunload', saveDraft);
      saveDraft();
    };
  }, [saveDraft]);

  const handleScenarioChange = (e) => {
    const { name, value } = e.target;
    setScenario((prev) => ({ ...prev, [name]: value }));
  };

  const handleLLMModelChange = (value) => {
    setScenario((prev) => ({ ...prev, llm_model: value }));
  };

  const handleLLMTemperatureChange = (value) => {
    setScenario((prev) => ({ ...prev, llm_temperature: value[0] }));
  };

  const handleReviewerChange = (index, e) => {
    const { name, value } = e.target;
    setReviewers((prev) => {
      const newReviewers = [...prev];
      newReviewers[index] = { 
        ...newReviewers[index], 
        [name]: name === 'weight' ? parseInt(value, 10) : value 
      };
      return newReviewers;
    });
  };

  const handleReviewerDimensionChange = (index, value) => {
    if (value === "create_new") {
      saveDraft();
      navigate("/create-review-dimension");
    } else {
      setReviewers((prev) => {
        const newReviewers = [...prev];
        newReviewers[index] = { ...newReviewers[index], dimension: value };
        return newReviewers;
      });
    }
  };

  const handleReviewerLLMModelChange = (index, value) => {
    setReviewers((prev) => {
      const newReviewers = [...prev];
      newReviewers[index] = { ...newReviewers[index], llm_model: value };
      return newReviewers;
    });
  };

  const handleReviewerLLMTemperatureChange = (index, value) => {
    setReviewers((prev) => {
      const newReviewers = [...prev];
      newReviewers[index] = { ...newReviewers[index], llm_temperature: value[0] };
      return newReviewers;
    });
  };

  const addReviewerField = () => {
    setReviewers((prev) => [
      ...prev,
      {
        dimension: "",
        description: "",
        prompt: "",
        weight: 1,
        llm_model: "gpt-4o-mini",
        llm_temperature: 0,
        run_count: 1,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("You must be logged in to create a scenario");
      return;
    }

    try {
      // Use the Supabase client directly for more control over the response
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('benchmark_scenarios')
        .insert([scenario])
        .select();

      if (scenarioError) throw scenarioError;
      if (!scenarioData || scenarioData.length === 0) throw new Error("No scenario data returned");

      const createdScenarioId = scenarioData[0].id;

      for (const reviewer of reviewers) {
        const { error: reviewerError } = await supabase
          .from('reviewers')
          .insert({
            ...reviewer,
            scenario_id: createdScenarioId,
          });
        if (reviewerError) throw reviewerError;
      }

      // Clear the draft from localStorage
      localStorage.removeItem('draftScenario');
      localStorage.removeItem('draftReviewers');

      toast.success("Scenario and reviewers created successfully");
      navigate("/");
    } catch (error) {
      console.error("Error creating scenario:", error);
      toast.error(`Failed to create scenario: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Create Scenario</h1>
          <nav>
            <ul className="flex space-x-4 items-center">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/secrets" className="hover:underline">Secrets</Link></li>
              <li><Button onClick={handleLogout} variant="ghost" className="h-9 px-4 py-2">Logout</Button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Scenario Details</h2>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={scenario.name}
                onChange={handleScenarioChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={scenario.description}
                onChange={handleScenarioChange}
              />
            </div>
            <div>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                name="prompt"
                value={scenario.prompt}
                onChange={handleScenarioChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="llm_model">LLM Model</Label>
              <Select onValueChange={handleLLMModelChange} value={scenario.llm_model}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select LLM Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aws--anthropic.claude-3-5-sonnet-20240620-v1:0">
                    aws--anthropic.claude-3-5-sonnet-20240620-v1:0
                  </SelectItem>
                  <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="llm_temperature">LLM Temperature: {scenario.llm_temperature.toFixed(2)}</Label>
              <Slider
                id="llm_temperature"
                min={0}
                max={1}
                step={0.01}
                value={[scenario.llm_temperature]}
                onValueChange={handleLLMTemperatureChange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Reviewers</h2>
            {reviewers.map((reviewer, index) => (
              <div key={index} className="border p-4 rounded-md space-y-2">
                <h3 className="text-lg font-semibold">Reviewer {index + 1}</h3>
                <div>
                  <Label htmlFor={`dimension-${index}`}>Dimension</Label>
                  <Select onValueChange={(value) => handleReviewerDimensionChange(index, value)} value={reviewer.dimension || "select_dimension"}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Dimension" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select_dimension" disabled>Select a dimension</SelectItem>
                      {isLoadingDimensions ? (
                        <SelectItem value="loading">Loading dimensions...</SelectItem>
                      ) : (
                        <>
                          {reviewDimensions?.map((dimension) => (
                            <SelectItem key={dimension.id} value={dimension.name}>
                              {dimension.name}
                            </SelectItem>
                          ))}
                          <SelectSeparator />
                          <SelectItem value="create_new">
                            <Link to="/create-review-dimension" className="flex items-center text-blue-500 hover:underline">
                              <span className="mr-2">+</span> Create New Dimension
                            </Link>
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`reviewer-description-${index}`}>Description</Label>
                  <Textarea
                    id={`reviewer-description-${index}`}
                    name="description"
                    value={reviewer.description}
                    onChange={(e) => handleReviewerChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`reviewer-prompt-${index}`}>Prompt</Label>
                  <Textarea
                    id={`reviewer-prompt-${index}`}
                    name="prompt"
                    value={reviewer.prompt}
                    onChange={(e) => handleReviewerChange(index, e)}
                    required
                  />
                </div>
                <div>
                  <Label>Weight</Label>
                  <RadioGroup
                    value={reviewer.weight.toString()}
                    onValueChange={(value) => handleReviewerChange(index, { target: { name: 'weight', value } })}
                    className="flex space-x-4 mt-2"
                  >
                    {[
                      { value: "1", label: "Weak signal" },
                      { value: "2", label: "Moderate signal" },
                      { value: "3", label: "Strong signal" },
                      { value: "4", label: "Very strong signal" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`weight-${index}-${option.value}`} />
                        <Label htmlFor={`weight-${index}-${option.value}`} className="font-normal">
                          {option.value} - {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor={`reviewer-llm-model-${index}`}>LLM Model</Label>
                  <Select onValueChange={(value) => handleReviewerLLMModelChange(index, value)} value={reviewer.llm_model}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select LLM Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws--anthropic.claude-3-5-sonnet-20240620-v1:0">
                        aws--anthropic.claude-3-5-sonnet-20240620-v1:0
                      </SelectItem>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`reviewer-llm-temperature-${index}`}>LLM Temperature: {reviewer.llm_temperature.toFixed(2)}</Label>
                  <Slider
                    id={`reviewer-llm-temperature-${index}`}
                    min={0}
                    max={1}
                    step={0.01}
                    value={[reviewer.llm_temperature]}
                    onValueChange={(value) => handleReviewerLLMTemperatureChange(index, value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor={`run-count-${index}`}>Run Count</Label>
                  <Input
                    id={`run-count-${index}`}
                    name="run_count"
                    type="number"
                    value={reviewer.run_count}
                    onChange={(e) => handleReviewerChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}
            <Button type="button" onClick={addReviewerField}>Add Reviewer</Button>
          </div>

          <Button type="submit" className="w-full">Create Scenario</Button>
        </form>
      </main>
    </div>
  );
};

export default CreateScenario;
