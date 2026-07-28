// StationPin.jsx
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BsFillLightningChargeFill } from "react-icons/bs";

export default function StationPin({ map, lat, lng, name }) {
  useEffect(() => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng) || !parsedLat || !parsedLng)
      return;

    // 1. 핀 메인 컨테이너 DOM 생성
    const pinContainer = document.createElement("div");
    pinContainer.style.cssText = `
      position: relative;
      width: 32px;
      height: 32px;
      background-color: #3F6A52;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      border: 2px solid white;
    `;

    // 2. 아이콘 내부 DOM 생성
    const iconWrapper = document.createElement("div");
    iconWrapper.style.cssText = `
      transform: rotate(45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    pinContainer.appendChild(iconWrapper);

    // 3. react-icon 렌더링
    const root = ReactDOM.createRoot(iconWrapper);
    root.render(<BsFillLightningChargeFill size={16} color="white" />);

    // 4. CustomOverlay 생성
    const overlay = new window.kakao.maps.CustomOverlay({
      map: map,
      position: new window.kakao.maps.LatLng(parsedLat, parsedLng),
      content: pinContainer,
      xAnchor: 0.5,
      yAnchor: 1.0,
      zIndex: 3,
    });

    return () => {
      overlay.setMap(null);
      setTimeout(() => root.unmount(), 0);
    };
  }, [map, lat, lng, name]);

  return null;
}
