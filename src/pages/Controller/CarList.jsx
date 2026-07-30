import { useState } from "react";
import StatCardList from "@/components/controller/StatCardList";
import SearchFilterBar from "@/components/common/SearchFilterBar";
import CarFilterPanel from "@/components/controller/carList/CarFilterPanel";
import CarVehicleList from "@/components/controller/carList/CarVehicleList";
import Pagination from "@/components/common/Pagination";
import { useCarTableList } from "@/hooks/queries/useCar";
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

  const stopCharging = (carId) => {
    console.warn("충전 중단 API 미연동:", carId);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <StatCardList />

      <SearchFilterBar
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
        placeholder="차량번호 검색"
      >
        {({ close }) => (
          <CarFilterPanel
            initialFilters={filters}
            onApply={(next) => {
              handleFiltersChange(next);
              close();
            }}
          />
        )}
      </SearchFilterBar>

      <div className="card">
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
