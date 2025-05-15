import Hello from "@/app/Hallo";
import {query} from "@/db/query";

export default async function Home() {
    return (
        <div>
            <Hello name={"laurens"}/>
            {(await query("SELECT * from rezepte")).map(r =>
                <div key={r.id}>{r.name}</div>
            )}
        </div>
    );
}
