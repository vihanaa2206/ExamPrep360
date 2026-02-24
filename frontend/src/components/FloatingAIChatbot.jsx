import { useState } from "react";
import { X } from "lucide-react";

const FloatingAIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi 👋 I’m your AI Mentor. Ask me about exams, careers, preparation or courses.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };

    // RAM based response (temporary logic)
    const aiMsg = {
      from: "ai",
      text:
        "That’s a great question 👍 You can explore exams by category, check eligibility, syllabus, PYQs, and coaching comparisons on ExamPrep360.",
    };

    setMessages([...messages, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating Avatar */}
      <div
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition z-50"
      >
        <span className="text-white text-xl">🤖</span>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border z-50 flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-blue-600 text-white rounded-t-xl">
            <span className="font-semibold text-sm">AI Mentor</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  msg.from === "ai"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-600 text-white ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAIChatbot;
