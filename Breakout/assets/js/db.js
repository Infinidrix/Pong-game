let db;
let request = indexedDB.open("scores", 1);
request.onupgradeneeded = ((ev) => {
    db = ev.target.result;

    // create the db
    var objStore = db.createObjectStore("leaderboard", { autoIncrement: true });
    // index by score
    objStore.createIndex("score", "score", { unique: false });
});
request.onsuccess = (ev => db = request.result)

request.onerror = console.warn;

export function addScore(username, score){
    let transaction = db.transaction(["leaderboard"], "readwrite");
    let objectStore = transaction.objectStore('leaderboard');

    let request = objectStore.add({ username, score });

    request.onerror = console.warn;
    transaction.onerror = console.warn;
    return retrieveScores;
}

function retrieveScores(displayScores){
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