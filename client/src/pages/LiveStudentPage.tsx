import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocketContext from "@/hooks/useSocketContext";
import { Device } from "mediasoup-client";
import type { AppData, Consumer, DtlsParameters, RtpCapabilities, RtpParameters, Transport } from "mediasoup-client/types";
import { useNavigate, useParams } from "react-router-dom";
import SidebarTabs from "@/components/classroom/SidebarTabs";
import VideoStage from "@/components/classroom/VideoStage";
import ControlBarForStudent from "./ControlBarForStudent";
import { toast } from "sonner";


interface IJoinRoom {
    rtpCapabilities: RtpCapabilities,
    error?: string
}

const LiveStudentPage = () => {
    const [openChat, setOpenChat] = useState(false)
    const [viewerCount] = useState(42);
    const { user, isInstructor } = useAuth();
    const { socket } = useSocketContext();
    const { lectureId } = useParams<{
        classroomId: string;
        lectureId: string;
    }>();

    const teacherVideoRef = useRef<HTMLVideoElement | null>(null);
    const screenVideoRef = useRef<HTMLVideoElement | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const deviceRef = useRef<Device>(null);
    const consumerTransportRef = useRef<Transport>(null)
    const screenVideoConsumerRef = useRef<Consumer | null>(null);
    const screenAudioConsumerRef = useRef<Consumer | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        goConnect()
    }, [])


    const clearStram = () => {
        if (!teacherVideoRef.current) return
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

    function leaveRoom() {
        if (!socket) return;
        socket.emit("leave:live-session")
        // navigate("/")
        clearStram()
    }

    function goConnect() {
        return deviceRef.current === null ? joinRoom() : createRecvTransport()
    }

    const joinRoom = async () => {
        try {
            if (!socket) {
                return
            }

            const Payload = {
                roomId: lectureId,
                userId: user?._id,
                name: user?.firstName
            }

            const { rtpCapabilities, error }: IJoinRoom = await socket.emitWithAck('join:live-session', Payload)

            if (error) {
                toast.error(error)
                navigate("/")
                return
            }

            const device = new Device()
            await device.load({
                routerRtpCapabilities: rtpCapabilities
            })
            deviceRef.current = device

            await createRecvTransport()


        } catch (error: any) {
            if (error.name === 'UnsupportedError')
                toast.error("browser not supported")
        }
    }

    const createRecvTransport = async () => {
        if (!socket || !deviceRef.current) return 

        const downTransport = await socket.emitWithAck('createWebRtcTransport', { isSender: false, roomId: lectureId })
        if (downTransport.error) {
            return
        }


        const consumerTransport = deviceRef.current.createRecvTransport(downTransport)

        consumerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void) => {
            try {
                const res = await socket.emitWithAck('transport-connect', {
                    roomId: lectureId, //@todo
                    transportId: consumerTransport.id,
                    dtlsParameters,
                })

                if (res?.error) {
                    return
                }
                // producerIdRef.current = res.producerId

                // Tell the transport that parameters were transmitted.
                cb()
            } catch  {
                // console.log(error)
            }
        })

        consumerTransportRef.current = consumerTransport

        const producers = await socket.emitWithAck('get-producres', { roomId: lectureId })

        for (const producerInfo of producers) {
            const producerId = producerInfo.id;
            const appData: AppData = producerInfo.appData;
            await createConsumer(producerId, appData);
        }
    }

    const createConsumer = useCallback(async (producerId: string, appData: AppData) => {
        if (!socket || !deviceRef.current || !consumerTransportRef.current) {
            return
        }
        const res: { error?: string, id: string, producerId: string, kind: 'video' | 'audio', rtpParameters: RtpParameters } = await socket.emitWithAck('consume', {
            roomId: lectureId,
            producerId,
            rtpCapabilities: deviceRef.current.rtpCapabilities
        })

        if (res.error) {
            return;
        }

        const recvTransport = consumerTransportRef.current;

        const consumer = await recvTransport.consume(res);
        const { kind } = res;
        const mediatag = appData?.mediaTag;

        // CAM VIDEO 
        if (kind === 'video' && mediatag === "cam-video" && teacherVideoRef.current) {
            const stream = new MediaStream([consumer.track]);
            teacherVideoRef.current.srcObject = stream;
            teacherVideoRef.current.autoplay = true;
            teacherVideoRef.current.playsInline = true;

            teacherVideoRef.current
                .play()

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
            audioEl.play()
            // .then(() => console.log("audio elm created successfully!")).catch(() => console.debug('audio play blocked'));
            document.body.appendChild(audioEl);
            socket.emit('consumer-resume', { roomId: lectureId, consumerId: consumer.id });
        }

        //   SCREEN VIDEO
        if (kind === "video" && mediatag === "screen-video") {
            screenVideoConsumerRef.current = consumer;
            attachScreenStream();

            // ADD CLEANUP HERE
            consumer.on("transportclose", () => {

                // 1. Clear the video element
                if (screenVideoRef.current) {
                    screenVideoRef.current.pause();
                    screenVideoRef.current.srcObject = null;
                }

                // 2. Reset refs
                screenVideoConsumerRef.current = null;
                screenAudioConsumerRef.current = null;

                // 3. Update UI state
                setIsScreenSharing(false);
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

                // 2. Reset refs
                screenAudioConsumerRef.current = null;

                // 3. Update UI state
                setIsScreenSharing(false);
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
        if (!screenVideoConsumerRef.current) {
            return;
        }

        setIsScreenSharing(true);

        const stream = new MediaStream();
        stream.addTrack(screenVideoConsumerRef.current.track);

        if (screenAudioConsumerRef.current) {
            stream.addTrack(screenAudioConsumerRef.current.track);
        }
        screenStreamRef.current = stream;

        setIsScreenSharing(true);

    }

    useEffect(() => {
        if (!isScreenSharing) return;
        if (!screenVideoRef.current) return;
        if (!screenStreamRef.current) return;

        screenVideoRef.current.srcObject = screenStreamRef.current;
        screenVideoRef.current.muted = false;

        screenVideoRef.current.play().catch(() => { });
    }, [isScreenSharing]);


    useEffect(() => {
        if (!socket) return;

        socket.on("new-producer", ({ producerId, appData }) => {
            createConsumer(producerId, appData);
        });

        socket.on("live-session:closed", () => {
            clearStram()
        })

        return () => {
            socket.off("new-producer");
        };
    }, [socket, createConsumer]);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
            <main className="flex-1 flex flex-col gap-4 relative">

                <VideoStage
                    isScreenSharing={isScreenSharing}
                    screenRef={screenVideoRef}
                    videoRef={teacherVideoRef}
                    isInstructor={false}
                    viewerCount={viewerCount}
                />

                <ControlBarForStudent
                    isChatOpen={openChat}
                    onLeave={leaveRoom}
                    onToggleChat={() => setOpenChat(v => !v)}
                />

            </main>

            {openChat && <SidebarTabs isTeacher={isInstructor} />}
        </div>
    );
};

export default LiveStudentPage;
