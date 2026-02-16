const countries = [
    "USA", "China", "Russia", "United Kingdom", "France", "Japan", "Germany", "India", 
    "Brazil", "Canada", "Australia", "Ukraine", "Israel", "South Korea", "Mexico", 
    "Egypt", "Turkey", "Poland", "Italy", "Spain", "Vietnam", "Pakistan", "Iran"
];

const battleEvents = [
    { text: "Supply lines cut! Logistics failing.", effect: (h1, h2) => Math.random() > 0.5 ? [h1 - 15, h2] : [h1, h2 - 15] },
    { text: "Air Superiority established!", effect: (h1, h2) => Math.random() > 0.5 ? [h1 + 5, h2 - 10] : [h1 - 10, h2 + 5] },
    { text: "Heavy Rains: All movement stalled.", effect: (h1, h2) => [h1, h2] },
    { text: "Cyber Attack: Communication blacked out.", effect: (h1, h2) => [h1 - 5, h2 - 5] }
];

// State variables
let warHistory = [];
let wins = {}; // { "USA": 3, "China": 1 }

// Get Elements
const playerSelect = document.getElementById('playerCountry');
const enemySelect = document.getElementById('enemyCountry');
const log = document.getElementById('battleLog');
const historyList = document.getElementById('historyList');
const leaderboardList = document.getElementById('leaderboardList');
const historySection = document.getElementById('historySection');

// 1. Populate Dropdowns
countries.sort().forEach(name => {
    playerSelect.innerHTML += `<option value="${name}">${name}</option>`;
    enemySelect.innerHTML += `<option value="${name}">${name}</option>`;
});

// 2. Helper for Status (Replaces Health numbers)
function getStatus(health) {
    if (health > 85) return "OFFENSIVE";
    if (health > 60) return "HOLDING LINE";
    if (health > 40) return "REMAINING STEADFAST";
    if (health > 20) return "LOSING GROUND";
    if (health > 5)  return "NEAR COLLAPSE";
    return "SURRENDERING";
}

// 3. Main Simulation Logic
function startSimulation() {
    let p1Name = playerSelect.value;
    let p2Name = enemySelect.value;
    
    if (p1Name === p2Name) {
        log.innerHTML = `<p style="color:yellow">Error: A nation cannot fight itself.</p>`;
        return;
    }

    let p1H = 100, p2H = 100;
    let location = document.getElementById('battleLocation').value;
    let mins = 0, hours = 0, days = 1;

    log.innerHTML = `<div class="event-msg">⚔️ INVASION COMMENCED: ${p1Name} vs ${p2Name} in ${location}</div><hr>`;

    const simLoop = setInterval(() => {
        mins += 30;
        if (mins >= 60) { mins = 0; hours++; }
        if (hours >= 24) { hours = 0; days++; }

        // Random attrition
        p1H -= (Math.random() * 1.8);
        p2H -= (Math.random() * 1.8);

        // Random Events
        if (Math.random() < 0.06) {
            const event = battleEvents[Math.floor(Math.random() * battleEvents.length)];
            const res = event.effect(p1H, p2H);
            p1H = res[0]; p2H = res[1];
            log.innerHTML += `<div class="event-alert">⚠️ ${event.text}</div>`;
        }

        const timeStamp = `D${days} ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        
        log.innerHTML += `
            <div class="log-entry">
                <span class="time">[${timeStamp}]</span> 
                <span>${p1Name}: <strong>${getStatus(p1H)}</strong></span> | 
                <span>${p2Name}: <strong>${getStatus(p2H)}</strong></span>
            </div>`;

        log.scrollTop = log.scrollHeight;

        if (p1H <= 0 || p2H <= 0) {
            clearInterval(simLoop);
            const winner = p1H > p2H ? p1Name : p2Name;
            const loser = p1H > p2H ? p2Name : p1Name;

            // Update Stats
            wins[winner] = (wins[winner] || 0) + 1;
            warHistory.unshift(`${winner} took ${location} from ${loser} (${days} days)`);
            
            updateUI();
            log.innerHTML += `<div class="victory-box"><h1>${winner} VICTORIOUS</h1><p>${location} has fallen.</p></div>`;
        }
    }, 150);
}

function updateUI() {
    historyList.innerHTML = warHistory.slice(0, 5).map(h => `<li>${h}</li>`).join('');
    
    // Sort and show top 5 on leaderboard
    const sortedWinners = Object.entries(wins).sort((a,b) => b[1] - a[1]);
    leaderboardList.innerHTML = sortedWinners.slice(0, 5).map(w => `<li>${w[0]}: ${w[1]} Wins</li>`).join('');
}

// 4. Connect Buttons
document.getElementById('startBattle').onclick = startSimulation;
document.getElementById('toggleHistory').onclick = () => {
    historySection.classList.toggle('hidden');
};
