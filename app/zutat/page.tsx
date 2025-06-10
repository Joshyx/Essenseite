'use server'

import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import {query} from "@/scripts/query";
import ZutatPanel from "@/components/ZutatPanel";
import {getCookie} from "@/scripts/cookies";

export default async function Home() {
    let ingredients = await query('SELECT * FROM "Zutaten"')
    return (
        <div>
            <NavigationBar username={await getCookie("username")}/>
            <main className="container mx-auto p-4">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold mb-4">Zutaten</h1>
                    <p className="text-gray-700 align-middle">Nährwerte pro 100g</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ingredients.map(async (re) => {
                        const neededForRecipes = (await query(`SELECT * FROM "Rezepte" JOIN "RezeptZutat" ON "RID"="Rezept" WHERE "Zutat"='${re.ZID}'`)).map((re) => {
                            return re.Name as string
                        })
                        return <ZutatPanel key={re.ZID} zutat={re} recipes={neededForRecipes}/>
                    })}
                </div>
            </main>
        </div>
    );
}
