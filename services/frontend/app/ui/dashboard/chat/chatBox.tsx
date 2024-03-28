import { User } from "@/app/lib/definitions";
import { ChatProp, Message, Target } from "@/app/ui/dashboard/chat/definition";

function sendTyping(currUser: User, target: Target,  socket: WebSocket){
  //TODO set a typing-start/typing-stop
  const msg: Message = {
    msg_type:"typing",
    content: "",
    target: target.uuid,
    type_target: "user",
    sender: currUser.uuid,
    sender_name: currUser.lastName,
    date: "",
    image: "",
  }

  socket.send(JSON.stringify(msg))
}

function sendMessage(currUser: User, target: Target, content: string,  socket: WebSocket){
  const msg: Message = {
    msg_type:"chat",
    content: content,
    target: target.uuid,
    type_target: target.type_target,
    sender: currUser.uuid,
    sender_name: currUser.lastName,
    date: "",
    image: "",
  }

  socket.send(JSON.stringify(msg))
}

//TODO Implement the debounce for "typing"
function debounce(func: Function) {
  let id: any

  return () => {
    if (id) {
      clearTimeout(id)
    }
    id = setTimeout(() => { func() }, 1000)
  }
}

export default function ChatBox({ prop, currUser }: { prop: ChatProp, currUser: User }) {
  console.log("messageList = ", prop.messageList.val)

  return (
    <div className="chat-container mb-2 h-50 items-end justify-center rounded-md bg-white border-solid border-[10px] border-black p-4 md:h-50 fixed bottom-0 left-[270px] ">
      {/* // !!! ADD NAME OF USER IN CHATBOX */}
      {/* <p>{prop.}</p> */}
      <div className="messages overflow-y-scroll h-96 ">
        {prop.messageList.val?.map((message, idx) => {
          return (
            <div key={idx} className="bg-zinc-200 shadow-xl h-[80px] w-auto rounded-lg p-4 mb-3 justify-between">
              <p className="font-bold">{message.sender_name}</p>
              <div className={message.sender === currUser.uuid ?
                " right-0" : " left-0"}>{message.content}</div>
            </div>
          );
        })}
      </div>
      <div className="sender bg-zinc-500 flex flex-col p-4 mb-2 h-25 rounded-lg">
        <div className={prop.typing.val ? "" : "hidden"}>
          <p>Typing</p>
        </div>
        <form id="form-chat flex flex-row">
          <input
            className="shadow-xl"
            id="chat-text"
            type="text"
            value={prop.content.val}
            onChange={(e) => {
              sendTyping(currUser, prop.target.val ,prop.socket.val)
              prop.content.setter(e.target.value)
            }}
          >
          </input>
          <button
            className="h-10 items-center rounded-lg bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 block"
            id="submit"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              sendMessage(
                currUser,
                prop.target.val,
                prop.content.val,
                prop.socket.val
              )
              prop.content.setter("")

              // if (target.target !== "undefined") {
              //   let message = new Message(
              //     "chat",
              //     content,
              //     target?.target ?? "",
              //     target?.type_target ?? "",
              //     userUuid ?? "",
              //     "",
              //   );
              //   let msg = JSON.stringify(message);
              //   setContent("");
              //   socket.send(msg);
              // }
            }}
          >Send
          </button>
        </form>
        <div className="flex flex-wrap">
          {/* {
            emojis.map((emoji: string) => {
              return (
                <button onClick={() => setContent(content + emoji)}>{emoji}</button>
              )
            })
          } */}
        </div>
      </div>
    </div>
  )
}