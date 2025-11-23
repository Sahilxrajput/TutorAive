import { APIClient } from "@/lib/api";
import type { ITweet } from "@/types/type";

export default new APIClient<ITweet>("/tweets");
