import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, RotateCcw, Sparkles, MessageSquare, Terminal, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content:
        'Greetings! I am Dudu Boi, the official AI assistant for POG. Ask me anything regarding 3D weapon modeling, Roblox Studio optimizations, TRIGGER FPS, or commission inquiries.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { projects, currentProjects, upcomingProjects, services, skills, settings } = usePortfolio();

  const quickPrompts = [
    'What does POG build?',
    'Tell me about TRIGGER',
    'What software is used?',
    'How can I contact POG?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setHasError(false);

    try {
      // Package live dynamic portfolio context to send to server Gemini endpoint
      const portfolioContext = {
        artist: settings.site_name || 'POG',
        tagline: settings.hero_tagline,
        bio: settings.about_description,
        skills: skills.map((s) => ({ name: s.name, category: s.category })),
        services: services.map((s) => ({ title: s.title, description: s.description })),
        featuredWorks: projects.map((p) => ({ title: p.title, category: p.category, polyCount: p.poly_count, tools: p.tools })),
        activeProjects: currentProjects.map((c) => ({ title: c.title, status: c.status, progress: `${c.progress}%`, description: c.description })),
        upcomingProjects: upcomingProjects.map((u) => ({ title: u.title, status: u.status, estimated: u.estimated_date })),
        contact: {
          discord: settings.discord || 'pogger67_',
          roblox: settings.roblox || 'opmasteraarav1',
          robloxUrl: settings.roblox_profile_url,
        },
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          portfolioContext,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.reply) {
        throw new Error(data.error || 'Server error');
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        content: data.reply || 'POG creates clean, game-ready 3D assets in Blender for Roblox.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setHasError(true);
      const errorMsg: ChatMessage = {
        id: 'bot-err-' + Date.now(),
        sender: 'assistant',
        content: 'I encountered an error connecting to the neural server. You can contact POG directly on Discord (pogger67_) or Roblox (opmasteraarav1).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        sender: 'assistant',
        content: 'Chat cleared. How can I assist you with POG\'s 3D assets and Roblox development today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="relative group p-4 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-cyan-500/40 border border-cyan-300/40 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center"
              aria-label="Open Dudu Boi AI Assistant"
            >
              {/* Glowing Pulse Ring */}
              <span className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-sm animate-pulse group-hover:bg-cyan-400/50" />
              <Bot className="relative w-6 h-6 text-white" />
              
              {/* Tooltip on hover */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                Chat with Dudu Boi (AI)
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl shadow-black/90 flex flex-col overflow-hidden bg-[#0a0d14]/95 backdrop-blur-2xl"
          >
            {/* Top Header */}
            <div className="p-4 border-b border-white/10 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 border border-cyan-400/40 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Bot className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-sm text-white tracking-wide">Dudu Boi</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Gemini AI
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">POG Portfolio Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm font-body">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none border border-cyan-400/30 font-medium'
                        : 'glass-panel text-slate-200 rounded-bl-none border border-white/10'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl glass-panel border border-white/10 max-w-[70%]">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs font-mono text-slate-400 ml-1">Analyzing portfolio...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-950/40 overflow-x-auto flex gap-1.5 scrollbar-none">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-white/10 bg-slate-900/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Dudu Boi about POG's work..."
                className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs font-body focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-cyan-500/20 border border-cyan-400/30 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
