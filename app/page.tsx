import {query} from "@/scripts/query";
import NavigationBar from "@/components/NavigationBar";
import RecipePanel from "@/components/RecipePanel";
import {getCookie} from "@/scripts/cookies";

export default async function Home() {
    const recipes = await query('SELECT * FROM "Rezepte"')
    const username = await getCookie("username")
    const user = (await query(`SELECT * FROM "Nutzer" WHERE "Nutzername"='${username}'`))[0]
    const favourites = await query(`SELECT * FROM "LieblingsRezepte" WHERE "Nutzer"='${user.ID}'`)

    return (
        <div>
            <NavigationBar/>
            <main className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Hallo {username || "mein*e unbekannte*r Freund*in"} :)</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((re) => {
                        const isFavourite = favourites.find((fav) => {
                            return fav.Rezept === re.RID
                        }) !== undefined
                        return <RecipePanel key={re.RID} id={re.RID} name={re.Name} description={re.Beschreibung} length={re.Dauer} fav={isFavourite} uid={user.ID}/>
                    })}
                </div>
            </main>
        </div>
    );
}
