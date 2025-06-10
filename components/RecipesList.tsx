'use client'

import RecipePanel from "@/components/RecipePanel";
import {useState} from "react";

export default function RecipesList(params: {
    user: Record<string, any> | undefined,
    recipes: Record<string, any>[],
    favourites: string[]
}) {
    const [onlyFavourites, setOnlyFavourites] = useState(false)
    const [onlyMine, setOnlyMine] = useState(false)
    const [search, setSearch] = useState('')

    const filteredRecipes = params.recipes.filter((re) => {
        const isFavourite = params.favourites.find((favID) => {
            return favID === re.RID
        }) !== undefined

        if (!isFavourite && onlyFavourites) return false
        if (re.Ersteller !== params.user?.ID && onlyMine) return false
        if (search && !(re.Name.toLowerCase().includes(search.toLowerCase())
            || re.Beschreibung.toLowerCase().includes(search.toLowerCase())))
            return false

        return true
    })

    return (
        <>
            <div className="flex justify-end items-center align-middle space-x-4 p-4">
                {params.user && <div>
                    <input
                        type="checkbox"
                        id="checkbox1"
                        defaultChecked={onlyFavourites}
                        onChange={(e) => {
                            setOnlyFavourites(!onlyFavourites)
                        }}
                        className="mx-2 w-5 h-5 align-middle ring ring-gray-500 accent-gray-800"
                    />
                    <label htmlFor="checkbox1" className="text-gray-700 align-middle">Nur Lieblinge</label>
                </div>}
                {params.user && <div>
                    <input
                        type="checkbox"
                        id="checkbox2"
                        defaultChecked={onlyMine}
                        onChange={(e) => {
                            setOnlyMine(!onlyMine)
                        }}
                        className="mx-2 w-5 h-5 align-middle ring ring-gray-500 accent-gray-800"
                    />
                    <label htmlFor="checkbox2" className="text-gray-700 align-middle">Nur eigene Rezepte</label>
                </div>}
                <div>
                    <input
                        type="text"
                        placeholder="Suchen..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecipes.length !== 0 ? filteredRecipes.map((re) => {
                    const isFavourite = params.favourites.find((favID) => {
                        return favID === re.RID
                    }) !== undefined

                    return <RecipePanel key={re.RID} id={re.RID} name={re.Name} description={re.Beschreibung}
                                        length={re.Dauer} fav={isFavourite} uid={params.user?.ID}/>
                }) : <div>Keine Rezepte gefunden</div>}
            </div>
        </>
    )
}