import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { callGeminiAPI } from '@/lib/openai';
import { FormattedMessage } from './FormattedMessage';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface QuizContextQuestion {
  questionNumber: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizContext {
  totalQuestions: number;
  score: number | null;
  questions: QuizContextQuestion[];
  title?: string;
  difficulty?: string;
  topic?: string;
}

interface MasterChatProps {
  quizTopic?: string;
  quizContext?: QuizContext;
}

const MasterChat = ({ quizTopic, quizContext }: MasterChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      let initialMessage: Message;
      
      if (quizContext && quizContext.score !== null) {
        const score = quizContext.score;
        const total = quizContext.totalQuestions;
        const percentage = Math.round((score / total) * 100);
        const title = quizContext.title || 'this assessment';
        const difficulty = quizContext.difficulty ? ` (${quizContext.difficulty} difficulty)` : '';
        
        let incorrectAnswersMessage = '';
        if (score < total) {
          const wrongAnswers = quizContext.questions.filter(q => !q.isCorrect);
          if (wrongAnswers.length > 0) {
            incorrectAnswersMessage = `\n\nHere's some feedback on your incorrect answers:\n\n`;
            wrongAnswers.forEach(q => {
              incorrectAnswersMessage += `Question ${q.questionNumber}: "${q.question}"\n`;
              incorrectAnswersMessage += `Your answer: "${q.userAnswer}"\n`;
              incorrectAnswersMessage += `Correct answer: "${q.correctAnswer}"\n`;
              if (q.explanation) {
                incorrectAnswersMessage += `Explanation: ${q.explanation}\n\n`;
              }
            });
          }
        }
        
        initialMessage = {
          id: '1',
          text: `Hi there! I'm your Master Teacher. I see you've completed "${title}"${difficulty} with a score of ${score}/${total} (${percentage}%).${incorrectAnswersMessage}\nAsk me any questions about the concepts, why an answer was wrong, or anything you'd like to learn deeper!`,
          sender: 'ai'
        };
      } else {
        initialMessage = {
          id: '1',
          text: quizTopic 
            ? `Hi there! I'm your Master Teacher. Ask me any questions about "${quizTopic}" or your recent assessment.` 
            : "Hi there! I'm your Master Teacher. How can I help you understand the topic better?",
          sender: 'ai'
        };
      }
      
      setMessages([initialMessage]);
    }
  }, [quizTopic, quizContext, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userPromptText = newMessage.trim();
    if (!userPromptText || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userPromptText,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Build full prompt context for Gemini
      let promptContext = `You are "Master Teacher", an expert, empathetic, and encouraging AI tutor.
Answer the user's question accurately, clearly, and concisely. Use bolding and bullet points where helpful.`;

      if (quizTopic) {
        promptContext += `\n\nTopic: ${quizTopic}`;
      }

      if (quizContext) {
        promptContext += `\n\n[Assessment Context]`;
        if (quizContext.title) promptContext += `\nTitle: ${quizContext.title}`;
        if (quizContext.score !== null) promptContext += `\nScore: ${quizContext.score}/${quizContext.totalQuestions}`;
        if (quizContext.questions && quizContext.questions.length > 0) {
          promptContext += `\nQuestions Summary:`;
          quizContext.questions.forEach(q => {
            promptContext += `\nQ${q.questionNumber}: ${q.question} | User Answer: ${q.userAnswer} | Correct Answer: ${q.correctAnswer} | Result: ${q.isCorrect ? 'Correct' : 'Incorrect'}`;
            if (q.explanation) promptContext += ` | Explanation: ${q.explanation}`;
          });
        }
      }

      // Add recent chat history for context
      const recentHistory = messages.slice(-6).map(m => `${m.sender === 'user' ? 'Student' : 'Teacher'}: ${m.text}`).join('\n');
      if (recentHistory) {
        promptContext += `\n\n[Recent Chat History]\n${recentHistory}`;
      }

      promptContext += `\n\n[Student Question]\n${userPromptText}`;

      const aiText = await callGeminiAPI(promptContext);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText || "I'm sorry, I couldn't process that question right now. Please try asking again.",
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response in MasterChat:', error);
      toast.error('Failed to get response from AI. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an error while answering. Please try asking again!",
          sender: 'ai'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight">Master Teacher</h3>
          <p className="text-xs text-gray-600">
            {quizContext?.title ? `Ask about "${quizContext.title}"` : "Ask questions about your assessment"}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl p-4 shadow-sm",
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
              )}
            >
              {message.sender === 'user' ? (
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              ) : (
                <FormattedMessage content={message.text} className="text-sm text-gray-800" />
              )}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none p-3 border border-gray-200 flex items-center gap-2">
              <Loader2 className="animate-spin text-primary" size={16} />
              <span className="text-xs text-gray-500 font-medium">Master Teacher is thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 bg-gray-50/50">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question about the topic..."
          className="flex-1 bg-white"
          disabled={isTyping}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!newMessage.trim() || isTyping} 
          className="bg-primary hover:bg-primary/90 text-white shadow"
        >
          {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
};

export default MasterChat;
