import { IncomingMessage } from "http";

export type ParsedBody = Record<string, unknown> | unknown[] | string

const getBodyFromRequest = (request: IncomingMessage): Promise<string> => {
  const body: Buffer[] = []

  return new Promise((resolve, reject) => {
    request.on('data', (chunk: Buffer) => {
      body.push(chunk)
    })

    request.on('end', () => {
      resolve(Buffer.concat(body).toString())
    })

    request.on('error', (e: Error) => {
      reject(e)
    })
  })
}

const tryParseBodyBuffer = (input: string): ParsedBody => {
  let parsedInput;

  try {
    parsedInput = JSON.parse(input)

    return parsedInput
  } catch {
    return input
  }
}

export const getParsedBody = async (request: IncomingMessage): Promise<ParsedBody> => {
  const body = await getBodyFromRequest(request)
  return tryParseBodyBuffer(body)
}