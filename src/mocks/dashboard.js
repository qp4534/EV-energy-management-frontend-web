// src/mocks/dashboard.js

//import { users } from "./users";

// users 변수를 선언 (더미 데이터)
const users = [
  { id: 1, role: "USER", is_locked: false, is_agree: true },
  { id: 2, role: "USER", is_locked: false, is_agree: true },
  { id: 3, role: "ADMIN", is_locked: false, is_agree: true },
  { id: 4, role: "CONTROLLER", is_locked: true, is_agree: true },
];

export const userData = [
  {
    label: "일반 이용자",
    value: users.filter((user) => user.role === "USER").length,
  },
];

export const staffData = [
  {
    label: "관리자",
    value: users.filter((user) => user.role === "ADMIN").length,
  },
  {
    label: "관제자",
    value: users.filter((user) => user.role === "CONTROLLER").length,
  },
];

export const accountStatusData = [
  {
    label: "정상 계정",
    value: users.filter((user) => !user.is_locked).length,
  },
  {
    label: "잠긴 계정",
    value: users.filter((user) => user.is_locked).length,
  },
  {
    label: "약관 미동의",
    value: users.filter((user) => !user.is_agree).length,
  },
];

export const memberFlow = [
  { month: "1월", joined: 22, withdrawn: 2 },
  { month: "2월", joined: 28, withdrawn: 3 },
  { month: "3월", joined: 35, withdrawn: 4 },
  { month: "4월", joined: 41, withdrawn: 3 },
  { month: "5월", joined: 47, withdrawn: 5 },
  { month: "6월", joined: 38, withdrawn: 4 },
  { month: "7월", joined: 40, withdrawn: 2 },
];