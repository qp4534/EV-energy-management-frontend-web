import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import StationPin from "./pin/StationPin";
import CarPin from "./pin/CarPin";

export default function Map({
  stations = [],
  vehicles = [],
  activeFilters = {},
}) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const navigate = useNavigate();

  const hasFitBounds = useRef(false);

  // 지도 초기화
  // 카카오맵 SDK(index.html의 <script>, autoload=false)는 네트워크를 통해 비동기로 로드되므로
  // 이 컴포넌트가 먼저 마운트되면 window.kakao가 아직 없을 수 있다. 그 상태에서 그냥 return하면
  // 이 effect는 다시 실행되지 않아(deps: []) 지도가 영원히 안 뜨고 에러도 안 나는 문제가 있었다.
  // SDK가 준비될 때까지 폴링해서 이 레이스 컨디션을 없앤다.
  useEffect(() => {
    if (!mapContainer.current) return;

    let cancelled = false;

    const initMap = () => {
      if (cancelled || !mapContainer.current) return;
      window.kakao.maps.load(() => {
        if (cancelled || !mapContainer.current) return;
        const centerPos = new window.kakao.maps.LatLng(37.5665, 126.978);
        const mapInstance = new window.kakao.maps.Map(mapContainer.current, {
          center: centerPos,
          level: 8,
        });

        setTimeout(() => mapInstance.relayout(), 100);
        setMap(mapInstance);
      });
    };

    if (window.kakao && window.kakao.maps) {
      initMap();
      return () => {
        cancelled = true;
      };
    }

    const intervalId = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(intervalId);
        initMap();
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!map || hasFitBounds.current) return;
    if (!stations.length && !vehicles.length) return;

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
      hasFitBounds.current = true;
    }
  }, [map, stations, vehicles]);

  const handleVehicleClick = useCallback(
    (vehicleId) => {
      if (vehicleId) navigate(`/controller/stat/${vehicleId}`);
    },
    [navigate],
  );

  const visibleStations = activeFilters.station === false ? [] : stations;
  const visibleVehicles = vehicles.filter(
    (v) => activeFilters[v.status || "danger"] !== false,
  );

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-gray-200 relative">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {map &&
        visibleStations.map((s, idx) => (
          <StationPin
            key={`station-${s.chargeId || idx}`}
            map={map}
            lat={s.latitude}
            lng={s.longitude}
          />
        ))}

      {map &&
        visibleVehicles.map((v, idx) => (
          <CarPin
            key={`vehicle-${v.carId || idx}`}
            map={map}
            lat={v.latitude}
            lng={v.longitude}
            id={v.carId}
            status={v.status || "danger"}
            onClick={handleVehicleClick}
          />
        ))}
    </div>
  );
}
