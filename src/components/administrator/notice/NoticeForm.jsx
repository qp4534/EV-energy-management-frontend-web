import { useState } from "react";
import "../../../styles/administrator/NoticeForm.css";

function NoticeForm({ initialData, onSubmit, onCancel, submitLabel = "등록" }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [isImportant, setIsImportant] = useState(initialData?.isImportant ?? true);
  const [target, setTarget] = useState(initialData?.target || "전체");
  const [isPinned, setIsPinned] = useState(initialData?.isPinned ?? false);
  const [content, setContent] = useState(initialData?.content || "");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력하세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력하세요.");
      return;
    }

    onSubmit({
      title,
      content,
      isImportant,
      target,
      isPinned,
      file, // 실제 업로드는 부모(NoticeWrite/NoticeEdit)에서 공지 저장 후 처리
    });
  };

  return (
    <div className="notice-form-box">
      <div className="form-field">
        <label>제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>구분</label>
        <div className="toggle-group">
          <button
            type="button"
            className={isImportant ? "toggle-active" : ""}
            onClick={() => setIsImportant(true)}
          >
            중요
          </button>
          <button
            type="button"
            className={!isImportant ? "toggle-active" : ""}
            onClick={() => setIsImportant(false)}
          >
            일반
          </button>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>노출 대상</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="전체">전체</option>
            <option value="관리자">관리자</option>
            <option value="관제자">관제자</option>
            <option value="이용자">이용자(차주)</option>
          </select>
        </div>

        <div className="form-field pin-field">
          <label>상단 고정</label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <span>목록 상단에 고정</span>
          </label>
        </div>
      </div>

      <div className="form-field">
        <label>내용</label>
        <textarea
          placeholder="공지 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>첨부파일</label>
        <div
          className="file-drop-zone"
          onClick={() => document.getElementById("fileInput").click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {file ? (
            <span>{file.name}</span>
          ) : (
            <>
              <div className="upload-icon">⬆</div>
              <span>파일을 드래그하거나 클릭하여 업로드</span>
            </>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button type="button" className="btn-submit" onClick={handleSubmit}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export default NoticeForm;