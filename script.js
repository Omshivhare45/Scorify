const URL = "https://api.cricapi.com/v1/currentMatches?apikey=8851c25f-0e59-40fc-abe0-4bfc0fe026ba&offset=0";

async function getScore() {
  try {
    const res = await fetch(URL);
    const data = await res.json();

    console.log(data);

    if (!data.data) {
      document.getElementById("match-container").innerHTML =
        "⚠️ No data available / API issue";
      return;
    }

    const iplMatches = data.data.filter(match =>
      match.name.includes("Indian Premier League")
    );

    let output = "";

    iplMatches.forEach(match => {

  const teams = match.name.split(" vs ");
  const team1 = teams[0] || "";
  const team2 = teams[1] || "";

  let badge = "";
  let badgeClass = "";

  if (match.matchEnded) {
    badge = "COMPLETED";
    badgeClass = "badge completed";
  } 
  else if (match.matchStarted) {
    badge = "LIVE 🔴";
    badgeClass = "badge live";
  } 
  else {
    badge = "UPCOMING";
    badgeClass = "badge upcoming";
  }

  const statusColor = getStatusColor(match.status);

  // ✅ SCORE PART (SAFE VERSION)
  let scoreHTML = "";

  if (match.score && Array.isArray(match.score)) {
    match.score.forEach(s => {
      scoreHTML += `
        <div class="score-line">
          ${s.inning || ""}: ${s.r || 0}/${s.w || 0} (${s.o || 0} ov)
        </div>
      `;
    });
  } else {
    scoreHTML = `<div class="score-line">Score not available</div>`;
  }

  output += `
    <div class="card">

      <div class="${badgeClass}">${badge}</div>

      <div class="teams">
        <span>${team1}</span>
        <span class="vs">vs</span>
        <span>${team2}</span>
      </div>

      <div class="score">
        ${scoreHTML}
      </div>

      <div class="status" style="color:${statusColor}">
        ${match.status || "No status"}
      </div>

      <div class="venue">${match.venue || "Unknown venue"}</div>

    </div>
  `;
});
    document.getElementById("match-container").innerHTML = output;

    
   if (iplMatches.some(m => m.matchStarted && !m.matchEnded)) {
  setTimeout(getScore, 60000)


}

  } catch (err) {
    console.log("Error:", err);
  }
}

function getStatusColor(status) {
  if (!status) return "#ccc";
  status = status.toLowerCase();

  if (status.includes("won")) return "#4ade80";
  if (status.includes("live")) return "#ff4757";
  return "#facc15";
}

getScore();