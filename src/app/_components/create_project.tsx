'use client'

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useState } from "react"
import { create_project } from "@/fetch"
import Notification from "./notification"

export default function CreateProject() {
  const [show, setShow] = useState<boolean>(false)
  const [notification, setNotification] = useState<boolean>(false)
  const [state, formAction] = useActionState(create_project, null)
    
  useEffect(() => {
    if (state) {
      setNotification(true)
      setShow(false)
    }
  }, [state])
    
  const Button = () => {
    const {pending} = useFormStatus()

    useEffect(() => {
      if (pending) {
        setNotification(false)
      } 
    }, [pending])
  
    return (
      <button type="submit" disabled={pending} className="text-xs font-bold cursor-pointer disabled:text-gray-500 disabled:cursor-default">
        {pending ? 'Adding...' : 'Add'} 
      </button>
    )
  }
  
  return (
    <div className="grid">
      <button onClick={() => setShow(true)} className="w-max rounded-sm text-gray-100 text-xs font-bold bg-gray-950 py-2 px-4 cursor-pointer">
        Create project
      </button>
      <div onClick={() => setShow(false)} className={`${show ? 'grid' : 'hidden'} fixed inset-0 items-center bg-gray-950/50 p-4`}>
        <form action={formAction} onClick={(e) => e.stopPropagation()} 
        className='grid gap-y-6 max-w-sm w-full rounded-sm bg-gray-50 border border-gray-300 p-4 mx-auto anim-modal'>
          <h1 className="text-lg">Create project</h1>
          <div className="grid gap-y-2">
            <label className="text-sm font-semibold">Name</label>
            <input type='text' name='name' required
            className="p-2 text-sm rounded-sm bg-gray-50 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950" />
          </div>
          <div className="flex justify-end gap-x-6 mt-3">
            <button type="reset" onClick={() => setShow(false)} className="text-xs font-bold cursor-pointer text-gray-500">Cancel</button>
            <Button />
          </div>
        </form>
      </div>
      {notification && state && <Notification text={state.success ? state.success : state.error ? state.error : ''} success={state.success ? true : false} />}
    </div>
  );
}