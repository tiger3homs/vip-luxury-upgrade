import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// 1. Define the Tool
const saveLeadTool: FunctionDeclaration = {
  name: 'save_lead',
  description: 'Saves a customer callback request or inquiry. Use this when the user expresses interest in a car, wants a test drive, or asks to be contacted.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      fullName: {
        type: Type.STRING,
        description: 'The full name of the customer.'
      },
      contactInfo: {
        type: Type.STRING,
        description: 'Phone number or email address of the customer.'
      },
      interest: {
        type: Type.STRING,
        description: 'What vehicle or service they are interested in (e.g. "Aston Martin DBX", "Selling my car", "General").'
      }
    },
    required: ['fullName', 'contactInfo']
  }
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome to VIP Luxury Cars. I am your personal concierge. How may I assist you with our exclusive collection today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryContext, setInventoryContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  
  const location = useLocation();

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isOpen, isLoading]);

  // Load Inventory for Context
  useEffect(() => {
    const initInventory = async () => {
      const { data: cars } = await supabase
        .from('cars_for_sale')
        .select('brand, model, year, price, currency, slug, status')
        .eq('status', 'available');

      if (cars) {
        const text = cars.map(c => 
          `- ${c.year} ${c.brand} ${c.model}: ${c.currency} ${c.price.toLocaleString()} (Ref: ${c.slug})`
        ).join('\n');
        setInventoryContext(text);
      }
    };
    initInventory();
  }, []);

  // Initialize Chat Session
  const getChatSession = () => {
    if (chatSessionRef.current) return chatSessionRef.current;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `
      You are the Concierge for VIP Luxury Cars (Killwangen, Switzerland).
      Address: Bahnhofstrasse 29, 8956 Killwangen.
      Contact: +41 79 800 00 67, Info@vipluxurycars.ch.

      Your goal is to assist high-net-worth clients.
      - Be polite, concise, and professional.
      - If they want to buy/sell or schedule a viewing, ask for their Name and Contact Info to "save their request".
      - You have access to the 'save_lead' tool. Call it when you have the user's name and contact info.
      
      Current Inventory:
      ${inventoryContext || 'Loading inventory...'}
    `;

    chatSessionRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: [saveLeadTool] }],
      },
    });

    return chatSessionRef.current;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const chat = getChatSession();
      
      // Inject current location context into the message without showing it to the user
      const contextAwareMessage = `[User is currently viewing: ${location.pathname}] ${userText}`;
      
      let response = await chat.sendMessage({ message: contextAwareMessage });

      // Handle Function Calls
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        // We have a tool call
        const call = functionCalls[0];
        if (call.name === 'save_lead') {
          // Execute the tool
          const args = call.args as any;
          
          // Save to Supabase
          const { error } = await supabase.from('car_purchase_requests').insert([{
            owner_firstname: args.fullName, // Mapping to existing schema
            owner_lastname: '(Chat Lead)',
            brand: 'Inquiry',
            model: args.interest || 'General',
            status: 'new',
            expected_price: 0
          }]);

          const toolResult = error 
            ? { result: "Error saving lead. Tell user to email us." }
            : { result: "Success. Lead saved. Tell user an agent will contact them shortly." };

          // Send result back to model
          response = await chat.sendMessage({
            content: {
              role: 'tool',
              parts: [{
                functionResponse: {
                  name: call.name,
                  id: call.id,
                  response: toolResult
                }
              }]
            }
          });
        }
      }

      // Display Model Response
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, connection interrupted. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(232,255,0,0.3)] hover:scale-110 ${isOpen ? 'bg-brand-gray text-white border border-white/20' : 'bg-brand-yellow text-brand-black'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>

      {/* Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-brand-black/95 backdrop-blur-md border border-white/10 flex flex-col shadow-2xl animate-fade-in-up rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div>
              <span className="text-brand-yellow text-xs font-bold uppercase tracking-widest block">Concierge</span>
              <span className="text-white font-display text-lg">VIP Assistant</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-brand-yellow text-brand-black font-medium rounded-tr-none' 
                      : 'bg-white/10 text-white border border-white/5 rounded-tl-none'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-lg rounded-tl-none flex gap-1 items-center h-10">
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-brand-black">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message..."
                className="flex-1 bg-brand-gray border border-white/10 px-4 py-3 text-white text-sm focus:border-brand-yellow focus:outline-none transition-colors rounded"
              />
              <button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()}
                className="bg-white/10 text-white p-3 hover:bg-brand-yellow hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};