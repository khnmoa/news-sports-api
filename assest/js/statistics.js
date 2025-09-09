$(document).ready(function () {
  const API_KEY = "0777a804440babe4506c08f8c0cc2aff30b9647ffaee123a91e608ce9edf5fb8";
  const LEAGUE_ID = 152; 
  const SEASON_ID = 2023;

  const url = `https://apiv2.allsportsapi.com/football/?met=Topscorers&leagueId=${LEAGUE_ID}&seasonId=${SEASON_ID}&APIkey=${API_KEY}`;

  $.getJSON(url, function (data) {
    console.log("API Response:", data);

    if (data && data.result && data.result.length > 0) {
      data.result.slice(0, 10).forEach(player => {
        const playerId = player.player_key;
        const teamId = player.team_key;

        
        $.getJSON(`https://apiv2.allsportsapi.com/football/?met=Players&playerId=${playerId}&APIkey=${API_KEY}`, function (playerData) {
          const playerInfo = playerData.result[0];

         
          const playerImage = (playerInfo && playerInfo.player_image && playerInfo.player_image.trim() !== "")
          ? playerInfo.player_image 
          : "https://cdn-icons-png.flaticon.com/512/149/149071.png";


          
          $.getJSON(`https://apiv2.allsportsapi.com/football/?met=Teams&teamId=${teamId}&APIkey=${API_KEY}`, function (teamData) {
            const teamInfo = teamData.result[0];

            const teamLogo = (teamInfo && teamInfo.team_logo && teamInfo.team_logo.trim() !== "")
            ? teamInfo.team_logo
            : "https://cdn-icons-png.flaticon.com/512/44/44948.png";


            const playerCard = `
              <div class="col-md-4 col-sm-6">
                <div class="card text-center p-3 player-card">
                  <img src="${playerImage}" alt="${player.player_name}" class="player-img mx-auto">
                  <h5 class="fw-bold">${player.player_name}</h5>
                  <p class="text-muted d-flex align-items-center justify-content-center">
                    <img src="${teamLogo}" alt="${player.team_name}" class="team-logo">
                    ${player.team_name}
                  </p>
                  <p>⚽ Goals: ${player.goals || 0}</p>
                  <p>🟨 Yellow Cards: ${player.yellowcards || 0}</p>
                  <p>🟥 Red Cards: ${player.redcards || 0}</p>
                </div>
              </div>
            `;

            $("#players").append(playerCard);
          });
        });
      });
    } else {
      $("#players").html(`<p class="text-center text-danger">No data found!</p>`);
    }
  }).fail(function (xhr, status, error) {
    console.error("Error fetching API:", error);
    $("#players").html(`<p class="text-center text-danger">Error fetching data</p>`);
  });
});
