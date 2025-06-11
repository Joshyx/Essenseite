'use client'

import React, {useEffect, useState} from 'react';
import NavigationBar from '@/components/NavigationBar';
import {query} from "@/scripts/query";
import ZutatPanel from "@/components/ZutatPanel";
import {getUserNameClientSide} from "@/scripts/utils";

export default function Zutaten() {
    const [ingredients, setIngredients] = useState<Record<string, any>[]>([])
    useEffect(() => {
        query('SELECT * FROM "Zutaten"').then((ingredients) => {
            setIngredients(ingredients)
        })
    }, [""])
    return (
        <div>
            <NavigationBar username={getUserNameClientSide(document)}/>
            <main className="container mx-auto p-4">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold mb-4">Zutaten</h1>
                    <p className="text-gray-700 align-middle">Nährwerte pro 100g</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ingredients.map((re) => {
                        return <ZutatPanel key={re.ZID} zutat={re}/>
                    })}
                </div>
            </main>
        </div>
    );
}
