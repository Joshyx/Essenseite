import {query} from "@/scripts/query";

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

export function deleteAll() {
    query(`DELETE
           FROM "RezeptZutat"`)
    query(`DELETE
           FROM "Zutaten"`)
    query(`DELETE
           FROM "LieblingsRezepte"`)
    query(`DELETE
           FROM "Rezepte"`)
}

export function importRecipes() {
    new Promise(async () => {
        for (const recipe of recipes) {
            let recipeID = (await query(`INSERT INTO "Rezepte" ("Ersteller", "Erstellt", "Dauer", "Zubereitung",
                                                                "Beschreibung", "Name", "Kategorie", "Vegan")
                                         VALUES (${randomInt(4, 8)}, '${new Date().toISOString()}', ${recipe.Dauer},
                                                 '${recipe.Zubereitung}', '${recipe.Beschreibung}',
                                                 '${recipe.Name}', '${recipe.Kategorie}', '${recipe.Vegan}') RETURNING "RID"`))[0].RID

            for (const ingredient of recipe.Zutaten) {

                let dbIngredientId: string | undefined = (await query(`SELECT *
                                                                       FROM "Zutaten"
                                                                       WHERE "Name" = '${ingredient.Name}'`))?.[0]?.ZID
                if (!dbIngredientId) {
                    dbIngredientId = (await query(`INSERT INTO "Zutaten" ("Name", "Zucker", "Eiweiß", "Fett",
                                                                          "Gesättigte", "Kalorien", "Kohlenhydrate")
                                                   VALUES ('${ingredient.Name}', '${randomInt(1, 100)}',
                                                           '${randomInt(1, 100)}', '${randomInt(1, 100)}',
                                                           '${randomInt(1, 100)}', '${randomInt(1, 100)}',
                                                           '${randomInt(1, 100)}') RETURNING "ZID"`))[0].ZID
                }
                await query(`INSERT INTO "RezeptZutat" ("Rezept", "Zutat", "Menge")
                             VALUES ('${recipeID}', '${dbIngredientId}', '${ingredient.Menge}')`)
            }
        }
        alert("Finished")
    })
}

