import { useEffect, useMemo, useRef, useState } from "react";
import "./CarDigitalTwinCard.css";

const TWIN_BASE_URL = `${import.meta.env.BASE_URL}battery-twin/`;
const TWIN_API_URL = (import.meta.env.VITE_TWIN_API_URL ?? "").replace(/\/$/, "");
const RISK_LABELS = ["정상", "주의", "경고", "위험"];
const VIEW_OPTIONS = [
  ["iso", "입체"],
  ["top", "상단"],
  ["front", "정면"],
  ["side", "측면"],
];

function replayFrames(replay) {
  return (replay?.scenarios ?? []).flatMap((scenario) => scenario.frames ?? []);
}

function replayPhases(replay) {
  let startIndex = 0;
  return (replay?.scenarios ?? []).map((scenario) => {
    const firstRiskOffset = Math.max(
      0,
      (scenario.frames ?? []).findIndex(
        (frame) => Number(frame.risk_level) > 0,
      ),
    );
    const phase = {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      startIndex,
      focusIndex: startIndex + firstRiskOffset,
      endIndex: startIndex + Math.max(0, (scenario.frames?.length ?? 1) - 1),
    };
    startIndex += scenario.frames?.length ?? 0;
    return phase;
  });
}

function toRenderFrame(frame) {
  const riskLevel = Number(frame.final_risk_level) || 0;
  const temperatures = frame.temperature_decic ?? [];
  return {
    ...frame,
    timestamp: frame.observed_at,
    scenario_name: "실시간 센서 스트림",
    risk_level: riskLevel,
    risk_label: RISK_LABELS[riskLevel],
    max_cell_temperature_c: temperatures.length ? Math.max(...temperatures) / 10 : 0,
    battery_twin_state: {
      temperature_decic: temperatures,
      voltage_mv: frame.voltage_mv,
      state_level: frame.state_level,
      hotspot_cell_index: frame.hotspot_cell_index,
    },
    connector_twin_state: {
      temperature_decic: frame.connector_temperature_decic,
      state_level: frame.connector_state_level,
      hotspot_component_index: frame.hotspot_connector_index,
    },
  };
}

