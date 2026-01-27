"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRtcTransport_options = exports.workerSettings = exports.mediaCodecs = void 0;
exports.mediaCodecs = [
    {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
        // parameters: {
        //   useinbandfec: 1,
        //   stereo: 1,
        // },
    },
    {
        kind: "video",
        mimeType: "video/H264",
        clockRate: 90000,
        parameters: {
            "packetization-mode": 1,
            "profile-level-id": "640c28",
        },
    },
    {
        kind: "video",
        mimeType: "video/H264",
        clockRate: 90000,
        parameters: {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
        },
    },
    {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {
            "x-google-start-bitrate": 1000,
        },
    },
];
exports.workerSettings = {
    rtcMinPort: 40000,
    rtcMaxPort: 41000,
    logLevel: "warn",
    logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"],
};
exports.webRtcTransport_options = {
    listenIps: [
        {
            ip: "0.0.0.0", // replace with relevant IP address
            announcedIp: "127.0.0.1",
        },
    ],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    rtcpFeedback: {
        nack: true,
        pli: true,
        remb: true,
        transportCc: true,
    },
    initialAvailableOutgoingBitrate: 1000000,
    maxIncomingBitrate: 1500000,
    minPort: 40000,
    maxPort: 40999,
    //   maxIncomingBitrate: 5000000,
    //   initialAvailableOutgoingBitrate: 5000000,
};
