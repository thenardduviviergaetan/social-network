'use client'

import { useEffect } from "react";

export default function Chat() {
  useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/api/ws?token=123456');

        socket.onopen = (event) => {
          console.log('WebSocket connection opened');
        };

        socket.onmessage = (event) => {
          let message
          try{
            message = JSON.parse(event.data);
          } catch{
            console.error('WebSocket message error:', event.data);
          }

          if (message.msg_type ==='status'){
            console.log('WebSocket status:', message.status);
          }
        }

        socket.onerror = (event) => {
          console.error('WebSocket error:', event);
        }

        socket.onclose = (event) => {
          console.log('WebSocket connection closed:', event);
        }

        return () => {
            socket.close();
        };
    }, []);

    console.log('Chat loaded');

  return (
    <div>
      <h1>Chat</h1>
    </div>

  );
}
