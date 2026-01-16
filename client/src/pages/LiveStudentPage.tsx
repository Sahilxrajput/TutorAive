import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocketContext from "@/hooks/useSocketContext";
import { Device } from "mediasoup-client";
import type { AppData, Consumer, DtlsParameters, RtpParameters, Transport } from "mediasoup-client/types";
import { useParams } from "react-router-dom";
import SidebarTabs from "@/components/classroom/SidebarTabs";
import VideoStage from "@/components/classroom/VideoStage";
import ControlBarForStudent from "./ControlBarForStudent";
import { toast } from "sonner";

const LiveStudentPage = () => {
    const [openChat, setOpenChat] = useState(false)
    const [viewerCount] = useState(42);
    const { user } = useAuth();
    const { socket } = useSocketContext();
    const { lectureId } = useParams<{
        classroomId: string;
        lectureId: string;
    }>();

    const teacherVideoRef = useRef<HTMLVideoElement | null>(null);
    const screenVideoRef = useRef<HTMLVideoElement | null>(null);
    const deviceRef = useRef<Device>(null);
    const consumerTransportRef = useRef<Transport>(null)
    const screenVideoConsumerRef = useRef<Consumer | null>(null);
    const screenAudioConsumerRef = useRef<Consumer | null>(null);
    const [isSharing, setIsSharing] = useState(false);


    function leaveRoom() {
        if (!teacherVideoRef.current || !socket) return;
        socket.emit("leave:live-session", { roomId: lectureId })
        teacherVideoRef.current.srcObject = null;
        teacherVideoRef.current = null;

        if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = null;
            screenVideoRef.current = null;
        }

        if (deviceRef.current) {
            deviceRef.current = null;
        }

        stop()
    }

    function goConnect() {
        return deviceRef.current === null ? joinRoom() : createRecvTransport()
    }

    const joinRoom = async () => {
        try {
            console.log("join fxn called -->")
            if (!socket) {
                console.log("socket not available")
                return
            }
            const { rtpCapabilities } = await socket.emitWithAck('join:live-session', { roomId: lectureId, userId: user?._id, name: user?.firstName })
            console.log("rtpCapabilities : ", rtpCapabilities)

            const device = new Device()
            await device.load({
                routerRtpCapabilities: rtpCapabilities
            })
            deviceRef.current = device
            console.log('Device RTP Capabilities', device.rtpCapabilities)

            await createRecvTransport()

            console.log("========================after transport======================")

        } catch (error: any) {
            console.log(error)
            if (error.name === 'UnsupportedError')
                console.log("browser not supported")
        }
    }

    const createRecvTransport = async () => {
        if (!socket || !deviceRef.current) return console.log("device / socket not available for consumer")

        const downTransport = await socket.emitWithAck('createWebRtcTransport', { isSender: false, roomId: lectureId })
        if (downTransport.error) {
            console.log(downTransport.error)
            return
        }

        console.log("downTransport: ", downTransport)

        const consumerTransport = deviceRef.current.createRecvTransport(downTransport)
        console.log("Recv create consumerTransport : ", consumerTransport)

        consumerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void) => {
            try {
                const res = await socket.emitWithAck('transport-connect', {
                    roomId: lectureId, //@todo
                    transportId: consumerTransport.id,
                    dtlsParameters,
                })

                if (res?.error) {
                    return console.log("tranpsort connect error : ", res.error)
                }
                // producerIdRef.current = res.producerId

                // Tell the transport that parameters were transmitted.
                cb()
            } catch (error) {
                console.log(error)
            }
        })

        consumerTransportRef.current = consumerTransport

        const producers = await socket.emitWithAck('get-producres', { roomId: lectureId })

        for (const producerInfo of producers) {
            console.log("producerInfo : ", producerInfo)
            const producerId = producerInfo.id;
            const appData: AppData = producerInfo.appData;
            await createConsumer(producerId, appData);
        }
    }

    const createConsumer = useCallback(async (producerId: string, appData: AppData) => {
        if (!socket || !deviceRef.current || !consumerTransportRef.current) {
            return console.log("somthing is missing")
        }
        const res: { error?: string, id: string, producerId: string, kind: 'video' | 'audio', rtpParameters: RtpParameters } = await socket.emitWithAck('consume', {
            roomId: lectureId,
            producerId,
            rtpCapabilities: deviceRef.current.rtpCapabilities
        })

        if (res.error) {
            console.log("error while consume", res.error);
            return;
        }

        const recvTransport = consumerTransportRef.current;

        const consumer = await recvTransport.consume(res);
        console.log("consumer ==> ", consumer);
        const { kind } = res;
        const mediatag = appData?.mediaTag;

        // CAM VIDEO 
        if (kind === 'video' && mediatag === "cam-video" && teacherVideoRef.current) {
            const stream = new MediaStream([consumer.track]);
            console.log("video track", consumer.track)
            teacherVideoRef.current.srcObject = stream;
            teacherVideoRef.current.autoplay = true;
            teacherVideoRef.current.playsInline = true;

            teacherVideoRef.current
                .play()
                .then(() => toast.success("video playing"))
                .catch(e => toast.error("play blocked"));

            socket.emit('consumer-resume', {
                consumerId: consumer.id,
                roomId: lectureId
            });
        }

        //  MIC AUDIO
        if (kind === 'audio' && mediatag === "mic-audio") {
            //@check
            const audioEl = document.createElement('audio');
            audioEl.autoplay = true;
            audioEl.srcObject = new MediaStream([consumer.track]);
            audioEl.play().then(() => console.log("audio elm created successfully!")).catch(() => console.debug('audio play blocked'));
            document.body.appendChild(audioEl);
            socket.emit('consumer-resume', { roomId: lectureId, consumerId: consumer.id });
        }

        //   SCREEN VIDEO
        if (kind === "video" && mediatag === "screen-video") {
            screenVideoConsumerRef.current = consumer;
            attachScreenStream();

            // ADD CLEANUP HERE
            consumer.on("transportclose", () => {
                console.log("[screen] producer closed");

                // 1. Clear the video element
                if (screenVideoRef.current) {
                    screenVideoRef.current.pause();
                    screenVideoRef.current.srcObject = null;
                }

                // 2. Reset refs
                screenVideoConsumerRef.current = null;
                screenAudioConsumerRef.current = null;

                // 3. Update UI state
                setIsSharing(false);
            });


            socket.emit("consumer-resume", { roomId: lectureId, consumerId: consumer.id });
            return;
        }

        //   SCREEN AUDIO
        if (kind === "audio" && mediatag === "screen-audio") {
            screenAudioConsumerRef.current = consumer;

            attachScreenStream();

            // ADD CLEANUP HERE
            consumer.on("transportclose", () => {
                console.log("[screen] producer closed");

                // 2. Reset refs
                screenAudioConsumerRef.current = null;

                // 3. Update UI state
                setIsSharing(false);
            });


            socket.emit("consumer-resume", {
                roomId: lectureId,
                consumerId: consumer.id,
            });

            return;
        }



        //@todo
        // consumer.on('transportclose', () => {
        //     consumedProducerIdsRef.current.delete(producerId);
        //     remoteStreams.current.delete(producerId);
        //     assignRemoteStreams();
        // });
    }, [lectureId, socket])

    function attachScreenStream() {
        if (!screenVideoRef.current) {
            console.log("screenVideoRef is not available")
            return;
        }
        if (!screenVideoConsumerRef.current) {
            console.log("screenVideoConsumerRef is not available")
            return;
        }

        console.log("screenVideoConsumerRef: ", screenAudioConsumerRef.current)

        const stream = new MediaStream();
        stream.addTrack(screenVideoConsumerRef.current.track);

        if (screenAudioConsumerRef.current) {
            stream.addTrack(screenAudioConsumerRef.current.track);
        }

        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.muted = false;
        screenVideoRef.current.play().catch(() => { });
        setIsSharing(true); // 🔥 THIS is the trigger
    }

    useEffect(() => {
        if (!socket) return;

        socket.on("new-producer", ({ producerId, appData }) => {
            createConsumer(producerId, appData);
        });

        return () => {
            socket.off("new-producer");
        };
    }, [socket, createConsumer]);



    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
            <main className="flex-1 flex flex-col p-4 gap-4 relative">


                <VideoStage
                    isSharing={isSharing}
                    screenRef={screenVideoRef}
                    videoRef={teacherVideoRef}
                    isInstructor={false}
                    viewerCount={viewerCount}
                />


                <button className="absolute right-1/2 top-12 bg-red-500" onClick={goConnect}>start</button>

                <ControlBarForStudent
                    isChatOpen={openChat}
                    onLeave={leaveRoom}
                    onToggleChat={() => setOpenChat(v => !v)}
                />
            </main>

            {openChat && <SidebarTabs />}
        </div>
    );
};

export default LiveStudentPage;
