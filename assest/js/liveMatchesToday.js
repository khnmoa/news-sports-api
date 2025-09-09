$(document).ready(function () {
  let allMatches = []; 

  $.ajax({
    url: `https://livescore-api.com/api-client/matches/live.json?&key=6DQtQHceC7caFJVO&secret=YMMuLgRDQpUAnphu27YSPa7sijCY2yM0`,
    type: "GET",
    success: function (response) {
      console.log(response);
      allMatches = response.data?.match || []; 
      renderMatches(allMatches);
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        $("#matches-list").html("<tr><td colspan='7'>Unauthorized: API Key or Secret is invalid / daily limit reached</td></tr>");
      } else {
        $("#matches-list").html("<tr><td colspan='7'>Failed to load matches</td></tr>");
      }
    }
  });

  function renderMatches(matches) {
    if (!matches.length) {
      $("#matches-list").html("<tr><td colspan='7'>No matches found</td></tr>");
      return;
    }

    let html = "";
    matches.forEach(match => {
      const league = match.competition?.name ?? "Unknown";
      const home = match.home ? `<img src="${match.home.logo}" width="20"> ${match.home.name}` : "Unknown";
      const away = match.away ? `<img src="${match.away.logo}" width="20"> ${match.away.name}` : "Unknown";
      const date = match.added ?? "Unknown";
      let datetime = match.scheduled ?? "Unknown";

      if(datetime !== "Unknown") {
        const [hourStr, minute] = datetime.split(":");
        let hour = parseInt(hourStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        datetime = `${hour}:${minute} ${ampm}`;
      }

      const venue = match.home?.stadium ?? match.location ?? "Unknown";
      const score = match.scores?.score ?? "TBD";
      const status = match.status ?? "Unknown";

      html += `
        <tr>
          <td>${league}</td>
          <td>${home}</td>
          <td>${away}</td>
          <td>${date}</td>
          <td>${datetime}</td>
          <td>${venue}</td>
          <td>${score} (${status})</td>
        </tr>
      `;
    });

    $("#matches-list").html(html);
  }

  $("#applyFilter").on("click", function () {
    const teamFilter = $("#teamFilter").val().toLowerCase().trim();

    const filtered = allMatches.filter(match => {
      const homeName = match.home?.name?.toLowerCase() ?? "";
      const awayName = match.away?.name?.toLowerCase() ?? "";
      return homeName.includes(teamFilter) || awayName.includes(teamFilter);
    });

    renderMatches(filtered);
  });
});
