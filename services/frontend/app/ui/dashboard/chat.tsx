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
    let date = new Date()
    // this.date = `${date.toLocaleDateString("fr")}-${date.toLocaleTimeString("fr")}`;
    this.image = image;
  }
}
class Target{
  type_target:string;
  target:string;
  constructor(
    type_target:string,
    target:string
  ){
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
export default function Chat({ user }: { user: string | null }) {
  let listUser = new ListUser()
  const [content, setContent] = useState("")
  const [socket, setsocket] = useState(Object)
  const [userList, setUserList] = useState(listUser.tab)
  const [groupList, setGroupList] = useState([])
  const [target, settarget] = useState(new Target("undefined","undefined"))
  useEffect(() => {
    let sc = new WebSocket('ws://localhost:8000/api/ws')
    sc.onopen = (event) => {
      console.log('WebSocket connection opened');
      sc.send(user??'');
    };

    sc.onmessage = (event) => {
      let message
      try {
        message = JSON.parse(event.data);
        console.log(message)
      } catch {
        console.error('WebSocket message error:', event.data);
      }

      listUser = new ListUser()
      if (message.msg_type === 'status') {
        console.log('WebSocket status:', message.status);
        message.status
          .filter((el: ConnBtn) => { return el.uuid != user })
          .forEach((el: ConnBtn) => {
            listUser.new(el.username, el.uuid, el.online);
          })
        setUserList(listUser.tab);
        console.log(userList)
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
            userList.map((user, idx) => {
              return (
                <div key={idx}>
                  <button id={user.username} onClick={
                    (e) => {
                      let t = new Target("user",user.uuid)
                      settarget(t)
                    }
                  }>{user.username}
                    <svg className="notification" width="10" height="10">
                      <circle cx="5" cy="5" r="5" fill={user.online ? "green" : "red"}></circle>
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
        <div className="messages"></div>
        <div className="sender">
          <form id="form-chat">
            <input id="chat-text" type="text" onChange={(e) => {
              setContent(e.target.value)
            }}
            ></input>
            <input id="submit" type="submit" onClick={(e) => {
              e.preventDefault();
              if (target.target !== "undefined") {
                console.log(content, user)
                let message = new Message(
                  "chat",
                  content,
                  target?.target,
                  target?.type_target,
                  user??'',
                  ""
                )
                let msg = JSON.stringify(message)
                console.log(socket)
                socket.send(msg);
              }
            }}></input>
          </form>
        </div>
      </div>
    </div>
  )
}
