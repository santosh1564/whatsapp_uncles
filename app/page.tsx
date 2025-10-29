'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { ThemeToggle } from './components/theme-toggle';
import { X, Send } from 'lucide-react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isLoading } = useChat();

  const handleQuickButton = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 transition-colors">
      <ThemeToggle />
      
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            WhatsApp Chat Bot
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Chat with AI powered by Gemini
          </p>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 space-y-4 mb-24">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400 mb-6">
                Start a conversation or try one of these:
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleQuickButton("What is artificial intelligence?")}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
                >
                  What is AI?
                </button>
                <button
                  onClick={() => handleQuickButton("Explain quantum computing in simple terms")}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
                >
                  Explain Quantum Computing
                </button>
                <button
                  onClick={() => handleQuickButton("Tell me a joke")}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
                >
                  Tell me a joke
                </button>
              </div>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="font-semibold text-sm mb-1">
                    {message.role === 'user' ? 'You' : 'Gemini'}
                  </div>
                </div>
                <div className="whitespace-pre-wrap break-words">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return <div key={`${message.id}-${i}`}>{part.text}</div>;
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 max-w-[80%]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput('');
            }
          }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-4 px-4"
        >
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              value={input}
              placeholder="Type your message..."
              onChange={e => setInput(e.currentTarget.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-full transition-colors flex items-center"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}