export default function ZutatPanel(params: { zutat: Record<string, any> }) {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-bold">{params.zutat.Name}</h2>
            <p className="text-gray-700">Energie: {params.zutat.Kalorien}cal</p>
            <p className="text-gray-700">Fett: {params.zutat.Fett}g</p>
            <p className="text-gray-700 pl-5">Davon gesättigte Fettsäuren: {params.zutat.Gesättigte}g</p>
            <p className="text-gray-700">Kohlenhydrate: {params.zutat.Kohlenhydrate}g</p>
            <p className="text-gray-700 pl-5">Davon Zucker: {params.zutat.Zucker}g</p>
            <p className="text-gray-700">Eiweiß: {params.zutat.Eiweiß}g</p>
        </div>
    )
}