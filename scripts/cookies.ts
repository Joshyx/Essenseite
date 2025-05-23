'use server'

import {cookies} from "next/headers";

export async function getCookie(key: string) {
    let cookiesStore = await cookies()
    return cookiesStore.get(key)?.value
}
export async function setCookie(key: string, value: string) {
    let cookieStore = await cookies()
    cookieStore.set(key, value)
}
export async function deleteCookie(key: string) {
    let cookiesStore = await cookies()
    return cookiesStore.delete(key)
}
