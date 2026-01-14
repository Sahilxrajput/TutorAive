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
        if (!streamRef.current) return;
        streamRef.current.getTracks().forEach(track => track.stop());

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        streamRef.current = null;

        if (screenProducerRef.current) {
            screenProducerRef.current.track?.stop();
            screenProducerRef.current.close();
            screenProducerRef.current = null;
        }
        if (saudioProducerRef.current) {
            saudioProducerRef.current.track?.stop();
            saudioProducerRef.current.close();
            saudioProducerRef.current = null;
        }

        if (camProducerRef.current) {
            camProducerRef.current.track?.stop();
            camProducerRef.current.close();
            camProducerRef.current = null;
        }
        if (micProducerRef.current) {
            micProducerRef.current.track?.stop();
            micProducerRef.current.close();
            micProducerRef.current = null;
        }
        if (!socket) return
        socket.emit("leave:live-session", { roomId: lectureId })
        stop()
    }

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

        if (!producerTransportRef.current || !streamRef.current) return console.log("producerTransport / streamRef Ref doesn't exist")

        micProducerRef.current = await producerTransportRef.current.produce({
            track: streamRef.current.getAudioTracks()[0],
            appData: { mediaTag: 'mic-audio' },
            codecOptions: {
                opusMaxPlaybackRate: 48000,
                opusStereo: true,
            },
            encodings: [{ maxBitrate: 128000 }]
        });

        camProducerRef.current = await producerTransportRef.current.produce({
            track: streamRef.current?.getVideoTracks()[0],
            encodings: [
                {
                    rid: 'low',
                    maxBitrate: 200000,
                    scaleResolutionDownBy: 4,
                    maxFramerate: 15
                },
                {
                    rid: 'medium',
                    maxBitrate: 800000,
                    scaleResolutionDownBy: 2,
                    maxFramerate: 30
                },
                {
                    rid: 'high',
                    maxBitrate: 3500000,
                    maxFramerate: 60
                }
            ],
            codecOptions: { videoGoogleStartBitrate: 2000 },
            appData: { mediaTag: 'cam-video' },
            // track: streamRef.current?.getVideoTracks()[0],
            // encodings: [
            //     {
            //         rid: 'r0',
            //         maxBitrate: 100000,
            //         scalabilityMode: 'S1T3',
            //     },
            //     {
            //         rid: 'r1',
            //         maxBitrate: 300000,
            //         scalabilityMode: 'S1T3',
            //     },
            //     {
            //         rid: 'r2',
            //         maxBitrate: 900000,
            //         scalabilityMode: 'S1T3',
            //     },
            // ],
            // codecOptions: {
            //     videoGoogleStartBitrate: 1000
            // }
        })

        //@note
        camProducerRef.current.on('trackended', () => {
            console.log('track ended')

            // close video track @todo
        })

        camProducerRef.current.on('transportclose', () => {
            console.log('transport ended')

            // close video track @todo
        })
    }


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
                    ref={localVideoRef}
                    isInstructor={true}
                    viewerCount={viewerCount}
                    isCamOff={isCamOff}
                    isSharing={isSharing}
                />

                <button onClick={takePermission}>permission</button>
                <button onClick={start}>start</button>

                <ControlsBar
                    onLeave={leaveRoom}
                    isChatOpen={openChat}
                    isMuted={isMuted}
                    isCamOff={isCamOff}
                    isSharing={isSharing}
                    onToggleMute={toggleMic}
                    onToggleCam={toggleCam}
                    onToggleChat={() => setOpenChat(v => !v)}
                    onToggleShare={() => setIsSharing(v => !v)} //@todo
                />
            </main>

            {openChat && <SidebarTabs />}
        </div>
    );

    // return (
    //     <div className='flex flex-col items-center justify-center gap-12 pt-8'>
    //         <h1>Call SFU MediaSoup</h1>

    //         <div className='flex items-center justify-center gap-16'>
    //             <video
    //                 className='h-75 w-125 border-4 rounded-xl'
    //                 ref={localVideoRef}
    //                 autoPlay
    //                 muted
    //                 playsInline
    //             />

    //             <video ref={remoteVideoRef}
    //                 className='h-75 w-125 border-4 rounded-xl'
    //                 muted
    //             />

    //         </div>

    //         <div className='grid grid-cols-3  gap-16'>
    //             <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={start}>Create</button>
    //             <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={leaveRoom}>Stop</button>
    //             <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={removeConsumer}>remove consumer</button>
    //             <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={toggleMic}>toggleMic</button>
    //             <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={toggleCam}>toggleCam</button>
    //         </div>
    //     </div>
    // );
}

export default LiveTeacherPage;
