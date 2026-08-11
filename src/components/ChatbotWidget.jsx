import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FiMessageSquare,
  FiRefreshCw,
  FiSend,
  FiX,
  FiZap,
} from "react-icons/fi";
import { chatService } from "../services/chatService";
import "../styles/ChatbotWidget.css";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "안녕하세요. 전기차 충전·배터리 안전에 관해 궁금한 점을 물어보세요.",
  sources: [],
};

function createConversationId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function errorMessage(error) {
  if (error?.response?.status === 401) {
    return "로그인 정보가 만료되었습니다. 다시 로그인한 뒤 이용해주세요.";
  }
  if (error?.code === "ECONNABORTED") {
    return "답변 생성 시간이 길어지고 있습니다. 잠시 후 다시 질문해주세요.";
  }
  return (
    error?.response?.data?.message ??
    "현재 챗봇에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
  );
}

function vehicleIdFromPath(pathname) {
  const match = pathname.match(/^\/controller\/cars\/([^/]+)(?:\/|$)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export default function ChatbotWidget() {
  const location = useLocation();
  const vehicleId = vehicleIdFromPath(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [conversationId, setConversationId] = useState(createConversationId);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, isSending, messages]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const resetConversation = () => {
    setMessages([WELCOME_MESSAGE]);
    setConversationId(createConversationId());
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const sendMessage = async () => {
    const message = input.trim();
    if (!message || isSending) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: message,
      sources: [],
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await chatService.sendMessage({
        message,
        conversationId,
        vehicleId,
      });
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: response.answer || "답변을 생성하지 못했습니다.",
          sources: Array.isArray(response.sources)
            ? response.sources.slice(0, 3)
            : [],
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: errorMessage(error),
          sources: [],
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    void sendMessage();
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="chatbot-widget">
      {isOpen && (
        <section
          id="mijunge-chatbot-panel"
          className="chatbot-panel"
          aria-label="MijungE 안전 챗봇"
        >
          <header className="chatbot-header">
            <div className="chatbot-brand">
              <FiZap aria-hidden="true" />
              <span>MijungE</span>
            </div>
            <button
              type="button"
              className="chatbot-header-button"
              onClick={resetConversation}
              aria-label="대화 초기화"
              title="대화 초기화"
            >
              <FiRefreshCw aria-hidden="true" />
            </button>
            <button
              type="button"
              className="chatbot-header-button"
              onClick={() => setIsOpen(false)}
              aria-label="챗봇 닫기"
            >
              <FiX aria-hidden="true" />
            </button>
          </header>

          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message-row chatbot-message-row--${message.role}`}
              >
                <div
                  className={`chatbot-message ${
                    message.isError ? "chatbot-message--error" : ""
                  }`}
                >
                  <p>{message.text}</p>
                  {message.sources.length > 0 && (
                    <div className="chatbot-sources">
                      <strong>참고 자료</strong>
                      <ul>
                        {message.sources.map((source) => (
                          <li key={source.chunkId ?? `${source.title}-${source.clause}`}>
                            {source.url ? (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {source.title}
                                {source.clause ? ` · ${source.clause}` : ""}
                              </a>
                            ) : (
                              <span>
                                {source.title}
                                {source.clause ? ` · ${source.clause}` : ""}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="chatbot-message-row chatbot-message-row--assistant">
                <div className="chatbot-message chatbot-message--loading" aria-label="답변 생성 중">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="관리 관련 궁금한 점을 물어보세요"
              aria-label="챗봇 질문"
              rows={1}
              maxLength={4000}
              disabled={isSending}
            />
            <button
              type="submit"
              className="chatbot-send-button"
              aria-label="질문 보내기"
              disabled={!input.trim() || isSending}
            >
              <FiSend aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className={`chatbot-launcher ${isOpen ? "chatbot-launcher--open" : ""}`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "챗봇 닫기" : "챗봇 열기"}
        aria-controls="mijunge-chatbot-panel"
        aria-expanded={isOpen}
      >
        <FiMessageSquare aria-hidden="true" />
      </button>
    </div>
  );
}
