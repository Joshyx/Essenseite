import Hello from "@/app/Hallo";
import {query} from "@/scripts/query";
import LogoutButton from "@/components/LogoutButton";
import {getCookie} from "@/scripts/cookies";

export default async function Home() {
    return (
        <div>
            <Hello name={(await getCookie("username")) || "Anonym"}/>
            <br/>
            Nutzer:
            {(await query(`SELECT * from "Nutzer"`)).map(r =>
                <div key={r.Nutzername}>{r.Vorname} {r.Name}</div>
            )}
            <br/>
            Fibonacci: {fibonacci(11)}<br/>
            Fakultät: {factorial(3)}<br/>
            <br/>
            <LogoutButton/>
        </div>
    );
}

function fibonacci(n: number): number {
    if(n === 0 || n === 1) return 1;

    return fibonacci(n - 1) + fibonacci(n - 2)
}
function factorial(n: number): number {
    if(n === 0) return 1;

    return n * factorial(n - 1)
}