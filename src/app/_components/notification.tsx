'use client'

import { useEffect, useState } from "react";
import { PiX } from "react-icons/pi";

export default function Notification({text, success}: {text: string, success?: boolean}) {
    const [show, setShow] = useState<boolean>(true)

    useEffect(() => {
        const notif = setTimeout(() => {
            setShow(false)
        }, 5000)

        return () => {clearTimeout(notif)}
    }, [])
    
    return (
        <div className={`${show ? '' : 'hidden'} anim-notif max-w-sm mx-auto fixed top-0 right-0 p-4`}>
            <div className={`${success ? ' bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'} 
            flex items-center gap-x-4 justify-between rounded-sm py-2 px-4`}>
                <h1 className="text-sm line-clamp-3">{text}</h1>
                <div><PiX onClick={() => setShow(false)} className={`${success ? ' text-emerald-500' : ' text-rose-500'} text-xl cursor-pointer`} /></div>
            </div>
        </div>
    )
}