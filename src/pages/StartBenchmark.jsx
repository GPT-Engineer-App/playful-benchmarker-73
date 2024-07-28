import Navbar from "../components/Navbar";
import BenchmarkForm from "../components/BenchmarkForm";

const StartBenchmark = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BenchmarkForm />
      </div>
    </main>
  </div>
);

export default StartBenchmark;