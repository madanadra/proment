export type Auth = {
    title: string
    action: (_current: any, e: FormData) => Promise<{error: string, token?: undefined} | {error?: undefined, token: string}>,
    input: {
        label: string
        type: string
        name: string
    }[],
    bottom: string
    url: string
    name: string
}

export type Project = {
    id: string
    name: string
    owner: {
        id: string
        username: string
    }
    updatedAt: Date
    createdAt: Date
}

export type Task = {
    id: string
    title: string
    description: string | null
    status: number
    membership: {
        user: {
            id: string
            username: string 
        }
    }[]
    updatedAt: Date
    createdAt: Date
}

export type Index = Project & {
    auth: string
    taskCount: number
    userCount: number
    progress: number
}

export type Detail = Index & {
    task: Task[]
    yourTaskCount: number
}