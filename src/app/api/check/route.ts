import prisma from "@/prisma"
import { NextRequest } from "next/server"
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
    const data = req.nextUrl.searchParams
    const token = data.get('token') || ''

    const res = await prisma.user.findUnique({
        where: {
            token: token
        }
    })

    if (res) {
        try {
            const decode = jwt.verify(token, process.env.SECRET_KEY || '') as {username: string}
            
            if (res.username === decode.username) {
                return Response.json(true)
            }

            return Response.json(false)
        } catch {
            return Response.json(false)
        }
    }
   
    return Response.json(false)
}