import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ShieldCheck
} from 'lucide-react';
import { ActionProposalCard } from './ActionProposalCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useNoor } from '../../context/NoorContext';

export const AskNoorView: React.FC = () => {
  const {
    aiMessages,
    isAiThinking,
    sendMessageToNoor,
    applyActionProposal,
    userProfile,
    shelfProducts
  } = useNoor();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAiThinking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiThinking) return;
    const text = input;
    setInput('');
    await sendMessageToNoor(text);
  };

  const samplePrompts = [
    'What should I use tonight?',
    'My skin feels dry or tight today',
    'Can I simplify my routine to 2-3 steps tonight?',
    'I think my serum is irritating my skin',
    'Are my shelf products compatible with each other?',
    'What should I pack for travel to a dry climate?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10 flex flex-col h-[calc(100vh-140px)] sm:h-[840px] animate-in fade-in duration-150">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.24em] uppercase text-neutral-500 font-mono">
              SKIN COMPANION
            </span>
            <Badge variant="dark" size="xs">
              Memory Active
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl text-black font-bold tracking-tight">
            Ask NOOR
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-normal">
            Continuous memory: calibrated to your {userProfile.skinType.toLowerCase()} skin and {shelfProducts.length} formulas on My Shelf.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-600 bg-white px-3.5 py-1.5 rounded-sm border border-neutral-200 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-black stroke-[1.5]" />
          <span>NON-DIAGNOSTIC GUIDANCE</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="grow overflow-y-auto py-5 space-y-4 pr-1">
        {aiMessages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-100`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-md p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-black text-white'
                    : 'bg-white border border-neutral-200 text-neutral-900 shadow-2xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider">
                    <Sparkles className="w-3 h-3 text-black stroke-[1.5]" />
                    <span>NOOR INTELLIGENCE</span>
                  </div>
                )}

                <div className="whitespace-pre-line space-y-2">
                  {msg.content}
                </div>

                {/* Proposed Action Card if present */}
                {msg.suggestedAction && (
                  <ActionProposalCard
                    action={msg.suggestedAction}
                    onApply={() => applyActionProposal(msg.suggestedAction!)}
                  />
                )}
              </div>

              <span className="text-[10px] text-neutral-400 mt-1 px-1 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          );
        })}

        {isAiThinking && (
          <div className="flex items-start gap-2 animate-in fade-in">
            <div className="p-3.5 rounded-md bg-white border border-neutral-200 text-xs text-neutral-600 flex items-center gap-3">
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>NOOR is analyzing formulation parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Consultation Chips */}
      {aiMessages.length <= 2 && (
        <div className="py-2 shrink-0">
          <span className="text-[10px] uppercase font-bold text-neutral-500 font-mono tracking-wider block mb-1.5">
            SUGGESTED CONSULTATIONS:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessageToNoor(prompt)}
                className="px-3 py-1.5 rounded-sm bg-white hover:bg-neutral-100 border border-neutral-200 hover:border-black text-neutral-800 shrink-0 text-left transition-colors cursor-pointer text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="pt-3 border-t border-neutral-200 shrink-0 flex items-center gap-2"
      >
        <div className="relative grow">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask NOOR anything about your skin, tonight's ritual, or active ingredients..."
            className="w-full bg-white border border-neutral-300 rounded-md pl-4 pr-10 py-3 text-xs sm:text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={!input.trim() || isAiThinking}
          className="shrink-0 px-4 py-3 min-h-[42px]"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 stroke-[1.5]" />
        </Button>
      </form>

      {/* Medical Disclaimer */}
      <div className="pt-2 text-[10px] text-neutral-400 font-mono text-center shrink-0">
        NOOR PROVIDES GENERAL COSMETIC GUIDANCE. FOR PERSISTENT PAIN OR LESIONS, CONSULT A DERMATOLOGIST.
      </div>
    </div>
  );
};
