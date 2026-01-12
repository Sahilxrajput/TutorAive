import { CreateWorker } from "./worker";
import { mediaCodecs } from "../config/mediasoup";

export async function createRouter() {
  const worker = await CreateWorker();
  const router = await worker.createRouter({
    mediaCodecs,
  });
  return router;
}
