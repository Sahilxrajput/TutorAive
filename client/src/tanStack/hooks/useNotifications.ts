import { fetchNotifications } from "@/api/tweets.api";
import { useQuery } from "@tanstack/react-query";

export function useNotifications() {
  return useQuery({
    queryKey: ["NOTi"],
    queryFn: fetchNotifications,
  });
}
