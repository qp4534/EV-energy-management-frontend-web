# EV-energy-management-frontend-web

전기차 배터리/충전 관리 플랫폼의 웹 대시보드. 관리자(Administrator)와 관제자(Controller) 두 역할이
같은 앱에서 로그인 후 서로 다른 라우트를 사용한다. React + Vite 기반 SPA이며, [backend](../EV-energy-management-backend)
`/api/*`를 통해서만 데이터를 주고받는다(직접 DB/AI 서비스에 접근하지 않음).

## 기술 스택

| 구분 | 내용 |
|---|---|
| 빌드 도구 | Vite |
| 프레임워크 | React 19, React Router 7 |
| 서버 상태 | TanStack Query (`@tanstack/react-query`) |
| 통신 | axios (`src/api/axios.js`, `baseURL`은 빌드 시 `VITE_API_URL`로 주입 — 배포본은 `/`, 즉 같은 오리진 상대경로) |
| 스타일 | Tailwind CSS 4 |
| 지도 | react-kakao-maps-sdk (Kakao Maps API 키는 빌드 시 GitHub Secret으로 주입) |
| 차트 | recharts |

## 폴더 구조

```
src/
├─ pages/
│  ├─ Auth/            # 로그인, 회원가입, 아이디/비밀번호 찾기
│  ├─ Administrator/   # 관리자 전용 — 배터리 진단/매도 제안서, 공지, 회원/로그 관리, 통계
│  ├─ Controller/       # 관제자 전용 — 차량 지도/대시보드
│  └─ MyPage.jsx, Landing.jsx
├─ components/administrator, controller, common
├─ hooks/queries/       # TanStack Query 훅 (useCar, useBattery 등)
├─ services/            # axios 호출 wrapper
└─ api/axios.js         # axios 인스턴스, baseURL 설정
```

> ⚠️ 관리자/관제 화면은 현재 **같은 배포본** 안에 라우트로만 구분되어 있다(별도 서비스 아님). 인프라
> 단(내부 ALB + VPN)에서는 이 앱을 그대로 재사용해 `admin.mijungev.kro.kr`로도 서빙하지만, 코드 상에서
> 라우트 자체를 네트워크별로 나누고 있지는 않다 — 자세한 내용은 gitops README 참고.

## 로컬 실행

```bash
npm install
npm run dev          # http://localhost:5173, VITE_API_URL 기본값은 axios.js의 fallback(http://localhost:8080)
```

## 배포

GitHub Actions가 Docker 이미지를 빌드해 Docker Hub에 push하고
[gitops](../EV-energy-management-gitops)의 `apps/frontend-eks/deployment.yaml`을 갱신하면
ArgoCD가 자동 반영한다.

- 외부(사용자) 경로: `https://www.mijungev.kro.kr/`
- 내부(관리자/관제 전용, VPN 필요) 경로: `https://admin.mijungev.kro.kr/`
