import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your AI Engineering?</h2>
        <p className="text-xl mb-8">Start benchmarking your GPT Engineer projects today and unlock new levels of performance.</p>
        <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
          <Link to="/signup">Get Started for Free</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;