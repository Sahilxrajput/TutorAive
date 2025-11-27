import { toast } from "sonner";

export function notifyError(error: any) {
  const errMsg =
    error?.response?.data?.message || error?.message || "Something went wrong";
  toast.error(errMsg);
}
