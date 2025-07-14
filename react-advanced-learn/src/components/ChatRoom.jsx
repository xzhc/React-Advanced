import { useEvent, useState } from "react";

export function ChatRoom({ roomId, theme, onMessage }) {
  const [messages, setMessages] = useState([]);

  // 使用 useEffectEvent 创建一个非响应式的事件处理函数
  // 即使 onMessage 或 theme 变化，也不会导致 Effect 重新执行
  const onReceiveMessage = useEffectEvent((receivedMessage) => {
    // 可以安全地使用最新的 props，如 onMessage 和 theme
    console.log(`Received in ${theme} theme: ${receivedMessage}`);
    onMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    connection.on("message", (receivedMessage) => {
      // 调用我们的 Effect Event
      onReceiveMessage(receivedMessage);

      // 更新本地状态
      setMessages((prev) => [...prev, receivedMessage]);
    });

    return () => connection.disconnect();
    // 依赖数组中只包含真正需要触发重新连接的 roomId
    // onMessage 和 theme 不在依赖项中，因为它们通过 useEffectEvent 使用
  }, [roomId]);

  return (
    <div className={theme}>
      <h1>Welcome to {roomId}</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

// 模拟 API
function createConnection(roomId) {
  return {
    connect() {
      console.log(`Connected to ${roomId}`);
    },
    disconnect() {
      console.log(`Disconnected from ${roomId}`);
    },
    on(event, callback) {
      console.log(`Listening for ${event} events`);
      // 模拟消息
      setTimeout(() => {
        callback(`Hello from ${roomId}!`);
      }, 1000);
    },
  };
}
