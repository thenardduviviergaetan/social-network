export type User = {
    uuid: string
    email: string
    firstName: string
    lastName: string
    dateOfBirth: string
    status: boolean
    nickname?: string
    about?: string
}
export type Follower = {
    uuid: string
    firstName: string
    lastName: string
}
export type Param = {
    page?: string
    user?: string
}

export type TokenUser = {
    id: string
    email: string
    name: string
    uuid: string
}

export type Comment = {
    id: number
    author_id: string
    author: string
    post_id: number
    content: string
    image: File | null
    date: string
}
