'use server'

import React from 'react';
import NavigationBar from '@/components/NavigationBar';
import {query} from "@/scripts/query";
import {redirect} from "next/navigation";
import {getCookie} from "@/scripts/cookies";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import ZutatPanel from "@/components/ZutatPanel";
import AboutAuthorPanel from "@/components/AboutAuthorPanel";

export default async function RecipeDetail({params}: {params: Promise<{id: string}>}) {
    const id = (await params).id
    const recipe = (await query(`SELECT *
                                 FROM "Rezepte"
                                 WHERE "RID" = '${id}'`))[0]
    const ingredients = await query(`SELECT * FROM "RezeptZutat" JOIN "Zutaten" ON "ZID"="Zutat" WHERE "Rezept"='${recipe.RID}'`)
    const user = (await query(`SELECT * FROM "Nutzer" WHERE "ID"='${recipe.Ersteller}'`))[0]

    const totalNutritionalValue = ingredients.reduce((prev, cur) => {

        return {
            "Kalorien": cur.Kalorien + prev.Kalorien,
            "Fett": cur.Fett + prev.Fett,
            "Gesättigte": cur.Gesättigte + prev.Gesättigte,
            "Kohlenhydrate": cur.Kohlenhydrate + prev.Kohlenhydrate,
            "Zucker": cur.Zucker + prev.Zucker,
            "Eiweiß": cur.Eiweiß + prev.Eiweiß,
        }
    })
    totalNutritionalValue["Name"] = "Nährwerte"

    if (!recipe) {
        redirect("/")
    }

    return (
        <div>
            <NavigationBar/>
            <main className="container mx-auto p-4 flex justify-between">
                <div>
                    <label>{user.Nutzername}</label>
                    <h1 className="text-3xl font-bold mb-4">{recipe.Name}</h1>
                    <p className="text-gray-700 mb-4">{recipe.Beschreibung}</p>
                    <p className="mb-4 font-bold">Dauer: {recipe.Dauer}min</p>
                    <div className="mb-4">
                        <h3 className="text-xl font-bold mb-2">Zutaten:</h3>
                        <ul className="list-disc pl-5">
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className="text-gray-700">{ingredient.Menge} {ingredient.Name}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Zubereitung:</h3>
                        <ol className="list-decimal pl-5">
                            {recipe.Zubereitung.toString().split("SEPERATOR").map((instruction: string, index: number) => (
                                <li key={index} className="text-gray-700">{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div>
                    <ZutatPanel zutat={totalNutritionalValue}/>
                    <AboutAuthorPanel author={user}/>
                    {(await getCookie("username")) == user.Nutzername &&
                        <DeleteRecipeButton id={id}/>
                    }
                </div>
            </main>
        </div>
    );
};
