"use client"
import { User } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { ChatProp, HistoryMessage, Message, StatusMessage } from "@/app/ui/dashboard/chat/definition";
import ChatClients from "./chat/users";
import ChatBox from "./chat/chatBox";

function getChatProp(): ChatProp {
  const set = (init) => {
    const [v, s] = useState(init)

    return { val: v, setter: s }
  }

  return {
    content: set(""),
    // socket: set({}),
    socket: set(new WebSocket("ws://localhost:8000/api/ws")),
    userlist: set([]),
    groupList: set([]),
    messageList: set([]),
    target: set({}),
    typing: set({}),
    // showChat: false,
    showChat: set(false),
  }
}

export default function Chat2({ user }: { user: User }) {
  let chat = getChatProp()

  // useEffect(() => {
  //   let sc = new WebSocket("ws://localhost:8000/api/ws");
  //   sc.onopen = (event) => {
  //     console.log("WebSocket connection opened");
  //     sc.send(user.uuid ?? "");
  //   };

  //   sc.onmessage = (event) => {
  //     let message: any;
  //     try {
  //       message = JSON.parse(event.data);
  //       console.log("Message send", message);
  //     } catch {
  //       console.error("WebSocket message error:", event.data);
  //     }

  //     switch (message.msg_type) {
  //       case "status":
  //         let msg_status: StatusMessage = message

  //         //TODO Change so users are sent in content and not in status.
  //         if (msg_status.status) chat.userlist.setter(msg_status.status
  //           .filter((c) => c.uuid !== user.uuid)
  //           .map(client => { return {uuid: client.uuid, username: client.username, online:client.online}})
  //         )
  //         if (msg_status.group) chat.groupList.setter(msg_status.group)
  //         break;
  //     }
  //   };

  //   sc.onerror = (event) => {
  //     console.error("WebSocket error:", event);
  //   };

  //   sc.onclose = (event) => {
  //     console.log("WebSocket connection closed:", event);
  //   };

  //   chat.socket.setter(sc)
  //   // setsocket(sc);
  //   return () => {
  //     sc.close();
  //   };
  // }, []);

  useEffect(() => {
    const s = chat.socket.val

    s.onerror = (event) => { console.error("WebSocket error:", event) }
    s.onclose = (event) => { console.log("WebSocket connection closed:", event) }
    s.onopen = () => {
      console.log("WebSocket connection opened")
      s.send(user.uuid)
    }

    s.onmessage = (event) => {
      let msg_tmp
      let targetUUID: string = chat.target.val.uuid
      // let targetUUID: string = user.uuid
      
      try {
        msg_tmp = JSON.parse(event.data);
        console.log("Message received", msg_tmp);
      } catch {
        console.error("WebSocket message error:", event.data);
        return
      }

      console.log("onMessage msg = ",msg_tmp)

      switch (msg_tmp.msg_type) {
        case "status":
          let msg_status: StatusMessage = msg_tmp

          //TODO Change so users are sent in content and not in status.
          if (msg_status.status) chat.userlist.setter(msg_status.status
            .filter((c) => c.uuid !== user.uuid)
            .map(client => { return {uuid: client.uuid, username: client.username, online:client.online}})
          )
          if (msg_status.group) chat.groupList.setter(msg_status.group)
          break;
        case "history":
          let msg_history: HistoryMessage = msg_tmp
          chat.messageList.setter(msg_history.tabMessage)
          break;
        case "chat":
          let msg: Message = msg_tmp

          console.log("Does it update ? ");
          if (msg_tmp.target === targetUUID || msg_tmp.sender === targetUUID ) {
            console.log("Setting List")
            chat.messageList.setter(prevMessage => [...prevMessage, msg])
          }else {
            // TODO : ADD notif ici
            // TODO Uncomment toast

            // toast.success(message.sender_name+" sent a message !\n"+message.content)
          }
          break;
        case "typing":
          let id: any

          if (msg_tmp.target === targetUUID || msg_tmp.sender === targetUUID) {
            chat.typing.setter(true)

            clearTimeout(id)
            id = setTimeout(() => {
              console.log("Typing off")
              chat.typing.setter(false)
            }, 1000);
          }
          break;
      }
    }

    //TODO Maybe use SetSocket to ensure all the changes have been taken into account
    chat.socket.setter(s);
    return () => { s.close() }
  }, [chat.target.val])

  return (
    <>
      <div className="chat flex flex-col px-3 py-4 md:px-2 text-purple-700">
        <h1 className="font-bold">Chat</h1>
        <ChatClients prop={chat} currUser={user} />
      </div>
      {chat.showChat.val && 
        <ChatBox prop={chat} currUser={user}/>
      }
    </>
  )
}