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
    const dataWeek = await fetchJson(url);
    res.render("week-schedule", { scheduleData: dataWeek }); // Geef de data door aan de template-renderfunctie
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
    const dataDay = await fetchJson(url);
    const personsThursday = dataDay.filter((entry) => entry.officeDays.includes("Thursday"));
    res.render("day-schedule", { day: "Thursday", personsThursday });
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

async function fetchJson(url) {
    return await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // Voeg het attribuut officeDays toe aan elk entry-object
            return data.map((entry) => {
                try {
                    entry.officeDays = entry["office-days"] ? JSON.parse(entry["office-days"]) : []; // Controleer of "office-days" bestaat en niet leeg is
                } catch (error) {
                    console.error("Error parsing office-days:", error); // Log de fout in de console
                    entry.officeDays = []; // Zet officeDays op een lege array als fallback
                }
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
