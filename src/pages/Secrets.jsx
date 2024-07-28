import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { useAddUserSecret } from "../integrations/supabase";
import { toast } from "sonner";

const Secrets = () => {
  const [anthropicApiKey, setAnthropicApiKey] = useState("");
  const [multionApiKey, setMultionApiKey] = useState("");
  const [gptEngineerTestToken, setGptEngineerTestToken] = useState("");
  const navigate = useNavigate();
  const { session } = useSupabaseAuth();
  const addUserSecret = useAddUserSecret();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error("You must be logged in to save secrets");
      return;
    }

    try {
      await addUserSecret.mutateAsync({
        user_id: session.user.id,
        secret: JSON.stringify({
          ANTHROPIC_API_KEY: anthropicApiKey,
          MULTION_API_KEY: multionApiKey,
          GPT_ENGINEER_TEST_TOKEN: gptEngineerTestToken,
        }),
      });
      toast.success("Secrets saved successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to save secrets: " + error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Secrets</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div>
            <Label htmlFor="anthropic-api-key">ANTHROPIC_API_KEY</Label>
            <Input
              id="anthropic-api-key"
              type="password"
              value={anthropicApiKey}
              onChange={(e) => setAnthropicApiKey(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="multion-api-key">MULTION_API_KEY</Label>
            <Input
              id="multion-api-key"
              type="password"
              value={multionApiKey}
              onChange={(e) => setMultionApiKey(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="gpt-engineer-test-token">GPT_ENGINEER_TEST_TOKEN</Label>
            <Input
              id="gpt-engineer-test-token"
              type="password"
              value={gptEngineerTestToken}
              onChange={(e) => setGptEngineerTestToken(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Save Secrets
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Secrets;