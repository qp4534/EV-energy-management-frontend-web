import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useDailyDangerCarCount } from "@/hooks/queries/useCar";

export default function ChartCard() {
  const { data: chartData, isLoading, isError } = useDailyDangerCarCount();
  const maxCount = Math.max(1, ...(chartData ?? []).map((item) => item.count));
  const yAxisMax = Math.ceil(maxCount / 5) * 5;

  if (isLoading) {
    return (
      <div className="card h-[320px] flex items-center justify-center">
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card h-[320px] flex items-center justify-center">
        <p className="text-red-500">데이터를 불러오지 못했습니다.</p>
      </div>
    );
  }

  return (
    <div className="card flex flex-col gap-2">
      <h2>최근 위험 차량 수</h2>

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            {/* 회색 격자선 */}
            <CartesianGrid stroke="#E2E6D8" vertical={true} horizontal={true} />

            {/* X축 */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "#B0B0B0" }}
              tick={{ fill: "#555555", fontSize: 13 }}
            />

            {/* Y축 */}
            <YAxis
              domain={[0, yAxisMax]}
              allowDecimals={false}
              tickLine={false}
              axisLine={{ stroke: "#B0B0B0" }}
              tick={{ fill: "#555555", fontSize: 13 }}
            />

            {/* 마우스 호버 툴팁 */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #E2E6D8",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value} 대`, "위험 차량"]}
            />

            {/* 진한 초록색 꺾은선 (이미지 색상 반영) */}
            <Line
              type="linear"
              dataKey="count"
              stroke="#1C4532"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#1C4532" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
