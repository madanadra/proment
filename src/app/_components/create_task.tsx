'use client'

import { useFormStatus } from "react-dom"
import { useActionState, useEffect, useRef, useState } from "react"
import { create_task, get_user } from "@/fetch"
import Notification from "./notification"
import { PiX } from "react-icons/pi"

export default function CreateTask({id, isOwner}: {id: string, isOwner: boolean}) {
  const [show, setShow] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [list, setList] = useState<boolean>(false)
  const [assignee, setAssignee] = useState<{id: string, username: string}[]>([])
  const [user, setUser] = useState<{id: string, username: string}[]>([])
  const [error, setError] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [notification, setNotification] = useState<boolean>(false)
  const [state, formAction] = useActionState(create_task, null)
  const box = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLInputElement>(null)
    
  useEffect(() => {
    if (state) {
      setNotification(true)
      setShow(false)
      setAssignee([])
      setUsername('')
    }
  }, [state])

  useEffect(() => {
    const outside = (event: MouseEvent | TouchEvent) => {
      if (!box.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) {
        setList(false)
      }
    }

    document.addEventListener("click", outside)

    return () => {
      document.removeEventListener("click", outside)
    }
  }, [])

  useEffect(() => {
    setLoading(true)

    const getUser = async () => { 
      await get_user(username)
      .then(res => res.data ? setUser(res.data) : setError(res.error))
      .catch(error => setError(error))
      .finally(() => setLoading(false))
    }

    if (username) {
      const debounce = setTimeout(() => {
        getUser()
      }, 300)

      return () => clearTimeout(debounce)
    }
  }, [username])
    
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
    <div className={`${isOwner ? '' : 'hidden'} grid`}>
      <button onClick={() => setShow(true)} className="w-max rounded-sm text-gray-100 text-xs font-bold bg-gray-950 py-2 px-4 cursor-pointer">
        Create task
      </button>
      <div onClick={() => setShow(false)} className={`${show ? 'grid' : 'hidden'} fixed inset-0 items-center bg-gray-950/50 p-4 z-50`}>
        <form action={formAction} onClick={(e) => e.stopPropagation()} 
        className='grid gap-y-6 max-w-sm w-full rounded-sm bg-gray-50 border border-gray-300 p-4 mx-auto anim-modal'>
          <h1 className="text-lg">Create task</h1>
          <input type='text' name='id' value={id} readOnly className="hidden" />
          <div className="grid gap-y-2">
            <label className="text-sm font-semibold">Title</label>
            <input type='text' name='title' required
            className="p-2 text-sm rounded-sm bg-gray-50 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950" />
          </div>
          <div className="grid gap-y-2">
            <label className="text-sm font-semibold">Description</label>
            <input type='text' name='description'
            className="p-2 text-sm rounded-sm bg-gray-50 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950" />
          </div>
          <div className="grid gap-y-2">
            <label className="text-sm font-semibold">Assignee</label>
            <div className="flex items-center gap-2">
              {assignee.map(item =>
                <div key={item.id} className="w-max rounded-full py-1 px-2 border border-gray-300 flex items-center gap-x-2">
                  <input type='text' name='assignee' value={item.id} readOnly className="hidden" />
                  <h1 className="text-xs">{item.username}</h1>
                  <PiX onClick={() => setAssignee(prev => prev.filter(data => data.id !== item.id))} 
                  className="text-gray-500 cursor-pointer" />
                </div>
              )}
            </div>
            <div className="relative">
              <input ref={toggle} type='text' value={username} onChange={(e) => setUsername(e.target.value)} onFocus={() => setList(true)}
              className="w-full p-2 text-sm rounded-sm bg-gray-50 border border-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950" />
              <div ref={box} className={`${username && list ? '' : 'hidden'} absolute top-full mt-2 inset-x-0 rounded-sm bg-gray-50 border border-gray-300 shadow py-1`}>
                {loading ? <div className='my-1 mx-auto w-5 border-2 aspect-square rounded-full border-gray-300 border-r-transparent animate-spin'/>
                : error ? <h1 className="text-sm font-medium text-center my-1">{error}</h1>
                : !user.length ? <h1 className="text-sm font-medium text-center my-1 text-gray-500">No results for &quot;<span className="text-gray-900">{username}</span>&quot;</h1>
                : user.map(item => <h1 key={item.id} onClick={() => !assignee.some(data => data.id === item.id) && (setAssignee(prev => [...prev, item]), setList(false))} 
                className={`${assignee.some(data => data.id === item.id) ? 'bg-gray-100 text-gray-500' : 'hover:bg-gray-100'} py-1 px-2 text-sm cursor-pointer`}>{item.username}</h1>)}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-x-6 mt-3">
            <button type="reset" onClick={() => (setShow(false), setAssignee([]), setUsername(''))} className="text-xs font-bold cursor-pointer text-gray-500">Cancel</button>
            <Button />
          </div>
        </form>
      </div>
      {notification && state && <Notification text={state.success ? state.success : state.error ? state.error : ''} success={state.success ? true : false} />}
    </div>
  );
}