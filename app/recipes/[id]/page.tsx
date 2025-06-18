'use client'

import React, {useEffect, useState} from 'react';
import NavigationBar from '@/components/NavigationBar';
import {query} from "@/scripts/query";
import {redirect, useParams} from "next/navigation";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import ZutatPanel from "@/components/ZutatPanel";
import AboutAuthorPanel from "@/components/AboutAuthorPanel";
import Link from 'next/link';
import {getUserNameClientSide} from "@/scripts/utils";

export default function RecipeDetail() {
    const params = useParams<{ id: string }>()
    const id = params.id;

    const [recipe, setRecipe] = useState<Record<string, any> | undefined>(undefined)
    const [ingredients, setIngredients] = useState<Record<string, any>[]>([])
    const [user, setUser] = useState<Record<string, any> | undefined>(undefined)
    const [nutritionalValue, setNutritionalValue] = useState<Record<string, any> | undefined>(undefined)
    useEffect(() => {
        new Promise(async () => {

            const rec = (await query(`SELECT *
                                 FROM "Rezepte"
                                 WHERE "RID" = '${id}'`))[0]
            if(!rec) {
                redirect("/")
            }
            setRecipe(rec)

            setUser((await query(`SELECT * FROM "Nutzer" WHERE "ID"='${rec.Ersteller}'`))[0])
        })
    }, [""])
    useEffect(() => {
        query(`SELECT * FROM "RezeptZutat" JOIN "Zutaten" ON "ZID"="Zutat" WHERE "Rezept"='${id}'`).then((ings) => {

            setIngredients(ings)

            const totalNutritionalValue = ings?.length > 0 ? ings.reduce((prev, cur) => {
                return {
                    "Kalorien": cur.Kalorien + prev.Kalorien,
                    "Fett": cur.Fett + prev.Fett,
                    "Gesättigte": cur.Gesättigte + prev.Gesättigte,
                    "Kohlenhydrate": cur.Kohlenhydrate + prev.Kohlenhydrate,
                    "Zucker": cur.Zucker + prev.Zucker,
                    "Eiweiß": cur.Eiweiß + prev.Eiweiß,
                }
            }) : {}
            totalNutritionalValue["Name"] = "Nährwerte"
            setNutritionalValue(totalNutritionalValue)
        })
    }, [""])

    return (
        <div>
            <NavigationBar />
            <main className="container mx-auto p-4 flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-4">{recipe?.Name ?? "Name"}</h1>
                    <p className="text-gray-700 mb-4">{recipe?.Beschreibung ?? "Beschreibung"}</p>
                    <p className="mb-4 font-bold">Dauer: {recipe?.Dauer}min</p>
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
                            {recipe?.Zubereitung.toString().split("SEPERATOR").map((instruction: string, index: number) => (
                                <li key={index} className="text-gray-700">{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </div>
                <div>
                    {nutritionalValue && <ZutatPanel zutat={nutritionalValue} />}
                    {user && <AboutAuthorPanel author={user} fullInfo={false}/>}
                    <div className="flex justify-end space-x-3 items-center">
                        <Link
                            href="/"
                            className="float-end py-2 px-4 mt-8 bg-gray-950 text-white rounded-xl cursor-pointer"
                        >Zurück</Link>
                        {user && getUserNameClientSide(document) == user.Nutzername &&
                            <DeleteRecipeButton id={id}/>
                        }
                    </div>
                </div>
            </main>
        </div>
    );
};
