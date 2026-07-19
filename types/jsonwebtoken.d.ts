declare module 'jsonwebtoken' {
  export function sign(payload: unknown, secretOrPrivateKey: string, options?: unknown): string
  export function verify(token: string, secretOrPrivateKey: string): unknown
}
