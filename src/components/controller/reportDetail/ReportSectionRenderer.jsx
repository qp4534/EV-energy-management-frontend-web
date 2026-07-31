import { REPORT_SECTION_TYPES } from "@/constants/report.constants";
import SummarySection from "./SummarySection";
import MetricGridSection from "./MetricGridSection";
import LineChartSection from "./LineChartSection";
import NumberedListSection from "./NumberedListSection";
import BulletListSection from "./BulletListSection";

const SECTION_COMPONENT = {
  [REPORT_SECTION_TYPES.SUMMARY]: SummarySection,
  [REPORT_SECTION_TYPES.METRIC_GRID]: MetricGridSection,
  [REPORT_SECTION_TYPES.LINE_CHART]: LineChartSection,
  [REPORT_SECTION_TYPES.NUMBERED_LIST]: NumberedListSection,
  [REPORT_SECTION_TYPES.BULLET_LIST]: BulletListSection,
};

export default function ReportSectionRenderer({ section }) {
  const SectionComponent = SECTION_COMPONENT[section.type];
  if (!SectionComponent) return null;
  return <SectionComponent section={section} />;
}