function formatIncidentTime(index, length) {
  if (!length) return "--:--:--";
  const lastIndex = Math.max(1, length - 1);
  const incidentIndex = Math.max(1, Math.round(lastIndex / 3));
  const elapsed = index <= incidentIndex
    ? Math.round(-3_600 + (index / incidentIndex) * 3_600)
    : Math.round(((index - incidentIndex) / Math.max(1, lastIndex - incidentIndex)) * 7_200);
  if (elapsed === 0) return "사고 발생";
  const sign = elapsed < 0 ? "-" : "+";
  const absolute = Math.abs(elapsed);
  const hours = Math.floor(absolute / 3_600);
  const minutes = Math.floor((absolute % 3_600) / 60);
  const seconds = absolute % 60;
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CarDigitalTwinCard({ mode = "live", vehicleId = "car-uuid-001" }) {
  const isHistory = mode === "history";
  const canvasRef = useRef(null);
  const fallbackRef = useRef(null);
  const viewerRef = useRef(null);
  const [replay, setReplay] = useState(null);
  const [remoteFrames, setRemoteFrames] = useState([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [available, setAvailable] = useState(true);
  const [status, setStatus] = useState("loading");
  const [dataSource, setDataSource] = useState("로컬 시뮬레이션");
  const [errorMessage, setErrorMessage] = useState("");
  const [remoteHistoryFailed, setRemoteHistoryFailed] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [toggles, setToggles] = useState({ vehicle: true, cover: true, exploded: false });

  const localFrames = useMemo(() => replayFrames(replay), [replay]);
  const phases = useMemo(() => replayPhases(replay), [replay]);
  const frames = remoteFrames.length
    ? remoteFrames
    : isHistory && !remoteHistoryFailed
      ? []
      : localFrames;
  const currentFrame = frames[frameIndex] ?? null;
  const activePhase = !remoteFrames.length
    ? phases.find((phase) => frameIndex >= phase.startIndex && frameIndex <= phase.endIndex)
    : null;

  useEffect(() => {
    let cancelled = false;
    let localViewer = null;

    async function initializeTwin() {
      try {
        const [response, twinModule] = await Promise.all([
          fetch(`${TWIN_BASE_URL}data/replay.json`, { cache: "no-store" }),
          import(/* @vite-ignore */ `${TWIN_BASE_URL}battery-twin-component.js`),
        ]);
        if (!response.ok) throw new Error(`재생 데이터 요청 실패 (${response.status})`);
        const loadedReplay = await response.json();
        if (!loadedReplay.battery_twin || !loadedReplay.connector_twin || !replayFrames(loadedReplay).length) {
          throw new Error("3D 트윈 데이터 형식이 올바르지 않습니다.");
        }
        if (cancelled) return;

        localViewer = new twinModule.BatteryTwinComponent({
          canvas: canvasRef.current,
          fallbackElement: fallbackRef.current,
          definition: loadedReplay.battery_twin,
          connectorDefinition: loadedReplay.connector_twin,
          assetBaseUrl: TWIN_BASE_URL,
          onSelection: setSelectedCell,
          onAvailability: setAvailable,
        });
        viewerRef.current = localViewer;
        localViewer.toggleVehicle(true);
        localViewer.setVisible(true);
        setReplay(loadedReplay);
        setStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(error instanceof Error ? error.message : "3D 트윈을 불러오지 못했습니다.");
        setStatus("error");
      }
    }

    initializeTwin();
    return () => {
      cancelled = true;
      localViewer?.dispose?.();
      if (viewerRef.current === localViewer) viewerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!TWIN_API_URL || status !== "ready") return undefined;
    let cancelled = false;
    let socket;

    if (isHistory) {
      setRemoteHistoryFailed(false);
      setDataSource("사고 이력 불러오는 중...");
      fetch(`${TWIN_API_URL}/api/v1/twins/vehicles/${encodeURIComponent(vehicleId)}/incidents/latest/history?resolution_seconds=30`)
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .then((payload) => {
          if (cancelled || !payload.frames?.length) return;
          setRemoteFrames(payload.frames.map(toRenderFrame));
          setFrameIndex(0);
          setDataSource("사고 이력 API · 30초 간격");
        })
        .catch(() => {
          setRemoteHistoryFailed(true);
          setDataSource("사고 이력 없음 · 로컬 시뮬레이션");
        });
    } else {
      const wsBase = TWIN_API_URL.replace(/^http/, "ws");
      socket = new WebSocket(`${wsBase}/api/v1/twins/vehicles/${encodeURIComponent(vehicleId)}/live`);
      socket.onmessage = (event) => {
        if (cancelled) return;
        const frame = toRenderFrame(JSON.parse(event.data));
        setRemoteFrames([frame]);
        setFrameIndex(0);
        setDataSource("WebSocket 실시간 · 1Hz");
      };
      socket.onerror = () => setDataSource("연결 대기 · 로컬 시뮬레이션");
    }

    return () => {
      cancelled = true;
      socket?.close();
    };
  }, [isHistory, status, vehicleId]);

  useEffect(() => {
    if (!currentFrame || !viewerRef.current) return;
    viewerRef.current.update(currentFrame.battery_twin_state, currentFrame);
  }, [currentFrame]);

  useEffect(() => {
    if (!playing || status !== "ready" || frames.length < 2) return undefined;
    const intervalMs = isHistory ? 650 : 1_000;
    const interval = window.setInterval(() => {
      setFrameIndex((index) => (index + 1) % frames.length);
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [frames.length, isHistory, playing, status]);

  function toggleFeature(key, method) {
    const active = viewerRef.current?.[method]?.();
    if (typeof active === "boolean") setToggles((current) => ({ ...current, [key]: active }));
  }

  function resetReplay() {
    setPlaying(false);
    setFrameIndex(0);
    viewerRef.current?.setView("iso");
  }

  const riskLevel = Number(currentFrame?.risk_level) || 0;
  const progressMax = Math.max(0, frames.length - 1);

  return (
    <div className={`card digital-twin-card digital-twin-card--${mode} flex h-full flex-col gap-3`}>
      <div className="digital-twin-heading">
        <div>
          <h2>{isHistory ? "사고 전 3시간 디지털 트윈" : "실시간 디지털 트윈"}</h2>
          <p>{isHistory ? "사고 1시간 전부터 사고 2시간 후까지" : "차량·배터리 상태 1Hz 모니터링"}</p>
        </div>
        <span className={`digital-twin-live ${isHistory ? "digital-twin-live--history" : ""}`}>
          {isHistory ? "INCIDENT" : "LIVE"}
        </span>
      </div>

      <div className="digital-twin-source"><i />{dataSource}</div>

      <div className="digital-twin-stage" data-level={riskLevel}>
        {status === "loading" && <div className="digital-twin-message">3D 모델을 불러오는 중...</div>}
        {status === "error" && <div className="digital-twin-message digital-twin-message--error">{errorMessage}</div>}
        <canvas ref={canvasRef} tabIndex="0" aria-label={isHistory ? "사고 이력 3D 디지털 트윈" : "실시간 3D 디지털 트윈"} />
        <div ref={fallbackRef} className="battery3d-fallback" hidden />

        {status === "ready" && (
          <>
            {isHistory && !remoteFrames.length && !remoteHistoryFailed ? (
              <div className="digital-twin-status">
                <span>사고 이력 불러오는 중...</span>
              </div>
            ) : (
              <div className="digital-twin-status">
                <span>{isHistory ? formatIncidentTime(frameIndex, frames.length) : currentFrame?.scenario_name ?? "실시간 상태"}</span>
                <strong>{currentFrame?.risk_label ?? RISK_LABELS[riskLevel]}</strong>
                <small>최대 셀 {Number(currentFrame?.max_cell_temperature_c ?? 0).toFixed(1)}°C</small>
              </div>
            )}
            {selectedCell && (
              <div className="digital-twin-selection">
                <span>선택 셀</span><strong>{selectedCell.cellId}</strong>
                <small>{selectedCell.temperatureC.toFixed(1)}°C · {selectedCell.riskLabel}</small>
              </div>
            )}
            <div className="digital-twin-legend" aria-label="위험 단계 범례">
              {RISK_LABELS.map((label, level) => <span key={label}><i data-level={level} />{label}</span>)}
            </div>
          </>
        )}
      </div>

      <div className="digital-twin-controls">
        <div className="digital-twin-button-row">
          {VIEW_OPTIONS.map(([view, label]) => (
            <button key={view} type="button" onClick={() => viewerRef.current?.setView(view)} disabled={!available}>{label}</button>
          ))}
          <button type="button" aria-pressed={toggles.vehicle} onClick={() => toggleFeature("vehicle", "toggleVehicle")} disabled={!available}>차량</button>
          <button type="button" aria-pressed={toggles.cover} onClick={() => toggleFeature("cover", "toggleCover")} disabled={!available}>커버</button>
          <button type="button" aria-pressed={toggles.exploded} onClick={() => toggleFeature("exploded", "toggleExploded")} disabled={!available}>분해</button>
          <button type="button" onClick={() => viewerRef.current?.focusHotspot()} disabled={!available}>위험 셀</button>
        </div>

        {isHistory ? (
          <div className="digital-twin-history-control">
            {!remoteFrames.length && remoteHistoryFailed && phases.length > 0 && (
              <div className="digital-twin-phase-list" aria-label="위험 유형별 시연 구간">
                {phases.map((phase) => (
                  <button
                    key={phase.id}
                    type="button"
                    className="digital-twin-phase-button"
                    data-phase={phase.id}
                    aria-pressed={activePhase?.id === phase.id}
                    title={phase.description}
                    onClick={() => {
                      setPlaying(false);
                      setFrameIndex(phase.focusIndex);
                    }}
                    disabled={status !== "ready"}
                  >
                    <strong>{phase.name}</strong>
                    <small>
                      {phase.id === "connector_fault"
                        ? "커넥터 이상만 보기"
                        : phase.id === "battery_internal"
                          ? "배터리 이상만 보기"
                          : "정상 기준 보기"}
                    </small>
                  </button>
                ))}
              </div>
            )}
            <div className="digital-twin-timeline">
              <button type="button" onClick={() => setPlaying((current) => !current)} disabled={status !== "ready"}>{playing ? "일시정지" : "재생"}</button>
              <button type="button" onClick={resetReplay} disabled={status !== "ready"}>초기화</button>
              <input type="range" min="0" max={progressMax} value={Math.min(frameIndex, progressMax)} onChange={(event) => { setPlaying(false); setFrameIndex(Number(event.target.value)); }} disabled={status !== "ready"} aria-label="사고 전후 3시간 재생 위치" />
              <span>{formatIncidentTime(frameIndex, frames.length)}</span>
            </div>
                <div className="digital-twin-time-axis"><span>-3시간</span><span>-2시간</span><span>-1시간</span><strong>사고 발생</strong></div>
          </div>
        ) : (
          <div className="digital-twin-live-summary"><span className="digital-twin-pulse" />1초마다 최신 프레임 반영 <strong>{currentFrame?.timestamp ? new Date(currentFrame.timestamp).toLocaleTimeString("ko-KR") : "--:--:--"}</strong></div>
        )}
      </div>
    </div>
  );
}
