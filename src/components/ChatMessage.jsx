const ChatMessage = ({ message }) => {
  const isUser = message.isUser || message.role === 'user';
  const text = message.text || message.content;
  return (
    <div className={`message ${isUser ? 'user' : 'ai'}`}>
      <div className="message-bubble">
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;

