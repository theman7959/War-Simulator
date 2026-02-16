const countries = ["USA", "China", "Russia", "UK", "France", "Japan", "Germany", "India", "Brazil", "Canada", "Australia", "Ukraine", "Israel", "South Korea", "Mexico", "Egypt", "Turkey", "Poland"]; // Keep your full list here

const battleEvents = [
    { text: "Supply lines cut! One side is struggling.", effect: (h1, h2) => Math.random() > 0.5 ? [h1 - 15, h2] : [h1, h2 - 15] },
    { text: "Air Superiority established!", effect: (h1, h2) => Math.random() > 0.5 ? [h1 + 5, h2 - 10] : [h1 - 10, h2 + 5] },
    { text: "Heavy Rains: All movement stalled.", effect: (h1, h2) => [h1, h2] }
];

const log = document.getElementById('battleLog');
const historyList = document.getElementById('historyList');
const historySection = document.getElementById('historySection');
let warHistory = [];

// Helper to turn hidden health into status words
function getStatus(health) {
    if (health > 80) return "DOMINATING";
    if (health > 50) return "STABLE";
    if (health > 25) return "PUSHED BACK";
    if (health > 10) return "CRITICAL";
    return "COLLAPSING";
}

function startSimulation() {
    let p1Name = document.getElementById('playerCountry').value;
    let p2Name = document.getElementById('enemyCountry').value;
    let p1H = 100, p2H = 100;
    let location = document.getElementById('battleLocation').value;
    let mins = 0, hours = 0, days = 1;

    log.innerHTML = `<div class="event-msg">⚔️ CONFLICT BEGUN: ${location}</div><hr>`;

    const simLoop = setInterval(() => {
        mins += 30;
        if (mins >= 60) { mins = 0; hours++; }
        if (hours >= 24) { hours = 0; days++; }

        p1H -= (Math.random() * 1.5);
        p2H -= (Math.random() * 1.5);

        if (Math.random() < 0.05) {
            const event = battleEvents[Math.floor(Math.random() * battleEvents.length)];
            const results = event.effect(p1H, p2H);
            p1H = results[0]; p2H = results[1];
            log.innerHTML += `<div class="event-alert">⚠️ ${event.text}</div>`;
        }

        const timeStamp = `D${days} ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        
        // DISPLAYING STATUS INSTEAD OF HEALTH
        log.innerHTML += `
            <div class="log-entry">
                <span class="time">[${timeStamp}]</span> 
                <span>${p1Name}: <strong>${getStatus(p1H)}</strong></span> 
                <span>${p2Name}: <strong>${getStatus(p2H)}</strong></span>
            </div>`;

        log.scrollTop = log.scrollHeight;

        if (p1H <= 0 || p2H <= 0) {
            clearInterval(simLoop);
            const winner = p1H > p2H ? p1Name : p2Name;
            const loser = p1H > p2H ? p2Name : p1Name;

            // Save to History
            warHistory.push(`${winner} defeated ${loser} in ${location} (${days} days)`);
            updateHistoryUI();

            log.innerHTML += `<div class="victory-box"><h1>${winner} VICTORIOUS</h1></div>`;
        }
    }, 100);
}

function updateHistoryUI() {
    historyList.innerHTML = warHistory.map(entry => `<li>${entry}</li>`).join('');
}

document.getElementById('startBattle').addEventListener('click', startSimulation);
document.getElementById('toggleHistory').addEventListener('click', () => {
    historySection.classList.toggle('hidden');
});
