'use client'

import RecipePanel from "@/components/RecipePanel";
import {useState} from "react";
import {deleteAll, importRecipes} from "@/scripts/utils";
import CategoryDropdown from "@/components/CategoryDropdown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSortDown} from "@fortawesome/free-solid-svg-icons";

export default function RecipesList(params: {
    user: Record<string, any> | undefined,
    recipes: Record<string, any>[],
    favourites: string[]
}) {
    const [onlyFavourites, setOnlyFavourites] = useState(false)
    const [onlyMine, setOnlyMine] = useState(false)
    const [onlyVegan, setOnlyVegan] = useState(false)
    const [category, setCategory] = useState('Alle')
    const [search, setSearch] = useState('')

    const filteredRecipes = params.recipes.filter((re) => {
        const isFavourite = params.favourites.find((favID) => {
            return favID === re.RID
        }) !== undefined

        if (!isFavourite && onlyFavourites) return false
        if (re.Ersteller !== params.user?.ID && onlyMine) return false
        if (re.Vegan !== "true" && onlyVegan) return false
        if (re.Kategorie !== category && category !== 'Alle') return false
        if (search && !(re.Name.toLowerCase().includes(search.toLowerCase())
            || re.Beschreibung.toLowerCase().includes(search.toLowerCase())))
            return false

        return true
    })

    return (
        <>
            <div className="flex justify-end items-center align-middle space-x-4 p-4">
                <div>
                    <input
                        type="checkbox"
                        id="checkbox2"
                        defaultChecked={onlyVegan}
                        onChange={(e) => {
                            setOnlyVegan(!onlyVegan)
                        }}
                        className="mx-2 w-5 h-5 align-middle ring ring-gray-500 accent-gray-800"
                    />
                    <label htmlFor="checkbox2" className="text-gray-700 align-middle">Nur vegane Rezepte</label>
                </div>
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
                    <label htmlFor="checkbox1" className="text-gray-700 align-middle">Nur Gehasste</label>
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
                <div className="relative">
                    <select
                        className="shadow appearance-none border rounded w-full py-2 pl-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {setCategory(e.target.value)}}
                    >
                        <option>Alle</option>
                        <option>Abendessen</option>
                        <option>Vorspeise</option>
                        <option>Nachtisch</option>
                        <option>Getränke</option>
                        <option>Sonstige</option>
                    </select>
                    <FontAwesomeIcon icon={faSortDown} className="absolute right-4 top-1/5"/>
                </div>
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

                    return <RecipePanel key={re.RID} recipe={re} fav={isFavourite} uid={params.user?.ID}/>
                }) : <div>Keine Rezepte gefunden</div>}
            </div>
        </>
    )
}