'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './components/theme-toggle';
import { X, Send } from 'lucide-react';

export default function Chat() {
  const [input, setInput] = useState('');
  const [bubbles, setBubbles] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);
  const { messages, sendMessage, status } = useChat();
  
  const isComposing = status === 'submitted' || status === 'streaming';

  const handleQuickButton = (text: string) => {
    sendMessage({ text });
  };

  const triggerBubbles = () => {
    const now = Date.now();
    const newBubbles = Array.from({ length: 14 }).map((_, i) => ({
      id: now + i,
      left: Math.random() * 80 + 10, // percentage across the screen
      size: Math.random() * 14 + 8, // px
      delay: Math.random() * 0.6, // s
      duration: Math.random() * 1.2 + 1.3, // s
    }));
    setBubbles(prev => [...prev, ...newBubbles]);
    // Cleanup after max duration
    const maxLifespan = (Math.max(...newBubbles.map(b => b.duration + b.delay)) + 0.2) * 1000;
    window.setTimeout(() => {
      setBubbles(prev => prev.filter(b => !newBubbles.find(nb => nb.id === b.id)));
    }, maxLifespan);
  };

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Ken Burns image layer */}
        <div
          className="absolute inset-0 will-change-transform kb-anim"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformOrigin: 'center',
          }}
        />
        {/* Soft animated gradient overlay */}
        <div className="absolute inset-0 pointer-events-none mix-blend-multiply">
          <div className="absolute inset-0 pulse-slow" style={{
            background:
              'radial-gradient(1200px 600px at 10% 10%, rgba(34,197,94,0.18), transparent 60%), radial-gradient(1000px 600px at 90% 20%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(1000px 600px at 30% 90%, rgba(234,179,8,0.14), transparent 60%)',
          }} />
        </div>
        {/* Floating dust particles */}
        <div
          className="absolute inset-0 pointer-events-none particles-anim opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.6) 50%, transparent 51%), radial-gradient(2px 2px at 40% 60%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(2px 2px at 70% 20%, rgba(255,255,255,0.5) 50%, transparent 51%), radial-gradient(2px 2px at 80% 80%, rgba(255,255,255,0.6) 50%, transparent 51%), radial-gradient(2px 2px at 15% 80%, rgba(255,255,255,0.45) 50%, transparent 51%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'auto',
          }}
        />
        {/* Vignette for readability */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background:
            'radial-gradient(1000px 600px at 50% 20%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)',
        }} />
      </div>

      <ThemeToggle />

      {/* Floating Bubbles Button - always visible top-right */}
      <button
        onClick={triggerBubbles}
        className="fixed top-4 right-4 z-20 h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transition-colors"
        aria-label="Celebrate"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Bubbles layer */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {bubbles.map(b => (
          <span
            key={b.id}
            className="bubble"
            style={{
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            WhatsApp Uncles
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-bold animate-bounce">
            Imagination beyond AI
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
                  onClick={() => handleQuickButton("Latest News in India")}
                  className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm"
                >
                  Latest News in India
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
                    {message.role === 'user' ? 'You' : 'Whatsapp Uncle'}
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
          
          {isComposing && (
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
          className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 py-4 px-4"
        >
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              value={input}
              placeholder="Type your message..."
              onChange={e => setInput(e.currentTarget.value)}
              disabled={isComposing}
            />
            <button
              type="submit"
              disabled={isComposing || !input.trim()}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="px-6 py-3 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-full transition-colors flex items-center"
                disabled={isComposing}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Local styles for animations */}
      <style jsx global>{`
        @keyframes kbZoomPan {
          0% { transform: scale(1) translate3d(0px, 0px, 0); }
          50% { transform: scale(1.06) translate3d(-8px, -6px, 0); }
          100% { transform: scale(1.12) translate3d(8px, 6px, 0); }
        }
        .kb-anim {
          animation: kbZoomPan 28s ease-in-out infinite alternate;
        }
        @keyframes particlesDrift {
          0% { background-position: 0px 0px, 40px 60px, 70px 20px, 80px 80px, 15px 80px; }
          100% { background-position: 20px 30px, 60px 90px, 90px 50px, 100px 110px, 35px 110px; }
        }
        .particles-anim { animation: particlesDrift 20s linear infinite; }
        @keyframes pulseSoft { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
        .pulse-slow { animation: pulseSoft 8s ease-in-out infinite; }

        /* Bubbles */
        @keyframes bubbleUp {
          0% { transform: translate3d(0, 16px, 0) scale(0.9); opacity: 0; }
          10% { opacity: 0.8; }
          60% { transform: translate3d(-6px, -40vh, 0) scale(1); }
          100% { transform: translate3d(6px, -70vh, 0) scale(1.05); opacity: 0; }
        }
        .bubble {
          position: absolute;
          bottom: 16px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.35));
          border-radius: 9999px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          animation-name: bubbleUp;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}