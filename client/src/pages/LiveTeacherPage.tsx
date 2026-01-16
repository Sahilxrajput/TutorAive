import { useEffect, useRef, useState } from 'react'
import { Device } from 'mediasoup-client'
import type {
    AppData,
    DtlsParameters,
    IceCandidate,
    IceParameters,
    MediaKind,
    Producer,
    ProducerCodecOptions,
    RtpCapabilities,
    RtpParameters,
    SctpParameters,
    Transport
} from 'mediasoup-client/types';
import useSocketContext from '@/hooks/useSocketContext';
import useAuth from '@/hooks/useAuth';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import VideoStage from '@/components/classroom/VideoStage';
import ControlsBar from '@/components/classroom/ControlsBar';
import SidebarTabs from '@/components/classroom/SidebarTabs';

const LiveTeacherPage = () => {


    const [isMuted, setIsMuted] = useState(false);
    const [isCamOff, setIsCamOff] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [openChat, setOpenChat] = useState(false)
    const [viewerCount] = useState(42);

    // -------------------------------------------------------
    const { user } = useAuth();
    const { socket, isConnected, } = useSocketContext();
    const { lectureId } = useParams<{
        classroomId: string;
        lectureId: string;
    }>();

    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenVideoRef = useRef<HTMLVideoElement | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const [cam, setCam] = useState<boolean>(true);
    const [mic, setMic] = useState<boolean>(true);
    const producerTransportRef = useRef<Transport>(null)
    const camProducerRef = useRef<Producer>(null);
    const micProducerRef = useRef<Producer>(null);
    const screenProducerRef = useRef<Producer>(null);
    const saudioProducerRef = useRef<Producer>(null);
    const deviceRef = useRef<Device>(null);
    const callIdRef = useRef<string>(null)

    // interface IProducerOptions {
    //     encodings: RTCRtpEncodingParameters[],
    //     codecOptions: ProducerCodecOptions,
    //     track?: MediaStreamTrack
    // }

    // let rtpCapabilities: any;
    // let consumer: Consumer;

    // let params = {
    //     encodings: [
    //         {
    //             rid: 'r0',
    //             maxBitrate: 100000,
    //             scalabilityMode: 'S1T3',
    //         },
    //         {
    //             rid: 'r1',
    //             maxBitrate: 300000,
    //             scalabilityMode: 'S1T3',
    //         },
    //         {
    //             rid: 'r2',
    //             maxBitrate: 900000,
    //             scalabilityMode: 'S1T3',
    //         },
    //     ],
    //     codecOptions: {
    //         videoGoogleStartBitrate: 1000,
    //     },
    // };        

    async function takePermission() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // save stream
        streamRef.current = stream;
        //@todo apply constrain

        // attach stream to video element
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        start()
    }


    async function start() {
        await (deviceRef.current === null ? joinRoom() : createSendTransport())
    }

    async function toggleMic() {
        const micProducer = micProducerRef.current;
        if (!micProducer) return;
        setIsMuted(v => !v)
        if (mic) {
            streamRef.current?.getAudioTracks().forEach(track => track.stop());
            const silentTrack = createSilentAudioTrack();
            if (silentTrack) await micProducer.replaceTrack({ track: silentTrack });
        } else {
            const newMicTrack = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            })
                .then(s => s.getAudioTracks()[0]);
            if (newMicTrack) await micProducer.replaceTrack({ track: newMicTrack });
        }

        setMic(!mic);
    }

    function createSilentAudioTrack() {
        const ctx = new AudioContext();
        const dst = ctx.createMediaStreamDestination();
        const oscillator = ctx.createOscillator();
        oscillator.connect(dst);
        oscillator.frequency.value = 0.0001;
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.05);
        return dst.stream.getAudioTracks()[0];
    }

    function createBlankVideoTrack(width = 1280, height = 720, fps = 30) {
        const canvas = Object.assign(document.createElement('canvas'), { width, height });
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        function draw() {
            if (ctx) {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, width, height);
                requestAnimationFrame(draw);
            }
        }
        draw();

        const stream = canvas.captureStream(fps);
        return stream.getVideoTracks()[0];
    }

    async function toggleCam() {
        const camProducer = camProducerRef.current;
        if (!camProducer) return;
        setIsCamOff(v => !v)
        if (cam) {
            streamRef.current?.getVideoTracks().forEach(track => track.stop());
            const blankTrack = createBlankVideoTrack();
            if (blankTrack) await camProducer.replaceTrack({ track: blankTrack });
            if (blankTrack && localVideoRef.current) {
                localVideoRef.current.srcObject = new MediaStream([blankTrack]);
            }
            streamRef.current = null;
        }
        else {
            const newCamStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1920, height: 1080, frameRate: { min: 30, ideal: 60 }, facingMode: "user" }
            });
            const localVideoTrack = newCamStream.getVideoTracks()[0];
            if (localVideoTrack) {
                await localVideoTrack.applyConstraints({
                    width: 1920,
                    height: 1080,
                    frameRate: 60
                }).catch(err => console.warn("applyConstraints failed:", err));
            }
            const newCamTrack = newCamStream.getVideoTracks()[0];
            if (newCamTrack) await camProducer.replaceTrack({ track: newCamTrack });
            if (localVideoRef.current && newCamTrack) {
                localVideoRef.current.srcObject = new MediaStream([newCamTrack]);
            }
            streamRef.current = newCamStream;
        }
        setCam(!cam);
    }
    
    const leaveRoom = () => {
        if (!socket) return;

        // 1. Notify server FIRST
        socket.emit("leave:live-session", { roomId: lectureId });

        // 2. Stop screen share cleanly
        stopScreenShare();

        // 3. Close producers (DO NOT stop tracks here)
        if (camProducerRef.current) {
            camProducerRef.current.close();
            camProducerRef.current = null;
        }

        if (micProducerRef.current) {
            micProducerRef.current.close();
            micProducerRef.current = null;
        }

        // 4. Stop local media tracks ONCE
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // 5. Clear video element
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        // 6. Reset device if you plan to rejoin
        deviceRef.current = null;

        // 7. Stop client-side consumers / listeners
        stop();
    };


    const joinRoom = async () => {
        try {
            if (!socket) return

            // @todo room id
            const { rtpCapabilities, producers } = await socket.emitWithAck('join:live-session', { roomId: lectureId, userId: user?._id, name: user?.firstName })
            console.log("rtpCapabilities : ", rtpCapabilities)

            const device = new Device()
            await device.load({
                routerRtpCapabilities: rtpCapabilities
            })
            deviceRef.current = device
            console.log('Device RTP Capabilities', device.rtpCapabilities)

            await createSendTransport()

            console.log("========================after transport======================")
        } catch (error: any) {
            console.log(error)
            if (error.name === 'UnsupportedError')
                console.log("browser not supported")
        }
    }

    // interface ITransportOptions {
    //     iceParameters: IceParameters,
    //     iceCandidates: IceCandidate[],
    //     dtlsParameters: DtlsParameters,
    //     sctpParameters: SctpParameters,
    //     error: any
    // }

    // interface ITransportProduceParameters{
    //     kind:MediaKind,
    //     rtpSendParameters: RtpSendParameters,
    //     appData:{}
    // }

    const enterFullScreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    };

    const createSendTransport = async () => {
        if (!socket) return

        const upTransport = await socket.emitWithAck('createWebRtcTransport', { isSender: true, roomId: lectureId })
        if (upTransport.error) {
            console.log(upTransport.error)
            return
        }

        console.log("uptransport: ", upTransport)

        if (!deviceRef.current) return console.log("device not found")
        const producerTransport = deviceRef.current.createSendTransport(upTransport); //@remind ? think should i pass a new object with param properties


        producerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void) => {
            try {
                const res = await socket.emitWithAck('transport-connect', {
                    roomId: lectureId,
                    transportId: producerTransport.id,
                    dtlsParameters,
                })

                if (res?.error) {
                    return console.log("tranpsort connect error : ", res.error)
                }
                //@todo Tell the transport that parameters were transmitted.
                cb()
            } catch (error) {
                console.log(error)
            }
        })

        producerTransport.on('produce', async ({ kind, rtpParameters, appData }: { appData: AppData, rtpParameters: RtpParameters, kind: MediaKind }, cb: ({ id }: { id: string }) => void) => {
            console.log("produce parameters :", { kind, rtpParameters, appData });

            try {
                const { id, error } = await socket.emitWithAck('transport-produce', {
                    roomId: lectureId,
                    kind,
                    transportId: producerTransport.id,
                    rtpParameters,
                    appData,
                });

                if (error) return console.log("error : ", error)

                console.log("return id : ", id)
                cb(id)
            } catch (error) {
                console.log(error)
            }
        })

        producerTransportRef.current = producerTransport;
        connectSendTransport()
    }

    const connectSendTransport = async () => {
        if (!producerTransportRef.current || !streamRef.current) {
            console.log("producerTransport / streamRef missing");
            return;
        }

        // MIC
        const micTrack = streamRef.current.getAudioTracks()[0];
        if (micTrack) {
            micProducerRef.current = await producerTransportRef.current.produce({
                track: micTrack,
                appData: { mediaTag: "mic-audio" },
                codecOptions: {
                    opusMaxPlaybackRate: 48000,
                    opusStereo: true,
                },
                encodings: [{ maxBitrate: 128000 }],
            });
        }

        // CAM
        const camTrack = streamRef.current.getVideoTracks()[0];
        if (camTrack) {
            camProducerRef.current = await producerTransportRef.current.produce({
                track: camTrack,
                appData: { mediaTag: "cam-video" },
                encodings: [
                    { rid: "low", maxBitrate: 200000, scaleResolutionDownBy: 4, maxFramerate: 15 },
                    { rid: "medium", maxBitrate: 800000, scaleResolutionDownBy: 2, maxFramerate: 30 },
                    { rid: "high", maxBitrate: 3500000, maxFramerate: 60 },
                ],
                codecOptions: { videoGoogleStartBitrate: 2000 },
            });

            camProducerRef.current.on("trackended", () => {
                console.log("[cam] track ended");
            });

            camProducerRef.current.on("transportclose", () => {
                console.log("[cam] transport closed");
            });
        }
    };

    const startScreenShare = async () => {
        if (!producerTransportRef.current) return;
        setIsSharing(true)

        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: 1920, height: 1080, frameRate: { ideal: 60, max: 60 }, displaySurface: 'monitor' },
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false, sampleRate: 48000 }
        });

        screenStreamRef.current = screenStream;

        // attach stream to video element
        if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screenStream;
        }

        const screenVideoTrack = screenStream.getVideoTracks()[0];
        let screenAudioTrack = screenStream.getAudioTracks()[0];


        if (screenVideoTrack) {
            await screenVideoTrack.applyConstraints({
                width: 1920,
                height: 1080,
                frameRate: { ideal: 60, max: 60 },
            }).catch(err => console.warn("applyConstraints failed:", err));
        }
        if (!producerTransportRef.current) {
            console.warn('Send transport not available.');
            screenStream.getTracks().forEach(track => track.stop());
            return;
        }

        // to handle run time error when peer just cancel or deny from sharing screen
        if (!screenAudioTrack) {
            screenAudioTrack = createSilentAudioTrack();
        }

        // IMPORTANT: detect manual stop
        if (screenVideoTrack) {
            screenVideoTrack.onended = () => {
                stopScreenShare();
            };
        }

        // IMPORTANT: detect manual stop
        if (screenAudioTrack) {
            screenAudioTrack.onended = () => {
                stopScreenShare();
            };
        }

        // SCREEN VIDEO
        if (screenVideoTrack) {
            screenProducerRef.current = await producerTransportRef.current.produce({
                track: screenVideoTrack,
                encodings: [
                    {
                        maxBitrate: 4_000_000,
                        maxFramerate: 30,
                        priority: 'high',
                        networkPriority: 'high',
                        scaleResolutionDownBy: 1,
                    }
                ],
                codecOptions: {
                    videoGoogleStartBitrate: 2000,
                    videoGoogleMaxBitrate: 4000,
                    videoGoogleMinBitrate: 1000,
                },
                appData: { mediaTag: 'screen-video' },
            });

            screenProducerRef.current.on('trackended', () => startScreenShare());
        }

        // SCREEN AUDIO 
        if (screenAudioTrack) {
            saudioProducerRef.current = await producerTransportRef.current.produce({
                track: screenAudioTrack,
                appData: { mediaTag: "screen-audio" },
                codecOptions: {
                    opusMaxPlaybackRate: 48000,
                    opusStereo: true,
                },
                encodings: [{ maxBitrate: 128000 }]
            });
            saudioProducerRef.current.on('trackended', () => startScreenShare());
        }
    }

    const stopScreenShare = () => {
        // If screen was never started, do nothing
        if (!screenProducerRef.current && !screenStreamRef.current) return;
        setIsSharing(false)
        console.log("[screen] stopped");

        // 1. Notify server FIRST
        if (socket) {
            socket.emit("stop-screen-share", { roomId: lectureId });
            setIsSharing(false)
        }

        // detach stream to video element
        if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = null;
        }

        // 2. Close producers
        if (screenProducerRef.current) {
            screenProducerRef.current.close();
            screenProducerRef.current = null;
        }

        if (saudioProducerRef.current) {
            saudioProducerRef.current.close();
            saudioProducerRef.current = null;
        }

        // 3. Stop tracks
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(t => t.stop());
            screenStreamRef.current = null;
        }
    };


    // useEffect(() => {
    //     if (!socket || !isConnected) return;

    //     // future socket logic here
    //     socket.on('connection-success', ({ socketId, existsProducer }) => {
    //         console.log(socketId, existsProducer)
    //     })

    //     socket.on("peer-joined", ({ name }: {
    //         name: string,
    //     }) => {
    //         console.log(name)
    //         toast.info(`${name} joined session`)
    //     })

    // }, [socket, isConnected]);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
            <main className="flex-1 flex flex-col p-4 gap-4 relative">
                <VideoStage
                    videoRef={localVideoRef}
                    screenRef={screenVideoRef}
                    isInstructor={true}
                    viewerCount={viewerCount}
                    isCamOff={isCamOff}
                    isSharing={isSharing}
                />

                {/* <button className='absolute bg-red-500 top-12 left-1/2' onClick={takePermission}>permission</button> */}
                <button className='absolute bg-red-500 top-12 left-1/3 ' onClick={takePermission}>start</button>

                <ControlsBar
                    onLeave={leaveRoom}
                    isChatOpen={openChat}
                    isMuted={isMuted}
                    isCamOff={isCamOff}
                    isSharing={isSharing}
                    onToggleMute={toggleMic}
                    onToggleCam={toggleCam}
                    onToggleChat={() => setOpenChat(v => !v)}
                    onToggleShare={() => isSharing ? stopScreenShare() : startScreenShare()} //@todo
                />
            </main>

            {openChat && <SidebarTabs isTeacher={!!user && user.role === "instructor"} />}
        </div>
    );
}

export default LiveTeacherPage;
