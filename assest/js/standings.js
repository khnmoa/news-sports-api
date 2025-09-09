const Api_key = "werqOGTBezEy8V4r";
const Api_secret = "wxSGGQ9hyDTFlufukR9FZs7S7THYXKQt";
var standingsData = [];
var standingsDataAr=[];
var goalsData=[];
const drawTable = () => {
  const $tbody = $("#standingsTable tbody");
  standingsData.forEach((entry,index) => {
    //replace k.ismalia broken logo with working one.
    entry.team.logo=(entry.team.name=="Kahraba")?'https://upload.wikimedia.org/wikipedia/ar/thumb/1/1c/%D9%86%D8%A7%D8%AF%D9%8A_%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1_%D8%A7%D9%84%D8%A5%D8%B3%D9%85%D8%A7%D8%B9%D9%8A%D9%84%D9%8A%D8%A9.png/250px-%D9%86%D8%A7%D8%AF%D9%8A_%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1_%D8%A7%D9%84%D8%A5%D8%B3%D9%85%D8%A7%D8%B9%D9%8A%D9%84%D9%8A%D8%A9.png':entry.team.logo;
    entry.team.name=getArName(entry.team.name);

    const gd = entry.goals_scored - entry.goals_conceded;
    const $row = $(`
        <tr>
          <td>${entry.rank}</td>
          <td>
            <img src="${
              entry.team.logo
            }" class="img-fluid rounded me-2 align-middle" width="24" height="24"  alt="${
      entry.team.name
    } logo">
            ${entry.team.name}
          </td>
          <td>${entry.points}</td>
          <td>${entry.matches}</td>
          <td>${entry.won}</td>
          <td>${entry.drawn}</td>
          <td>${entry.lost}</td>
          <td>${entry.goals_scored}</td>
          <td>${entry.goals_conceded}</td>
          <td>${gd >= 0 ? "+" + gd : gd}</td>
        </tr>
      `);
    $tbody.append($row);
  });
};

const drawGoals = () => {
  const $tbody = $("#goalsTable tbody");
  goalsData.forEach((entry,index) => {
    //replace k.ismalia broken logo with working one.
    entry.team.logo=(entry.team.name=="Kahraba")?'https://upload.wikimedia.org/wikipedia/ar/thumb/1/1c/%D9%86%D8%A7%D8%AF%D9%8A_%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1_%D8%A7%D9%84%D8%A5%D8%B3%D9%85%D8%A7%D8%B9%D9%8A%D9%84%D9%8A%D8%A9.png/250px-%D9%86%D8%A7%D8%AF%D9%8A_%D9%83%D9%87%D8%B1%D8%A8%D8%A7%D8%A1_%D8%A7%D9%84%D8%A5%D8%B3%D9%85%D8%A7%D8%B9%D9%8A%D9%84%D9%8A%D8%A9.png':entry.team.logo;
    entry.team.name=getArName(entry.team.name);

      const $row = $(`
        <tr>
          <td>${entry.player.name}</td>
          <td>
            <img src="${
              entry.team.logo
            }" class="img-fluid rounded me-2 align-middle" width="24" height="24"  alt="${
      entry.team.name
    } logo">
            ${entry.team.name}
          </td>
          <td>${entry.goals}</td>
          <td>${entry.assists}</td>
          <td>${entry.played}</td>
        </tr>
      `);
    $tbody.append($row);
  });
};

const fetchStandings = () => {
  $.ajax({
    url: "https://livescore-api.com/api-client/competitions/table.json",
    type: "GET",
    contentType: "application/json",
    data: {
      // Data to send (optional)
      competition_id: 36,
      key: Api_key,
      secret: Api_secret,
      lang: "ar",
    },
    success: function (response) {
      // What to do if the request is successful
      console.log(response);
      standingsData = response.data.stages[0].groups[0].standings;
      drawTable();
      // console.log(standingsData);
    },
    error: function (xhr, status, error) {
      // What to do if the request fails
      console.error(error);
    },
  });
};

const fetchAr=()=>{
  //https://livescore-api.com/api-client/competitions/standings.json?competition_id=36&key=werqOGTBezEy8V4r&secret=A6Mgw6Tc3TYYGuqcJRDyyw9N6OleKpGk&lang=ar
  const baseURL='https://livescore-api.com/api-client/competitions/standings.json';
  const apiKey='werqOGTBezEy8V4r';
  const secretKey='A6Mgw6Tc3TYYGuqcJRDyyw9N6OleKpGk';
  $.ajax({
    url:baseURL,
    type:"GET",
    contentType:'application/json',
    data:{
      competition_id: 36/*-34*/,
      key: apiKey,
      secret: secretKey,
      lang: "ar",
    },
     success: function (response) {
      // What to do if the request is successful
      // console.log(response);
      standingsDataAr = response.data.table;
      // console.log(standingsDataAr);
      drawTable();
    },
    error: function (xhr, status, error) {
      // What to do if the request fails
      console.error(error);
    },
  });
}

const fetchGoalRanking=()=>{
  const apiKey='werqOGTBezEy8V4r';
  const secretKey='A6Mgw6Tc3TYYGuqcJRDyyw9N6OleKpGk';
  $.ajax({
    url:'https://livescore-api.com/api-client/competitions/topscorers.json',
    type:'GET',
    contentType:'application/json',
    data:{
      competition_id: 36,
      key: apiKey,
      secret: secretKey,
      lang: "ar",
    },
    success: function (response) {
      // What to do if the request is successful
      // console.log(response);
      goalsData=response.data.topscorers;
      // console.log(goalsData);
      drawGoals();
    },
    error: function (xhr, status, error) {
      // What to do if the request fails
      console.error(error);
    },

  })
}

$(document).ready(function () {
  fetchStandings();
  // fetchAr();
  fetchGoalRanking();
});
