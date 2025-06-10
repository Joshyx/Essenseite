'use client'

import {query} from "@/scripts/query";
import {redirect} from "next/navigation";

export default function DeleteRecipeButton(params: {id: string}) {
    async function deleteRecipe() {

        await query(`DELETE FROM "RezeptZutat" WHERE "Rezept"='${params.id}'`)
        await query(`DELETE FROM "LieblingsRezepte" WHERE "Rezept"='${params.id}'`)
        await query(`DELETE FROM "Rezepte" WHERE "RID"='${params.id}'`)
        redirect("/")
    }

    return <button className="float-end py-2 px-4 mt-8 bg-red-950 text-white rounded-xl cursor-pointer" onClick={deleteRecipe}>
        Rezept löschen
    </button>
}
