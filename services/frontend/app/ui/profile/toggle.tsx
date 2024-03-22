"use client"
import axios from "axios";
import clsx from "clsx";
import { User } from '../../lib/definitions';
import { ChangeEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "@/app/lib/constants";


interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    user:User | null
}
export default function Toggle({ children, className, user}: ToggleProps) {
    const [child,setChildren] = useState(children);
    const  apply = async (value:string, e:ChangeEvent<HTMLInputElement>)=> {
        
        value = e.target.checked ? "public" : "private";
        setChildren(value);
        toast.success(`Changes successfully applied, your account is now ${value}`, {
            duration: 3000,
            style:{
                backgroundColor:"rgb(126 34 206 / var(--tw-bg-opacity))",
                color:"white"
            }
        });
        axios.post(`${API_BASE_URL}/user/status?user=${user?.uuid}`, { status: value, uuid: user?.uuid });
    }
    return (
        <div className="flex flex-wrap justify-around mt-5 items-center p-4">
            <label className={clsx("inline-flex items-center cursor-pointer", className)}>
                {children?.[0] === 'private' ? <input type="checkbox" className="sr-only peer" onChange={(event) => { apply(children?.[0], event) }} /> : <input type="checkbox" className="sr-only peer" defaultChecked onChange={(event) => { apply(children?.[0], event) }} />}
                <div className={`relative w-11 h-6 bg-gray-400 peer-focus:outline-none rounded-full peer dark:bg-black-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600`}></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-400">
                    {child}
                </span>
            </label>
            <Toaster />
        </div>
    )
}
