import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse, isLoading }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage || isLoading) return;

    inputRef.current.value = "";

    const updatedHistory = [...chatHistory, { role: "user", text: userMessage }];

    const historyWithThinking = [...updatedHistory, { role: "model", text: "Thinking..." }];
    setChatHistory(historyWithThinking);

    generateBotResponse(updatedHistory);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        disabled={isLoading}
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="material-symbols-rounded"
      >
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;