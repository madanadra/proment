import Link from "next/link"
import { Auth } from "@/type"
import FormUnauth from "./form_unauth"

export default function TemplateUnauth({title, action, input, bottom, url, name}: Auth) {
    return (
        <div className="p-7 max-w-md mx-auto grid gap-y-8">
            <h1 className="my-4 text-3xl">{title}</h1>
            <FormUnauth title={title} action={action} input={input} />
            <h1 className="text-sm text-center">
                {bottom} <span className="font-semibold underline"><Link href={url}>{name}</Link></span>
            </h1>
        </div>
    )
}