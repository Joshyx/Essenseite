'use client'
//Felix' property
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function NavigationBar({username}: {username: string | undefined}) {
    return (
        <nav className="bg-gray-800 p-4 items-center h-20">
            <div className="mx-auto flex justify-between items-center h-full">
                <div className="text-white text-xl font-bold">
                    <Link href="/">Essenseite</Link>
                </div>
                <div className="flex items-center">
                    <div className="space-x-4">
                        <Link href="/new" className="text-white py-2 px-4 hover:text-gray-300">Rezept erstellen</Link>
                    </div>
                    <div className="space-x-4">
                        <Link href="/zutat" className="text-white py-2 px-4 hover:text-gray-300">Zutaten</Link>
                    </div>
                    <div className="space-x-4">
                        {username
                            ? <>
                                <LogoutButton/>
                            </>
                            : <>
                                <Link href="/register"
                                      className="my-8 text-white font-semibold py-2 px-4 border-2 rounded-xl hover:text-gray-300">Registrieren</Link>
                                <Link href="/login"
                                      className="text-white font-semibold py-2 px-4 border-2 rounded-xl hover:text-gray-300">Anmelden</Link>
                            </>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}
