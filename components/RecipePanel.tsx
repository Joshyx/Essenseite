'use client'

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLeaf, faThumbsDown as faThumpsDownSolid} from "@fortawesome/free-solid-svg-icons";
import {faThumbsDown as faThumpsDownRegular} from "@fortawesome/free-regular-svg-icons";
import {useEffect, useState} from "react";
import {query} from "@/scripts/query";

export default function RecipePanel({recipe, uid, fav}: {
    recipe: Record<string, any>,
    uid: string | undefined,
    fav: boolean,
}) {
    const [isFavourite, setFavourite] = useState(fav)
    const [likeCounter, setLikeCounter] = useState(0)

    // @ts-ignore
    function toggleFavourite(e: MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()

        if (!uid) {
            alert("Melde dich an, um etwas zu hassen")
            return
        }

        setFavourite(!isFavourite)

        if (!isFavourite) {
            query(`INSERT INTO "LieblingsRezepte" ("Nutzer", "Rezept")
                   VALUES ('${uid}', '${recipe.RID}')`)
        } else {
            query(`DELETE
                   FROM "LieblingsRezepte"
                   WHERE "Nutzer" = '${uid}'
                     AND "Rezept" = '${recipe.RID}'`)
        }
        query(`SELECT COUNT(*) AS "COUNT"
               FROM "LieblingsRezepte"
               WHERE "Rezept" = '${recipe.RID}'`).then((res) => {
            setLikeCounter(res[0].COUNT)
        })
    }

    useEffect(() => {
        query(`SELECT COUNT(*) AS "COUNT"
               FROM "LieblingsRezepte"
               WHERE "Rezept" = '${recipe.RID}'`).then((res) => {
            setLikeCounter(res[0].COUNT)
        })
    }, [setLikeCounter])

    return (
        <div className="border rounded-lg p-4 shadow-md">
            <Link href={`/recipes/${recipe.RID}`} className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold">{recipe.Name}</h2>
                        <div className="flex justify-end items-center space-x-2">
                            {recipe.Vegan === "true" && <FontAwesomeIcon icon={faLeaf} />}
                            <p className="text-gray-700 align-middle">{recipe.Dauer}min</p>
                        </div>
                    </div>
                    <p className="text-gray-700">{recipe.Beschreibung}</p>
                </div>
                <div className="flex justify-end items-center space-x-2">
                    <div>{likeCounter}</div>
                    {isFavourite
                        ?
                        <FontAwesomeIcon onClick={toggleFavourite} icon={faThumpsDownSolid}
                                         className="float-end text-red-950"/>
                        : <FontAwesomeIcon onClick={toggleFavourite} icon={faThumpsDownRegular} className="float-end"/>
                    }
                </div>
            </Link>
        </div>
    )
}