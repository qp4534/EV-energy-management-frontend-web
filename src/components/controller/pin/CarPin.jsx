// CarPin.jsx
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { FaCar } from "react-icons/fa6"; // 🚗 react-icons 차량 아이콘

const bgColors = {
  danger: "#EF4444", // 빨간색
  warning: "#F97316", // 주황색
  caution: "#EAB308", // 노란색
};

const zIndexMap = {
  danger: 30, // 긴급 차량이 가장 위
  warning: 20,
  caution: 10,
};

export default function CarPin({
  map,
  lat,
  lng,
  id,
  status = "danger",
  onClick,
}) {
  useEffect(() => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng) || !parsedLat || !parsedLng)
      return;

    const bgColor = bgColors[status] || bgColors.danger;

    // 1. 핀 메인 컨테이너 DOM 생성
    const pinContainer = document.createElement("div");
    pinContainer.style.cssText = `
      position: relative;
      width: 32px;
      height: 32px;
      background-color: ${bgColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      border: 2px solid white;
      cursor: pointer;
    `;

    // 2. 아이콘을 감쌀 회전용 내부 DOM 생성
    const iconWrapper = document.createElement("div");
    iconWrapper.style.cssText = `
      transform: rotate(45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    pinContainer.appendChild(iconWrapper);

    // 3. react-dom/client를 이용해 react-icon 렌더링 (react-dom-server 불필요)
    const root = ReactDOM.createRoot(iconWrapper);
    root.render(<FaCar size={16} color="white" />);

    if (onClick) {
      pinContainer.onclick = (e) => {
        e.stopPropagation();
        onClick(e);
      };
    }

    // 4. CustomOverlay 생성
    const overlay = new window.kakao.maps.CustomOverlay({
      map: map,
      position: new window.kakao.maps.LatLng(parsedLat, parsedLng),
      content: pinContainer,
      xAnchor: 0.5,
      yAnchor: 1.0,
      zIndex: zIndexMap[status] || 20,
    });

    return () => {
      overlay.setMap(null);
      // 메모리 누수 방지를 위해 unmount 처리
      setTimeout(() => root.unmount(), 0);
    };
  }, [map, lat, lng, id, status, onClick]);

  return null;
}
