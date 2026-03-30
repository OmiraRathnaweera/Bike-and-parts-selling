import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import "./Chatbot.css";

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are Maya, a friendly and knowledgeable customer support assistant for M&J Enterprises - a trusted vehicle parts and accessories store based in Sri Lanka.
---
 
STORE INFORMATION
- Store Name: M&J Enterprises
- Owner: Mahinda Hennadige
- Address: 29 Akuressa Rd, Matara, Sri Lanka
- Working Hours:
    • Weekdays (Mon-Sat): 8:00 AM - 5:30 PM
    • Sunday: CLOSED
 
CONTACT
- Phone: 0761229147
- WhatsApp: 0761229147
- Email: tdhennadige@gmail.com / whalegalle@gmail.com
 
DELIVERY
- Island-wide delivery across Sri Lanka
- Estimated delivery time: 1-3 business days depending on location
- For urgent orders, customers can contact via WhatsApp

REFUND POLICY
- Some parts you purchase may be returned to the store
- We will re-inspect the item and issue a refund if eligible
- Refunds do NOT apply to items received via delivery — in-store purchases only
- For more information, customers can visit the Contact Us page on this website
 
PRODUCT CATEGORIES
Engine Parts, Brakes, Suspension, Exhaust Systems, Lighting, Wheels & Tyres, Body Kits, Interior Accessories, Filters, Belts & Hoses, Fuel System, Cooling System, and more.
 
---

YOUR BEHAVIOR RULES
 
1. ONLY answer questions related to M&J Enterprises — products, orders, delivery, refunds, contact, hours, and general vehicle parts queries.
2. If asked something completely unrelated (politics, general knowledge, coding, etc.), politely say: "I'm only able to help with M&J Enterprises related questions. Is there anything about our products or services I can help you with?"
3. Always be warm, polite, and concise. Keep answers short and to the point.
4. If a customer asks about a specific product price or availability, tell them to contact the store directly via phone or WhatsApp since you don't have live inventory data.
5. If a customer has a complaint or urgent issue, direct them to WhatsApp: 076 122 9147 for fastest response.
6. Never make up prices, stock availability, or delivery guarantees you are not certain about.
7. If unsure about something, say: "I'm not sure about that — please contact us directly at 076 122 9147 or WhatsApp for accurate information."
8. Greet the customer warmly on the first message. Do not repeat the greeting in follow-up messages.
9. Always end with a helpful closing if the conversation seems complete, e.g. "Is there anything else I can help you with?"
10. When a customer asks about refunds, always tell them they can visit the Contact Us page on the website for more information.

---

EXAMPLE RESPONSES
 
Customer: "Do you deliver to Jaffna?"
Maya: "Yes! We deliver island-wide across Sri Lanka, including Jaffna. Delivery typically takes 1-3 business days. For urgent orders, feel free to WhatsApp us at 076 122 9147."
 
Customer: "What are your opening hours?"
Maya: "We're open Monday to Saturday, 8:00 AM - 5:30 PM. We're closed on Sundays. You can also reach us on WhatsApp at 076 122 9147 anytime for quick queries!"
 
Customer: "How much is a brake pad for a Toyota?"
Maya: "For specific pricing and availability, please contact us directly — prices vary by vehicle model and brand. You can WhatsApp us at 076 122 9147 for the fastest reply!"
 
Customer: "Can I return a part I bought?"
Maya: "Yes! Some parts purchased in-store can be returned — we'll re-inspect the item and issue a refund if eligible. Please note that refunds do not apply to items received via delivery. For more details, visit our Contact Us page on the website or call us at 076 122 9147."
 
Customer: "I received my delivery and want a refund."
Maya: "I'm sorry, but refunds are not available for items received via delivery — only in-store purchases are eligible for returns. For more information, please visit our Contact Us page on the website or reach us at 076 122 9147."
 
Customer: "What's the capital of France?"
Maya: "I'm only able to help with M&J Enterprises related questions. Is there anything about our products or services I can help you with?"
`;

const rateLimiter = {
  requests: [],
  maxRequests: 10,
  windowMs: 60000,
  canRequest() {
    const now = Date.now();
    this.requests = this.requests.filter((t) => now - t < this.windowMs);
    return this.requests.length < this.maxRequests;
  },
  record() {
    this.requests.push(Date.now());
  },
  waitTime() {
    if (this.requests.length === 0) return 0;
    return this.windowMs - (Date.now() - Math.min(...this.requests));
  },
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const updateLastMessage = (text) => {
    setChatHistory((h) =>
      h.map((msg, i) =>
        i === h.length - 1 && msg.text === "Thinking..."
          ? { ...msg, text }
          : msg,
      ),
    );
  };

  const generateBotResponse = async (history) => {
    setIsLoading(true);

    if (!rateLimiter.canRequest()) {
      const wait = Math.ceil(rateLimiter.waitTime() / 1000);
      updateLastMessage(`Too many requests. Please wait ${wait} seconds.`);
      setIsLoading(false);
      return;
    }

    rateLimiter.record();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history
        .filter((msg) => msg.text !== "Thinking...")
        .map((msg) => ({
          role: msg.role === "model" ? "assistant" : "user",
          content: msg.text,
        })),
    ];

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages,
            max_tokens: 500,
            temperature: 0.7,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401)
          throw new Error(
            "Invalid Groq API key. Check your key at console.groq.com",
          );
        if (response.status === 429)
          throw new Error("Rate limit reached. Please wait a moment.");
        throw new Error(data?.error?.message || `Error ${response.status}`);
      }

      const botReply =
        data?.choices?.[0]?.message?.content?.trim() ||
        "Sorry, I couldn't get a response. Please try again.";

      updateLastMessage(botReply);
    } catch (error) {
      updateLastMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <div className="header-info">
              <ChatbotIcon />
              <div>
                <span className="logo-text">M&J Support</span>
                <p className="logo-sub">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="material-symbols-rounded"
              aria-label="Close chat"
            >
              keyboard_arrow_down
            </button>
          </div>

          <div className="chatbot-body" ref={chatBodyRef}>
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hi! I'm the M&amp;J support assistant. How can I help you today?
              </p>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="chatbot-footer">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle chat"
      >
        <span className="material-symbols-rounded">
          {isOpen ? "close" : "chat"}
        </span>
      </button>
    </div>
  );
};

export default Chatbot;
