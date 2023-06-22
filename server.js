import express from "express";

// de basis url van de SheetDB api
const url = "https://sheetdb.io/api/v1/vq0fsa3zwdx2d";

// maak een nieuwe express app
const server = express();

// Stel het poortnummer in
server.set("port", process.env.PORT || 8000);

// Stel de view engine in
server.set("view engine", "ejs");
server.set("views", "./views");

// Stel de public map in
server.use(express.static("public"));

// Route voor de weekplanning
server.get("/week-schedule", async (req, res) => {
    try {
        const data = await fetchJson(url);
        res.render("week-schedule", { scheduleData: data }); // Geef de data door aan de template-renderfunctie
    } catch (error) {
        console.log(error);
        res.status(500).send("Er is een fout opgetreden bij het ophalen van de gegevens");
    }
});

// Route voor de index pagina
server.get("/", (request, response) => {
    response.render("index");
});

// Route voor de index pagina
server.get("/index", (request, response) => {
    response.render("index");
});

// Route voor de dagplanning
server.get("/day-schedule", async (req, res) => {
    try {
        const data = await fetchJson(url);
        const personsThursday = data.filter((entry) => entry.officeDays.includes("Thursday"));
        const personName = personsThursday.length > 0 ? personsThursday[0].name : null;
        res.render("day-schedule", { day: "Thursday", personName });
    } catch (error) {
        console.log(error);
        res.status(500).send("Er is een fout opgetreden bij het ophalen van de gegevens");
    }
});

// Route voor de maandplanning
server.get("/month-schedule", function (req, res) {
    res.render("month-schedule");
});

// Route voor de sign up
server.get("/sign-up", function (req, res) {
    res.render("sign-up");
});

// Route voor login
server.get("/login", function (req, res) {
    res.render("login");
});

// Definieer de fetchJson functie
async function fetchJson(url) {
    return await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // Voeg het attribuut officeDays toe aan elk entry-object
            return data.map((entry) => {
                entry.officeDays = JSON.parse(entry["office-days"]);
                return entry;
            });
        })
        .catch((error) => {
            console.log(error);
            throw error;
        });
}

// Start met luisteren
server.listen(server.get("port"), () => {
    console.log(`Application started on http://localhost:${server.get("port")}`);
});
