import { Index } from "@/type";
import moment from "moment";
import { PiCrosshair, PiScroll, PiUser } from "react-icons/pi";

export default function CardProject({item}: {item: Index}) {
    return (
        <div className="grid sm:flex gap-y-4 gap-x-8 py-4">
            <div className="grow grid justify-items-start gap-y-1">
                <h1 className="text-lg font-medium hover:underline">{item.name}</h1>
                <h1 className="text-sm">
                    <span className={item.owner.id === item.auth ? 'text-indigo-700' : ''}>{item.owner.username}</span> &middot; {moment(item.createdAt).fromNow()}
                </h1>
            </div>
            <div className="flex items-center gap-x-6">
                <div className="flex items-center gap-x-1">
                    <PiScroll className="text-xl text-gray-500" />
                    <h1 className="text-xs text-gray-500">{item.taskCount}</h1>
                </div>
                <div className="flex items-center gap-x-1">
                    <PiUser className="text-xl text-gray-500" />
                    <h1 className="text-xs text-gray-500">{item.userCount}</h1>
                </div>
                <div className="grow flex items-center justify-end gap-x-1">
                    <PiCrosshair className="text-xl" />
                    <h1 className="text-xs">{item.progress}%</h1>
                </div>
            </div>
        </div>
    )
}