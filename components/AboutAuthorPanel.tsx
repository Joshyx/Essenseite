'use server'

import {query} from "@/scripts/query";
import Link from "next/link";

export default async function AboutAuthorPanel(params: { author: Record<string, any>, fullInfo: boolean }) {
    let recipeCount = (await query(`SELECT COUNT(*) AS "COUNT"
                                    FROM "Rezepte"
                                    WHERE "Ersteller" = '${params.author.ID}'`))[0].COUNT
    let hateCount = (await query(`SELECT COUNT(*) AS "COUNT"
                                  FROM "LieblingsRezepte"
                                  WHERE "Nutzer" = ${params.author.ID}`))[0].COUNT
    const isVegan = (await query(`SELECT "RID" FROM "Rezepte" WHERE "Vegan"='false' AND "Ersteller"=${params.author.ID}`)).length === 0
    return (
        <div className="border rounded-lg p-4 shadow-md mt-8">
            <h2 className="text-xl font-bold">{params.fullInfo ? `Name: ${params.author.Vorname} ${params.author.Name} aka ${params.author.Nutzername}` : "Über den Autoren"}</h2>
            {params.fullInfo || <p className="text-gray-700">Name: {params.author.Vorname} {params.author.Name} aka {params.author.Nutzername}</p>}
            <p className="text-gray-700">{isVegan ? "Tierfreund" : "Kaltblütiger Mörder (Nicht vegan)"}</p>
            <p className="text-gray-700">Wohnort: {params.author.Wohnort}, {params.author.Land}</p>
            {params.fullInfo || <p className="text-gray-700">Passwort: {params.author.Passwort}</p>}
            <p className="text-gray-700">Kontakt: <Link
                href={`mailto:${params.author.email}`}>{params.author.email}</Link></p>
            <p className="text-gray-700">Alter: {Math.floor((Date.now() - Date.parse(params.author.Geburtsdatum)) / 1000 / 60 / 60 / 24 / 365)}</p>
            <p className="text-gray-700">Erstellte Rezepte: {recipeCount}</p>
            <p className="text-gray-700">{hateCount == 0
                ? "Reine Seele (Keine gehassten Rezepte)"
                : hateCount == 1
                    ? "Beginner: Nur 1 gehasstes Rezept"
                    : hateCount <= 3
                        ? `Amateur: Nur ${hateCount} gehasste Rezepte`
                        : hateCount <= 7
                            ? `Ein echter Hater: ${hateCount} gehasste Rezepte`
                            : `Vengeful Spirit: ${hateCount} hasserfüllte Rezensionen`}
            </p>
        </div>
    )
}