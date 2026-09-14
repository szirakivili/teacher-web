// Csengetési rend (Hétfő-Csütörtök)
const scheduleRegular = [
    { id: 0, start: "07:15", end: "07:55" },
    { id: 1, start: "08:05", end: "08:45" },
    { id: 2, start: "09:00", end: "09:40" },
    { id: 3, start: "09:55", end: "10:35" },
    { id: 4, start: "10:45", end: "11:25" },
    { id: 5, start: "11:35", end: "12:15" },
    { id: 6, start: "12:25", end: "13:05" },
    { id: 7, start: "13:15", end: "13:55" },
    { id: 8, start: "14:05", end: "14:45" },
    { id: 9, start: "15:00", end: "17:00" }
];

// Csengetési rend (Péntek)
const scheduleFriday = [
    { id: 0, start: "07:15", end: "07:55" },
    { id: 1, start: "08:05", end: "08:45" },
    { id: 2, start: "09:00", end: "09:40" },
    { id: 3, start: "09:55", end: "10:35" },
    { id: 4, start: "10:45", end: "11:25" },
    { id: 5, start: "11:35", end: "12:15" },
    { id: 6, start: "12:35", end: "13:15" },
    { id: 7, start: "13:25", end: "14:05" },
    { id: 8, start: "14:15", end: "14:55" },
    { id: 9, start: "15:00", end: "17:00" }
];

function timeToSecs(timeStr) {
    const parts = timeStr.split(":");
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60;
}

function updateTimer() {
    const now = new Date();
    const day = now.getDay(); 
    const currSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    const statusEl = document.getElementById('status-text');
    const timerEl = document.getElementById('timer-display');
    
    if (day === 0 || day === 6) {
        statusEl.innerHTML = "Hétvége";
        timerEl.innerHTML = `<div class="time-part">--</div><div class="colon">:</div><div class="time-part">--</div>`;
        timerEl.style.color = "var(--text-muted)";
        timerEl.style.textShadow = "none";
        return;
    }
    
    const schedule = (day === 5) ? scheduleFriday : scheduleRegular;
    
    let currentState = "after"; 
    let targetTime = 0;
    let statusText = "";
    
    const sevenAM = 7 * 3600; // Reggel 7:00 másodpercben

    if (currSecs < sevenAM) {
        // Ha még nincs reggel 7 óra
        currentState = "before_school";
        statusText = "Még nem kezdődött el a tanítás";
    } else {
        // Ha elmúlt 7 óra, normál csengetési logika
        for (let i = 0; i < schedule.length; i++) {
            const startSecs = timeToSecs(schedule[i].start);
            const endSecs = timeToSecs(schedule[i].end);
            
            if (currSecs < startSecs) {
                currentState = "break";
                targetTime = startSecs;
                statusText = i === 0 ? "0. óra következik" : `${schedule[i].id}. óra következik`;
                break;
            } else if (currSecs >= startSecs && currSecs < endSecs) {
                currentState = "class";
                targetTime = endSecs;
                statusText = `${schedule[i].id}. óra`;
                break;
            }
        }
    }
    
    if (currentState === "after") {
            statusEl.innerHTML = "Vége a tanításnak";
            timerEl.innerHTML = `<div class="time-part">--</div><div class="colon">:</div><div class="time-part">--</div>`;
            timerEl.style.color = "var(--text-muted)";
            timerEl.style.textShadow = "none";
            return;
    }

    if (currentState === "before_school") {
            statusEl.innerHTML = statusText;
            timerEl.innerHTML = `<div class="time-part">--</div><div class="colon">:</div><div class="time-part">--</div>`;
            timerEl.style.color = "var(--text-muted)";
            timerEl.style.textShadow = "none";
            return;
    }
    
    const diff = targetTime - currSecs;
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    
    // Flexboxos (dobozos) HTML generálása a stabilitásért
    let timeHTML = "";
    if (h > 0) {
        timeHTML += `<div class="time-part">${h.toString().padStart(2, '0')}</div><div class="colon">:</div>`;
    }
    timeHTML += `<div class="time-part">${m.toString().padStart(2, '0')}</div><div class="colon">:</div><div class="time-part">${s.toString().padStart(2, '0')}</div>`;
    
    let timerColor = "var(--color-kzmk)"; // Alapértelmezett (ciánkék)
    
    if (currentState === "class") {
        if (diff < 300) { // 5 perc
            timerColor = "var(--color-robotics)"; 
        } else if (diff < 600) { // 10 perc
            timerColor = "var(--color-contact)"; 
        }
    } else if (currentState === "break") {
        if (diff < 120) { // 2 perc
            timerColor = "var(--color-robotics)"; 
        } else if (diff < 300) { // 5 perc
            timerColor = "#fbbf24"; // Sárga
        }
    }
    
    statusEl.innerHTML = statusText;
    timerEl.innerHTML = timeHTML;
    
    timerEl.style.color = timerColor;
    
    if(timerColor === "var(--color-kzmk)") timerEl.style.textShadow = "0 0 20px rgba(21, 250, 219, 0.4)";
    else if(timerColor === "var(--color-contact)") timerEl.style.textShadow = "0 0 20px rgba(245, 158, 11, 0.4)";
    else if(timerColor === "var(--color-robotics)") timerEl.style.textShadow = "0 0 20px rgba(239, 68, 68, 0.4)";
    else if(timerColor === "#fbbf24") timerEl.style.textShadow = "0 0 20px rgba(251, 191, 36, 0.4)";
}

setInterval(updateTimer, 1000);
updateTimer(); 