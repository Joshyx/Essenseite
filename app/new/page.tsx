'use client'

import {FormEvent, useState} from "react";
import {query} from "@/scripts/query";
import Link from "next/link";
import {redirect} from "next/navigation";
import NavigationBar from "@/components/NavigationBar";
import {getUserNameClientSide, randomInt} from "@/scripts/utils";
import CategoryDropdown from "@/components/CategoryDropdown";

export default function NewRecipePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([['', '']]);
    const [instructions, setInstructions] = useState(['']);
    const [length, setLength] = useState(0);
    const [category, setCategory] = useState('Abendessen')
    const [vegan, setVegan] = useState(true)

    const handleAddIngredient = () => {
        setIngredients([...ingredients, ['', '']]);
    };

    const handleAddInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleIngredientAmountChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][0] = value;
        setIngredients(newIngredients);
    };
    const handleIngredientNameChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index][1] = value;
        setIngredients(newIngredients);
    };

    const handleInstructionChange = (index: number, value: string) => {
        const newInstructions = [...instructions];
        newInstructions[index] = value;
        setInstructions(newInstructions);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let username = getUserNameClientSide(document)
        if (!username) {
            const users = (await query(`SELECT *
                                        FROM "Nutzer"`))
            const randomUser = users[randomInt(0, users.length - 1)]
            username = randomUser.Nutzername
            confirm(`Da du nicht angemeldet bist, wird dein Rezept stattdessen zufällig dem Nutzer ${username} zugeordnet`)
        }
        let UID = (await query(`SELECT "ID"
                                FROM "Nutzer"
                                WHERE "Nutzername" = '${username}'`))[0].ID

        const instructionsText = instructions.join("SEPERATOR")

        let recipeID = (await query(`INSERT INTO "Rezepte" ("Ersteller", "Erstellt", "Dauer", "Zubereitung",
                                                            "Beschreibung", "Name", "Kategorie", "Vegan")
                                     VALUES (${UID}, '${new Date().toISOString()}', ${length}, '${instructionsText}',
                                             '${description}',
                                             '${title}', '${category}', '${vegan}') RETURNING "RID"`))[0].RID

        for (const ingredient of ingredients) {

            let dbIngredientId: string = (await query(`SELECT *
                                                       FROM "Zutaten"
                                                       WHERE "Name" = '${ingredient[1]}'`))?.[0]?.ZID
            if (!dbIngredientId) {
                dbIngredientId = (await query(`INSERT INTO "Zutaten" ("Name", "Zucker", "Eiweiß", "Fett", "Gesättigte",
                                                                      "Kalorien", "Kohlenhydrate")
                                               VALUES ('${ingredient[1]}', '${randomInt(1, 100)}', '${randomInt(1, 100)}
                                                       ', '${randomInt(1, 100)}', '${randomInt(1, 100)}',
                                                       '${randomInt(1, 100)}', '${randomInt(1, 100)}
                                                       ') RETURNING "ZID"`))[0].ZID
            }
            await query(`INSERT INTO "RezeptZutat" ("Rezept", "Zutat", "Menge")
                         VALUES ('${recipeID}', '${dbIngredientId}', '${ingredient[0]}')`)
        }

        redirect("/")
    };

    return (
        <>
            <NavigationBar/>
            <main className="container mx-auto p-4">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-4 text-center">Neues Rezept erstellen</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Beschreibung
                        </label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Benötigte Zeit (Minuten)
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="title"
                            type="number"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            required
                        />
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="w-3/4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Kategorie
                            </label>
                            <CategoryDropdown
                                onChangeAction={(e) => setCategory(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Lecker
                            </label>
                            <input
                                type="checkbox"
                                id="checkbox2"
                                className="mx-2 w-6 h-6 align-middle ring ring-gray-500 accent-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Vegan
                            </label>
                            <input
                                type="checkbox"
                                id="checkbox2"
                                defaultChecked={vegan}
                                onChange={(e) => {
                                    setVegan(!vegan)
                                }}
                                className="mx-2 w-6 h-6 align-middle ring ring-gray-500 accent-gray-800"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredients">
                            Zutaten
                        </label>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="mb-2 flex space-x-3">
                                <input
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={ingredient[0]}
                                    onChange={(e) => handleIngredientAmountChange(index, e.target.value)}
                                    placeholder={`Anzahl ${index + 1}`}
                                    required
                                />
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={ingredient[1]}
                                    onChange={(e) => handleIngredientNameChange(index, e.target.value)}
                                    placeholder={`Zutat ${index + 1}`}
                                    required
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddIngredient}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Zutat hinzufügen
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instructions">
                            Zubereitung
                        </label>
                        {instructions.map((instruction, index) => (
                            <div key={index} className="mb-2">
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={instruction}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    placeholder={`Schritt ${index + 1}`}
                    required
                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddInstruction}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Schritt hinzufügen
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <Link
                            className="border-2 border-gray-800 text-black font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                            href="/"
                        >
                            Abbrechen
                        </Link>
                        <button
                            className="bg-gray-800 hover:bg-gray-900 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Erstellen
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
};

