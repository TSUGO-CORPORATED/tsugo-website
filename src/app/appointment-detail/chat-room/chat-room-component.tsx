'use client';
import socketIO, { Socket } from "socket.io-client";
import { Peer } from "peerjs";
import axios from "axios";
import React, { useState, useEffect, useRef, useContext, use } from 'react';
import { ContextVariables } from '../../../context-variables';
import { useSearchParams } from 'next/navigation';
import { Interface } from "readline";
import { Button, Paper } from "@mui/material";
import moment from 'moment';
import { buttonOffMid } from "@/muistyle";

//import cv from 'opencv4nodejs';

interface chatMessage {
    appointment: number,
    user: number,
    firstName: string,
    lastName: string,
    content: string,
    timestamp: string
}

const constraints = {
    audio: false,
    video: true,
  };

export default function ChatRoomSub(): React.JSX.Element{
    const { userId, userFirstName, userLastName } = useContext(ContextVariables);
    


    const [messages, setMessages] = useState<chatMessage[]>([]);
    const [interlocutorFirstName, setInterlocutorFirstName] = useState<string | null>(null);
    const [interlocutorLastName, setInterlocutorLastName] = useState<string | null>(null);
    const [error, setError] = useState<any>(null); //TODO: Determine type properly
    const [videoIsOpen, setVideoIsOpen] = useState(false);
    let peerId = "";
    const peer = useRef<Peer>();
    const socket = useRef<Socket>();
    const streamRefs = useRef<MediaStream[]>([]);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const video2Ref = useRef<HTMLVideoElement>(null);
    let navigator:Navigator | null = null;
    if (typeof window != "undefined") {
        navigator = window.navigator;
    }
    else {
        navigator = null;
    }

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('slug');
    // console.log(appointmentId);

    const sendMessage = (message: string) => {
        let date = (new Date()).toISOString();
        if(typeof appointmentId == "string") {
            const obj = {
                appointment: parseInt(appointmentId),
                user: userId,
                firstName: userFirstName,
                lastName: userLastName,
                content: message,
                timestamp: date
            }
            textRef.current!.value = "";
            const jsobj = JSON.stringify(obj);
            if(socket.current!.connected) socket.current!.send(jsobj);
        }
    };

    const initInterlocutorName = async () => {
        try {
            const timeframe = "history"; 
            const url = `https://senior-project-server-8090ce16e15d.herokuapp.com/appointment/detail/${appointmentId}`;
            const response = await axios.get(url);
            console.log(response)
            if(response.data.clientUserId == userId) {
                setInterlocutorFirstName(response.data.interpreterUser.firstName);
                setInterlocutorLastName(response.data.interpreterUser.lastName);
            }
            else if(response.data.interpreterUserId == userId) {
                setInterlocutorFirstName(response.data.clientUser.firstName);
                setInterlocutorLastName(response.data.clientUser.lastName);
            }
           
            
          } catch (error) {
            console.error("Error fetching History:", error);
          }
    };

    const initPeer = () => {
        
        peer.current = new Peer();
        peer.current.on('connection', function (con) {
            peer.current!.on('call', function (call) {
                console.log("someone is calling")
                navigator!.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    streamRefs.current.push(stream);
                    call.answer(stream);
                    call.on('stream', function (remoteStream) {
                    newVideo(remoteStream);
                });
            }).catch( (err) => {
                console.log('Failed to get local stream', err);
            });
        });
        socket.current!.on("disconnect-user", () => {
            con.close();
        })
    });
    peer.current.on('open', (id) => {
        console.log("open peer")
        peerId = id //setPeerId(id);
        console.log("peerId is: " + peerId)
        socket.current!.emit('video-join', peerId);
    });
    }

    const joinVideo = () => {
        initPeer();
        navigator!.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                const videoTracks = stream.getVideoTracks();
                console.log("Got stream with constraints:", constraints);
                console.log(`Using video device: ${videoTracks[0].label}`);
                stream.onremovetrack = () => {
                    console.log("Stream ended");
                };
                streamRefs.current.push(stream); //can't get the stream from srcObject, this is fix until that is figured out
                videoRef.current!.srcObject = stream;
            })
            .catch((error) => {
            if (error.name === "OverconstrainedError") {
                console.error(
                "resolution not supported"//`The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`,
            );
            } else if (error.name === "NotAllowedError") {
                console.error(
                "You need to grant this page permission to access your camera and microphone.",
                );
            } else {
                console.error(`getUserMedia error: ${error.name}`, error);
            }
            });
        setVideoIsOpen(true);
    };

    const leaveVideo = () => {
        setVideoIsOpen(false);
        peer.current!.disconnect();
        peer.current!.destroy();
        for(const stream of streamRefs.current!){
            stream.getTracks().forEach(track => track.stop());
        }
    };

        useEffect(() => { //set up socket
            console.log("setting up socket...");
            initInterlocutorName();

            socket.current = socketIO(`${process.env.NEXT_PUBLIC_DATABASE_SERVER_URL}`); //TODO: Set env variable  http://localhost:8080
            socket.current.emit("CONNECT_ROOM", `{"room": ${appointmentId}}`); //TOD: Need buttons for selecting which room you want, default to 1 for now

            socket.current.on("connect", () => {
                console.log("connected to server!");
            });
            socket.current.on("disconnect", () => {
                console.log("disconnected from server!");
            });
            socket.current.on("error", (error) => {
                console.log(typeof error); //TODO: once we see what the type is we can fix the above type
                setError(error);
            });
            socket.current.on("message", async (message) => {
                console.log("received message");
                let parsedMessage = await JSON.parse(message);
                setMessages((prevMessages) => [...prevMessages, parsedMessage]);
            });
            socket.current.on("history", async (message) => {
                console.log("received message history");
                let parsedHistory = await JSON.parse(message);
                let standardizedHistory: any = [];
                for(let i = 0; i < parsedHistory.length; i++){ //TODO: standardize on the server side so this can be pretty
                    standardizedHistory.push({
                        user: parsedHistory[i].userId,
                        content: parsedHistory[i].content,
                        timestamp: parsedHistory[i].messageTimestamp
                    });
                }
                setMessages((prevMessages) => [...prevMessages, ...standardizedHistory]);
            });
            socket.current.on('connect-user', (userId) => {
                console.log(userId + " and " + peerId);
                if (peerId == userId) return;
                console.log("connecting")

                if(peer.current != undefined){
                    peer.current.connect(userId);
                    navigator!.mediaDevices.getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                        streamRefs.current.push(stream);
                        var call = peer.current!.call(userId, stream);
                        call.on('stream', function (remoteStream) {
                          newVideo(remoteStream);
                        });
                      }).catch((err) => {
                        console.log('Failed to get local stream', err);
                      });
                }
              });

            return () => { //cleanupt socket peer and media streams
                socket.current?.disconnect();
                peer.current?.disconnect();
                for(const stream of streamRefs.current!){
                    stream.getTracks().forEach(track => track.stop());
                }
            }   
        }, []);

        const newVideo = (stream: MediaStream) => {
            //const video = document.createElement('video');
            const videoContainer = document.getElementById('video-container');
            if (video2Ref.current!.id == stream.id) return;
            video2Ref.current!.id = stream.id;
            video2Ref.current!.srcObject = stream;

            
            video2Ref.current!.addEventListener('loadedmetadata', () => {
              video2Ref.current!.play();
            });
          };
          

    return (
        <Paper className="chat-room__container">  
        <div className="chat-room__video-container">
                <video className="chat-room__video" ref={videoRef} width="320" height="240" autoPlay playsInline>
                    No Source!
                </video>
                <video className="chat-room__video" ref={video2Ref} width="320" height="240" autoPlay playsInline>
                    No Source!
                </video>
            </div>
            <div className="chat-room__card" >
                <ul className="chatContainer">
                    {messages.map((message, index) => {
                        if(message.user == userId) {
                        return <li key={index} className="chat-room-message" > 
                            <div className="messageContainer-sent">
                                <p className="chat-room__message__username">Me </p> 
                                <p className="chat-room__message__content">{message.content} </p> 
                                <p className="chat-room__message__timestamp">{moment(message.timestamp).fromNow()} </p>
                            </div> 
                        </li>} else {
                        return <li key={index} className="chat-room-message" > 
                            <div className="messageContainer-rec">
                                <p className="chat-room__message__username">{interlocutorFirstName} {interlocutorLastName}</p> 
                                <p className="chat-room__message__content"> {message.content} </p> 
                                <p className="chat-room__message__timestamp"> {moment(message.timestamp).fromNow()} </p>
                            </div> 
                        </li>}
                    })}
                </ul>
            </div>
            <textarea ref={textRef} className="chat-room-text-input" placeholder="message" 
            onKeyDown={(key) => {if(key.key == "Enter" && textRef.current!.value != null) {sendMessage(textRef.current!.value)}}}></textarea>
            
            <div className="ButtonContainer">   
            {videoIsOpen ? <Button sx={buttonOffMid} variant="contained" className="videoButton" onClick={leaveVideo} > Stop Camera </Button>
                     : <Button sx={buttonOffMid} variant="contained" className="videoButton" onClick={joinVideo}> Start Camera </Button>
                }
            <Button sx={buttonOffMid} variant="contained" className="chat-room-send-button" 
            onClick={() => {if(textRef.current!.value != null) sendMessage(textRef.current!.value)}} 
            > Send </Button> 
            </div>
        </Paper>
    )
}