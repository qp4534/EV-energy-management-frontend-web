import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StationPin from "./pin/StationPin";
import CarPin from "./pin/CarPin";

export default function Map({ stations = [], vehicles = [] }) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚗 수신된 vehicles 데이터:", vehicles);
  }, [vehicles]);

  // 1. 지도 초기화
  useEffect(() => {
    if (!mapContainer.current || !window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const centerPos = new window.kakao.maps.LatLng(37.5665, 126.978);
      const mapInstance = new window.kakao.maps.Map(mapContainer.current, {
        center: centerPos,
        level: 8,
      });

      setTimeout(() => mapInstance.relayout(), 100);
      setMap(mapInstance);
    });
  }, []);

  // 2. 좌표 범위 자동 맞춤
  useEffect(() => {
    if (!map || (!stations.length && !vehicles.length)) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    let hasValidCoords = false;

    stations.forEach((s) => {
      const lat = Number(s.latitude ?? s.lat);
      const lng = Number(s.longitude ?? s.lng);
      if (!isNaN(lat) && !isNaN(lng) && lat && lng) {
        bounds.extend(new window.kakao.maps.LatLng(lat, lng));
        hasValidCoords = true;
      }
    });

    vehicles.forEach((v) => {
      const lat = Number(v.latitude ?? v.lat);
      const lng = Number(v.longitude ?? v.lng);
      if (!isNaN(lat) && !isNaN(lng) && lat && lng) {
        bounds.extend(new window.kakao.maps.LatLng(lat, lng));
        hasValidCoords = true;
      }
    });

    if (hasValidCoords) {
      map.setBounds(bounds);
    }
  }, [map, stations, vehicles]);

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 relative">
      <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />

      {/* ⚡ 충전소 핀 */}
      {map &&
        stations.map((s, idx) => (
          <StationPin
            key={`station-${s.id || s.charge_id || idx}`}
            map={map}
            lat={s.latitude ?? s.lat}
            lng={s.longitude ?? s.lng}
            name={s.name || s.address}
          />
        ))}

      {/* 🚗 차량 핀 */}
      {map &&
        vehicles.map((v, idx) => {
          const vehicleId = v.id || v.car_id;
          return (
            <CarPin
              key={`vehicle-${vehicleId || idx}`}
              map={map}
              lat={v.latitude ?? v.lat}
              lng={v.longitude ?? v.lng}
              id={vehicleId}
              name={v.name || v.car_number}
              status={v.status || "danger"}
              onClick={() => {
                if (vehicleId) navigate(`/controller/stat/${vehicleId}`);
              }}
            />
          );
        })}
    </div>
  );
}
