'use client';
import socketIO, { Socket } from "socket.io-client";
import React, { useState, useEffect, useRef } from 'react';



export default function ChatRoomSub(): React.JSX.Element{

    const [messages, setMessages] = useState<string[]>([]);
    const [error, setError] = useState<any>(null); //TODO: Determine type properly
    const socket = useRef<Socket>();
    let sendMessage = (message: string) => {
        if(socket.current!.connected) socket.current!.send(message);
    };
        useEffect(() => {
            socket.current = socketIO("http://localhost:8080"); //TODO: Set env variable
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
            socket.current.on("message", (message) => {
                console.log("received message");
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.current?.disconnect();
            }
        }, []);

    return (
        <div>
            <div>
                <ul>
                    {messages.map((message, index) => <li key={index}>{message}</li>)}
                </ul>
            </div>
            <button onClick={() => {sendMessage("Take this!")}}>Press me!</button>
        </div>
    )
}