import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ControllerMain from "./pages/ControllerMain";
import AdministratorMain from "./pages/AdministratorMain";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  // 사용자 역할 상태를 관리하는 state
  // 'controller' | 'administrator'
  // 개발하실때 useState('controller')로 설정하시면 관리자 화면이 보여요!(백엔드랑 권한 설정 넣기 전까진 이렇게 해용!)
  const [userRole, setUserRole] = useState("controller");

  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        <Sidebar role={userRole} />
        <main className="content-area">
          <Routes>
            {userRole === "controller" ? (
              <Route path="/controller" element={<ControllerMain />} />
            ) : (
              <Route path="/administrator" element={<AdministratorMain />} />
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
