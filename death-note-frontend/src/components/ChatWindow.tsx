import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSkull, FaPaperclip, FaArrowRight, FaRegClock } from 'react-icons/fa';
import { Message, Victim, SenderType } from '../types';

interface ChatWindowProps {
    victims: Victim[];
    setVictims: React.Dispatch<React.SetStateAction<Victim[]>>;
  }

const ChatContainer = styled.div`
  margin-left: 80px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  width: calc(100% - 80px);

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div<{ sender: 'system' | 'user' }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: ${props => props.sender === 'system' ? '18px 18px 18px 4px' : '18px 18px 4px 18px'};
  background-color: ${props => props.sender === 'system' ? '#333' : '#d63031'};
  color: white;
  align-self: ${props => props.sender === 'system' ? 'flex-start' : 'flex-end'};
  word-wrap: break-word;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InstructionMessage = styled(MessageBubble)`
  background-color: #444;
  border-left: 3px solid #d63031;
`;

const DeathNoteMessage = styled(MessageBubble)`
  background-color: #111;
  border-left: 3px solid #ff0000;
  max-width: 100%;
  align-self: flex-start;
`;

const InputContainer = styled.div`
  padding: 15px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #333;
  background-color: #1a1a1a;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px;
  background-color: #222;
  border: 1px solid #444;
  color: #fff;
  font-family: 'Courier New', monospace;
  border-radius: 20px;
  outline: none;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: #d63031;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }
`;

const ImageUploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #333;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444;
  }

  input {
    display: none;
  }
`;

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4444;
  font-family: 'Courier New', monospace;
  margin-left: auto;
`;
const ChatWindow: React.FC<ChatWindowProps> = ({ victims, setVictims }) => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: 1,
        text: "Bienvenido a la Death Note. Reglas:\n\n1. Escribe el nombre completo\n2. Sube una foto (opcional)\n3. Tienes 40 segundos para la causa\n4. 6m40s para detalles",
        sender: 'system',
        isInstruction: true
      },
      {
        id: 2,
        text: "Escribe el nombre completo:",
        sender: 'system',
      }
    ]);
    
    const [inputValue, setInputValue] = useState('');
    const [currentStep, setCurrentStep] = useState<'name' | 'image' | 'cause' | 'details'>('name');
    const [victim, setVictim] = useState<Partial<Victim>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);
    
    useEffect(() => {
    if (timeLeft <= 0) {
        if (currentStep !== 'name') {
        handleTimeout();
        }
        return;
    }
    
    const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
    }, [timeLeft, currentStep]);

    const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    };
  
    const handleSubmit = () => {
      if (!inputValue.trim() && currentStep !== 'image') return;
  
      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        sender: 'user'
      };
  
      const newMessages = [...messages, userMessage];
  
      let systemMessage: Message = {
        id: Date.now() + 1,
        text: "",
        sender: 'system'
      };
  
      switch(currentStep) {
        case 'name':
          setVictim(prev => ({ ...prev, name: inputValue }));
          systemMessage.text = "¿Quieres subir una foto? (Opcional - 40s)";
          setCurrentStep('image');
          startTimer(40);
          break;
        case 'image':
          systemMessage.text = "Foto omitida. Registro fallido: Se requiere al menos una imagen";
          setMessages([...newMessages, systemMessage]);
          setVictim({});
          setCurrentStep('name');
          setTimeLeft(0);
          return;
        case 'cause':
          setVictim(prev => ({ ...prev, cause: inputValue }));
          systemMessage.text = "Detalla la muerte (6m40s restantes):";
          setCurrentStep('details');
          startTimer(400);
          break;
        case 'details':
          const finalVictim: Victim = {
            ...victim as Victim,
            id: Date.now(),
            deathTime: new Date().toLocaleString(),
            status: 'executed',
            details: inputValue,
            cause: victim.cause || 'heart attack'
          };
  
          setMessages([...newMessages, 
            { id: Date.now() + 2, text: `¡${finalVictim.name} ha sido eliminado!`, sender: 'system' }
          ]);
          
          setVictims(prev => [...prev, finalVictim]);
          setVictim({});
          setImagePreview(null);
          setCurrentStep('name');
          setTimeLeft(0);
          return;
      }
  
      setMessages([...newMessages, systemMessage]);
      setInputValue('');
    };
  
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setVictim(prev => ({ ...prev, image: imageUrl }));
        
        setMessages(prev => [...prev, 
          { id: Date.now(), text: "Imagen subida ✅", sender: 'user' },
          { id: Date.now() + 1, text: "Especifica la causa de muerte (40s restantes):", sender: 'system' }
        ]);
        
        setCurrentStep('cause');
        startTimer(40);
      };
      reader.readAsDataURL(file);
    };
  
    const handleTimeout = () => {
      if (!victim.name) return;
  
      let finalVictim: Victim;
      let resultMessage: string;
  
      if (currentStep === 'cause' && victim.image) {
        // Tiempo agotado para causa pero tiene imagen → ataque cardiaco
        finalVictim = {
          ...victim as Victim,
          id: Date.now(),
          deathTime: new Date().toLocaleString(),
          status: 'executed',
          cause: 'heart attack',
          details: 'Muerte por ataque cardiaco (causa no especificada)'
        };
        resultMessage = `💀 ${finalVictim.name} eliminado por ataque cardiaco (tiempo agotado)`;
      } 
      else if (currentStep === 'details' && victim.image) {
        // Tiempo agotado para detalles pero tiene imagen → ataque cardiaco
        finalVictim = {
          ...victim as Victim,
          id: Date.now(),
          deathTime: new Date().toLocaleString(),
          status: 'executed',
          cause: victim.cause || 'heart attack',
          details: 'Muerte por ' + (victim.cause || 'ataque cardiaco') + ' (detalles no especificados)'
        };
        resultMessage = `💀 ${finalVictim.name} eliminado por ${finalVictim.cause} (detalles no especificados)`;
      }
      else {
        // No hay imagen → registro fallido
        finalVictim = {
          ...victim as Victim,
          id: Date.now(),
          deathTime: new Date().toLocaleString(),
          status: 'failed',
          cause: 'Registro fallido: sin imagen'
        };
        resultMessage = "⏰ Registro fallido: Se requiere al menos una imagen";
      }
  
      setMessages(prev => [...prev, 
        { id: Date.now(), text: resultMessage, sender: 'system' }
      ]);
      
      if (victim.image) {
        setVictims(prev => [...prev, finalVictim]);
      }
      
      setVictim({});
      setImagePreview(null);
      setCurrentStep('name');
      setTimeLeft(0);
    };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map(message => (
          <MessageBubble key={message.id} sender={message.sender}>
            {message.text.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        {currentStep !== 'image' ? (
          <>
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder={
                currentStep === 'name' ? "Nombre completo..." :
                currentStep === 'cause' ? "Causa de muerte..." :
                "Detalles específicos..."
              }
            />
            <ActionButton onClick={handleSubmit}>
              <FaArrowRight />
            </ActionButton>
          </>
        ) : (
          <>
            <ImageUploadLabel>
              <FaPaperclip />
              Subir imagen
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </ImageUploadLabel>
            <ActionButton onClick={handleSubmit}>
              Omitir
            </ActionButton>
          </>
        )}
        
        {timeLeft > 0 && (
          <TimerDisplay>
            <FaRegClock />
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </TimerDisplay>
        )}
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatWindow;