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
      cursor: pointer;
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

    // pinContainer 자체가 -45deg 회전돼 있어서, 이름표는 이 별도 앵커(+45deg로 되돌림) 안에
    // 넣어야 화면상 수평으로 똑바로 보인다(iconWrapper와 같은 방식).
    let tooltip = null;
    let clicked = false;
    if (name) {
      const tooltipAnchor = document.createElement("div");
      tooltipAnchor.style.cssText = `
        position: absolute;
        inset: 0;
        transform: rotate(45deg);
        pointer-events: none;
      `;
      pinContainer.appendChild(tooltipAnchor);

      tooltip = document.createElement("div");
      tooltip.textContent = name;
      tooltip.style.cssText = `
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: #1C4532;
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.12s ease;
        z-index: 50;
      `;
      tooltipAnchor.appendChild(tooltip);

      const showTooltip = () => {
        tooltip.style.opacity = "1";
        tooltip.style.visibility = "visible";
      };
      const hideTooltip = () => {
        tooltip.style.opacity = "0";
        tooltip.style.visibility = "hidden";
      };

      pinContainer.onmouseenter = showTooltip;
      pinContainer.onmouseleave = () => {
        if (!clicked) hideTooltip();
      };
      pinContainer.onclick = (e) => {
        e.stopPropagation();
        clicked = !clicked;
        if (clicked) showTooltip();
        else hideTooltip();
      };
    }

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
