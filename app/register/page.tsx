'use client';

import {useState} from 'react';
import {query} from "@/scripts/query";
import {redirect} from "next/navigation";
import {setCookie} from "@/scripts/cookies";
import NavigationBar from "@/components/NavigationBar";
import {getUserNameClientSide} from "@/scripts/utils";

export default function RegisterPage() {
    const user = getUserNameClientSide(document)
    if (user) {
        redirect("/")
    }

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
        let result = (await query(`SELECT "Nutzername"
                                   FROM "Nutzer"
                                   WHERE "Nutzername" = '${username}';`))

        if (result.length !== 0) {
            alert(`Dieser Nutzername ${result[0].Nutzername} ist bereits vergeben.`)
            return;
        }
        let result2 = (await query(`SELECT "Nutzername"
                                    FROM "Nutzer"
                                    WHERE "Passwort" = '${password}';`))
        if (result2.length !== 0) {
            alert(`Passwort ist falsch. Dieses gehört zu Nutzer ${result2[0].Nutzername}`)
            return;
        }
        await query(`INSERT INTO "Nutzer" ("Nutzername", "Passwort", "Vorname", "Name", "Wohnort", "Land", "email",
                                           "Geburtsdatum")
                     VALUES ('${username}', '${password}', '${firstName}', '${lastName}', 'Berghain', '${country}',
                             '${email}', '${birthday}')`)
        await setCookie("username", username)
        redirect("/")
    };

    return (
        <>
            <NavigationBar username={getUserNameClientSide(document)}/>
            <div className="flex justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="mt-16 w-full max-w-md space-y-6"
                >
                    <h2 className="text-2xl font-bold text-center">Registrierung</h2>

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

                    <div className="flex space-x-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vorname</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nachname</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value="Berghain"
                                disabled={true}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Land</label>
                            <input
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Geburtsdatum</label>
                        <input
                            type="date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-800 transition cursor-pointer"
                    >
                        Registrieren
                    </button>
                </form>
            </div>
        </>
    );
}
