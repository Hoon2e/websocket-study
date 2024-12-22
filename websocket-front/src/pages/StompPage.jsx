import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Link } from "react-router";
import { useStomp } from "@/provides/StompProvider";

const StompPage = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const [username, setUsername] = useState("");
  const { isConnected, subscribe, sendMessage } = useStomp();
  useEffect(() => {
    const username = prompt("사용자 이름을 입력하세요");
    setUsername(username);
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    console.log("isConnected", isConnected);
    if (isConnected) {
      unsubscribe = subscribe("/topic/public", (message) => {
        const parsed = JSON.parse(message.body);
        console.log("Received message:", parsed);
        setMessages((prev) => [...prev, parsed]);
      });
    }

    return () => unsubscribe();
  }, [isConnected, subscribe]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Stomp Chat Room</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.messageList}>
            {/* 메시지가 여기에 표시됩니다 */}
            {messages.map((message, index) => (
              <div className={styles.message} key={index}>
                <strong>{message.username}:</strong> {message.message}
              </div>
            ))}
          </div>
          <h3 style={{ textAlign: "center" }}>{username}</h3>
          <form className={styles.messageForm}>
            <input
              type="text"
              className={styles.messageInput}
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              type="button"
              className={styles.sendButton}
              onClick={() => {
                sendMessage("/app/chat/send", {
                  username,
                  message: messageInput,
                });
                setMessageInput("");
              }}
            >
              Send
            </button>
          </form>
        </div>
      </main>
      <Link to="/">home</Link>
    </div>
  );
};

export default StompPage;
