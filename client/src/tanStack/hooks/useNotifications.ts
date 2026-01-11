import { fetchNotifications } from "@/api/tweets.api";
import { useQuery } from "@tanstack/react-query";
import {CACHE_KEY_NOTIFICATIONS} from "../constants"

export function useNotifications() {
  return useQuery({
    queryKey: CACHE_KEY_NOTIFICATIONS,
    queryFn: fetchNotifications,
  });
}
