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

const Call = () => {

    const { user } = useAuth();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cam, setCam] = useState<boolean>(true);
    const [mic, setMic] = useState<boolean>(true);
    const { socket, isConnected, } = useSocketContext();
    const producerTransportRef = useRef<Transport>(null)
    const consumerTransportRef = useRef<Transport>(null)
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
    let isProducer: boolean = false;

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

    const removeConsumer = () => {
        if (!socket) return
        socket.emit("leave:live-session", { roomId: 123 })
        stop()
    }

    async function start() {
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

        goConnect(true)
    }

    function copyIdToClipboard() {
        if (callIdRef.current) {
            navigator.clipboard.writeText(callIdRef.current).then(() => {
                // setIdCopied(true);
                // setTimeout(() => setIdCopied(false), 2000);
            });
        }
    }

    function copyUrlToClipboard() {
        const url = window.location.pathname
        console.log("url: ", url)
        const urlToCopy = `${import.meta.env.VITE_API_URL}/${url}`
        navigator.clipboard.writeText(urlToCopy).then(() => {
            // setUrlCopied(true);
            // setTimeout(() => setUrlCopied(false), 2000);
        });
    }

    async function toggleMic() {
        const micProducer = micProducerRef.current;
        if (!micProducer) return;
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

    function leaveRoom() {
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
    }

    function goConsume() {
        goConnect(false)
    }

    function goConnect(producer: boolean) {
        isProducer = producer
        return deviceRef.current === null ? joinRoom(producer) : createTransport()
    }

    const mute = () => {
        if (localVideoRef.current) {
            localVideoRef.current.muted = true;
            // localVideoRef.current.volume = 1.0;
        }
    };


    async function createConsumer(producerId: string, appData?: AppData) {
        if (!socket || !deviceRef.current || !consumerTransportRef.current) {
            return console.log("somthing is missing")
        }
        const res: { error?: string, id: string, producerId: string, kind: 'video' | 'audio', rtpParameters: RtpParameters } = await socket.emitWithAck('consume', {
            roomId: 123,
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

        if (res.kind === 'video' && remoteVideoRef.current) {
            const stream = new MediaStream([consumer.track]);

            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.autoplay = true;
            remoteVideoRef.current.playsInline = true;

            remoteVideoRef.current
                .play()
                .then(() => console.log("video playing"))
                .catch(e => console.log("play blocked", e));

            socket.emit('consumer-resume', {
                consumerId: consumer.id,
                roomId: 123
            });
        } else if (res.kind === 'audio') {
            //@check
            const audioEl = document.createElement('audio');
            audioEl.autoplay = true;
            audioEl.srcObject = new MediaStream([consumer.track]);
            // audioEl.controls = true;
            audioEl.play().then(() => console.log("audio elm created successfully!")).catch(() => console.debug('audio play blocked'));
            document.body.appendChild(audioEl);
            socket.emit('consumer-resume', { roomId: 123, consumerId: consumer.id });
        }

        //@todo
        // consumer.on('transportclose', () => {
        //     consumedProducerIdsRef.current.delete(producerId);
        //     remoteStreams.current.delete(producerId);
        //     assignRemoteStreams();
        // });
    }

    //same fxn steps
    const joinRoom = async () => {
        try {
            console.log("join fxn called -->")
            if (!socket) {
                console.log("socket not available")
                return
            }
            // @todo room id
            const { rtpCapabilities, producers } = await socket.emitWithAck('join:live-session', { roomId: 123, userId: user?._id, name: user?.firstName })
            console.log("rtpCapabilities : ", rtpCapabilities)
            // rtpCapabilities = res.rtpCapabilities
            //     creatDevice()
            // }

            // async function creatDevice() {
            const device = new Device()
            await device.load({
                routerRtpCapabilities: rtpCapabilities
            })
            deviceRef.current = device
            console.log('Device RTP Capabilities', device.rtpCapabilities)

            await createTransport()

            console.log("========================after transport======================")
            // if (!isProducer && producers) {
            //     for (const producerInfo of producers) {
            //         console.log("producerInfo : ", producerInfo)
            //         const producerId = producerInfo.id;
            //         const appData: AppData = producerInfo.appData;
            //         await createConsumer(producerId, device, appData);
            //     }
            // }

        } catch (error: any) {
            console.log(error)
            if (error.name === 'UnsupportedError')
                console.log("browser not supported")
        }
    }

    function createTransport() {
        return isProducer ? createSendTransport() : createRecvTransport()
    }

    interface ITransportOptions {
        iceParameters: IceParameters,
        iceCandidates: IceCandidate[],
        dtlsParameters: DtlsParameters,
        sctpParameters: SctpParameters,
        error: any
    }

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

        const upTransport = await socket.emitWithAck('createWebRtcTransport', { isSender: true, roomId: 123 })
        //  , (params: ITransportOptions) => {
        if (upTransport.error) {
            console.log(upTransport.error)
            return
        }

        console.log("uptransport : ", upTransport)

        if (!deviceRef.current) return console.log("device not found")
        const producerTransport = deviceRef.current.createSendTransport(upTransport); //@remind ? think should i pass a new object with param properties


        producerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void) => {
            try {
                const res = await socket.emitWithAck('transport-connect', {
                    roomId: 123, //@todo
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
                    roomId: 123,
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

    const createRecvTransport = async () => {
        if (!socket || !deviceRef.current) return console.log("device or socket on available for consumer")

        const downTransport = await socket.emitWithAck('createWebRtcTransport', { isSender: false, roomId: 123 })
        if (downTransport.error) {
            console.log(downTransport.error)
            return
        }
        console.log("Recv createWebRtcTransport : ", downTransport)

        const consumerTransport = deviceRef.current.createRecvTransport(downTransport)
        console.log("Recv create consumerTransport : ", consumerTransport)

        consumerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void) => {
            try {
                const res = await socket.emitWithAck('transport-connect', {
                    roomId: 123, //@todo
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
        // if (!producerTransportRef.current) return console.log("producer Ref not exist")
        // console.log("producerRef", producerTransportRef.current.id)
        // createConsumer(producerTransportRef.current.id);
        // connectRecvTransport()
        // }

        const producers = await socket.emitWithAck('get-producres', { roomId: 123 })

        console.log("producers : ", producers)

        for (const producerInfo of producers) {
            // console.log("producerInfo : ", producerInfo)
            const producerId = producerInfo.id;
            // const appData: AppData = producerInfo.appData;
            await createConsumer(producerId);
        }

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

    const connectRecvTransport = async () => {
        if (!socket || !deviceRef.current) return;
        if (!producerTransportRef.current) return;

        const res = await socket.emitWithAck('consume', {
            rtpCapabilities: deviceRef.current.rtpCapabilities,
            roomId: 123,// @todo
            producerId: producerTransportRef.current
        })

        if (res.error) {
            console.log(res);
            return
        }

        console.log("Consume ITransportOptions :", res)
        if (!consumerTransportRef.current) return console.log("consumerRef not exist")

        const consumer = await consumerTransportRef.current.consume({
            id: res.id,
            producerId: res.producerId,
            kind: res.kind,
            rtpParameters: res.rtpParameters
        })
        console.log("coneumer ==> ", consumer);
        const { track } = consumer

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = new MediaStream([track])
        }

        socket.emit('consumer-resume', { consumerId: consumer.id, roomId: 123 })
    }

    useEffect(() => {
        if (!socket || !isConnected) return;

        // future socket logic here
        socket.on('connection-success', ({ socketId, existsProducer }) => {
            console.log(socketId, existsProducer)
        })
        socket.on("joined-room", (data) => {
            console.log(data?.roomId,
                data?.peers)
        })

    }, [socket, isConnected]);

    return (
        <div className='flex flex-col items-center justify-center gap-12 pt-8'>
            <h1>Call SFU MediaSoup</h1>

            <div className='flex items-center justify-center gap-16'>
                <video
                    className='h-75 w-125 border-4 rounded-xl'
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                />

                <video ref={remoteVideoRef}
                    className='h-75 w-125 border-4 rounded-xl'
                    muted
                />

            </div>

            <div className='grid grid-cols-3  gap-16'>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={start}>Create</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={goConsume}>Join</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={leaveRoom}>Stop</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={mute}>unmute</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={removeConsumer}>remove consumer</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={toggleMic}>toggleMic</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={toggleCam}>toggleCam</button>
            </div>
        </div>
    );
}

export default Call;
