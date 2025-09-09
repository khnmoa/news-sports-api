$(document).ready(function () {
  // Weather Section 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiKey = "9c9691ea939acdc745b65a8fca718b84"; 
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
          $("#weather-info").html(`
            ${data.name}: ${data.main.temp}°C 
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather icon">
          `);
        },
        error: function () {
          $("#weather-info").text("Failed to load weather data");
        }
      });
    });
  }

  // Currency Section
  $.ajax({
    url: "https://open.er-api.com/v6/latest/USD",
    type: "GET",
    success: function (data) {
      const usdToEgp = data.rates.EGP;
      const usdToSar = data.rates.SAR;
      $("#usd").text(`USD: 1 USD = ${usdToEgp.toFixed(2)} EGP`);
      $("#sar").text(`SAR: 1 SAR = ${(1 / usdToSar).toFixed(2)} USD`);

      // Converter
      $("#convert").click(function () {
        const amount = $("#amount").val();
        const from = $("#from").val();
        const to = $("#to").val();
        if (amount === "") return;

        $.ajax({
          url: `https://open.er-api.com/v6/latest/${from}`,
          type: "GET",
          success: function (conv) {
            const rate = conv.rates[to];
            const result = amount * rate;
            $("#result").text(`${amount} ${from} = ${result.toFixed(2)} ${to}`);
          },
          error: function () {
            $("#result").text("Conversion failed, try again");
          }
        });
      });
    },
    error: function () {
      $("#usd").text("Failed to load USD rates");
      $("#sar").text("Failed to load SAR rates");
    }
  });

  // Live Matches Section

const footballApiKey = "7616cabe45c82d4e3aed4f14325261ff";
const season = "2025";

$.ajax({
  url: `https://v3.football.api-sports.io/fixtures?live=all`,
  type: "GET",
  headers: { "x-apisports-key": footballApiKey },
  success: function (response) {
    console.log(response)
    const matches = response.response;
    let html = "";

    if (matches.length === 0) {
      html = "<p>No live matches at the moment</p>";
    } else {
      matches.forEach(match => {
        const matchDate = new Date(match.fixture.date).toLocaleString("en-US", { timeZone: "Africa/Cairo" });

        html += `
          <div class="match">
            <img src="${match.teams.home.logo || 'default.png'}" width="20" alt="${match.teams.home.name}"> 
            ${match.teams.home.name}
            ${match.goals.home} - ${match.goals.away}
            <img src="${match.teams.away.logo || 'default.png'}" width="20" alt="${match.teams.away.name}"> 
            ${match.teams.away.name}
            <br><small>${match.league.name} - ${matchDate}</small>
          </div>
        `;
      });
    }

    $("#matches-list").html(html);
  },
  error: function () {
    $("#matches-list").text("Failed to load matches");
  }
});

});


$(document).ready(function () {
    var newApiKey = 'bc5fc62248fe34dae0e9d086c9bc40d6';


    var newsApiCategories = ['world', 'science', 'business', 'sports'];

 
    var categoryTitles = {
        world: "📰 سياسة",
        science: "🔬 علوم",
        business: "💰 اقتصاد",
        sports: "⚽ رياضة"
    };


   newsApiCategories.forEach(function (category, index) {
    setTimeout(function() {
        var newsApiUrl = `https://gnews.io/api/v4/top-headlines?apikey=${newApiKey}&category=${category}&max=3&lang=ar`;

        $.ajax({
            type: 'get',
            dataType: 'json',
            url: newsApiUrl,
            success: function (result) {
                var section = `
                    <div class="news-section my-4">
                        <h2 class="category-title mb-3">${categoryTitles[category]}</h2>
                        <div class="row" id="${category}-row"></div>
                    </div>
                `;
                $('#news').append(section);

                if(result.articles){
                    for (var a = 0; a < result.articles.length; a++) {
                        var article = `
                            <div class="col-md-4 mb-3">
                                <div class="card h-100">
                                    <img class="card-img-top" src='${result.articles[a].image}' alt="صورة الخبر">
                                    <div class="card-body">
                                        <h5 class="card-title">${result.articles[a].title}</h5>
                                        <p class="card-text">${result.articles[a].description || ''}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                        $(`#${category}-row`).append(article);
                    }
                }
            },
            error: function (errors) {
                console.log("حدث خطأ أثناء جلب الأخبار:", errors.responseText);
            },
        });
    }, index * 2000); // 2 ثانية بين كل request
});
})