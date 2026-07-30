// StationPin.jsx
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BsFillLightningChargeFill } from "react-icons/bs";

export default function StationPin({ map, lat, lng }) {
  useEffect(() => {
    if (!map || !window.kakao || !window.kakao.maps) return;

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng) || !parsedLat || !parsedLng)
      return;

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

    const iconWrapper = document.createElement("div");
    iconWrapper.style.cssText = `
      transform: rotate(45deg);
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    pinContainer.appendChild(iconWrapper);

    const root = ReactDOM.createRoot(iconWrapper);
    root.render(<BsFillLightningChargeFill size={16} color="white" />);

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
  }, [map, lat, lng]);

  return null;
}
