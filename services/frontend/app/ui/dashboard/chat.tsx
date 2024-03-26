"use client";

import { useEffect } from "react";
import { useState } from "react";
import { boolean } from "zod";

class Message {
  msg_type: string;
  content: string;
  target: string;
  type_target: string;
  sender: string;
  sender_name: string;
  date: string;
  image: string;

  constructor(
    msg_type: string,
    content: string,
    target: string,
    type_target: string,
    sender: string,
    image: string,
    sender_name?: string,
  ) {
    this.msg_type = msg_type;
    this.content = content;
    this.type_target = type_target;
    this.target = target;
    this.sender = sender;
    sender_name != undefined ? this.sender_name = sender_name : this.sender_name = "";
    // let date = new Date()
    this.date = "";//`${date.toLocaleDateString("fr")}-${date.toLocaleTimeString("fr")}`;
    this.image = image;
  }
}
class Target {
  type_target?: string;
  target?: string;
  constructor(
    type_target?: string,
    target?: string,
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
    this.tab = new Array();
  }
  new(username: string, uuid: string, online: boolean) {
    this.tab.push(new ConnBtn(username, uuid, online));
  }
}
class ListMessage {
  tab: Array<Message>;
  constructor() {
    this.tab = new Array();
  }
  add(message: Message) {
    this.tab.push(message);
  }
  new(
    msg_type: string,
    content: string,
    target: string,
    type_target: string,
    sender: string,
    image: string,
  ) {
    this.tab.push(
      new Message(
        msg_type,
        content,
        target,
        type_target,
        sender,
        image,
      ),
    );
  }
}
class Groupe {
  name: string;
  id: string;
  constructor
    (
      name: string,
      id: string,) {
    this.name = name;
    this.id = id;
  }
}
export default function Chat({ user }: { user: string | null }) {
  let listUser = new ListUser();
  const userUuid = user;
  const [content, setContent] = useState("");
  const [socket, setsocket] = useState(Object);
  const [userList, setUserList] = useState(listUser.tab);
  const [groupList, setGroupList] = useState(Array<Groupe>);
  const [messageList, setmessageList] = useState(new ListMessage().tab);
  const [target, setTarget] = useState(new Target());
  const [typing, setTyping] = useState(false);
  // const [typingTimeout,setTypingTimeout] = useState(setTimeout(()=>{},1000))
  useEffect(() => {
    let sc = new WebSocket("ws://localhost:8000/api/ws");
    sc.onopen = (event) => {
      console.log("WebSocket connection opened");
      sc.send(userUuid ?? "");
    };

    sc.onmessage = (event) => {
      let message: any;
      try {
        message = JSON.parse(event.data);
        console.log("Message send", message);
      } catch {
        console.error("WebSocket message error:", event.data);
      }

      switch (message.msg_type) {
        case "status":
          listUser = new ListUser();
          message.status
            .filter((el: ConnBtn) => {
              return el.uuid != userUuid;
            })
            .forEach((el: ConnBtn) => {
              listUser.new(el.username, el.uuid, el.online);
            });
          setUserList(listUser.tab);
          let tabGroupe = new Array<Groupe>
          message.groupe
            .forEach((elgroupe: Groupe) => {
              tabGroupe.push(elgroupe);
            })
          setGroupList(tabGroupe)
          // console.log(groupList)
          break;
      }
    };

    sc.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    sc.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };
    setsocket(sc);
    return () => {
      sc.close();
    };
  }, []);


  let timeout: NodeJS.Timeout;
  useEffect(() => {
    socket.onmessage = (event: { data: string }) => {
      let message: any;
      try {
        message = JSON.parse(event.data);
        console.log("Message send", message);
      } catch {
        console.error("WebSocket message error:", event.data);
      }

      switch (message.msg_type) {
        case "status":
          listUser = new ListUser();
          message.status
            .filter((el: ConnBtn) => {
              return el.uuid != userUuid;
            })
            .forEach((el: ConnBtn) => {
              listUser.new(el.username, el.uuid, el.online);
            });
          setUserList(listUser.tab);
          let tabGroupe = new Array<Groupe>
          message.groupe
            .forEach((elgroupe: Groupe) => {
              tabGroupe.push(elgroupe);
            })
          setGroupList(tabGroupe)
          // console.log(groupList)
          break;
        case "history":
          let listMessage = new ListMessage();
          message.tab_message.forEach((el: Message) => {
            listMessage.add(el);
          })
          setmessageList(listMessage.tab);
          break;
        case "chat":
          // console.log("message target : ",message.target,"\ntarget : ", target)
          // console.log(message.target, target.target, message.sender)
          if (message.target == target.target || message.sender == target.target) {
            setmessageList(prevMessage => [...prevMessage,
            new Message(
              message.msg_type,
              message.content,
              message.target,
              message.type_target,
              message.sender,
              message.image,
              message.sender_name,
            )
            ]);
          } else {
            /// TODO : ADD notif ici
          }
          break;
        case "typing":
          if (message.target == target.target || message.sender == target.target) {
            setTyping(true);
            clearTimeout(timeout)
            timeout = setTimeout(() => {
              console.log("Typing off")
              setTyping(false)
            }, 1000);
          }
          break;
      }
    };
  }, [target]);


  return (
    <div className="chat flex flex-col px-3 py-4 md:px-2 text-purple-700">
      <h1 className="font-bold">Chat</h1>
      <div className="chanel-list flex-row mb-2 h-50 items-end justify-center rounded-md bg-white p-4 md:h-50">
        <h2 className="font-bold">Users</h2>
        <div className="user">
          {userList.map((users, idx) => {
            return (
              <div key={"user" + idx} className="items-end justify-center rounded-md bg-zinc-200 p-3 md:h-50 mb-1">
                <button
                  id={users.username}
                  onClick={(e) => {
                    // console.log("users.uuid",users.uuid)
                    // let t = new Target("user", users.uuid);
                    setTarget(new Target("user", users.uuid));
                    socket.send(JSON.stringify(
                      new Message(
                        "history",
                        "",
                        users.uuid,
                        "user",
                        userUuid ?? "",
                        "",
                      ),
                    ));
                  }}
                >
                  {users.username}
                  <svg className="notification" width="10" height="10">
                    <circle
                      cx="5"
                      cy="5"
                      r="5"
                      fill={users.online ? "green" : "red"}
                    >
                    </circle>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
        <div className="group">
          <h2 className="font-bold">Groupe</h2>
          {groupList?.map((group, idx) => {
            return (
              <div key={"groupe" + idx} className="items-end justify-center rounded-md bg-zinc-200 p-3 md:h-50  mb-1 ">
                <button
                  id={group.name}
                  onClick={(e) => {
                    let t = new Target("group", group.id);
                    setTarget(t);
                    socket.send(JSON.stringify(
                      new Message(
                        "history",
                        "",
                        group.id,
                        "group",
                        userUuid ?? "",
                        "",
                      ),
                    ));
                  }}>{group.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-container mb-2 h-50 items-end justify-center rounded-md bg-white p-4 md:h-50 fixed bottom-0 right-0 ">
        <div className="messages overflow-y-scroll h-96 ">
          {messageList.map((message, idx) => {
            return (
              <div key={idx} className="bg-zinc-200 shadow-xl h-[80px] w-auto rounded-lg p-4 mb-3 justify-between">
                <p className="font-bold">{message.sender_name}</p>
                <div className={message.sender === userUuid ?
                  " right-0" : " left-0"}>{message.content}</div>
              </div>
            );
          })}
        </div>
        <div className="sender bg-zinc-500 flex flex-col p-4 mb-2 h-25 rounded-lg">
          <div className={typing ? "" : "hidden"}>
            <p>Typing</p>
          </div>
          <form id="form-chat flex flex-row">
            <input
              className="shadow-xl"
              id="chat-text"
              type="text"
              value={content}
              onChange={(e) => {
                socket.send(JSON.stringify(new Message(
                  "typing",
                  content,
                  target?.target ?? "",
                  target?.type_target ?? "",
                  userUuid ?? "",
                  "",
                )))
                setContent(e.target.value);
              }}
            >
            </input>
            <button
              className="h-10 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 block"
              id="submit"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                // console.log("target submit",target)
                if (target.target !== "undefined") {
                  let message = new Message(
                    "chat",
                    content,
                    target?.target ?? "",
                    target?.type_target ?? "",
                    userUuid ?? "",
                    "",
                  );
                  let msg = JSON.stringify(message);
                  // console.log(msg)
                  setContent("");
                  socket.send(msg);
                }
              }}
            >Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
