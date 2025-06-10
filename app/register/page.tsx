'use client';

import { useState } from 'react';
import {query} from "@/scripts/query";
import {redirect} from "next/navigation";
import {getCookie, setCookie} from "@/scripts/cookies";

export default function RegisterPage() {
    getCookie("username").then(username => {
        if(username) {
            redirect("/")
        }
    })
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [country, setCountry] = useState('')
    const [email, setEmail] = useState('')
    const [birthday, setBirthday] = useState(new Date().toISOString().slice(0, 10))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would call your login API
        let result = (await query(`SELECT "Nutzername" FROM "Nutzer" WHERE "Nutzername"='${username}';`))

        if(result.length !== 0) {
            alert(`Dieser Nutzername ${result[0].Nutzername} ist bereits vergeben.`)
            return;
        }
        let result2 = (await query(`SELECT "Nutzername" FROM "Nutzer" WHERE "Passwort"='${password}';`))
        if(result2.length !== 0) {
            alert(`Passwort ist falsch. Dieses gehört zu Nutzer ${result2[0].Nutzername}`)
            return;
        }
        await query(`INSERT INTO "Nutzer" ("Nutzername", "Passwort", "Vorname", "Name", "Wohnort", "Land", "email", "Geburtsdatum")
                            VALUES ('${username}', '${password}', '${firstName}', '${lastName}', 'Berghain', '${country}', '${email}', '${birthday}')`)
        await setCookie("username", username)
        redirect("/")
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center">Registrierung</h2>

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

                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vorname</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nachname</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex space-x-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Wohnort</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value="Berghain"
                            disabled={true}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Land</label>
                        <input
                            type="text"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">E-Mail</label>
                    <input
                        type="email"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Geburtsdatum</label>
                    <input
                        type="date"
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                    Registrieren
                </button>
            </form>
        </div>
    );
}
