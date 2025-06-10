//Felix' property
'use server'

import {getCookie} from "@/scripts/cookies";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function NavigationBar() {
    let user = await getCookie("username")
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link href="/">Essenseite</Link>
                </div>
                <div className="space-x-4">
                    <Link href="/new" className="text-white py-2 px-4 hover:text-gray-300">Rezept erstellen</Link>
                </div>
                <div className="space-x-4">
                    {user
                        ? <>
                            <LogoutButton/>
                        </>
                        : <>
                            <Link href="/register"
                                  className="text-white py-2 px-4 border-2 rounded-xl hover:text-gray-300">Registrieren</Link>
                            <Link href="/login"
                                  className="text-white py-2 px-4 border-2 rounded-xl hover:text-gray-300">Anmelden</Link>
                        </>
                    }
                </div>
            </div>
        </nav>
    );
}