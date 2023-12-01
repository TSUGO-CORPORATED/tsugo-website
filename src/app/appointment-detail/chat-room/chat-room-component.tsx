'use client';
import socketIO, { Socket } from "socket.io-client";
import React, { useState, useEffect, useRef, useContext } from 'react';
import { ContextVariables } from '../../../context-variables';
import { useSearchParams } from 'next/navigation';
import { Interface } from "readline";
//import cv from 'opencv4nodejs';

interface chatMessage {
    appointment: number,
    user: number,
    content: string,
    timestamp: string
}

const constraints = {
    audio: false,
    video: true,
  };



export default function ChatRoomSub(): React.JSX.Element{
    const { userId } = useContext(ContextVariables);

    const [messages, setMessages] = useState<chatMessage[]>([]);
    const [error, setError] = useState<any>(null); //TODO: Determine type properly
    const socket = useRef<Socket>();
    const textRef = useRef<HTMLTextAreaElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
   // const navigator = new MediaDevices();
    navigator.mediaDevices.getUserMedia(constraints)
  .then((stream) => {
    const videoTracks = stream.getVideoTracks();
    console.log("Got stream with constraints:", constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    stream.onremovetrack = () => {
      console.log("Stream ended");
    };
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

    // SEARCH PARAMS
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get('slug');
    // console.log(appointmentId);

    let sendMessage = (message: string) => {
        let date = (new Date()).toISOString();
        if(typeof appointmentId == "string") {
            const obj = {
                appointment: parseInt(appointmentId),
                user: userId,
                content: message,
                timestamp: date
            }
            textRef.current!.value = "";
            const jsobj = JSON.stringify(obj);
            if(socket.current!.connected) socket.current!.send(jsobj);
        }
    };


        useEffect(() => {
            socket.current = socketIO("https://senior-project-server-8090ce16e15d.herokuapp.com/"); //TODO: Set env variable  http://localhost:8080
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

           

            return () => {
                socket.current?.disconnect();
            }   
        }, []);

    return (
        <>
            <div >
                <ul className="chatContainer">
                    {messages.map((message, index) => {
                        if(message.user == userId) return <li key={index} className="chat-room-message" style={{left: "300px"}}> <div className="messageContainer"><p>User:{message.user} </p> <p>{message.content} </p> <p>{message.timestamp} </p></div> </li>
                        return <li key={index} className="chat-room-message"> <div className="messageContainer"><p>User:{message.user} </p> <p> {message.content} </p> <p> {message.timestamp} </p></div> </li>
                    })}
                </ul>
            </div>
            <textarea ref={textRef} className="chat-room-text-input" placeholder="..."></textarea>
            <button className="chat-room-send-button" onClick={() => {if(textRef.current!.value != null) sendMessage(textRef.current!.value)}}>Send</button>
            <video ref={videoRef} width="320" height="240" controls>
                No Source!
            </video>
        </>
    )
}