import { showScores  } from "./app.js";

let db;
let request = indexedDB.open("scores", 1);
request.onupgradeneeded = ((ev) => {
    db = ev.target.result;

    // create the db
    var objStore = db.createObjectStore("leaderboard", { autoIncrement: true });
    // index by score
    objStore.createIndex("score", "score", { unique: false });
});
request.onsuccess = (ev => {
    db = request.result;
    retrieveScores((res) => showScores("#scorelist", res));
    mostFrequentPlayers((res) => showScores("#playerlist", res))
})

request.onerror = console.warn;

export function addScore(username, score){
    console.log("Adding " + username);
    let transaction = db.transaction(["leaderboard"], "readwrite");
    let objectStore = transaction.objectStore('leaderboard');

    let request = objectStore.add({ username, score });

    request.onerror = console.warn;
    transaction.onerror = console.warn;
    return retrieveScores;
}

export function retrieveScores(displayScores){
    let transaction = db.transaction(["leaderboard"]);
    transaction.onerror = console.warn;
    let objectStore = transaction.objectStore('leaderboard');
    let results = [];
    objectStore.index("score").openCursor(null, "prev").onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor){
            results.push(cursor.value);
            cursor.continue();
        } else {
            displayScores(results)
        }
    };
} 

export function mostFrequentPlayers(displayScores){
    let objectStore = db.transaction("leaderboard").objectStore("leaderboard");
    objectStore.onerror = console.warn;
    let players = new Set();
    let games = new Map();
    objectStore.openCursor().onsuccess = (e) => {
        let cursor = e.target.result;
        if (cursor){
            let name = cursor.value.username;
            if (!players.has(name)){
                games.set(name, 0);
                players.add(name);
            }
            games.set(name, games.get(name) + 1);
            cursor.continue();
        } else {
            displayScores([...games.entries()].sort((a, b) => b[1] - a[1]));
        }
    };
}