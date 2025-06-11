import {query} from "@/scripts/query";
import NavigationBar from "@/components/NavigationBar";
import {getCookie} from "@/scripts/cookies";
import RecipesList from "@/components/RecipesList";

export default async function Home() {
    const recipes = await query('SELECT * FROM "Rezepte"')
    const username = await getCookie("username")
    const user = username ? (await query(`SELECT * FROM "Nutzer" WHERE "Nutzername"='${username}'`))[0] : undefined
    const favourites = username ? await query(`SELECT * FROM "LieblingsRezepte" WHERE "Nutzer"='${user!.ID}'`) : []

    return (
        <div>
            <NavigationBar/>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-1">Hallo {username || "mein*e unbekannte*r Freund*in"} :)</h1>
                <RecipesList user={user} recipes={recipes} favourites={favourites.map((fav) => fav.Rezept)}/>
            </main>
        </div>
    );
}
