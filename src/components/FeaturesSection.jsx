import { CheckCircle, BarChart2, Zap } from "lucide-react";

const features = [
  {
    icon: <CheckCircle className="h-12 w-12 text-purple-600" />,
    title: "Comprehensive Testing",
    description: "Evaluate your AI's performance across multiple dimensions with our thorough benchmarking scenarios."
  },
  {
    icon: <BarChart2 className="h-12 w-12 text-purple-600" />,
    title: "Insightful Analytics",
    description: "Gain valuable insights with detailed performance metrics and visualizations."
  },
  {
    icon: <Zap className="h-12 w-12 text-purple-600" />,
    title: "Continuous Improvement",
    description: "Identify areas for enhancement and track your AI's progress over time."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Lovable Benchmarks?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;