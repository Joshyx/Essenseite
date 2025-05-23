'use client';

import { useState } from 'react';
import {query} from "@/scripts/query";
import {redirect} from "next/navigation";
import {getCookie, setCookie} from "@/scripts/cookies";

export default function LoginPage() {
    getCookie("username").then(username => {
        if(username) {
            redirect("/")
        }
    })
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would call your login API
        let result = (await query(`SELECT "Nutzername" FROM "Nutzer" WHERE "Passwort"='${password}';`))

        if(result.length === 0) {
            alert("Nutzername oder Passwort falsch.")
            return;
        }
        if(result[0].Nutzername != username) {
            alert(`Passwort ist falsch. Dieses gehört zu Nutzer ${result[0].Nutzername}`)
            return;
        }
        await setCookie("username", username)
        redirect("/")
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nutzername</label>
                    <input
                        type="text"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Passwort</label>
                    <input
                        type="password"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                    Anmelden
                </button>
            </form>
        </div>
    );
}
