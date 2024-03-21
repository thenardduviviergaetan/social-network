'use client'

import { User } from "@/app/lib/definitions";
// import { fetchUser } from "@/app/lib/data";
import { auth } from "@/auth";
import { Socket } from "dgram";
import { useCallback, useEffect } from "react";
import { useState } from "react";

class Message {
  msg_type: string;
  content: string;
  target: string;
  type_target: string;
  sender: string;
  date: string;
  image: string;

  constructor(
    msg_type: string,
    content: string,
    target: string,
    type_target: string,
    sender: string,
    date: string,
    image: string
  ) {
    this.msg_type = msg_type;
    this.content = content;
    this.type_target = type_target;
    this.target = target;
    this.sender = sender;
    this.date = date;
    this.image = image;
  }
}


export default function Chat({ user }: { user: User | null }) {
  // auth().then((users) =>{})
  // const user = auth()
  const test = new Message("Testing", "Ceci est un message de test", "All", "All", user?.uuid, new Date().toLocaleDateString("fr"), "")
  const [content, setContent] = useState("")
  // const [socket, setsocket] = useState()
  var socket:WebSocket
  useEffect(() => {
    socket = new WebSocket('ws://localhost:8000/api/ws')
    // setsocket(sw);
    socket.onopen = (event) => {
      console.log('WebSocket connection opened');
      socket.send(user?.uuid);
      // let msg = JSON.stringify(test)
      // socket.send(msg);
    };

    socket.onmessage = (event) => {
      let message
      try {
        message = JSON.parse(event.data);
        console.log(message)
      } catch {
        console.error('WebSocket message error:', event.data);
      }

      if (message.msg_type === 'status') {
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
    // return socket
  }, []);
  // let chatcontent = ""
  console.log('socket', socket)
  return (
    <div className="chat px-5 py-20">
      <h1>Chat</h1>
      <div className="user-list"></div>
      <div className="chat-container">
        <div className="messages"></div>
        <div className="sender">
          <form id="form-chat">
            <input id="chat-text" type="text" onChange={(e) => {
              setContent(e.target.value)
            }}
            ></input>
            <input id="submit" type="submit" onClick={(e) => {
              e.preventDefault();
              console.log(content, user?.uuid)
              let msg = JSON.stringify(content)
              console.log(socket)
              socket?.send(msg);
            }}></input>
          </form>
        </div>
      </div>
    </div>
  )
}