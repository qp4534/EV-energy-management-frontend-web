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
import StatsReport from "./pages/Administrator/StatsReport";
import Login from "./pages/Auth/Login";
import FindId from "./pages/Auth/FindId";
import ResetPasswordRequest from "./pages/Auth/ResetPasswordRequest";
import ResetPasswordNew from "./pages/Auth/ResetPasswordNew";
import SignupConsent from "./pages/Auth/SignupConsent";
import SignupInfo from "./pages/Auth/SignupInfo";
import Terms from "./pages/Auth/Terms";
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import CarReportList from "./pages/Controller/CarReportList";

const AUTH_ROUTE_PATTERN = /^\/(login|find-id|reset-password|signup|terms)/;

function App() {
  // 사용자 역할 상태를 관리하는 state
  // 'controller' | 'administrator'
  // 개발하실때 useState('controller')로 설정하시면 관리자 화면이 보여요!(백엔드랑 권한 설정 넣기 전까진 이렇게 해용!)
  const [userRole, setUserRole] = useState("controller");
  const location = useLocation();
  const isAuthRoute = AUTH_ROUTE_PATTERN.test(location.pathname);
  // 로그인 화면에서 넘어온 경로(/administrator, /controller)로 어떤 사이드바/라우트 묶음을
  // 보여줄지 우선 판단하고, 판단이 안 되는 경로(/ 등)에서는 기존 userRole state로 대체
  const activeRole = location.pathname.startsWith("/administrator") || location.pathname.startsWith("/admin")
    ? "administrator"
    : location.pathname.startsWith("/controller")
      ? "controller"
      : userRole;

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
        <Route path="/terms" element={<Navigate to="/terms/service" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar role={activeRole} />
        <main className="content-area">
          <Routes>
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
                <Route path="/admin/reports" element={<StatsReport />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
