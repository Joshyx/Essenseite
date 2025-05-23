'use client'

import {deleteCookie} from "@/scripts/cookies";

export default function LogoutButton() {
    return <button className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition" onClick={logout}>
        Logout
    </button>
}

async function logout() {
    await deleteCookie("username")
    window.location.reload()
}