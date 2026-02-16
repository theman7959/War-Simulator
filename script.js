const countries = [
    { name: "USA", power: 95, health: 100 },
    { name: "Japan", power: 80, health: 100 },
    { name: "United Kingdom", power: 85, health: 100 },
    { name: "Brazil", power: 70, health: 100 },
    { name: "Australia", power: 75, health: 100 }
];

const playerSelect = document.getElementById('playerCountry');
const enemySelect = document.getElementById('enemyCountry');
const log = document.getElementById('battleLog');

// Populate Dropdowns
countries.forEach(c => {
    playerSelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
    enemySelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
});

document.getElementById('startBattle').addEventListener('click', () => {
    const p1 = {...countries.find(c => c.name === playerSelect.value)};
    const p2 = {...countries.find(c => c.name === enemySelect.value)};
    const location = document.getElementById('battleLocation').value;

    log.innerHTML = `<strong>Battle initiated in ${location}!</strong><br>`;

    const fight = setInterval(() => {
        // Random variance in damage
        let p1Dmg = Math.floor(Math.random() * (p1.power / 5));
        let p2Dmg = Math.floor(Math.random() * (p2.power / 5));

        p2.health -= p1Dmg;
        p1.health -= p2Dmg;

        log.innerHTML += `${p1.name} hits for ${p1Dmg}. ${p2.name} hits for ${p2Dmg}.<br>`;
        log.scrollTop = log.scrollHeight;

        if (p1.health <= 0 || p2.health <= 0) {
            clearInterval(fight);
            const winner = p1.health > p2.health ? p1.name : p2.name;
            log.innerHTML += `--- <br><strong>MISSION COMPLETE: ${winner} VICTORIOUS</strong>`;
        }
    }, 800);
});
