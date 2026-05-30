
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { getApiKey } from '../services/security';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcription, setTranscription] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Manual decode function following guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual encode function following guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Manual audio buffer decoding from raw PCM
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    setIsConnecting(true);
    // Fix: Move nextStartTime inside startSession scope so it persists for the duration of the session closure
    let nextStartTime = 0;
    
    try {
      // Create fresh instance right before call
      const ai = new GoogleGenAI({ apiKey: getApiKey() });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              // Use manual encode to send audio chunks to the model
              const base64 = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsConnecting(false);
            setIsActive(true);
          },
          onmessage: async (msg) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outputNodeRef.current!);
              
              // End time tracking for seamless playback
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              
              source.start(nextStartTime);
              nextStartTime += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (msg.serverContent?.outputTranscription) {
               setTranscription(prev => prev + msg.serverContent!.outputTranscription!.text);
            }
            if (msg.serverContent?.turnComplete) {
              setTranscription('');
            }
            if (msg.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch (e) {}
              }
              sourcesRef.current.clear();
              nextStartTime = 0;
            }
          },
          onerror: () => stopSession(),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          systemInstruction: "You are the Visionary AI Director. Help the user create cinematic masterpieces. Be concise, creative, and professional."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    setIsActive(false);
    setIsConnecting(false);
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
  };

  return (
    <div className="fixed bottom-10 right-10 z-[200]">
      <div className={`relative flex items-center gap-4 transition-all ${isActive ? 'translate-x-0' : 'translate-x-4'}`}>
        {isActive && (
          <div className="glass px-6 py-4 rounded-3xl border-blue-500/20 max-w-xs animate-in slide-in-from-right-10">
             <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
               Live Director Feedback
             </div>
             <p className="text-[11px] text-white leading-relaxed italic">
               {transcription || "Listening for your creative query..."}
             </p>
          </div>
        )}
        
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group relative ${
            isActive ? 'bg-red-500 shadow-red-500/20' : 'bg-blue-600 shadow-blue-500/20'
          }`}
        >
          {isConnecting ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isActive ? (
            <span className="text-2xl">⏹️</span>
          ) : (
            <div className="relative">
              <span className="text-3xl group-hover:animate-pulse">🎙️</span>
              <div className="absolute -inset-4 border border-blue-400/30 rounded-full animate-[ping_3s_infinite]" />
            </div>
          )}
          
          <div className="absolute -top-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
            {isActive ? 'Terminate Link' : 'Initialize Live Director'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default LiveAssistant;
