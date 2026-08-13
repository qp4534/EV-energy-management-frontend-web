import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ControllerMain from "./pages/Controller/ControllerMain";
import CarList from "./pages/Controller/CarList";
import ControllMap from "./pages/Controller/ControllerMap";
import CarDetail from "./pages/Controller/CarDetail";
import AiReportList from "./pages/Controller/AiReportList";
import AiReportDetail from "./pages/Controller/AiReportDetail";
import AdministratorMain from "./pages/Administrator/AdministratorMain";
import NoticeManage from "./pages/Administrator/NoticeManage";
import NoticeWrite from "./pages/Administrator/NoticeWrite";
import NoticeEdit from "./pages/Administrator/NoticeEdit";
import NoticeDetail from "./pages/Administrator/NoticeDetail";
import LogManage from "./pages/Administrator/LogManage";
import UserManage from "./pages/Administrator/UserManage";
import BatteryDiagnosis from "./pages/Administrator/BatteryDiagnosis";
import SystemPage from "./pages/Administrator/SystemPage";
import StatsReport from "./pages/Administrator/StatsReport";
import Login from "./pages/Auth/Login";
import FindId from "./pages/Auth/FindId";
import ResetPasswordRequest from "./pages/Auth/ResetPasswordRequest";
import ResetPasswordNew from "./pages/Auth/ResetPasswordNew";
import SignupConsent from "./pages/Auth/SignupConsent";
import SignupInfo from "./pages/Auth/SignupInfo";
import Terms from "./pages/Auth/Terms";
import Landing from "./pages/Landing";
import MyPage from "./pages/MyPage";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import useAuth from "./hooks/common/useAuth";
import CarReportList from "./pages/Controller/CarReportList";
import ChatbotWidget from "./components/ChatbotWidget";

const AUTH_ROUTE_PATTERN = /^\/(login|find-id|reset-password|signup|terms)/;

function DashboardLayout() {
  // 사용자 역할 상태를 관리하는 state
  // 'controller' | 'administrator'
  // 개발하실때 useState('controller')로 설정하시면 관리자 화면이 보여요!(백엔드랑 권한 설정 넣기 전까진 이렇게 해용!)
  const [userRole] = useState("controller");
  const location = useLocation();
  const { isLoggedIn, role: authRole } = useAuth();
  const isAuthRoute = AUTH_ROUTE_PATTERN.test(location.pathname);

  if (!isAuthRoute && location.pathname !== "/" && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 경로(/administrator, /controller)가 특정 role 전용 구역을 가리키는지 우선 판단하고,
  // 판단이 안 되는 경로(/, /mypage 등)에서는 null로 둔다.
  const pathImpliesRole = location.pathname.startsWith("/administrator") || location.pathname.startsWith("/admin")
    ? "administrator"
    : location.pathname.startsWith("/controller")
      ? "controller"
      : null;

  // 로그인은 했지만 자기 role이 아닌 대시보드 경로로 직접 들어온 경우, 주소를 바꿔도
  // 그 화면이 보이지 않도록 자기 role의 홈으로 되돌린다.
  if (isLoggedIn && pathImpliesRole && pathImpliesRole !== authRole) {
    return <Navigate to={authRole === "administrator" ? "/administrator" : "/controller"} replace />;
  }

  const activeRole = pathImpliesRole ?? (isLoggedIn ? authRole : userRole);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/reset-password" element={<ResetPasswordRequest />} />
        <Route path="/reset-password/new" element={<ResetPasswordNew />} />
        <Route path="/signup" element={<SignupConsent />} />
        <Route path="/signup/info" element={<SignupInfo />} />
        <Route path="/terms/:type" element={<Terms />} />
        <Route path="/terms" element={<Navigate to="/terms/privacy" replace />} />
      </Routes>
    );
  }
  //const [userRole, setUserRole] = useState("administrator");

  return (
    <div className="app-container">
      <Header role={activeRole} />
      <div className="main-layout">
        <Sidebar role={activeRole} />
        <main
          className={`content-area${
            location.pathname.startsWith("/controller")
              ? " content-area--controller"
              : ""
          }`}
        >
          <Routes>
            <Route path="/mypage" element={<MyPage />} />
            {activeRole === "controller" ? (
              <>
                <Route path="/controller" element={<ControllerMain />} />
                <Route path="/controller/cars" element={<CarList />} />
                <Route path="/controller/map" element={<ControllMap />} />
                <Route path="/controller/cars/:id" element={<CarDetail />} />
                <Route path="/controller/reports" element={<AiReportList />} />
                <Route
                  path="/controller/reports/:id"
                  element={<AiReportDetail />}
                />
                <Route
                  path="/controller/cars/:id/reports"
                  element={<CarReportList />}
                />
              </>
            ) : (
              <>
                <Route path="/administrator" element={<AdministratorMain />} />
                <Route path="/admin/notices" element={<NoticeManage />} />
                <Route path="/admin/notices/new" element={<NoticeWrite />} />
                <Route path="/admin/notices/:id" element={<NoticeDetail />} />
                <Route path="/admin/notices/:id/edit" element={<NoticeEdit />} />
                <Route path="/admin/logs" element={<LogManage />} />
                <Route path="/admin/users" element={<UserManage />} />
                <Route path="/admin/battery" element={<BatteryDiagnosis />} />
                <Route path="/admin/system" element={<SystemPage />} />
                <Route path="/admin/reports" element={<StatsReport />} />
              </>
            )}
          </Routes>
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}

export default App;
