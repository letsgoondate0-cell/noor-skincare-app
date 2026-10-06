import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  ShieldCheck,
  Minimize2,
  Maximize2,
  CornerDownRight
} from 'lucide-react';
import { Button } from '../common/Button';
import { ActionProposalCard } from './ActionProposalCard';
import { useNoor } from '../../context/NoorContext';

interface QuickAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAiDrawer: React.FC<QuickAiDrawerProps> = ({ isOpen, onClose }) => {
  const {
    aiMessages,
    isAiThinking,
    sendMessageToNoor,
    applyActionProposal,
    userProfile
  } = useNoor();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, aiMessages, isAiThinking]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAiThinking) return;
    const text = input;
    setInput('');
    await sendMessageToNoor(text);
  };

  const quickPrompts = [
    'What should I do right now?',
    'My skin feels dry today',
    'Can I simplify my routine tonight?',
    'Is this product irritating my barrier?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white border-l border-neutral-300 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-black flex items-center justify-center rounded-xs text-white">
              <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                NOOR AI ASSISTANT
              </h3>
              <p className="text-[11px] text-neutral-500 font-normal">
                Continuous memory • {userProfile.skinType} profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-sm text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="grow overflow-y-auto p-4 space-y-4">
          {aiMessages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[88%] rounded-md p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 border border-neutral-200 text-neutral-900'
                  }`}
                >
                  <div className="whitespace-pre-line space-y-2">
                    {msg.content}
                  </div>

                  {msg.suggestedAction && (
                    <ActionProposalCard
                      action={msg.suggestedAction}
                      onApply={() => {
                        applyActionProposal(msg.suggestedAction!);
                        onClose();
                      }}
                    />
                  )}
                </div>

                <span className="text-[10px] text-neutral-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {isAiThinking && (
            <div className="flex items-center gap-2 p-3 bg-neutral-100 border border-neutral-200 rounded-md text-xs text-neutral-600">
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>NOOR is analyzing formulations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt shortcuts */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50 shrink-0 space-y-2">
          <span className="text-[10px] uppercase font-semibold text-neutral-500 tracking-wider block">
            Quick Actions:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => sendMessageToNoor(p)}
                className="text-left p-2 rounded-sm bg-white border border-neutral-200 hover:border-black text-[11px] text-neutral-800 truncate transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-3.5 border-t border-neutral-200 bg-white shrink-0 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask NOOR anything..."
            className="grow bg-neutral-50 border border-neutral-300 rounded-md px-3 py-2 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!input.trim() || isAiThinking}
            className="px-3"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
