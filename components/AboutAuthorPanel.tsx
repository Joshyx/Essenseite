import {query} from "@/scripts/query";
import Link from "next/link";

export default async function AboutAuthorPanel(params: { author: Record<string, any> }) {
    let recipeCount = (await query(`SELECT COUNT(*) AS "COUNT" FROM "Rezepte" WHERE "Ersteller"='${params.author.ID}'`))[0].COUNT
    return (
        <div className="border rounded-lg p-4 shadow-md mt-8">
            <h2 className="text-xl font-bold">Über den Autoren</h2>
            <p className="text-gray-700">Name: {params.author.Vorname} {params.author.Name} aka {params.author.Nutzername}</p>
            <p className="text-gray-700">Wohnort: {params.author.Wohnort}, {params.author.Land}</p>
            <p className="text-gray-700">Passwort: {params.author.Passwort}</p>
            <p className="text-gray-700">Kontakt: <Link href={`mailto:${params.author.email}`}>{params.author.email}</Link></p>
            <p className="text-gray-700">Alter: {Math.floor((Date.now() - Date.parse(params.author.Geburtsdatum)) / 1000 / 60 / 60 / 24 / 365)}</p>
            <p className="text-gray-700">Erstellte Rezepte: {recipeCount}</p>
        </div>
    )
}