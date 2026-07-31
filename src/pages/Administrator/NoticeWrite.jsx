import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoticeForm from "../../components/administrator/notice/NoticeForm";
//import { noticeService } from "../../services/noticeService";
import "../../styles/administrator/NoticeForm.css";

// 임시
const createNoticeMock = async (noticeData) => {
  console.log("작성 데이터:", noticeData);
  return new Promise((resolve) => setTimeout(resolve, 300));
};

function NoticeWrite() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await createNoticeMock(data);
    alert("공지사항이 등록되었습니다! (임시)");
    navigate("/admin/notices");
  };

  return (
    <div className="notice-form">
      <h2>공지사항 작성</h2>
      <NoticeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/notices")}
        submitLabel="등록"
      />
    </div>
  );
}

export default NoticeWrite;