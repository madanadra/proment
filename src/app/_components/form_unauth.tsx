'use client'

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useState } from "react"
import { Auth } from "@/type"
import Notification from "@/app/_components/notification"

export default function FormUnauth({title, action, input}: Pick<Auth, 'title' | 'action' | 'input'>) {
  const [notification, setNotification] = useState<boolean>(false)
  const [state, formAction] = useActionState(action, null)

  useEffect(() => {
    if (state?.token) {
      window.location.href = window.location.pathname+'?token='+state.token
    } else if (state?.error) {
      setNotification(true)
    }
  }, [state])

  const Button = () => {
    const {pending} = useFormStatus()

    useEffect(() => {
      pending && setNotification(false)
    }, [pending])

    return (
      <button type="submit" disabled={pending} 
      className="flex items-center justify-center gap-x-2 mt-2 rounded-sm text-gray-100 text-xs font-bold bg-gray-950 
      py-2 px-4 cursor-pointer disabled:text-gray-500 disabled:bg-gray-800 disabled:cursor-default">
        {pending && <div className='w-4 border-2 aspect-square rounded-full border-gray-300 border-r-transparent animate-spin'/>} 
        {title}
      </button>
    )
  }

  return (
    <form action={formAction} className="grid gap-y-4">
        {input.map((item, i) =>
            <div key={i} className="grid gap-y-2">
                <label className="text-sm font-semibold">{item.label}</label>
                <input type={item.type} name={item.name} required
                className="p-2 text-sm rounded-sm bg-gray-50 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950" />
            </div>
        )}
        <Button />
        {notification && state?.error && <Notification text={state.error} />}
    </form>
  );
}