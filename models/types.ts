import { User } from "../db"
import { Request } from "express"

export type AuthRequest<P = {}> = Request<P> & {
    user?: User,
}
