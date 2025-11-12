'use client';

import { useState, useEffect, useRef } from 'react';
import { sendChatMessage, ChatMessage } from '@/api/fish';

interface AIChatAssistantProps {
  onClose: () => void;
  onAction?: (action: string, data: any) => void;
}

export default function AIChatAssistant({ onClose, onAction }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: '🐠 Hi! I\'m your marine biology assistant. Ask me about any fish species, where to find them, or say "log a sighting" to add a new catch!',
      },
    ]);
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add 3 second delay to simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await sendChatMessage(input, messages);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Handle actions
      if (response.action && onAction) {
        onAction(response.action, response.actionData);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-navy border-2 border-sonar-green shadow-[0_0_30px_rgba(20,255,236,0.3)] max-w-2xl w-full h-[600px] flex flex-col font-mono">
        {/* Header */}
        <div className="bg-[color-mix(in_srgb,var(--color-sonar-green)_10%,transparent)] border-b border-sonar-green p-4 flex justify-between items-center">
          <div>
            <h2 className="text-sonar-green text-lg font-bold">🤖 AI MARINE ASSISTANT</h2>
            <p className="text-text-secondary text-xs">Powered by OpenRouter AI</p>
          </div>
          <button
            onClick={onClose}
            className="text-sonar-green hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded ${
                  msg.role === 'user'
                    ? 'bg-sonar-green text-dark-navy'
                    : 'bg-nautical-blue border border-panel-border text-text-primary'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-nautical-blue border border-panel-border p-3 rounded">
                <p className="text-sonar-green text-sm animate-pulse">Thinking...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-panel-border p-4">
          <div className="flex gap-2">
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`px-4 py-2 border ${
                isListening
                  ? 'bg-red-500 border-red-500 text-white animate-pulse'
                  : 'border-sonar-green text-sonar-green hover:bg-sonar-green hover:text-dark-navy'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? '🔴 LISTENING...' : '🎤'}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about fish or say 'log a sighting'..."
              className="flex-1 bg-nautical-blue border border-panel-border text-text-primary px-4 py-2 focus:outline-none focus:border-sonar-green"
              disabled={isLoading}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 py-2 bg-sonar-green text-dark-navy font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SEND
            </button>
          </div>

          <div className="mt-2 text-xs text-text-secondary">
            💡 Try: &quot;Tell me about clownfish&quot; • &quot;Where can I find manta rays?&quot; • &quot;Log a sighting&quot;
          </div>
        </div>
      </div>
    </div>
  );
}
