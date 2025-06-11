'use client';

import {useEffect, useState} from 'react';
import {query} from "@/scripts/query";
import {redirect} from "next/navigation";
import NavigationBar from "@/components/NavigationBar";
import {getUserNameClientSide} from "@/scripts/utils";
import {setCookie} from "@/scripts/cookies";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would call your login API
        let result = (await query(`SELECT "Nutzername"
                                   FROM "Nutzer"
                                   WHERE "Passwort" = '${password}';`))

        if (result.length === 0) {
            alert("Nutzername oder Passwort falsch.")
            return;
        }
        if (result[0].Nutzername != username) {
            alert(`Passwort ist falsch. Dieses gehört zu Nutzer ${result[0].Nutzername}`)
            return;
        }
        await setCookie("username", username)
        redirect("/")
    };

    return (
        <>
            <NavigationBar/>
            <div className="mt-16 min-h-screen flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white w-full max-w-md space-y-6"
                >
                    <h2 className="text-2xl font-bold text-center">Login</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nutzername</label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Passwort</label>
                        <input
                            type="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition cursor-pointer"
                    >
                        Anmelden
                    </button>
                </form>
            </div>
        </>
    );
}
