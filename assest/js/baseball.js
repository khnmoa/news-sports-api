  $(document).ready(function () {
      const apiKey = "ab790b6dd1dc4f628e75a7a08e314155";
      const leagueId = 258; 
      const season = 2023;
      let allMatches = [];

      $.ajax({
        url: `https://v1.basketball.api-sports.io/games?league=${leagueId}&season=${season}`,
        type: "GET",
        headers: { "x-apisports-key": apiKey },
        success: function (response) {
          console.log(response);
          allMatches = response.response || [];
          renderMatches(allMatches);
        },
        error: function () {
          $("#matches-list").html("<tr><td colspan='6'>Failed to load matches</td></tr>");
        }
      });

      function renderMatches(matches) {
        if (!matches.length) {
          $("#matches-list").html("<tr><td colspan='6'>No matches found</td></tr>");
          return;
        }

        let html = "";
        matches.forEach(match => {
          const league = match.league?.name || "Unknown League";
          const home = `<img src="${match.teams.home.logo}" width="20"> ${match.teams.home.name}`;
          const away = `<img src="${match.teams.away.logo}" width="20"> ${match.teams.away.name}`;
          const date = new Date(match.date).toLocaleString();
          const venue = match.venue ?? "Unknown";
       const homeScore = match.scores.home.total;
const awayScore = match.scores.away.total;

const score = `${homeScore} - ${awayScore}`;

          html += `
            <tr>
              <td>${league}</td>
              <td>${home}</td>
              <td>${away}</td>
              <td>${date}</td>
              <td>${venue}</td>
              <td>${score}</td>
            </tr>
          `;
        });

        $("#matches-list").html(html);
      }

      $("#applyFilter").click(function () {
        const teamName = $("#teamFilter").val().toLowerCase();
        const dateFilter = $("#dateFilter").val();

        const filtered = allMatches.filter(match => {
          const homeTeam = match.teams.home.name.toLowerCase();
          const awayTeam = match.teams.away.name.toLowerCase();
          const matchDate = new Date(match.date).toISOString().split("T")[0];

          let teamMatch = !teamName || homeTeam.includes(teamName) || awayTeam.includes(teamName);
          let dateMatch = !dateFilter || matchDate === dateFilter;

          return teamMatch && dateMatch;
        });

        renderMatches(filtered); 
      });
    });