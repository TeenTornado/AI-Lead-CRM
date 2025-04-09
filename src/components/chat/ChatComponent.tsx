import React, { useState, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { sendChatMessage } from "../../services/chatService";
import { useChat } from "../../context/ChatContext";

const ChatComponent = () => {
  const { isOpen, setIsOpen } = useChat();
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add this useEffect for initial message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: "Hi! I'm SharpSys Assistant, your AI-Lead-CRM expert. I can help you with lead management, analytics, user management, and all other features of our CRM system. How can I assist you today?",
          isUser: false,
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setMessages((prev) => [...prev, { text: inputMessage, isUser: true }]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputMessage);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-[500px] h-[700px] shadow-2xl rounded-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between bg-primary text-primary-foreground rounded-t-xl p-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Support Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/90 text-primary-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">
                    Welcome to AI Support!
                  </p>
                  <p className="text-sm">How can I help you today?</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                      msg.isUser
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted dark:bg-gray-800 mr-4"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted dark:bg-gray-800 rounded-2xl px-4 py-2 animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t dark:border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 rounded-full px-4 py-2 bg-muted dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="rounded-full px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatComponent;
