import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { Send, Camera, BrainCircuit, Loader2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore, MachineType } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { soundManager } from '@/lib/audio';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'image';
  data?: string; // base64 or url
};

export function AIAssistant() {
  const { selectedMachine, setSelectedMachine, addAlert } = useStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'cctv'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: `SynapseX AI Assistant online. How can I help you analyze the ${selectedMachine} system today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // CCTV State
  const [cctvImage, setCctvImage] = useState<string | null>(null);
  const [cctvPrompt, setCctvPrompt] = useState('Analyze this CCTV frame for safety hazards or anomalies.');
  const [cctvAnalysis, setCctvAnalysis] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(prev => [...prev, { role: 'model', content: `Context switched to ${selectedMachine}. I am now monitoring the ${selectedMachine} telemetry.` }]);
  }, [selectedMachine]);

  const handleMachineSelect = (machine: MachineType) => {
    soundManager.play('click');
    setSelectedMachine(machine);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are an expert industrial AI assistant for SynapseX. The user is currently monitoring the ${selectedMachine} machine. Analyze machine logs, suggest maintenance, and provide precise technical answers.`,
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });

      setMessages(prev => [...prev, { role: 'model', content: response.text || 'No response generated.' }]);
    } catch (error: any) {
      addAlert({ message: `AI Error: ${error.message}`, level: 'danger' as any });
      setMessages(prev => [...prev, { role: 'model', content: 'Error connecting to AI core.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCctvImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeCCTV = async () => {
    if (!cctvImage) return;
    setIsLoading(true);
    setCctvAnalysis('');

    try {
      const base64Data = cctvImage.split(',')[1];
      const mimeType = cctvImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          `Context: The user is currently monitoring the ${selectedMachine} machine. ${cctvPrompt}`,
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        ]
      });

      setCctvAnalysis(response.text || 'No analysis generated.');
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      addAlert({ message: `Vision Error: ${error.message}`, level: 'danger' as any });
      setCctvAnalysis('Error analyzing image.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-text-secondary mt-1">Advanced diagnostics and CCTV vision analysis</p>
        </div>
        <div className="flex bg-bg-secondary p-1 rounded-lg border border-border">
          {(['drilling', 'milling', 'turning'] as MachineType[]).map((m) => (
            <button
              key={m}
              onClick={() => handleMachineSelect(m)}
              onMouseEnter={() => soundManager.play('hover')}
              className={cn(
                "px-4 py-1.5 text-sm font-medium capitalize rounded-md transition-colors",
                selectedMachine === m 
                  ? "bg-surface text-accent-primary shadow-sm" 
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <div className="flex gap-4 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all", activeTab === 'chat' ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20" : "text-text-secondary hover:text-text-primary border border-transparent")}
        >
          <BrainCircuit className="w-4 h-4" /> Diagnostics (High Thinking)
        </button>
        <button
          onClick={() => setActiveTab('cctv')}
          className={cn("flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all", activeTab === 'cctv' ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20" : "text-text-secondary hover:text-text-primary border border-transparent")}
        >
          <Camera className="w-4 h-4" /> CCTV Analysis
        </button>
      </div>

      {activeTab === 'chat' && (
        <Card className="flex-1 flex flex-col overflow-hidden p-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex flex-col max-w-[80%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                <div className={cn("px-4 py-3 rounded-lg", msg.role === 'user' ? "bg-accent-primary text-white" : "bg-bg-secondary border border-border text-text-primary")}>
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-mono">Processing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-bg-secondary border-t border-border">
            <form onSubmit={handleChatSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about machine diagnostics..."
                className="flex-1 bg-surface border border-border rounded-md px-4 py-2 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </Card>
      )}

      {activeTab === 'cctv' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-accent-primary" />
              CCTV Feed Input
            </h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div 
                className="flex-1 min-h-[200px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-bg-secondary relative overflow-hidden group hover:border-accent-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {cctvImage ? (
                  <img src={cctvImage} alt="CCTV Feed" className="absolute inset-0 w-full h-full object-contain" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-text-secondary mb-2 group-hover:text-accent-primary transition-colors" />
                    <span className="text-text-secondary font-medium">Click to upload CCTV frame</span>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Analysis Prompt</label>
                <input
                  type="text"
                  value={cctvPrompt}
                  onChange={(e) => setCctvPrompt(e.target.value)}
                  className="w-full bg-bg-secondary border border-border rounded-md px-4 py-2 text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                />
              </div>

              <Button 
                onClick={handleAnalyzeCCTV} 
                disabled={isLoading || !cctvImage}
                className="w-full"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing Vision Data...</>
                ) : (
                  <><BrainCircuit className="w-4 h-4 mr-2" /> Analyze Frame</>
                )}
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col">
            <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
            <div className="flex-1 bg-bg-secondary border border-border rounded-lg p-4 overflow-y-auto">
              {cctvAnalysis ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                  {cctvAnalysis}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-text-secondary text-sm font-mono">
                  AWAITING IMAGE DATA...
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
