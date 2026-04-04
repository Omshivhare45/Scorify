const matchId = localStorage.getItem("matchId");


const URL = `https://api.cricapi.com/v1/match_scorecard?apikey=8851c25f-0e59-40fc-abe0-4bfc0fe026ba&id=${matchId}`;

async function getScorecard(){
    try{

        console.log("MATCH ID:", matchId);

        const res = await fetch(URL);
        const text = await res.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            document.getElementById("scorecard-container").innerHTML = "⚠️ scorecard not available";
            return;
        }

        console.log(data);

        if( !data.data || !data.data.scorecard){
            document.getElementById("scorecard-container").innerHTML = "⚠️No Score card available";
            return;
        }


        let output = "";

        data.data.scorecard.forEach(inning  => {
            output +=` <div class="scorecard-box">`;

            output += `<h2>${inning.inning}</h2>`;

            // batting table

            output += 
            `<table class = "batting-table">
                <tr>
                    <th>Player</th>
                    <th>R</th>
                    <th>B</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>SR</th>
                </tr>`;

                inning.batting.forEach(b => {
                    output += `<tr>
                        <td>${b.batsmaName}</td>
                        <td>${b.runs}</td>
                        <td>${b.balls}</td>
                        <td>${b.fours}</td>
                        <td>${b.sixes}</td>
                        <td>${b.strikeRate}</td>
                    </tr>`;

                    
                });

                output += `</table>`;

                //bowling table

                output += 
                `<table class="bowling-table">
                    <tr>
                        <th>Bowler</th>
                        <th>O</th>
                        <th>R</th>
                        <th>W</th>
                        <th>Economy</th>
                    </tr>`;

                    inning.bowling.forEach( b => {
                        output += `<tr>
                            <td>${b.bowlername}</td>
                            <td>${b.overs}</td>
                            <td>${b.runs}</td>
                            <td>${b.wickets}</td>
                            <td>${b.economy}</td>
                        </tr>`;
                    });
                
                output +=  `</table>`;

                output += `</div>`;

        });

        document.getElementById("scorecard-container").innerHTML = output;

    } catch (e){
        console.log("Error", e );
    }
}

getScorecard();