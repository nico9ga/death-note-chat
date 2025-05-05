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
          text: "Escribe el nombre completo (Nombre y Apellido):",
          sender: 'system',
      }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [victim, setVictim] = useState<Partial<Victim>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [victimId, setVictimId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  type Step = 'name' | 'image' | 'cause' | 'details' | 'confirmation';
  const [currentStep, setCurrentStep] = useState<Step>('name');

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const startTimer = (seconds: number) => {
      setTimeLeft(seconds);
  };

  const createVictim = async (name: string, lastName: string, deathType?: string, image?: string) => {
      try {
          const response = await fetch('http://localhost:3000/api/victim', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name,
                  lastName,
                  deathType,
                  images: image ? [image] : []
              })
          });

          if (!response.ok) {
              throw new Error('Error al crear la víctima');
          }

          const data = await response.json();
          return data.id;
      } catch (error) {
          console.error('Error:', error);
          return null;
      }
  };

  const addDeathDetails = async (id: string, details: string) => {
      try {
          const response = await fetch(`http://localhost:3000/api/victim/deathdetails/${id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  details
              })
          });

          if (!response.ok) {
              throw new Error('Error al añadir detalles');
          }

          return await response.json();
      } catch (error) {
          console.error('Error:', error);
          return null;
      }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() && currentStep !== 'image') return;
  
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };
  
    const newMessages = [...messages, userMessage];
    let systemMessage: Message = { id: Date.now() + 1, text: "", sender: 'system' };
  
    switch(currentStep) {
      case 'name':
        const nameParts = inputValue.split(' ');
        if (nameParts.length < 2) {
          systemMessage.text = "Debes ingresar nombre y apellido. Intenta de nuevo:";
          setMessages([...newMessages, systemMessage]);
          setInputValue('');
          return;
        }
        
        const name = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        setVictim(prev => ({ ...prev, name, lastName }));
        systemMessage.text = "¿Quieres subir una foto? (Opcional - 40s)";
        setCurrentStep('image');
        startTimer(40);
        break;
        
      case 'image':
        systemMessage.text = "Especifica la causa de muerte (Opcional - 40s):";
        setCurrentStep('cause');
        startTimer(40);
        break;
        
        case 'cause':
          // Guardar causa solo si se ingresó
          const deathType = inputValue.trim() ? inputValue : 'Heart Attack';
          setVictim(prev => ({ ...prev, deathType }));
          
          const id = await createVictim(
            victim.name || '',
            victim.lastName || '',
            deathType,
            victim.image // Asegurar que enviamos la imagen
          );
          
          if (id) {
            setVictimId(id);
            if (inputValue.trim()) {
              systemMessage.text = "Detalla la muerte (Opcional - 6m40s):";
              setCurrentStep('details');
              startTimer(400);
            } else {
              systemMessage.text = "Ejecutando sentencia (40s)...";
              setCurrentStep('confirmation');
              startTimer(40);
            }
          } else {
          systemMessage.text = "Error al registrar la víctima. Intenta de nuevo.";
          resetProcess();
        }
        break;
        
      case 'details':
        if (!victimId) {
          systemMessage.text = "Error: No se encontró el ID de la víctima";
          resetProcess();
          return;
        }
        
        // Enviar detalles solo si se especificaron
        const detailsResult = inputValue.trim() 
          ? await addDeathDetails(victimId, inputValue)
          : true;
  
        if (detailsResult) {
          systemMessage.text = "Ejecutando sentencia (40s)...";
          setCurrentStep('confirmation');
          startTimer(40);
        } else {
          systemMessage.text = "Error al añadir detalles de la muerte";
          resetProcess();
        }
        break;
        
      case 'confirmation':
        const finalVictim: Victim = {
          ...victim as Victim,
          id: victimId || Date.now().toString(),
          deathTime: new Date().toLocaleString(),
          deathType: victim.deathType || "Heart Attack", // Valor por defecto
          details: victim.details
        };
  
        systemMessage.text = `¡${victim.name} ${victim.lastName} ha sido eliminado!`;
        setVictims(prev => [...prev, finalVictim]);
        resetProcess();
        break;
    }
  
    setMessages([...newMessages, systemMessage]);
    setInputValue('');
  };
  
  // Función auxiliar para resetear el estado
  const resetProcess = () => {
    setVictim({});
    setImagePreview(null);
    setCurrentStep('name');
    setTimeLeft(0);
    setVictimId(null);
    setInputValue('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setImagePreview(imageUrl);
      // Actualizamos el estado completo de la víctima
      setVictim(prev => ({ 
        ...prev, 
        image: imageUrl,
        name: prev.name || '',
        lastName: prev.lastName || ''
      }));
      
      setMessages(prev => [...prev, 
        { id: Date.now(), text: "Imagen subida ✅", sender: 'user' },
        { id: Date.now() + 1, text: "Especifica la causa de muerte (40s restantes):", sender: 'system' }
      ]);
      
      setCurrentStep('cause');
      startTimer(40);
    };
    reader.readAsDataURL(file);
  };

  const handleTimeout = async () => {
    if (!victim.name || !victim.lastName) return;
  
    let finalVictim: Victim | null = null;
    let resultMessage: string;
  
    // Caso 1: Ya tenemos victimId (paso de detalles)
    if (victimId) {
      const details = currentStep === 'details' 
        ? `Muerte por ${victim.deathType || 'ataque cardiaco'} (detalles no especificados)`
        : victim.details || '';
      
      if (currentStep === 'details') {
        await addDeathDetails(victimId, details);
      }
  
      finalVictim = {
        ...victim as Victim,
        id: victimId,
        deathTime: new Date().toLocaleString(),
        deathType: victim.deathType || 'Heart Attack',
        details: details
      };
      
      resultMessage = `💀 ${victim.name} ${victim.lastName} eliminado - ${victim.deathType || 'ataque cardiaco'}`;
    }
    // Caso 2: No tenemos victimId pero sí imagen
    else if (victim.image) {
      const id = await createVictim(
        victim.name,
        victim.lastName,
        victim.deathType || 'Heart Attack',
        victim.image
      );
      
      if (id) {
        finalVictim = {
          ...victim as Victim,
          id,
          deathTime: new Date().toLocaleString(),
          deathType: victim.deathType || 'Heart Attack',
          details: victim.details || `Muerte por ${victim.deathType || 'ataque cardiaco'}`
        };
        resultMessage = `💀 ${victim.name} ${victim.lastName} eliminado por ${victim.deathType || 'ataque cardiaco'}`;
      } else {
        resultMessage = "Error al registrar la víctima (tiempo agotado)";
      }
    }
    // Caso 3: No hay imagen
    else {
      resultMessage = "⏰ Registro fallido: Se requiere al menos una imagen";
    }
  
    setMessages(prev => [...prev, 
      { id: Date.now(), text: resultMessage, sender: 'system' }
    ]);
    
    if (finalVictim) {
      setVictims(prev => [...prev, finalVictim as Victim]);
    }
    
    // Resetear el proceso
    setVictim({});
    setImagePreview(null);
    setCurrentStep('name');
    setTimeLeft(0);
    setVictimId(null);
  };

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
  }, [timeLeft, currentStep, handleTimeout]);

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
                              currentStep === 'name' ? "Nombre y apellido..." :
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