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
import Landing from "./pages/Landing";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import CarReportList from "./pages/Controller/CarReportList";

function DashboardLayout() {
  // 사용자 역할 상태를 관리하는 state
  // 'controller' | 'administrator'
  // 개발하실때 useState('controller')로 설정하시면 관리자 화면이 보여요!(백엔드랑 권한 설정 넣기 전까진 이렇게 해용!)
  const [userRole, setUserRole] = useState("administrator");

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar role={userRole} />
        <main className="content-area">
          <Routes>
            {userRole === "controller" ? (
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}

export default App;
