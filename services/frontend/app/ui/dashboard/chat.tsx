'use client'

import { useEffect } from "react";
import { useState } from "react";

class Message {
  msg_type: string;
  content: string;
  target: string;
  type_target: string;
  sender: string;
  // date: string;
  image: string;

  constructor(
    msg_type: string,
    content: string,
    target: string,
    type_target: string,
    sender: string,
    image: string
  ) {
    this.msg_type = msg_type;
    this.content = content;
    this.type_target = type_target;
    this.target = target;
    this.sender = sender;
    // let date = new Date()
    // this.date = `${date.toLocaleDateString("fr")}-${date.toLocaleTimeString("fr")}`;
    this.image = image;
  }
}
class Target {
  type_target: string;
  target: string;
  constructor(
    type_target: string,
    target: string
  ) {
    this.type_target = type_target;
    this.target = target;
  }
}
class ConnBtn {
  username: string;
  uuid: string;
  online: boolean;
  constructor(username: string, uuid: string, online: boolean) {
    this.username = username;
    this.uuid = uuid;
    this.online = online;
  }
}
class ListUser {
  tab: Array<ConnBtn>;
  constructor() {
    this.tab = new Array;
  }
  new(username: string, uuid: string, online: boolean) {
    this.tab.push(new ConnBtn(username, uuid, online));
  }
}
class ListMessage {
  tab: Array<Message>;
  constructor() {
    this.tab = new Array;
  }
  new(
    msg_type: string,
    content: string,
    target: string,
    type_target: string,
    sender: string,
    image: string) {
    this.tab.push(new Message(
      msg_type,
      content,
      target,
      type_target,
      sender,
      image
    ));
  }
}
export default function Chat({ user }: { user: string | null }) {
  let listUser = new ListUser()
  let listMessage = new ListMessage()
  const userUuid = user
  const [content, setContent] = useState("")
  const [socket, setsocket] = useState(Object)
  const [userList, setUserList] = useState(listUser.tab)
  const [groupList, setGroupList] = useState([])
  const [messageList, setmessageList] = useState(listMessage.tab)
  const [target, settarget] = useState(new Target("undefined", "undefined"))
  useEffect(() => {
    let sc = new WebSocket('ws://localhost:8000/api/ws')
    sc.onopen = (event) => {
      console.log('WebSocket connection opened');
      sc.send(userUuid ?? '');
    };

    sc.onmessage = (event) => {
      let message
      try {
        message = JSON.parse(event.data);
        console.log("Message send", message)
      } catch {
        console.error('WebSocket message error:', event.data);
      }

      switch (message.msg_type) {
        case 'status':
          listUser = new ListUser()
          // console.log('WebSocket status:', message.status);
          message.status
            .filter((el: ConnBtn) => { return el.uuid != userUuid })
            .forEach((el: ConnBtn) => {
              listUser.new(el.username, el.uuid, el.online);
            })
          setUserList(listUser.tab);
          // console.log(userList);
          break;
        case 'history':
          listMessage = new ListMessage();
          break;
        case 'chat':
          listMessage.new(
            message.msg_type,
            message.content,
            message.target,
            message.type_target,
            message.sender,
            message.image
          )
          setmessageList(listMessage.tab)
          break;
      }
    }

    sc.onerror = (event) => {
      console.error('WebSocket error:', event);
    }

    sc.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    }
    setsocket(sc);
    return () => {
      sc.close();
    };
  }, []);
  return (
    <div className="chat">
      <h1>Chat</h1>
      <div className="chanel-list">
        <h2>Users</h2>
        <div className="user">
          {
            userList.map((users, idx) => {
              return (
                <div key={idx}>
                  <button id={users.username} onClick={
                    (e) => {
                      let t = new Target("user", users.uuid)
                      settarget(t)
                      socket.send(JSON.stringify(new Message(
                        "history",
                        "",
                        "user",
                        users.uuid,
                        userUuid ?? "",
                        ""
                      )))
                    }
                  }>{users.username}
                    <svg className="notification" width="10" height="10">
                      <circle cx="5" cy="5" r="5" fill={users.online ? "green" : "red"}></circle>
                    </svg>
                  </button>
                </div>
              )
            })
          }
        </div>
        <div className="group">
          {
            groupList?.map((group, idx) => {
              return (
                <div key={idx}>
                  <button>
                  </button>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="chat-container">
        <div className="messages">
          {
            messageList.map((message, idx) => {
              return (
                <div key={idx}>
                  <div className="message">{message.content}</div>
                </div>
              )
            })
          }
        </div>
        <div className="sender">
          <form id="form-chat">
            <input id="chat-text" type="text" value={content} onChange={(e) => {
              setContent(e.target.value)
            }}
            ></input>
            <input id="submit" type="submit" onClick={(e) => {
              e.preventDefault();
              if (target.target !== "undefined") {
                // console.log(content, user)
                let message = new Message(
                  "chat",
                  content,
                  target?.target,
                  target?.type_target,
                  userUuid ?? '',
                  ""
                )
                let msg = JSON.stringify(message)
                setContent("")
                socket.send(msg);
              }
            }}></input>
          </form>
        </div>
      </div>
    </div>
  )
}
