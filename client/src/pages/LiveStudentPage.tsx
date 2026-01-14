import { useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import useSocketContext from "@/hooks/useSocketContext";
import { Device } from "mediasoup-client";
import type { AppData, DtlsParameters, RtpParameters, Transport } from "mediasoup-client/types";
import { useParams } from "react-router-dom";
import ControlsBar from "@/components/classroom/ControlsBar";
import SidebarTabs from "@/components/classroom/SidebarTabs";
import VideoStage from "@/components/classroom/VideoStage";
import ControlBarForStudent from "./controlBarForStudent";

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
    const deviceRef = useRef<Device>(null);
    const consumerTransportRef = useRef<Transport>(null)



    function leaveRoom() {
        if (!teacherVideoRef.current || !socket) return;
        socket.emit("leave:live-session", { roomId: lectureId })
        teacherVideoRef.current.srcObject = null;
        teacherVideoRef.current = null;
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
            // @todo room id
            const { rtpCapabilities, producers } = await socket.emitWithAck('join:live-session', { roomId: lectureId, userId: user?._id, name: user?.firstName })
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

        console.log("producers : ", producers)

        for (const producerInfo of producers) {
            // console.log("producerInfo : ", producerInfo)
            const producerId = producerInfo.id;
            // const appData: AppData = producerInfo.appData;
            await createConsumer(producerId);
        }
    }

    async function createConsumer(producerId: string, appData?: AppData) {
        if (!socket || !deviceRef.current || !consumerTransportRef.current) {
            return console.log("somthing is missing")
        }
        const res: { error?: string, id: string, producerId: string, kind: 'video' | 'audio', rtpParameters: RtpParameters } = await socket.emitWithAck('consume', {
            roomId: lectureId,
            producerId,
            rtpCapabilities: deviceRef.current.rtpCapabilities
        })

        if (res.error) return console.log("error while consume", res.error);

        console.log("Consume ITransportOptions :", res)
        if (!consumerTransportRef.current) return console.log("consumerRef not exist")

        const recvTransport = consumerTransportRef.current;
        if (!recvTransport) return;

        const consumer = await recvTransport.consume(res);
        console.log("consumer ==> ", consumer);

        if (res.kind === 'video' && teacherVideoRef.current) {
            const stream = new MediaStream([consumer.track]);

            teacherVideoRef.current.srcObject = stream;
            teacherVideoRef.current.autoplay = true;
            teacherVideoRef.current.playsInline = true;

            teacherVideoRef.current
                .play()
                .then(() => console.log("video playing"))
                .catch(e => console.log("play blocked", e));

            socket.emit('consumer-resume', {
                consumerId: consumer.id,
                roomId: lectureId
            });
        } else if (res.kind === 'audio') {
            //@check
            const audioEl = document.createElement('audio');
            audioEl.autoplay = true;
            audioEl.srcObject = new MediaStream([consumer.track]);
            // audioEl.controls = true;
            audioEl.play().then(() => console.log("audio elm created successfully!")).catch(() => console.debug('audio play blocked'));
            document.body.appendChild(audioEl);
            socket.emit('consumer-resume', { roomId: lectureId, consumerId: consumer.id });
        }

        //@todo
        // consumer.on('transportclose', () => {
        //     consumedProducerIdsRef.current.delete(producerId);
        //     remoteStreams.current.delete(producerId);
        //     assignRemoteStreams();
        // });
    }


    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
            <main className="flex-1 flex flex-col p-4 gap-4 relative">


                <VideoStage
                    ref={teacherVideoRef}
                    isInstructor={false}
                    viewerCount={viewerCount}
                />

                <button onClick={goConnect}>start</button>

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
