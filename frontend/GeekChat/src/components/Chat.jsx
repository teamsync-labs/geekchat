import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialMessages = [
  { id: 1, user: "Анна", text: "Привет! Как дела?", time: "10:30" },
  { id: 2, user: "Ты", text: "Привет! Всё отлично, изучаю shadcn/ui!", time: "10:32" },
  { id: 3, user: "Анна", text: "Круто! Сможешь стилизовать сообщения по цветам, как я просила?", time: "10:35" },
];

function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [currentMessageId, setCurrentMessageId] = useState(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Выделяем последнее сообщение
    if (messages.length > 0) {
      setCurrentMessageId(messages[messages.length - 1].id);
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    const newMsg = {
      id: messages.length + 1,
      user: "Ты",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#162035] rounded-2xl shadow-2xl p-6 border border-[#2A4A7A]/30">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2A4A7A]/30">
          <h1 className="text-2xl font-bold text-[#E8EDF5] tracking-tight">
            💬 GeekChat
          </h1>
          <span className="text-xs text-[#8A9BB5] bg-[#0A1628] px-3 py-1 rounded-full border border-[#2A4A7A]/30">
            {messages.length} сообщений
          </span>
        </div>

        {/* Область сообщений */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {messages.map((msg) => {
            const isCurrent = msg.id === currentMessageId;
            const isOther = msg.user === "Анна";
            
            return (
              <Card 
                key={msg.id} 
                className={`p-3 border transition-all ${
                  isOther 
                    ? "bg-[#243B5E] border-[#3A5A8A]" 
                    : "bg-[#1A2D4A] border-[#2A4A7A]"
                } ${
                  isCurrent 
                    ? 'ring-2 ring-[#8AB4F8] shadow-lg shadow-[#8AB4F8]/20 scale-[1.02]' 
                    : 'hover:scale-[1.01]'
                }`}
              >
                <CardContent className="p-0 flex items-start gap-3">
                  <Avatar className="h-9 w-9 border-2 border-[#2A4A7A] flex-shrink-0">
                    <AvatarImage 
                      src={`https://ui-avatars.com/api/?name=${msg.user}&background=${isOther ? "2A4A7A" : "1A2D4A"}&color=fff&bold=true`} 
                    />
                    <AvatarFallback className="bg-[#2A4A7A] text-[#E8EDF5] font-medium">
                      {msg.user[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${
                        isOther ? "text-[#8AB4F8]" : "text-[#81C995]"
                      }`}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-[#8A9BB5]">{msg.time}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-[#8AB4F8] text-[#0A1628] px-2 py-0.5 rounded-full font-medium">
                          ● Текущее
                        </span>
                      )}
                    </div>
                    <p className="text-[#E8EDF5] break-words mt-0.5">{msg.text}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-[#2A4A7A]/30">
          <Input 
            placeholder="Напишите сообщение..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-[#0A1628] border-[#2A4A7A] text-[#E8EDF5] placeholder:text-[#6A7A95] focus:border-[#3A5A8A] focus:ring-1 focus:ring-[#3A5A8A]"
          />
          <Button 
            onClick={sendMessage}
            className="bg-[#2A4A7A] hover:bg-[#3A5A8A] text-[#E8EDF5] border border-[#3A5A8A] transition-all px-6"
          >
            Отправить
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
