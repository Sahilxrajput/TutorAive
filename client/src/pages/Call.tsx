import useSocket from '@/hooks/useSocket'
import React, { useEffect, useRef } from 'react'
import * as mediasoupClient from 'mediasoup-client'
import type { DtlsParameters, IceCandidate, IceParameters, MediaKind, ProducerCodecOptions, RtpCapabilities, SctpParameters } from 'mediasoup-client/types';

const Call = () => {

    const video1Ref = useRef<HTMLVideoElement | null>(null);
    const video2Ref = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const { socket, isConnected, onlineUsers, sendMessage, emitCustomEvent } = useSocket();

    interface IProducerOptions {
        encodings: RTCRtpEncodingParameters[],
        codecOptions: ProducerCodecOptions,
        track?: MediaStreamTrack
    }

    let device: any;
    let rtpCapabilities: any;
    let producerTransport: any;
    let consumerTransport: any;
    let producer: any;
    let consumer: any;
    let isProducer: boolean = false;
    let params = {
        encodings: [
            {
                rid: 'r0',
                maxBitrate: 100000,
                scalabilityMode: 'S1T3',
            },
            {
                rid: 'r1',
                maxBitrate: 300000,
                scalabilityMode: 'S1T3',
            },
            {
                rid: 'r2',
                maxBitrate: 900000,
                scalabilityMode: 'S1T3',
            },
        ],
        codecOptions: {
            videoGoogleStartBitrate: 1000,
        },
    };

    async function start() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // save stream
        streamRef.current = stream;

        // attach stream to video element
        if (video1Ref.current) {
            video1Ref.current.srcObject = stream;
        }

        // add track to params
        const track = stream.getVideoTracks()[0];

        params = {
            ...params,
            track,
        };
        goConnect(true)
    }

    function stop() {
        if (!streamRef.current) return;

        streamRef.current.getTracks().forEach(track => track.stop());

        if (video1Ref.current) {
            video1Ref.current.srcObject = null;
        }

        streamRef.current = null;
    }

    function goConsume() {
        goConnect(false)
    }

    function goConnect(producerOrConsumer: boolean) {
        isProducer = producerOrConsumer
        return device === undefined ? getRtpCapabilities() : goCreateTransport()
    }

    //same fxn steps
    const getRtpCapabilities = () => {
        if (!socket) return
        // make a request to the server for Router RTP Capabilities
        // see server's socket.on('getRtpCapabilities', ...)
        // the server sends back data object which contains rtpCapabilities
        socket.emit('createRoom', (data: RtpCapabilities) => {
            console.log(`Router RTP Capabilities...`, data)

            // we assign to local variable and will be used when
            // loading the client Device (see createDevice above)
            rtpCapabilities = data
            //@remind can be pass as argument don't need to store in variable
            creatDevice()
        })
    }

    //same fxn steps
    async function creatDevice() {
        try {
            device = new mediasoupClient.Device()

            await device.load({
                routerRtpCapabilities: rtpCapabilities
            })
            console.log('Device RTP Capabilities', device.rtpCapabilities)
            goCreateTransport()
        } catch (error: any) {
            console.log(error)
            if (error.name === 'UnsupportedError')
                console.log("browser not supported")
        }
    }

    function goCreateTransport() {
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

    const createSendTransport = () => {
        if (!socket) return

        socket.emit('createWebRtcTransport', { sender: true }, (params: ITransportOptions) => {
            if (params.error) {
                console.log(params.error)
                return
            }
            console.log("createWebRtcTransport : ", params)
            producerTransport = device.createSendTransport(params)

            producerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void, errback: any) => {
                try {
                    // Signal local DTLS parameters to the server side transport
                    // see server's socket.on('transport-connect', ...)
                    socket.emit('transport-connect', {
                        dtlsParameters,
                    })

                    // Tell the transport that parameters were transmitted.
                    cb()

                } catch (error) {
                    errback(error)
                }
            })

            producerTransport.on('produce', async (parameters: any, cb: (id: string) => void, errback: any) => {
                console.log("produce parameters :", parameters)

                try {
                    // tell the server to create a Producer
                    // with the following parameters and produce
                    // and expect back a server side producer id
                    // see server's socket.on('transport-produce', ...)
                    socket.emit('transport-produce', {
                        kind: parameters.kind,
                        rtpParameters: parameters.rtpParameters,
                        appData: parameters.appData,
                    }, (id: string) => {
                        // Tell the transport that parameters were transmitted and provide it with the
                        // server side producer's id.
                        cb(id)
                    })
                } catch (error) {
                    errback(error)
                }
            })
            connectSendTransport()
        })
    }

    const createRecvTransport = () => {
        if (!socket) return

        socket.emit('createWebRtcTransport', { sender: false }, (params: ITransportOptions) => {
            if (params.error) {
                console.log(params.error)
                return
            }
            console.log("Recv createWebRtcTransport : ",params)

            consumerTransport = device.createRecvTransport(params)

            consumerTransport.on('connect', async ({ dtlsParameters }: { dtlsParameters: DtlsParameters }, cb: () => void, errback: any) => {
                try {
                    // Signal local DTLS parameters to the server side transport
                    // see server's socket.on('transport-connect', ...)
                    socket.emit('transport-recv-connect', {
                        dtlsParameters,
                    })

                    // Tell the transport that parameters were transmitted.
                    cb()

                } catch (error) {
                    errback(error)
                }
            })
            connectRecvTransport()
        })
    }

    const connectRecvTransport = async () => {
        if (!socket) return;

        socket.emit('consume', {
            rtpCapabilities: device.rtpCapabilities,
        }, async (params: any) => {
            if (params.error) {
                console.log('Cannot Consume')
                return
            }

            console.log("Consume ITransportOptions :", params)
            consumer = await consumerTransport.consume({
                id: params.id,
                producerId: params.producerId,
                kind: params.kind,
                rtpParameters: params.rtpParameters
            })

            const { track } = consumer

            if (video2Ref.current) {
                video2Ref.current.srcObject = new MediaStream([track])
            }

            socket.emit('consumer-resume')
        })
    }

    const connectSendTransport = async () => {
        producer = await producerTransport.produce(params)
        console.log("connectSendTransport : ", params)
        producer.on('trackended', () => {
            console.log('track ended')

            // close video track
        })

        producer.on('transportclose', () => {
            console.log('transport ended')

            // close video track
        })
    }



    useEffect(() => {
        if (!socket || !isConnected) return;

        // future socket logic here
        socket.on('connection-success', ({ socketId, existsProducer }) => {
            console.log(socketId, existsProducer)
        })

    }, [socket, isConnected]);

    return (
        <div className='flex flex-col items-center justify-center gap-12 pt-8'>
            <h1>Call SFU MediaSoup</h1>

            <div className='flex items-center justify-center gap-16'>
                <video
                    className='h-75 w-125 border-4 rounded-xl'
                    ref={video1Ref}
                    autoPlay
                    muted
                />

                <video
                    className='h-75 w-125 border-4 rounded-xl'
                    ref={video2Ref}
                    autoPlay
                    muted
                />
            </div>

            <div className='grid grid-cols-3  gap-16'>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={start}>Create</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={goConsume}>Join</button>
                <button className='bg-pink-300 rounded-md py-4 text-sm' onClick={stop}>Stop</button>
            </div>
        </div>
    );
}

export default Call;
