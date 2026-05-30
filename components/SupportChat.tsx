
import React, { useState, useRef, useEffect } from 'react';
import { createSupportChat } from '../services/geminiService';

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<'he' | 'en'>('he');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'ברוך הבא, Architect. אני ה-Visionary Oracle. אני מכיר כל פינה בסטודיו הזה ויודע לענות על כל שאלה כללית. איך אוכל לעזור היום?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Re-init chat if language changes
  useEffect(() => {
    chatSessionRef.current = null;
    const welcome = language === 'he' 
      ? 'ברוך הבא, Architect. אני ה-Visionary Oracle. איך אוכל לעזור?' 
      : 'Welcome, Architect. I am the Visionary Oracle. How can I assist you?';
    setMessages([{ role: 'model', text: welcome }]);
  }, [language]);

  const initChat = () => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createSupportChat(language);
    }
    return chatSessionRef.current;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const chat = initChat();
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const streamResponse = await chat.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      for await (const chunk of streamResponse) {
        const chunkText = chunk.text || "";
        fullText += chunkText;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
          return newMessages;
        });
        scrollToBottom();
      }
    } catch (err: any) {
      console.error("Chat Error:", err);
      if (err.message?.includes("API_KEY") || err.message?.includes("entity was not found")) {
        const errTxt = language === 'he' ? "חיבור ניורוני נכשל. נראה שחסר מפתח API." : "Neural link failed. API key missing.";
        setMessages(prev => [...prev, { role: 'model', text: errTxt }]);
        if ((window as any).aistudio?.openSelectKey) {
          await (window as any).aistudio.openSelectKey();
        }
      } else {
        const genericErr = language === 'he' ? "חוויתי הפרעה בתדר." : "I experienced a frequency interruption.";
        setMessages(prev => [...prev, { role: 'model', text: genericErr }]);
      }
      chatSessionRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const welcome = language === 'he' ? 'הזיכרון אופס. אני מוכן להנחיות חדשות.' : 'Memory purged. Awaiting new directives.';
    setMessages([{ role: 'model', text: welcome }]);
    chatSessionRef.current = null;
  };

  return (
    <div className="fixed bottom-10 left-10 z-[201]">
      {isOpen ? (
        <div className="w-[400px] h-[550px] glass rounded-[32px] border-white/10 shadow-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Support Oracle</h4>
                <div className="flex items-center gap-2">
                   <button onClick={() => setLanguage('he')} className={`text-[8px] font-black px-1.5 py-0.5 rounded ${language === 'he' ? 'bg-blue-500 text-white' : 'text-zinc-500'}`}>HE</button>
                   <button onClick={() => setLanguage('en')} className={`text-[8px] font-black px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-blue-500 text-white' : 'text-zinc-500'}`}>EN</button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Purge Memory">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`text-[8px] font-black uppercase tracking-[0.2em] mb-2 ${msg.role === 'user' ? 'text-blue-500 mr-2' : 'text-zinc-600 ml-2'}`}>
                  {msg.role === 'user' ? 'Architect' : 'Oracle'}
                </div>
                <div className={`max-w-[90%] p-5 rounded-3xl text-[12px] leading-relaxed font-medium ${
                  msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-xl' 
                  : 'bg-zinc-900/80 text-zinc-300 border border-white/5 rounded-tl-none backdrop-blur-sm'
                }`}>
                  {msg.text || (loading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-md">
            <form onSubmit={handleSend} className="relative flex gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'he' ? "שאל את המערכת..." : "Ask the Oracle..."}
                className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-[11px] text-white outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-zinc-700 font-medium"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 bg-zinc-900 glass border border-white/10 rounded-[24px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <span className="text-3xl group-hover:rotate-12 transition-transform relative z-10">💬</span>
          <div className="absolute left-full ml-6 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.2em] pointer-events-none">
            System Oracle
          </div>
        </button>
      )}
    </div>
  );
};

export default SupportChat;
