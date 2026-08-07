import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * 화면에 렌더된 DOM 엘리먼트를 그대로 캡처해서 PDF 파일로 저장한다.
 * (배터리 매도 제안서 "PDF Download" 버튼 전용 - 기존엔 console.log만 찍고
 * 실제 다운로드 동작이 없었음)
 *
 * @param {HTMLElement} element - 캡처할 컨테이너
 * @param {string} fileName - 확장자 없이 넘기면 .pdf 붙여서 저장
 */
export async function exportElementToPdf(element, fileName = "제안서") {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  // A4 세로, mm 단위
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // 내용이 A4 한 장보다 길면 다음 페이지로 이어붙인다.
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);
}
