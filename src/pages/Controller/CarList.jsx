// NOTE: StatCardList는 이미 만들어져 있고 useCarStats()를 내부에서 직접 호출하는
// 자기완결형 컴포넌트라고 가정해서 props 없이 그냥 배치했습니다.
// 만약 counts를 props로 받는 형태라면 useCarStats()를 여기서 호출해서 넘겨주세요.
import { useState } from "react";
import StatCardList from "@/components/controller/StatCardList";
import CarSearchFilterBar from "@/components/controller/CarList/CarSearchFilterBar";
import CarVehicleList from "@/components/controller/CarList/CarVehicleList";
import Pagination from "@/components/common/Pagination";
import { useCarTableList } from "@/hooks/queries/useCar"; // 실제 프로젝트에서는 "@/hooks/useCar"
import { DEFAULT_CAR_FILTERS, PAGE_SIZE } from "@/constants/carList.constants";

export default function CarList() {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState(DEFAULT_CAR_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // 검색어/필터가 바뀌면 1페이지로 리셋
  const handleSearchTextChange = (text) => {
    setSearchText(text);
    setCurrentPage(1);
  };
  const handleFiltersChange = (next) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const { data, isLoading, isError } = useCarTableList({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: searchText,
    ...filters,
  });

  // TODO: 충전 중단은 아직 API/뮤테이션이 정의되지 않았습니다.
  // 실제 연동 시 useMutation으로 교체하고, 성공 시 ["carTableList"] 쿼리를 invalidate 하세요.
  const stopCharging = (carId) => {
    console.warn("충전 중단 API 미연동:", carId);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <StatCardList />

      <CarSearchFilterBar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="rounded-xl border border-gray-200 bg-white px-4">
        {isError ? (
          <p className="py-10 text-center text-sm text-red-500">
            목록을 불러오지 못했습니다.
          </p>
        ) : (
          <CarVehicleList
            cars={data?.items ?? []}
            isLoading={isLoading}
            onStopCharging={stopCharging}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
