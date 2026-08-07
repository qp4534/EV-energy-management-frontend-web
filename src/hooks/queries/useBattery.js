// batteryService 결과를 컴포넌트에 전달
import { useQuery } from "@tanstack/react-query";
import { batteryService } from "@/services/batteryService";

export const useBatteryByCarId = (carId) => {
  return useQuery({
    queryKey: ["battery", carId],
    queryFn: () => batteryService.getBatteryByCarId(carId),
    enabled: !!carId,
  });
};

// BatteryDiagnosis.jsx(/admin/battery "배터리 진단" 탭) 전용.
// carId는 드롭다운 선택만으로는 세팅되지 않고, "진단 실행" 버튼을 눌렀을 때만 상위에서 넘어온다.
export const useBatteryDiagnosisByCarId = (carId) => {
  return useQuery({
    queryKey: ["batteryDiagnosis", carId],
    queryFn: () => batteryService.getDiagnosisByCarId(carId),
    enabled: !!carId,
  });
};

// BatteryDiagnosis.jsx "배터리 매도 제안서" 탭 전용.
// "배터리 진단" 탭과 같은 carId(diagnosedCarId)를 공유해서, 선택한 차량이
// 바뀌면 진단 탭과 매도 제안서 탭이 함께 갱신되게 한다.
export const useProposalByCarId = (carId) => {
  return useQuery({
    queryKey: ["batteryProposal", carId],
    queryFn: () => batteryService.getProposalByCarId(carId),
    enabled: !!carId,
  });
};

// BatteryDiagnosis.jsx "배터리 잔존가치/판매처" 탭 전용. 마찬가지로 진단 탭과
// 같은 carId(diagnosedCarId)를 공유한다.
export const useOffersByCarId = (carId) => {
  return useQuery({
    queryKey: ["batteryOffers", carId],
    queryFn: () => batteryService.getOffersByCarId(carId),
    enabled: !!carId,
  });
};
