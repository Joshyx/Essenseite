'use client'

import {useEffect, useState} from "react";
import {query} from "@/scripts/query";

export default function ZutatPanel(params: { zutat: Record<string, any> }) {
    const [recipeNames, setRecipeNames] = useState(["keinem Rezept"])
    params.zutat.ZID !== undefined && useEffect(() => {
        query(`SELECT *
               FROM "Rezepte"
                        JOIN "RezeptZutat" ON "RID" = "Rezept"
               WHERE "Zutat" = '${params.zutat.ZID}'`)
            .then((rezut) => {
                const names: string[] = []
                rezut.forEach((it) => {
                    names.push(it.Name)
                })
                setRecipeNames(names)
            })
    }, [""])
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold">{params.zutat.Name}</h2>
            <p className="text-gray-700">Energie: {params.zutat.Kalorien}cal</p>
            <p className="text-gray-700">Fett: {params.zutat.Fett}g</p>
            <p className="text-gray-700 pl-5">Davon gesättigte Fettsäuren: {params.zutat.Gesättigte}g</p>
            <p className="text-gray-700">Kohlenhydrate: {params.zutat.Kohlenhydrate}g</p>
            <p className="text-gray-700 pl-5">Davon Zucker: {params.zutat.Zucker}g</p>
            <p className="text-gray-700">Eiweiß: {params.zutat.Eiweiß}g</p>
            {recipeNames && <p className="text-gray-700 font-semibold">Vorhanden
                in {recipeNames.join(", ").replace(/, ([^,]*)$/, ' und $1')}</p>}
        </div>
    )
}