export default interface HttpServerAdapter {
  get: (url: string, callback: Function) => Promise<void>
  post: (url: string, callback: Function) => Promise<void>
  listen: (port: number, callback: Function) => Promise<void>
}