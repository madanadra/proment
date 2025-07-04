'use client'

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef, useState } from "react"
import { update_status } from "@/fetch"
import Notification from "./notification"
import { PiPencilSimple } from "react-icons/pi";

export default function UpdateStatus({id, isOwner, status}: {id: string, isOwner: boolean, status: number}) {
    const [show, setShow] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [value, setValue] = useState<number>(status)
    const [notification, setNotification] = useState<boolean>(false)
    const [state, formAction] = useActionState(update_status, null)
    const form = useRef<HTMLFormElement | null>(null)
    const box = useRef<HTMLDivElement>(null)
    const toggle = useRef<HTMLDivElement>(null)
        
    useEffect(() => {
        if (state) {
            setNotification(true)
        }
    }, [state])

    useEffect(() => {
        if (value !== status) {
            setShow(false)
            form.current?.requestSubmit()
        }
    }, [value])

    useEffect(() => {
        const outside = (event: MouseEvent | TouchEvent) => {
            if (!box.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) {
                setShow(false)
            }
        }

        document.addEventListener("click", outside)

        return () => {
            document.removeEventListener("click", outside)
        }
    }, [])
        
    const Button = () => {
        const {pending} = useFormStatus()

        useEffect(() => {
        setLoading(pending)

        if (pending) {
            setNotification(false)
        } 
        }, [pending])
    
        return (<></>)
    }
  
    return (
        <div className={`${isOwner ? '' : 'hidden'} grid`}>
            <form ref={form} action={formAction} className='hidden'>
                <input type='text' name='id' value={id} readOnly />
                <input type='text' name='status' value={value} readOnly />
                <Button />
            </form>
            <div className={`${loading ? 'hidden' : ''} relative`}>
                <div ref={toggle} onClick={() => setShow(!show)} className="cursor-pointer">
                    <PiPencilSimple className="text-xl text-gray-500" />
                </div>
                <div ref={box} className={`${show ? '' : 'hidden'} absolute top-full right-0 mt-2 py-1 rounded-sm w-max bg-gray-50 border border-gray-300 shadow`}>
                    <h1 onClick={() => setValue(1)} className={`${value === 1 ? 'bg-gray-100 text-gray-500' : 'hover:bg-gray-100 text-gray-900'} py-1.5 px-3 text-sm cursor-pointer`}>Not started</h1>
                    <h1 onClick={() => setValue(2)} className={`${value === 2 ? 'bg-gray-100 text-gray-500' : 'hover:bg-gray-100 text-gray-900'} py-1.5 px-3 text-sm cursor-pointer`}>Ongoing</h1>
                    <h1 onClick={() => setValue(3)} className={`${value === 3 ? 'bg-gray-100 text-gray-500' : 'hover:bg-gray-100 text-gray-900'} py-1.5 px-3 text-sm cursor-pointer`}>Done</h1>
                </div>
            </div>
            <div className={`${loading ? '' : 'hidden'} w-5 border-2 aspect-square rounded-full border-gray-300 border-r-transparent animate-spin`} />
            {notification && state && <Notification text={state.success ? state.success : state.error ? state.error : ''} success={state.success ? true : false} />}
        </div>
    );
}