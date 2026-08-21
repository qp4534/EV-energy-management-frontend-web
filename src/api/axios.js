// src/api/axios.js
import axios from "axios";
import { clearAuth } from "../hooks/common/useAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인터셉터 처리
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 로그인 없이도 호출되는 엔드포인트 목록 (백엔드 SecurityConfig의 permitAll 목록과 동일하게 유지).
// 여기서 오는 401은 "세션 만료"가 아니라 "아이디/비번 오류" 같은 정상 실패 응답이라 리다이렉트 대상에서 뺀다.
const PUBLIC_AUTH_PATHS = [
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/email/send-code",
  "/api/auth/email/verify-code",
  "/api/auth/find-email",
  "/api/auth/password/reset/send-code",
  "/api/auth/password/reset",
];

// 그 외 요청이 401을 받으면 토큰이 없거나 만료/위조된 것이므로, 로컬 인증 상태를 지우고
// 루트(랜딩) 화면으로 돌려보낸다. axios.js는 React 트리 밖이라 react-router navigate를 못 쓰므로
// 풀 리로드로 처리한다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const isPublicAuthRequest = PUBLIC_AUTH_PATHS.some((path) =>
      url.includes(path),
    );

    if (status === 401 && !isPublicAuthRequest) {
      clearAuth();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
