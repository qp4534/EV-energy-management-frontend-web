# 차량 Twin 온도 표시 경로 수정 리뷰

## 1. 결론

배터리 여권의 `currentTemp`와 실시간 Twin 온도가 섞이던 문제를 제거했다. 차량 상세 화면의
현재 온도는 해당 차량의 최신 Twin 프레임에서만 가져오며, 사고 안전보고서는 해당
`anomaly_id`에 연결된 과거 Twin 프레임만 사용한다.

화면의 최종 표시 규칙은 다음과 같다.

- 최신 Twin 데이터: `78.2°C`처럼 현재 최고 셀 온도 표시
- stale Twin 데이터: 온도 수치를 숨기고 `데이터 지연`과 마지막 측정 시각 표시
- Twin 데이터 없음: `측정 데이터 없음` 표시
- 어떤 경우에도 `BATTERY_PASSPORT.currentTemp`나 다른 차량의 첫 번째 데이터로 대체하지 않음

## 2. 저장소별 변경사항

### FastAPI `dev_ch`

- `GET /api/v1/twins/vehicles/{vehicle_id}/latest/measurement` 추가
- Redis의 해당 차량 최신 Twin 프레임에서 최고/평균 셀 온도, 전압, 위험도와 stale 여부 계산
- 안전보고서는 `tf.anomaly_id = a.anomaly_id`인 프레임 중 감지 시각과 가장 가까운 프레임 사용
- 보고서용 과거 온도가 없을 때 배터리 여권 온도로 대체하지 않음
- 시연기의 `car-uuid-001` mock 식별자를 제거하고 RDS `CAR.car_id` 실제 UUID 10개에 프로필 결합
- 필요 시 `TWIN_DEMO_VEHICLE_IDS` 또는 `--vehicle-ids`로 시연 차량 UUID 고정 가능

### Spring Backend `dev_ch`

- `GET /api/battery-passports/car/{carId}`로 해당 차량 여권을 정확히 조회
- `GET /api/twin-frames/cars/{carId}/latest-measurement`로 FastAPI 최신 측정값을 프록시
- FastAPI의 snake_case 응답은 `@JsonAlias`로 수신하고 프론트에는 camelCase로 직렬화
- FastAPI 404는 404, 연결 실패는 502로 구분
- FastAPI 호출에 연결·읽기 timeout 적용

### Frontend `dev_ch`

- `batteries[0]` fallback 제거
- 여권 정적 Query와 Twin 실시간 Query 분리
- 여권 Query는 5분 `staleTime`으로 캐시하고 Twin Query만 1초 polling
- `maxCellTemperatureC`, `observedAt`, `isStale`, `ageSeconds` 계약 사용
- stale 데이터는 현재 온도로 표시하지 않고 마지막 측정 일시와 경과시간 표시

## 3. 최종 데이터 흐름

1. FastAPI가 실제 `CAR.car_id` UUID로 들어온 센서 프레임을 Redis에 최신값으로 저장한다.
2. 프론트가 Spring에 해당 차량 UUID의 여권과 최신 Twin 측정값을 각각 요청한다.
3. Spring은 여권은 RDS에서, 실시간 측정값은 FastAPI에서 받아 camelCase JSON으로 반환한다.
4. 프론트는 여권을 캐시하고 Twin만 1초마다 갱신한다.
5. 사고 보고서는 현재 Redis 값이 아니라 사고의 `anomaly_id`에 연결된 과거 Twin 프레임을 사용한다.

## 4. 검증 결과

- FastAPI 전체 테스트: `125 passed`
- Spring 변경 단위 테스트: 성공 (`BUILD SUCCESSFUL`)
- Frontend 변경 파일 ESLint: 통과
- Frontend production build: 통과
- 세 저장소 `git diff --check`: 통과

## 5. 배포 전 확인사항과 한계

- FastAPI, Backend, Frontend의 `dev_ch` 변경을 같은 배포에 함께 반영해야 한다.
- Backend의 `FASTAPI_BASE_URL`이 실제 FastAPI 서비스 주소를 가리켜야 한다.
- Redis에 해당 실제 차량 UUID의 최신 프레임이 있어야 화면에 온도가 표시된다.
- RDS 자동 선택 대신 특정 시연 차량을 고정하려면 `TWIN_DEMO_VEHICLE_IDS`를 설정한다.
- 저장소 기존 문제로 Backend 전체 테스트와 Frontend 전체 lint는 아직 완전 green이 아니다.
- 로컬 계약·빌드는 검증했지만, 실제 배포 환경의 FE→BE→FastAPI→Redis 종단 간 화면 확인은 별도로 필요하다.

AI 이상보고서의 온도 출처 분리는 통과로 판단한다. 이번 수정은 데이터 출처와 화면 계약을
바로잡은 것이며, 열폭주 모델 자체의 성능이나 실제 차량 안전 인증 수준을 변경하는 작업은 아니다.
