'use client'

import {ChangeEvent} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSortDown} from "@fortawesome/free-solid-svg-icons";

export default function CategoryDropdown({onChangeAction}: {
    onChangeAction: (event: ChangeEvent<HTMLSelectElement>) => void
}) {
    return <div className="relative">
        <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={onChangeAction}
        >
            <option>Abendessen</option>
            <option>Vorspeise</option>
            <option>Nachtisch</option>
            <option>Getränke</option>
            <option>Sonstige</option>
        </select>
        <FontAwesomeIcon icon={faSortDown} className="absolute right-4 top-1/5"/>
    </div>
}