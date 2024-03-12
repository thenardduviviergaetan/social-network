export type User = {
    uuid: string
    email: string
    firstName: string
    lastName: string
    dateOfBirth: string
    nickname?: string
    about?: string
}

export type TokenUser = {
    id: string
    email: string
    name: string
    uuid: string
}