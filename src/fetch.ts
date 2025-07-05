'use server'

import { revalidatePath } from "next/cache"
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import prisma from "./lib/prisma"

export async function sign_up(_: unknown, e: FormData) {
    const username = e.get('username') as string
    const password = e.get('password') as string
    const passwordConfirmation = e.get('password-confirmation') as string

    if (!username) {
        return {error: 'Username cannot be empty.'}
    }

    if (!password) {
        return {error: 'Password cannot be empty.'}
    }

    if (!passwordConfirmation) {
        return {error: 'Password confirmation cannot be empty.'}
    }

    if (password !== passwordConfirmation) {
        return {error: 'Password confirmation does not match.'}
    }

    try {
        const res = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        
        if (res) return {error: 'Username already exists.'}

        const token = jwt.sign({username: username}, process.env.SECRET_KEY || '', {expiresIn: '7d'})

        bcrypt.hash(password, 10, async (_err, hash) => {
            await prisma.user.create({
                data: {
                    username: username,
                    password: hash,
                    token: token
                }
            })
        })

        return {token: token}

    } catch {
        return {error: 'Something went wrong.'}
    }
}

export async function log_in(_: unknown, e: FormData) {
    const username = e.get('username') as string
    const password = e.get('password') as string

    if (!username) {
        return {error: 'Username cannot be empty.'}
    }

    if (!password) {
        return {error: 'Password cannot be empty.'}
    }

    try {
        const res = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        
        if (!res) return {error: 'Username or password is incorrect.'}

        const match = await bcrypt.compare(password, res.password)
        
        if (!match) {
            return {error: 'Username or password is incorrect.'}
        }

        const token = jwt.sign({username: username}, process.env.SECRET_KEY || '', {expiresIn: '7d'})

        await prisma.user.update({
            where: {
                id: res.id
            },
            data: {
                token: token
            }
        })

        return {token: token}

    } catch {
        return {error: 'Something went wrong.'}
    }
}

export async function log_out(_: unknown, __: unknown) {
    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value

        await prisma.user.update({
            where: {
                token: token
            },
            data: {
                token: null
            }
        })
        
        return {token: token}

    } catch {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        return {token: token}
    }
}

export async function verify() {
    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value || ''
        const decode = jwt.verify(token, process.env.SECRET_KEY || '') as {username: string}

        return decode.username
    } catch {
        return ''
    }
    
}

export async function get_index() {
    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        })

        if (!user) {
            return {error: 'Authentication error.'}
        }

        const first = await prisma.task.findMany({
            where: {
                membership: {
                    some: {
                        userId: user.id
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                projectId: true
            }, 
            distinct: ['projectId']
        })

        const second = await prisma.project.findMany({
            where: {
                OR: [
                    {ownerId: user.id}, 
                    {id: {in: first.map(item => item.projectId)} 
                }]
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                task: {
                    include: {
                        membership: true
                    }
                }
            }
        })

        const res = second.map(item => {
            const array = item.task.flatMap(task => task.membership).map(membership => membership.userId)
            const sum = item.task.reduce((acc, val) => acc + (val.status - 1), 0)/2
            const {task, ...rest} = item 

            return {
                ...rest,
                auth: user.id,
                taskCount: item.task.length,
                userCount: new Set(array).size,
                progress: item.task.length ? Math.round((sum*100)/item.task.length) : 0
            }
        })
        
        return {data: res}

    } catch {
        return {error: 'Something went wrong.'}
    }
}

export async function create_project(_: unknown, e: FormData) {
    const name = e.get('name') as string

    if (!name) {
        return {
            error: 'Name cannot be empty.',
            id: Date.now()
        }
    }

    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        })

        if (!user) {
            return {
                error: 'Authentication error.',
                id: Date.now()
            }
        }

        await prisma.project.create({
            data: {
                name: name,
                ownerId: user.id
            }
        })

        revalidatePath('/', 'page')

        return {
            success: 'Successfully created the project.',
            id: Date.now()
        }

    } catch {
        return {
            error: 'Something went wrong.',
            id: Date.now()
        }
    }
}

