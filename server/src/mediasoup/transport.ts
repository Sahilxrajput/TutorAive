import { Router } from "mediasoup/node/lib/RouterTypes";
import { webRtcTransport_options } from "../config/mediasoup";

export async function createWebRtcTransport(router: Router) {
  try {
    let transport = await router.createWebRtcTransport(webRtcTransport_options);
    console.log(`transport id: ${transport.id}`);

    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "closed") transport.close();
    });

    transport.on("@close", () => {
      console.log("transport closed");
    });

    return transport;
  } catch (error) {
    console.log("error while createTransport", error);
    return;
  }
}
