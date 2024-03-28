import { ChatProp, ConnBtn, Message, Target, Client, Group } from "@/app/ui/dashboard/chat/definition";
import { User } from "@/app/lib/definitions";
import { string } from "prop-types";
import { Dispatch, SetStateAction } from "react";


function getHistory(currUser: User, clientUUID: string, target: { val: Target, setter: Dispatch<SetStateAction<Target>> }, socket: WebSocket, showChat: any) {
  //TODO Complet missing infos
  const msg: Message = {
    msg_type: "history",
    content: "",
    target: clientUUID,
    type_target: "user",
    sender: currUser.uuid ?? "",
    sender_name: "",
    date: "",
    image: "",
  }

  console.log("Chat2, history = ", msg)

  socket.send(JSON.stringify(msg))
  showChat.setter(true)
  target.setter({ type_target: "user", uuid: clientUUID })
}

// function ClientCard({ prop, currUser, client, key }: { prop: ChatProp, currUser: User, client: ConnBtn | Group, key: number }) {
//   const isConnBtn = (val: any): val is ConnBtn => { return true }

//   (isConnBtn(client))
//     ? prop.target.setter({ type_target: "user", uuid: client.uuid })
//     : prop.target.setter({ type_target: "group", uuid: client.id.toString() })

//   if (isConnBtn(client)) {
//     return (
//       <div key={"user" + key} className="items-end justify-center rounded-md bg-zinc-200 p-3 md:h-50 mb-1">
//         <button
//           id={client.username}
//           onClick={() => {
//             getHistory(currUser, prop.target, prop.socket.val, prop.showChat)
//           }}
//           className="flex align-center"
//         >
//           <svg className="notification mr-[10px]" width="10" height="10">
//             <circle
//               cx="5"
//               cy="5"
//               r="5"
//               fill={client.online ? "green" : "red"}
//             >
//             </circle>
//           </svg>
//           <p>{client.username}</p>
//         </button>
//       </div>
//     )
//   }else {
//     return(
//       <div key={"user" + key} className="items-end justify-center rounded-md bg-zinc-200 p-3 md:h-50 mb-1">
//         <button
//           id={client.id.toString()}
//           onClick={() => {
//             getHistory(currUser, prop.target, prop.socket.val, prop.showChat)
//           }}
//           className="flex align-center"
//         >
//         <p>{client.id.toString()}</p>
//         </button>
//       </div>
//     )
//   }
// }

export default function ChatClients({ prop, currUser }: { prop: ChatProp, currUser: User }) {

  const click = (chatUserUUID: string) => {
    (prop.showChat.val && prop.target.val.uuid === chatUserUUID)
      ? prop.showChat.setter(false)
      : getHistory(currUser, chatUserUUID, prop.target, prop.socket.val, prop.showChat)
  }

  return (
    <div className="chanel-list flex-row mb-2 h-50 items-end justify-center rounded-md bg-white p-4 md:h-50">
      <h2 className="font-bold">Users</h2>
      <div className="user">
        {/* {prop.userlist.val.map((chatUser, idx) => {
          return <></>
          // return <ClientCard prop={prop} currUser={currUser} client={chatUser} key={idx}/>
        })} */}
        {prop.userlist.val.map((chatUser, idx) => {
          // TODO Make the whole return a button for better UI/UX
          return (
            <div key={"user" + idx} className="items-end justify-center rounded-md bg-zinc-200 p-3 md:h-50 mb-1">
              <button id={chatUser.username} onClick={() => click(chatUser.uuid)} >
                <svg className="notification mr-[10px]" width="10" height="10">
                  <circle
                    cx="5"
                    cy="5"
                    r="5"
                    fill={chatUser.online ? "green" : "red"}
                  >
                  </circle>
                </svg>
                <p>{chatUser.username}</p>
              </button>
            </div>
          );
        })}
      </div>
      <div className="group">
        <h2 className="font-bold">Group</h2>
        {prop.groupList?.val.map((group, idx) => {
          return (
            <div key={"groupe" + idx} className="items-end justify-center rounded-md bg-zinc-200 p-3 md:h-50  mb-1 ">
              <button id={group.name} onClick={() => click(group.id)} >
                {group.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
}