export async function get_detail(id: string) {
    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        })

        if (!user) {
            return {error: 'Authentication error.'}
        }

        const project = await prisma.project.findUnique({
            where: {
                id: id
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                task: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        membership: {
                            orderBy: {
                                createdAt: 'desc'
                            },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!project) {
            return {error: 'Project not found.'}
        }

        const first = await prisma.task.findMany({
            where: {
                membership: {
                    some: {
                        userId: user.id
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                projectId: true
            }, 
            distinct: ['projectId']
        })

        const second = await prisma.project.findMany({
            where: {
                OR: [
                    {ownerId: user.id}, 
                    {id: {in: first.map(item => item.projectId)} 
                }]
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true
            }
        })

        if (!second.map(item => item.id).includes(id)) {
            return {error: 'Authorization error.'}
        }

        const taskMap = project.task.flatMap(task => task.membership)
        const userMap = taskMap.map(membership => membership.userId)
        const yourTaskMap = taskMap.filter(membership => membership.userId === user.id).map(membership => membership.taskId)
        const statusSum = project.task.reduce((acc, val) => acc + (val.status - 1), 0)/2

        const res = {
            ...project,
            auth: user.id,
            taskCount: project.task.length,
            userCount: new Set(userMap).size,
            progress: project.task.length ? Math.round((statusSum*100)/project.task.length) : 0,
            yourTaskCount: yourTaskMap.length
        }

        return {data: res}

    } catch {
        return {error: 'Something went wrong.'}
    }
}

export async function create_task(_: unknown, e: FormData) {
    const id = e.get('id') as string
    const title = e.get('title') as string
    const description = e.get('description') as string
    const assignee = e.getAll('assignee') as string[]

    if (!title) {
        return {
            error: 'title cannot be empty.',
            id: Date.now()
        }
    }

    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        const user = await prisma.user.findUnique({
            where: {
                token: token
            },
            include: {
                project: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })

        if (!user) {
            return {
                error: 'Authentication error.',
                id: Date.now()
            }
        }

        if (!user.project.map(item => item.id).includes(id)) {
            return {
                error: 'Authorization error.',
                id: Date.now()
            }
        }

        await prisma.project.update({
            where: {
                id: id
            },
            data: {
                task: {
                    create: {
                        title: title,
                        description: description,
                        membership: {
                            create: assignee.map(item => ({userId: item}))
                        }
                    }
                }
            }
        })

        revalidatePath('/'+id, 'page')

        return {
            success: 'Successfully created the task.',
            id: Date.now()
        }

    } catch {
        return {
            error: 'Something went wrong.',
            id: Date.now()
        }
        
    }
}

export async function get_user(value: string) {
    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        })

        if (!user) {
            return {error: 'Authentication error.'}
        }

        const res = await prisma.user.findMany({
            where: {
                username: {
                    contains: value,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                username: true
            }
        })

        return {data: res}

    } catch {
        return {error: 'Something went wrong.'}
    }
}

export async function update_status(_: unknown, e: FormData) {
    const id = e.get('id') as string
    const status = e.get('status') as string

    if (![1, 2, 3].includes(Number(status))) {
        return {
            error: 'Validation error on status.',
            id: Date.now()
        }
    }

    try {
        const cookie = await cookies()
        const token = cookie.get('auth-token')?.value
        
        const user = await prisma.user.findUnique({
            where: {
                token: token
            },
            include: {
                project: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        task: {
                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }
                }
            }
        })

        if (!user) {
            return {
                error: 'Authentication error.',
                id: Date.now()
            }
        }

        const task = await prisma.task.findUnique({
            where: {
                id: id
            }
        })

        if(!task) {
            return {
                error: 'Task not found.',
                id: Date.now()
            }
        }

        if (!user.project.map(item => item.id).includes(task.projectId)) {
            return {
                error: 'Authorization error.',
                id: Date.now()
            }
        }

        await prisma.task.update({
            where: {
                id: task.id
            },
            data: {
                status: Number(status)
            }
        })

        revalidatePath('/'+task.projectId, 'page')

        return {
            success: 'Successfully updated the status.',
            id: Date.now()
        }

    } catch {
        return {
            error: 'Something went wrong.',
            id: Date.now()
        }
    }
}