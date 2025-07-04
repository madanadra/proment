'use client'

import { useFormStatus } from "react-dom"
import { useActionState, useEffect } from "react"
import { log_out } from "@/fetch"
import { PiSignOut } from "react-icons/pi"

export default function LogOut() {
  const [state, formAction] = useActionState(log_out, null)

  useEffect(() => {
    if (state?.token) {
      window.location.href = window.location.pathname+'?token='+state.token
    }
  }, [state])
  
  const Button = () => {
    const {pending} = useFormStatus()
  
    return (
      <button formAction={formAction} disabled={pending} className="ml-2 grid items-center">
        {pending ? <div className='w-5 border-2 aspect-square rounded-full border-gray-300 border-r-transparent animate-spin'/>
        : <PiSignOut className="text-xl text-gray-500 cursor-pointer" />}
      </button>
    )
  }
  
  return (
    <form>
      <Button />
    </form>
  );
}