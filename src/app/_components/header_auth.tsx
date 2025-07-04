import { verify } from "@/fetch";
import LogOut from "./log_out";
import Link from "next/link";

export default async function HeaderAuth() {
    const username = await verify()

    return (
        <div className="grid items-center h-14 border-b border-gray-300">
            <div className="max-w-7xl px-4 w-full flex items-center justify-between gap-x-12 mx-auto">
                <Link href='/' className="hidden sm:grid text-lg">Project Management</Link>
                <Link href='/' className="sm:hidden text-lg">PM</Link>
                <div className="flex items-center divide-x divide-gray-300">
                    <div className="grid">
                        <h1 className="truncate text-sm font-semibold mr-2">{username}</h1>
                    </div>
                    <LogOut />
                </div>
            </div>
        </div>
    )
}