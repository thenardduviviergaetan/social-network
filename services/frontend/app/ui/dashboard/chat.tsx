'use client'

import { useEffect } from "react";

export default function Chat() {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/api/ws');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.msg_type === 'status') {
          console.log('WebSocket status:', message.status);
        }
      } catch (error) {
        console.error('WebSocket message error:', event.data);
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

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
