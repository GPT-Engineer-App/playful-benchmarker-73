import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Lovable Benchmarks has been instrumental in improving our AI models. The insights we've gained are invaluable.",
    author: "Dr. Emily Chen",
    role: "AI Research Lead, TechCorp"
  },
  {
    quote: "The comprehensive testing scenarios provided by Lovable Benchmarks have helped us identify and fix critical issues in our systems.",
    author: "Michael Rodriguez",
    role: "CTO, AI Innovations Inc."
  },
  {
    quote: "We've seen a significant boost in our AI's performance since implementing Lovable Benchmarks. Highly recommended!",
    author: "Sarah Johnson",
    role: "Product Manager, FutureTech Solutions"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <blockquote className="text-lg text-gray-600 mb-4">"{testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;