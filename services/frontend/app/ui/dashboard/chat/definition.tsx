import { Dispatch, SetStateAction } from "react"

export type Group = {
  name: string;
  id: string;
}

export type Client = {
  username: string,
  uuid: string,
  online: boolean,
  message: string,
  lastMsg: string[],
  msg_type: string
}

export type Message = {
  msg_type: string;
  content: string;
  target: string;
  type_target: string;
  sender: string;
  sender_name: string;
  date: string;
  image: string;
}

export type StatusMessage = {
  msg_type: string,
  target: string,
  status: Client[],
	group: Group[],
}

export type HistoryMessage = {
	msg_type:   string
	target:     string
	tabMessage: Message[]
}

export type ConnBtn = {
  uuid: string,
  username: string,
  online: boolean
}

export type ListUser = Array<ConnBtn>


export type Target = {
  type_target: string,
  uuid: string;
}

export type ChatProp = {
  content: { val: string, setter: Dispatch<SetStateAction<string>> },
  socket: { val: WebSocket, setter: Dispatch<SetStateAction<WebSocket>> },
  userlist: { val: ConnBtn[], setter: Dispatch<any> },
  groupList: { val: Group[], setter: Dispatch<SetStateAction<Group[]>> },
  messageList: { val: Message[], setter: Dispatch<SetStateAction<Message[]>> },
  target: { val: Target, setter: Dispatch<SetStateAction<Target>> },
  typing: { val: {}, setter: Dispatch<any> },
  showChat: {val: boolean, setter: Dispatch<SetStateAction<boolean>>},
}