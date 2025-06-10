'use client'

import {deleteCookie} from "@/scripts/cookies";

export default function LogoutButton() {
    return <button className="w-full py-2 px-4 text-white border-2 font-semibold rounded-xl cursor-pointer" onClick={logout}>
        Abmelden
    </button>
}

async function logout() {
    await deleteCookie("username")
    window.location.reload()
}