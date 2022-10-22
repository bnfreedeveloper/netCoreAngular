export interface LoginResponse {
    statusCode?: number,
    message?: string,
    name: string,
    userName: string,
    token: string,
    expiration: string,
    success: boolean
}