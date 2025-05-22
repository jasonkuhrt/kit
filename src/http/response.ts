import { Status } from './status/index.js'

export const notFound: Response = new Response(Status.NotFound.description, { status: Status.NotFound.code })