const recipes = [
    {
        "Name": "Spaghetti Bolognese",
        "Beschreibung": "Ein klassisches italienisches Gericht mit Hackfleischsauce.",
        "Dauer": 45,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Die Spaghetti in einem großen Topf mit Salzwasser nach Packungsanweisung al dente kochen. SEPERATOR In einer großen Pfanne das Olivenöl erhitzen und die fein gehackte Zwiebel und den Knoblauch darin glasig dünsten. SEPERATOR Das Hackfleisch hinzufügen und krümelig anbraten, bis es durchgegart ist. SEPERATOR Die Tomatenwürfel, Tomatenmark, Salz, Pfeffer und die Kräuter hinzufügen und alles gut umrühren. SEPERATOR Die Sauce bei mittlerer Hitze etwa 15-20 Minuten köcheln lassen. SEPERATOR Die gekochten Spaghetti abgießen und mit der Bolognese-Sauce vermengen. SEPERATOR Mit geriebenem Parmesan bestreuen und servieren.",
        "Zutaten": [
            {
                "Name": "Spaghetti",
                "Menge": "400g"
            },
            {
                "Name": "Hackfleisch",
                "Menge": "500g"
            },
            {
                "Name": "Zwiebel",
                "Menge": "1 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Tomatenwürfel",
                "Menge": "800g"
            },
            {
                "Name": "Tomatenmark",
                "Menge": "2 EL"
            },
            {
                "Name": "Olivenöl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Kräuter",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Parmesan",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Hähnchen-Curry",
        "Beschreibung": "Ein würziges Curry mit Hähnchen und Gemüse.",
        "Dauer": 35,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Das Hähnchenfleisch in mundgerechte Stücke schneiden. SEPERATOR In einem großen Topf das Öl erhitzen und die Zwiebel und den Knoblauch darin anbraten, bis sie goldbraun sind. SEPERATOR Das Hähnchenfleisch hinzufügen und von allen Seiten anbraten. SEPERATOR Die Currypaste hinzufügen und gut umrühren, damit das Fleisch gleichmäßig bedeckt ist. SEPERATOR Die Kokosmilch und das Gemüse hinzufügen und alles zum Kochen bringen. SEPERATOR Die Hitze reduzieren und das Curry etwa 20 Minuten köcheln lassen, bis das Hähnchen durchgegart ist. SEPERATOR Mit Salz und Pfeffer abschmecken und mit frischem Koriander bestreuen. SEPERATOR Heiß mit Reis servieren.",
        "Zutaten": [
            {
                "Name": "Hähnchenbrust",
                "Menge": "500g"
            },
            {
                "Name": "Zwiebel",
                "Menge": "1 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Currypaste",
                "Menge": "2 EL"
            },
            {
                "Name": "Kokosmilch",
                "Menge": "400ml"
            },
            {
                "Name": "Gemüse (z.B. Paprika, Karotten, Erbsen)",
                "Menge": "200g"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Koriander",
                "Menge": "frisch, nach Geschmack"
            }
        ]
    },
    {
        "Name": "Apfelkuchen",
        "Beschreibung": "Ein saftiger Kuchen mit Äpfeln und Zimt.",
        "Dauer": 60,
        "Kategorie": "Nachtisch",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 180°C vorheizen. SEPERATOR Die Äpfel schälen, entkernen und in dünne Scheiben schneiden. SEPERATOR In einer Schüssel Mehl, Zucker, Backpulver und eine Prise Salz vermischen. SEPERATOR Die Butter in kleinen Stücken dazugeben und mit den Fingerspitzen zu einer krümeligen Masse verarbeiten. SEPERATOR Ein Ei hinzufügen und alles zu einem glatten Teig kneten. SEPERATOR Den Teig in eine gefettete Springform geben und gleichmäßig verteilen. SEPERATOR Die Apfelscheiben auf dem Teig verteilen und leicht andrücken. SEPERATOR Zimt und Zucker über die Äpfel streuen. SEPERATOR Den Kuchen im vorgeheizten Ofen etwa 40-45 Minuten backen, bis er goldbraun ist. SEPERATOR Vor dem Servieren abkühlen lassen.",
        "Zutaten": [
            {
                "Name": "Mehl",
                "Menge": "200g"
            },
            {
                "Name": "Zucker",
                "Menge": "150g"
            },
            {
                "Name": "Backpulver",
                "Menge": "1 Päckchen"
            },
            {
                "Name": "Salz",
                "Menge": "1 Prise"
            },
            {
                "Name": "Butter",
                "Menge": "100g"
            },
            {
                "Name": "Ei",
                "Menge": "1 Stück"
            },
            {
                "Name": "Äpfel",
                "Menge": "4 Stück"
            },
            {
                "Name": "Zimt",
                "Menge": "1 TL"
            }
        ]
    },
    {
        "Name": "Margherita Pizza",
        "Beschreibung": "Eine klassische italienische Pizza mit Tomaten, Mozzarella und Basilikum.",
        "Dauer": 30,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 245°C vorheizen. SEPERATOR Den Pizzateig auf einer bemehlten Arbeitsfläche ausrollen. SEPERATOR Den Teig auf ein mit Backpapier belegtes Blech legen. SEPERATOR Die Tomatensauce gleichmäßig auf dem Teig verteilen. SEPERATOR Den Mozzarella in Scheiben auf die Sauce legen. SEPERATOR Die Pizza im vorgeheizten Ofen für etwa 10-15 Minuten backen, bis der Rand goldbraun ist. SEPERATOR Mit frischem Basilikum garnieren und servieren.",
        "Zutaten": [
            {
                "Name": "Pizzateig",
                "Menge": "1 Portion"
            },
            {
                "Name": "Tomatensauce",
                "Menge": "100ml"
            },
            {
                "Name": "Mozzarella",
                "Menge": "125g"
            },
            {
                "Name": "Basilikum",
                "Menge": "einige Blätter"
            }
        ]
    },
    {
        "Name": "Caesar Salad",
        "Beschreibung": "Ein frischer Salat mit knusprigen Croutons und Caesar-Dressing.",
        "Dauer": 20,
        "Kategorie": "Vorspeise",
        "Vegan": false,
        "Zubereitung": "Den Salat waschen und in mundgerechte Stücke zupfen. SEPERATOR Die Croutons in einer Pfanne mit etwas Olivenöl knusprig rösten. SEPERATOR Den Salat in eine große Schüssel geben und mit den Croutons bestreuen. SEPERATOR Das Caesar-Dressing über den Salat träufeln. SEPERATOR Alles gut vermengen und mit Parmesan bestreuen. SEPERATOR Mit Salz und Pfeffer abschmecken.",
        "Zutaten": [
            {
                "Name": "Römersalat",
                "Menge": "1 Kopf"
            },
            {
                "Name": "Croutons",
                "Menge": "100g"
            },
            {
                "Name": "Caesar-Dressing",
                "Menge": "100ml"
            },
            {
                "Name": "Parmesan",
                "Menge": "50g"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Rindergulasch",
        "Beschreibung": "Ein herzhafter Eintopf mit zartem Rindfleisch und Gemüse.",
        "Dauer": 90,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Das Rindfleisch in mundgerechte Stücke schneiden. SEPERATOR In einem großen Topf das Öl erhitzen und das Fleisch darin anbraten, bis es von allen Seiten braun ist. SEPERATOR Die Zwiebeln und den Knoblauch hinzufügen und glasig dünsten. SEPERATOR Das Paprikapulver hinzufügen und kurz mitrösten. SEPERATOR Die Tomaten, die Brühe und das Gemüse hinzufügen und alles zum Kochen bringen. SEPERATOR Die Hitze reduzieren und das Gulasch etwa 1 Stunde köcheln lassen, bis das Fleisch zart ist. SEPERATOR Mit Salz und Pfeffer abschmecken und heiß servieren.",
        "Zutaten": [
            {
                "Name": "Rindfleisch",
                "Menge": "500g"
            },
            {
                "Name": "Zwiebeln",
                "Menge": "2 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Paprikapulver",
                "Menge": "1 EL"
            },
            {
                "Name": "Tomaten",
                "Menge": "400g"
            },
            {
                "Name": "Rinderbrühe",
                "Menge": "500ml"
            },
            {
                "Name": "Gemüse (z.B. Karotten, Paprika)",
                "Menge": "200g"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Linsensuppe",
        "Beschreibung": "Eine nahrhafte Suppe mit Linsen und Gemüse.",
        "Dauer": 45,
        "Kategorie": "Abendessen",
        "Vegan": true,
        "Zubereitung": "Die Linsen in einem Sieb unter fließendem Wasser abspülen. SEPERATOR In einem großen Topf das Öl erhitzen und die Zwiebeln und den Knoblauch darin glasig dünsten. SEPERATOR Das Gemüse hinzufügen und kurz mitdünsten. SEPERATOR Die Linsen, die Brühe und die Tomaten hinzufügen und alles zum Kochen bringen. SEPERATOR Die Hitze reduzieren und die Suppe etwa 30 Minuten köcheln lassen, bis die Linsen weich sind. SEPERATOR Mit Salz und Pfeffer abschmecken und heiß servieren.",
        "Zutaten": [
            {
                "Name": "Linsen",
                "Menge": "250g"
            },
            {
                "Name": "Zwiebeln",
                "Menge": "1 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Gemüse (z.B. Karotten, Sellerie)",
                "Menge": "200g"
            },
            {
                "Name": "Gemüsebrühe",
                "Menge": "1l"
            },
            {
                "Name": "Tomaten",
                "Menge": "400g"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Kartoffelpüree",
        "Beschreibung": "Cremiges Püree aus Kartoffeln.",
        "Dauer": 30,
        "Kategorie": "Sonstige",
        "Vegan": false,
        "Zubereitung": "Die Kartoffeln schälen und in gleichmäßige Stücke schneiden. SEPERATOR Die Kartoffeln in einem großen Topf mit Salzwasser zum Kochen bringen und etwa 15-20 Minuten kochen, bis sie weich sind. SEPERATOR Die Kartoffeln abgießen und kurz ausdampfen lassen. SEPERATOR Die Kartoffeln durch eine Kartoffelpresse drücken oder mit einem Kartoffelstampfer zerdrücken. SEPERATOR Die Butter und die Milch hinzufügen und alles gut vermengen, bis das Püree cremig ist. SEPERATOR Mit Salz und Muskatnuss abschmecken.",
        "Zutaten": [
            {
                "Name": "Kartoffeln",
                "Menge": "1kg"
            },
            {
                "Name": "Butter",
                "Menge": "50g"
            },
            {
                "Name": "Milch",
                "Menge": "100ml"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Muskatnuss",
                "Menge": "etwas gerieben"
            }
        ]
    },
    {
        "Name": "Rührei",
        "Beschreibung": "Schnell zubereitete Eier mit cremiger Konsistenz.",
        "Dauer": 10,
        "Kategorie": "Sonstige",
        "Vegan": false,
        "Zubereitung": "Die Eier in eine Schüssel aufschlagen und mit Salz und Pfeffer verquirlen. SEPERATOR Die Butter in einer Pfanne bei mittlerer Hitze schmelzen. SEPERATOR Die verquirlten Eier in die Pfanne geben und unter ständigem Rühren garen, bis sie cremig sind. SEPERATOR Die Pfanne von der Hitze nehmen und die Eier weiterrühren, bis sie die gewünschte Konsistenz haben. SEPERATOR Heiß servieren.",
        "Zutaten": [
            {
                "Name": "Eier",
                "Menge": "4 Stück"
            },
            {
                "Name": "Butter",
                "Menge": "20g"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Gemüsepfanne",
        "Beschreibung": "Eine bunte Pfanne mit verschiedenen Gemüsesorten.",
        "Dauer": 25,
        "Kategorie": "Abendessen",
        "Vegan": true,
        "Zubereitung": "Das Gemüse waschen und in mundgerechte Stücke schneiden. SEPERATOR In einer großen Pfanne das Öl erhitzen und das Gemüse darin anbraten. SEPERATOR Mit Salz und Pfeffer würzen und bei mittlerer Hitze etwa 10-15 Minuten braten, bis das Gemüse weich ist. SEPERATOR Mit frischen Kräutern bestreuen und heiß servieren.",
        "Zutaten": [
            {
                "Name": "Gemüse (z.B. Paprika, Zucchini, Karotten)",
                "Menge": "500g"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Kräuter",
                "Menge": "frisch, nach Geschmack"
            }
        ]
    },
    {
        "Name": "Obstsalat",
        "Beschreibung": "Ein frischer Salat mit verschiedenen Obstsorten.",
        "Dauer": 15,
        "Kategorie": "Nachtisch",
        "Vegan": true,
        "Zubereitung": "Das Obst waschen und in mundgerechte Stücke schneiden. SEPERATOR Das Obst in eine große Schüssel geben. SEPERATOR Den Zitronensaft und den Honig über das Obst träufeln. SEPERATOR Alles gut vermengen und gekühlt servieren.",
        "Zutaten": [
            {
                "Name": "Obst (z.B. Äpfel, Bananen, Trauben, Orangen)",
                "Menge": "500g"
            },
            {
                "Name": "Zitronensaft",
                "Menge": "2 EL"
            },
            {
                "Name": "Honig",
                "Menge": "1 EL"
            }
        ]
    },
    {
        "Name": "Tomatensuppe",
        "Beschreibung": "Eine cremige Suppe aus frischen Tomaten.",
        "Dauer": 40,
        "Kategorie": "Vorspeise",
        "Vegan": false,
        "Zubereitung": "Die Tomaten waschen und grob hacken. SEPERATOR In einem großen Topf das Öl erhitzen und die Zwiebeln und den Knoblauch darin glasig dünsten. SEPERATOR Die Tomaten hinzufügen und kurz mitdünsten. SEPERATOR Die Brühe hinzufügen und alles zum Kochen bringen. SEPERATOR Die Hitze reduzieren und die Suppe etwa 20 Minuten köcheln lassen. SEPERATOR Die Suppe mit einem Pürierstab fein pürieren. SEPERATOR Die Sahne hinzufügen und alles gut vermengen. SEPERATOR Mit Salz und Pfeffer abschmecken und heiß servieren.",
        "Zutaten": [
            {
                "Name": "Tomaten",
                "Menge": "1kg"
            },
            {
                "Name": "Zwiebeln",
                "Menge": "1 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Gemüsebrühe",
                "Menge": "500ml"
            },
            {
                "Name": "Sahne",
                "Menge": "100ml"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Pancakes",
        "Beschreibung": "Fluffige Pfannkuchen, ideal zum Frühstück.",
        "Dauer": 20,
        "Kategorie": "Sonstige",
        "Vegan": false,
        "Zubereitung": "Mehl, Zucker, Backpulver und Salz in einer Schüssel vermischen. SEPERATOR Die Milch und das Ei in einer separaten Schüssel verquirlen und zur Mehlmischung geben. SEPERATOR Alles gut vermengen, bis ein glatter Teig entsteht. SEPERATOR Etwas Butter in einer Pfanne bei mittlerer Hitze schmelzen. SEPERATOR Den Teig portionsweise in die Pfanne geben und von jeder Seite goldbraun backen. SEPERATOR Warm mit Ahornsirup servieren.",
        "Zutaten": [
            {
                "Name": "Mehl",
                "Menge": "200g"
            },
            {
                "Name": "Zucker",
                "Menge": "2 EL"
            },
            {
                "Name": "Backpulver",
                "Menge": "1 TL"
            },
            {
                "Name": "Salz",
                "Menge": "1 Prise"
            },
            {
                "Name": "Milch",
                "Menge": "250ml"
            },
            {
                "Name": "Ei",
                "Menge": "1 Stück"
            },
            {
                "Name": "Butter",
                "Menge": "20g"
            },
            {
                "Name": "Ahornsirup",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Avocado Toast",
        "Beschreibung": "Ein einfaches und gesundes Frühstück mit Avocado auf Toast.",
        "Dauer": 10,
        "Kategorie": "Sonstige",
        "Vegan": true,
        "Zubereitung": "Den Toast im Toaster goldbraun rösten. SEPERATOR Die Avocado halbieren, entkernen und das Fruchtfleisch herauslöffeln. SEPERATOR Die Avocado mit einer Gabel zerdrücken und mit Salz und Pfeffer würzen. SEPERATOR Die Avocado-Masse auf den Toast streichen. SEPERATOR Mit Chili-Flocken und Sesamsamen bestreuen. SEPERATOR Optional mit einem Spiegelei servieren.",
        "Zutaten": [
            {
                "Name": "Toastbrot",
                "Menge": "2 Scheiben"
            },
            {
                "Name": "Avocado",
                "Menge": "1 Stück"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Chili-Flocken",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Sesamsamen",
                "Menge": "1 TL"
            }
        ]
    },
    {
        "Name": "Griechischer Salat",
        "Beschreibung": "Ein frischer Salat mit Gurken, Tomaten, Oliven und Feta-Käse.",
        "Dauer": 15,
        "Kategorie": "Vorspeise",
        "Vegan": false,
        "Zubereitung": "Die Gurken und Tomaten waschen und in mundgerechte Stücke schneiden. SEPERATOR Die Zwiebel schälen und in dünne Ringe schneiden. SEPERATOR Die Oliven abtropfen lassen. SEPERATOR Den Feta-Käse in Würfel schneiden. SEPERATOR Alle Zutaten in eine große Schüssel geben. SEPERATOR Das Olivenöl und den Oregano darüber träufeln. SEPERATOR Alles gut vermengen und mit Salz und Pfeffer abschmecken.",
        "Zutaten": [
            {
                "Name": "Gurken",
                "Menge": "2 Stück"
            },
            {
                "Name": "Tomaten",
                "Menge": "3 Stück"
            },
            {
                "Name": "Rote Zwiebel",
                "Menge": "1 Stück"
            },
            {
                "Name": "Schwarze Oliven",
                "Menge": "100g"
            },
            {
                "Name": "Feta-Käse",
                "Menge": "200g"
            },
            {
                "Name": "Olivenöl",
                "Menge": "3 EL"
            },
            {
                "Name": "Oregano",
                "Menge": "1 TL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Lachs mit Zitronen-Dill-Sauce",
        "Beschreibung": "Ein leckeres Gericht mit Lachsfilet und einer cremigen Zitronen-Dill-Sauce.",
        "Dauer": 25,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 200°C vorheizen. SEPERATOR Die Lachsfilets mit Salz und Pfeffer würzen und auf ein mit Backpapier belegtes Blech legen. SEPERATOR Den Lachs im vorgeheizten Ofen für etwa 12-15 Minuten backen. SEPERATOR In der Zwischenzeit die Sahne, den Zitronensaft und den Dill in einem kleinen Topf erhitzen und kurz köcheln lassen. SEPERATOR Die Sauce mit Salz und Pfeffer abschmecken. SEPERATOR Den Lachs mit der Zitronen-Dill-Sauce servieren.",
        "Zutaten": [
            {
                "Name": "Lachsfilets",
                "Menge": "2 Stück"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Sahne",
                "Menge": "100ml"
            },
            {
                "Name": "Zitronensaft",
                "Menge": "2 EL"
            },
            {
                "Name": "Frischer Dill",
                "Menge": "1 EL"
            }
        ]
    },
    {
        "Name": "Möhren-Kokos-Suppe",
        "Beschreibung": "Eine cremige Suppe mit Möhren und Kokosmilch.",
        "Dauer": 30,
        "Kategorie": "Vorspeise",
        "Vegan": true,
        "Zubereitung": "Die Möhren schälen und in grobe Stücke schneiden. SEPERATOR In einem großen Topf das Öl erhitzen und die Zwiebeln und den Knoblauch darin glasig dünsten. SEPERATOR Die Möhren hinzufügen und kurz mitdünsten. SEPERATOR Die Gemüsebrühe und die Kokosmilch hinzufügen und alles zum Kochen bringen. SEPERATOR Die Hitze reduzieren und die Suppe etwa 20 Minuten köcheln lassen, bis die Möhren weich sind. SEPERATOR Die Suppe mit einem Pürierstab fein pürieren. SEPERATOR Mit Salz und Pfeffer abschmecken und heiß servieren.",
        "Zutaten": [
            {
                "Name": "Möhren",
                "Menge": "500g"
            },
            {
                "Name": "Zwiebeln",
                "Menge": "1 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Gemüsebrühe",
                "Menge": "500ml"
            },
            {
                "Name": "Kokosmilch",
                "Menge": "200ml"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Schokoladen-Muffins",
        "Beschreibung": "Saftige Muffins mit Schokolade.",
        "Dauer": 35,
        "Kategorie": "Nachtisch",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 180°C vorheizen und die Muffinförmchen in ein Muffinblech setzen. SEPERATOR In einer Schüssel Mehl, Zucker, Backpulver und Kakao vermischen. SEPERATOR In einer anderen Schüssel die Eier, die Milch und das Öl verquirlen. SEPERATOR Die flüssigen Zutaten zu den trockenen Zutaten geben und alles gut vermengen. SEPERATOR Die Schokoladenstücke unterheben. SEPERATOR Den Teig in die Muffinförmchen füllen und im vorgeheizten Ofen für etwa 20-25 Minuten backen. SEPERATOR Die Muffins abkühlen lassen und servieren.",
        "Zutaten": [
            {
                "Name": "Mehl",
                "Menge": "200g"
            },
            {
                "Name": "Zucker",
                "Menge": "150g"
            },
            {
                "Name": "Backpulver",
                "Menge": "1 Päckchen"
            },
            {
                "Name": "Kakao",
                "Menge": "2 EL"
            },
            {
                "Name": "Eier",
                "Menge": "2 Stück"
            },
            {
                "Name": "Milch",
                "Menge": "150ml"
            },
            {
                "Name": "Öl",
                "Menge": "80ml"
            },
            {
                "Name": "Schokoladenstücke",
                "Menge": "100g"
            }
        ]
    },
    {
        "Name": "Erdbeer-Smoothie",
        "Beschreibung": "Ein erfrischender Smoothie mit Erdbeeren und Banane.",
        "Dauer": 5,
        "Kategorie": "Getränke",
        "Vegan": true,
        "Zubereitung": "Die Erdbeeren waschen und die Stiele entfernen. SEPERATOR Die Banane schälen und in grobe Stücke schneiden. SEPERATOR Die Erdbeeren, die Banane, den Joghurt und den Orangensaft in einen Mixer geben. SEPERATOR Alles gut mixen, bis ein cremiger Smoothie entsteht. SEPERATOR In Gläser füllen und sofort servieren.",
        "Zutaten": [
            {
                "Name": "Erdbeeren",
                "Menge": "200g"
            },
            {
                "Name": "Bananen",
                "Menge": "1 Stück"
            },
            {
                "Name": "Joghurt",
                "Menge": "150g"
            },
            {
                "Name": "Orangensaft",
                "Menge": "100ml"
            }
        ]
    },
    {
        "Name": "Hühnerbrust mit Rosmarin-Kartoffeln",
        "Beschreibung": "Saftige Hühnerbrust mit knusprigen Rosmarin-Kartoffeln.",
        "Dauer": 40,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 220°C vorheizen. SEPERATOR Die Kartoffeln schälen und in grobe Stücke schneiden. SEPERATOR Die Kartoffeln in eine Schüssel geben, mit Olivenöl beträufeln und mit Salz, Pfeffer und Rosmarin würzen. SEPERATOR Die Kartoffeln auf ein mit Backpapier belegtes Blech geben und im vorgeheizten Ofen für etwa 25 Minuten backen. SEPERATOR In der Zwischenzeit die Hühnerbrust mit Salz und Pfeffer würzen. SEPERATOR In einer Pfanne das Öl erhitzen und die Hühnerbrust von jeder Seite etwa 5-6 Minuten braten, bis sie durchgegart ist. SEPERATOR Die Hühnerbrust mit den Rosmarin-Kartoffeln servieren.",
        "Zutaten": [
            {
                "Name": "Kartoffeln",
                "Menge": "500g"
            },
            {
                "Name": "Olivenöl",
                "Menge": "3 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Rosmarin",
                "Menge": "1 EL"
            },
            {
                "Name": "Hühnerbrust",
                "Menge": "2 Stück"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            }
        ]
    },
    {
        "Name": "Zucchini-Lasagne",
        "Beschreibung": "Eine leichtere Version der klassischen Lasagne mit Zucchini statt Nudeln.",
        "Dauer": 60,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 180°C vorheizen. SEPERATOR Die Zucchini in dünne Scheiben schneiden. SEPERATOR In einer Pfanne das Hackfleisch anbraten, bis es durchgegart ist. SEPERATOR Die Tomatensauce hinzufügen und alles gut vermengen. SEPERATOR Eine Auflaufform mit etwas Tomatensauce bestreichen. SEPERATOR Abwechselnd Schichten von Zucchinischeiben, Hackfleischsauce und Béchamelsauce in die Form geben. SEPERATOR Die oberste Schicht sollte Béchamelsauce sein. SEPERATOR Die Lasagne im vorgeheizten Ofen für etwa 30-35 Minuten backen, bis sie goldbraun ist. SEPERATOR Vor dem Servieren etwas abkühlen lassen.",
        "Zutaten": [
            {
                "Name": "Zucchini",
                "Menge": "3 Stück"
            },
            {
                "Name": "Hackfleisch",
                "Menge": "500g"
            },
            {
                "Name": "Tomatensauce",
                "Menge": "500ml"
            },
            {
                "Name": "Béchamelsauce",
                "Menge": "500ml"
            }
        ]
    },
    {
        "Name": "Bananenbrot",
        "Beschreibung": "Ein saftiges Brot mit reifen Bananen und Nüssen.",
        "Dauer": 60,
        "Kategorie": "Nachtisch",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 180°C vorheizen und eine Kastenform einfetten. SEPERATOR Die Bananen schälen und mit einer Gabel zerdrücken. SEPERATOR In einer Schüssel die zerdrückten Bananen mit den Eiern, dem Zucker und dem Öl vermischen. SEPERATOR In einer anderen Schüssel Mehl, Backpulver und Natron vermischen. SEPERATOR Die trockenen Zutaten zu den feuchten Zutaten geben und alles gut vermengen. SEPERATOR Die gehackten Nüsse unterheben. SEPERATOR Den Teig in die vorbereitete Kastenform füllen und im vorgeheizten Ofen für etwa 50-60 Minuten backen. SEPERATOR Vor dem Servieren abkühlen lassen.",
        "Zutaten": [
            {
                "Name": "Bananen",
                "Menge": "3 Stück"
            },
            {
                "Name": "Eier",
                "Menge": "2 Stück"
            },
            {
                "Name": "Zucker",
                "Menge": "150g"
            },
            {
                "Name": "Öl",
                "Menge": "80ml"
            },
            {
                "Name": "Mehl",
                "Menge": "250g"
            },
            {
                "Name": "Backpulver",
                "Menge": "1 TL"
            },
            {
                "Name": "Natron",
                "Menge": "1/2 TL"
            },
            {
                "Name": "Nüsse",
                "Menge": "50g"
            }
        ]
    },
    {
        "Name": "Kürbiscremesuppe",
        "Beschreibung": "Eine cremige Suppe aus Hokkaido-Kürbis.",
        "Dauer": 40,
        "Kategorie": "Vorspeise",
        "Vegan": true,
        "Zubereitung": "Den Kürbis waschen, entkernen und in grobe Stücke schneiden. SEPERATOR In einem großen Topf das Öl erhitzen und die Zwiebeln und den Knoblauch darin glasig dünsten. SEPERATOR Die Kürbisstücke hinzufügen und kurz mitdünsten. SEPERATOR Die Gemüsebrühe hinzufügen und alles zum Kochen bringen. SEPERATOR Die Hitze reduzieren und die Suppe etwa 20 Minuten köcheln lassen, bis der Kürbis weich ist. SEPERATOR Die Suppe mit einem Pürierstab fein pürieren. SEPERATOR Die Sahne hinzufügen und alles gut vermengen. SEPERATOR Mit Salz und Pfeffer abschmecken und heiß servieren.",
        "Zutaten": [
            {
                "Name": "Hokkaido-Kürbis",
                "Menge": "1kg"
            },
            {
                "Name": "Zwiebeln",
                "Menge": "1 Stück"
            },
            {
                "Name": "Knoblauch",
                "Menge": "2 Zehen"
            },
            {
                "Name": "Gemüsebrühe",
                "Menge": "750ml"
            },
            {
                "Name": "Sahne",
                "Menge": "100ml"
            },
            {
                "Name": "Öl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Pfannkuchen mit Apfelmus",
        "Beschreibung": "Dünne Pfannkuchen serviert mit süßem Apfelmus.",
        "Dauer": 30,
        "Kategorie": "Sonstige",
        "Vegan": false,
        "Zubereitung": "In einer Schüssel Mehl, Eier, Milch und eine Prise Salz zu einem glatten Teig verrühren. SEPERATOR Etwas Butter in einer Pfanne bei mittlerer Hitze schmelzen. SEPERATOR Eine kleine Kelle Teig in die Pfanne geben und gleichmäßig verteilen. SEPERATOR Den Pfannkuchen von jeder Seite goldbraun backen. SEPERATOR Die Pfannkuchen warm halten und den Vorgang wiederholen, bis der gesamte Teig aufgebraucht ist. SEPERATOR Die Pfannkuchen mit Apfelmus servieren.",
        "Zutaten": [
            {
                "Name": "Mehl",
                "Menge": "250g"
            },
            {
                "Name": "Eier",
                "Menge": "2 Stück"
            },
            {
                "Name": "Milch",
                "Menge": "500ml"
            },
            {
                "Name": "Salz",
                "Menge": "1 Prise"
            },
            {
                "Name": "Butter",
                "Menge": "20g"
            },
            {
                "Name": "Apfelmus",
                "Menge": "nach Bedarf"
            }
        ]
    },
    {
        "Name": "Gebackene Süßkartoffel-Pommes",
        "Beschreibung": "Knusprige Pommes aus Süßkartoffeln, gebacken im Ofen.",
        "Dauer": 35,
        "Kategorie": "Sonstige",
        "Vegan": true,
        "Zubereitung": "Den Backofen auf 220°C vorheizen. SEPERATOR Die Süßkartoffeln schälen und in Pommes-Form schneiden. SEPERATOR Die Süßkartoffel-Pommes in eine Schüssel geben, mit Olivenöl beträufeln und mit Salz, Paprikapulver und Knoblauchpulver würzen. SEPERATOR Die Pommes auf ein mit Backpapier belegtes Blech geben und im vorgeheizten Ofen für etwa 20-25 Minuten backen, bis sie knusprig sind. SEPERATOR Die Pommes mit Dip servieren.",
        "Zutaten": [
            {
                "Name": "Süßkartoffeln",
                "Menge": "2 große"
            },
            {
                "Name": "Olivenöl",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Paprikapulver",
                "Menge": "1 TL"
            },
            {
                "Name": "Knoblauchpulver",
                "Menge": "1 TL"
            }
        ]
    },
    {
        "Name": "Mango-Lassi",
        "Beschreibung": "Ein erfrischendes Joghurtgetränk mit Mango.",
        "Dauer": 5,
        "Kategorie": "Getränke",
        "Vegan": false,
        "Zubereitung": "Die Mango schälen und das Fruchtfleisch vom Stein lösen. SEPERATOR Die Mango, den Joghurt, die Milch, den Zucker und die Eiswürfel in einen Mixer geben. SEPERATOR Alles gut mixen, bis ein cremiges Getränk entsteht. SEPERATOR In Gläser füllen und sofort servieren.",
        "Zutaten": [
            {
                "Name": "Mango",
                "Menge": "1 Stück"
            },
            {
                "Name": "Joghurt",
                "Menge": "250g"
            },
            {
                "Name": "Milch",
                "Menge": "100ml"
            },
            {
                "Name": "Zucker",
                "Menge": "2 EL"
            }
        ]
    },
    {
        "Name": "Quinoa-Salat",
        "Beschreibung": "Ein gesunder Salat mit Quinoa, Gemüse und einem Zitronen-Dressing.",
        "Dauer": 25,
        "Kategorie": "Vorspeise",
        "Vegan": true,
        "Zubereitung": "Die Quinoa nach Packungsanweisung kochen und abkühlen lassen. SEPERATOR Das Gemüse waschen und in kleine Stücke schneiden. SEPERATOR Die Quinoa und das Gemüse in eine große Schüssel geben. SEPERATOR Für das Dressing Olivenöl, Zitronensaft, Salz und Pfeffer vermischen. SEPERATOR Das Dressing über den Salat träufeln und alles gut vermengen. SEPERATOR Mit frischen Kräutern bestreuen und servieren.",
        "Zutaten": [
            {
                "Name": "Quinoa",
                "Menge": "200g"
            },
            {
                "Name": "Gemüse (z.B. Gurke, Tomate, Paprika)",
                "Menge": "300g"
            },
            {
                "Name": "Olivenöl",
                "Menge": "3 EL"
            },
            {
                "Name": "Zitronensaft",
                "Menge": "2 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            }
        ]
    },
    {
        "Name": "Putenbrust mit Ofengemüse",
        "Beschreibung": "Zarte Putenbrust serviert mit Ofengemüse.",
        "Dauer": 50,
        "Kategorie": "Abendessen",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 200°C vorheizen. SEPERATOR Das Gemüse waschen und in grobe Stücke schneiden. SEPERATOR Das Gemüse in eine Schüssel geben, mit Olivenöl beträufeln und mit Salz, Pfeffer und Rosmarin würzen. SEPERATOR Das Gemüse auf ein mit Backpapier belegtes Blech geben und im vorgeheizten Ofen für etwa 25 Minuten backen. SEPERATOR In der Zwischenzeit die Putenbrust mit Salz und Pfeffer würzen. SEPERATOR In einer Pfanne das Öl erhitzen und die Putenbrust von jeder Seite etwa 5-6 Minuten braten, bis sie durchgegart ist. SEPERATOR Die Putenbrust mit dem Ofengemüse servieren.",
        "Zutaten": [
            {
                "Name": "Gemüse (z.B. Karotten, Pastinaken, Zwiebeln)",
                "Menge": "500g"
            },
            {
                "Name": "Olivenöl",
                "Menge": "3 EL"
            },
            {
                "Name": "Salz",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Pfeffer",
                "Menge": "nach Geschmack"
            },
            {
                "Name": "Rosmarin",
                "Menge": "1 EL"
            },
            {
                "Name": "Putenbrust",
                "Menge": "2 Stück"
            }
        ]
    },
    {
        "Name": "Blaubeer-Muffins",
        "Beschreibung": "Saftige Muffins mit frischen Blaubeeren.",
        "Dauer": 35,
        "Kategorie": "Nachtisch",
        "Vegan": false,
        "Zubereitung": "Den Backofen auf 180°C vorheizen und die Muffinförmchen in ein Muffinblech setzen. SEPERATOR In einer Schüssel Mehl, Zucker und Backpulver vermischen. SEPERATOR In einer anderen Schüssel die Eier, die Milch und das Öl verquirlen. SEPERATOR Die flüssigen Zutaten zu den trockenen Zutaten geben und alles gut vermengen. SEPERATOR Die Blaubeeren unterheben. SEPERATOR Den Teig in die Muffinförmchen füllen und im vorgeheizten Ofen für etwa 20-25 Minuten backen. SEPERATOR Die Muffins abkühlen lassen und servieren.",
        "Zutaten": [
            {
                "Name": "Mehl",
                "Menge": "200g"
            },
            {
                "Name": "Zucker",
                "Menge": "100g"
            },
            {
                "Name": "Backpulver",
                "Menge": "1 Päckchen"
            },
            {
                "Name": "Eier",
                "Menge": "2 Stück"
            },
            {
                "Name": "Milch",
                "Menge": "150ml"
            },
            {
                "Name": "Öl",
                "Menge": "80ml"
            },
            {
                "Name": "Blaubeeren",
                "Menge": "150g"
            }
        ]
    }
]


