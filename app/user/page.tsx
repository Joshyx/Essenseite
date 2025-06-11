'use server'

import NavigationBar from '@/components/NavigationBar';
import {query} from "@/scripts/query";
import AboutAuthorPanel from "@/components/AboutAuthorPanel";
import {getCookie} from "@/scripts/cookies";

export default async function Nutzer() {
    const user = await query('SELECT * FROM "Nutzer"')
    return (
        <div>
            <NavigationBar/>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Autoren</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.map((nutzer) => {
                        return <AboutAuthorPanel key={nutzer.ID} author={nutzer} fullInfo/>
                    })}
                </div>
            </main>
        </div>
    );
}
