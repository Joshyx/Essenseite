export function randomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

export function getUserNameClientSide(document: Document): string | undefined {
    return document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("username="))
        ?.split("=")[1]
}
