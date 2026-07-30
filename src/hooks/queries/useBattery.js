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
