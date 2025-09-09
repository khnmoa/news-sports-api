$(document).ready(function () {
  const apiKey = "7616cabe45c82d4e3aed4f14325261ff";
  const leagueId = 39; // Premier League
  const season = 2023;
   let allMatches = [];

  $.ajax({
    url: `https://v3.football.api-sports.io/fixtures?league=${leagueId}&season=${season}`,
    type: "GET",
    headers: { "x-apisports-key": apiKey },
    success: function (response) {
        console.log(response)
          allMatches = response.response;
      //  renderMatches(allMatches);
       // const matches = response.response;
      renderMatches(allMatches);
    },
    error: function () {
      $("#matches-list").html("<tr><td colspan='6'>Failed to load matches</td></tr>");
    }
  });

  function renderMatches(matches) {
    let html = "";
    matches.forEach(match => {
      const league = match.league.name;
      const home = `<img src="${match.teams.home.logo}" width="20"> ${match.teams.home.name}`;
      const away = `<img src="${match.teams.away.logo}" width="20"> ${match.teams.away.name}`;
      const date = new Date(match.fixture.date).toLocaleString();
      const venue = match.fixture.venue?.name ?? "Unknown";
      const score = (match.goals.home !== null)
        ? `${match.goals.home} - ${match.goals.away}`
        : (match.fixture.status.short === "LIVE" ? "Live Now" : "TBD");

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
      const matchDate = new Date(match.fixture.date).toISOString().split("T")[0];

      let teamMatch = !teamName || homeTeam.includes(teamName) || awayTeam.includes(teamName);
      let dateMatch = !dateFilter || matchDate === dateFilter;

      return teamMatch && dateMatch;
    });

    renderMatches(filtered); 
  });
});