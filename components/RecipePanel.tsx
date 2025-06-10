'use client'

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import {useState} from "react";
import {query} from "@/scripts/query";

export default function RecipePanel(params: {
    id: number,
    name: string,
    description: string,
    length: number,
    fav: boolean,
    uid: string
}) {
    const [isFavourite, setFavourite] = useState(params.fav)

    // @ts-ignore
    function toggleFavourite(e: MouseEvent<SVGSVGElement, MouseEvent>) {
        e.preventDefault()
        setFavourite(!isFavourite)

        if (!isFavourite) {
            query(`INSERT INTO "LieblingsRezepte" ("Nutzer", "Rezept")
                   VALUES ('${params.uid}', '${params.id}')`)
        } else {
            query(`DELETE
                   FROM "LieblingsRezepte"
                   WHERE "Nutzer" = '${params.uid}'
                     AND "Rezept" = '${params.id}'`)
        }
    }

    return (
        <div className="border rounded-lg p-4 shadow-md">
            <Link href={`/recipes/${params.id}`} className="flex flex-col justify-between h-full">
                <div>
                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold">{params.name}</h2>
                        <p className="text-gray-700 align-middle">{params.length}min</p>
                    </div>
                    <p className="text-gray-700">{params.description}</p>
                </div>
                <div>
                    {isFavourite
                        ?
                        <FontAwesomeIcon onClick={toggleFavourite} icon={faHeartSolid} className="float-end text-red-500"/>
                        : <FontAwesomeIcon onClick={toggleFavourite} icon={faHeartRegular} className="float-end"/>
                    }
                </div>
            </Link>
        </div>
    )
}