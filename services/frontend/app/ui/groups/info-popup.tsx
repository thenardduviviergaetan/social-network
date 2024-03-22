'use client';
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import GroupForm from "./group-form"

function Popup({ func, children }: { func: any, children: React.ReactNode}) {
    return (
        <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center z-10 bg-gray-600/50">
            <div className=" flex flex-col w-1/4 h-1/3 bg-gray-200 p-[10px]">
                <XMarkIcon className="h-[25px] w-[25px] ml-auto hover:cursor-pointer" onClick={func}/>
                { children }
            </div>
        </div>
    )
}


export function CreateGroupButton() {
    const [popup, setPopupState] = useState(false)
    const setPop = () => { setPopupState(!popup) }

    return (
        <>
            <button  type="button" onClick={setPop} className="flex h-10 justify-center w-2/12 items-center rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 active:bg-purple-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">
                Create New Group
            </button>
            {popup && <Popup func={setPop}>
                    <GroupForm func={setPop} />
                </Popup>
            }
        </>
    )
}