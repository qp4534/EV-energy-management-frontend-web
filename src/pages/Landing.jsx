import React from "react";
import { Flame, BatteryCharging, Car } from "lucide-react";

import HeroSection from "../components/landing/HeroSection";
import FeatureCard from "../components/landing/FeatureCard";
import SectionHeader from "../components/landing/SectionHeader";
import NoticePreviewList from "../components/landing/NoticePreviewList";
import LandingFooter from "../components/landing/LandingFooter";
import "../styles/Landing.css";

import { MOCK_LANDING_NOTICES } from "../mocks/landingNoticeMock";

// 특징 소개 카드 3종 (재사용 가능한 FeatureCard에 넘겨줄 데이터)
const FEATURES = [
  {
    icon: <Flame size={26} />,
    title: "화재 이상 감지",
    description: "열화상 카메라 기반 실시간 이상 온도 탐지",
  },
  {
    icon: <BatteryCharging size={26} />,
    title: "배터리 진단",
    description: "SOH 예측으로 배터리 수명 관리",
  },
  {
    icon: <Car size={26} />,
    title: "4단계 경보",
    description: "정상/주의/경고/긴급 단계별 대응",
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <HeroSection />

      <div className="landing-container">
        <section className="feature-grid">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </section>

        <section className="landing-notice-section">
          <SectionHeader title="공지사항" linkTo="/admin/notices" />
          <NoticePreviewList notices={MOCK_LANDING_NOTICES} limit={3} />
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}
