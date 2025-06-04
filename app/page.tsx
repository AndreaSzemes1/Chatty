import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
    <div className="flex-grow flex items-center justify-center">
    <div className="text-center p-8 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Welcome to Chatty</h1>
      <p className="mb-2">
        Chatty is a mental health support app that provides a safe space to express yourself.
      </p>
      <p className="mb-2">
        Register to access personalized meditation, diary entries, and motivational quotes.
      </p>
      <p>
        Start chatting now and take a step towards a healthier mind.
      </p>
    </div>
  </div>
    </div>
  );
}
