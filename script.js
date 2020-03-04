$(document).ready(function() {
	// Event Click for Search Button
	$("#search-button").on("click", function(event) {
	  event.preventDefault();
	  var city = $("#city").val();
	  if (city == "") {
		return;
	  } else {
		getCityWeather(city);
		addToRecentSearches(city);
	  }
	});
  
	// Onclick listener to search list items
	$("#recent-searches-list").on("click", "li.list-group-item", function() {
	  var city = $(this).text();
	  getCityWeather(city);
	});
  
	// Hide Elements til item is searched
	$("#city-info").hide();
	$("#forecast").hide();
  
	// Load Recent Searches from Local Storage
	getRecentSearches();
  
	
	// City's Weather Info
	function getCityWeather(city) {
	  $("#city-info").show();
  
	  var api_key = "ef9704d691706b1a922e0f0e52268d4e";
	  var baseURL = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}`;
  
	  city = city;
	  var unit = "imperial";
	  var newURL = baseURL + "&q=" + city + "&units=" + unit;
  
	  $.ajax({
		url: newURL,
		method: "GET"
	  }).then(function(response) {
		// City Name
		$("#city-name").text(response.name);
  
		// Today's Date
		$("#date-today").text(`(${moment().format("l")})`);
  
		// Weather Icon
		$("#weather-icon").attr(
		  "src",
		  `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`
		);
  
		// Temperature in Fahrenheit
		$("#temperature").text(response.main.temp + " F");
  
		// Humidity Percentage
		$("#humidity").text(response.main.humidity + " %");
  
		// Wind Speed: MPH
		$("#wind-speed").text(response.wind.speed + " MPH");
  
		// Get UV Index
		var lon = response.coord.lon;
		var lat = response.coord.lat;
		getUVIndex(lon, lat);
  
		// 5 day forecast
		var id = response.id;
		getWeekForecast(id);
	  });
	}
  
	// UV Index
	function getUVIndex(lon, lat) {
	  var api_key = "ef9704d691706b1a922e0f0e52268d4e";
	  var baseURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${api_key}`;
  
	  var newURL = baseURL + "&lat=" + lat + "&lon=" + lon;
  
	  $.ajax({
		url: newURL,
		method: "GET"
	  }).then(function(response) {
		var uv = response.value;
  
		if (uv <= 2.0) {
		  // Favorable: 2 OR LESS
		  $("#uv-index").text(uv);
		  $("#uv-index").addClass("badge badge-success");
		} else if (uv > 2.0 && uv <= 5.0) {
		  // Medium: 2.1 TO 5
		  $("#uv-index").text(uv);
		  $("#uv-index").addClass("badge badge-warning");
		} else if (uv > 5.0 && uv <= 10.0) {
		  // HIGH: 5.1 to 10
		  $("#uv-index").text(uv);
		  $("#uv-index").addClass("badge badge-danger");
		}
	  });
	}
  
	// Five Day forecast
	function getWeekForecast(id) {
	  $("#forecast").show();
  
	  var api_key = "ef9704d691706b1a922e0f0e52268d4e";
	  var baseURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${api_key}`;
  
	  var unit = "imperial";
	  var newURL = baseURL + "&id=" + id + "&units=" + unit;
  
	  $.ajax({
		url: newURL,
		method: "GET"
	  }).then(function(response) {
		var cardHTML = "";
  
		// Loop for five day
		for (var i = 1; i < response.list.length; i += 8) {
		  // icon from response
		  var weatherIcon = response.list[i].weather[0].icon;
  
		  //  Date to Month/Date/Year Format
		  var dateStr = response.list[i].dt_txt;
		  var dateStrArr = dateStr.split(" ");
		  var date = dateStrArr[0];
		  var dateArr = date.split("-");
		  var newDate = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];
			//card for five day
		  cardHTML += `
			  <div class="card text-white bg-dark p-1 mr-3">
				  <div class="card-header text-center font-weight-bold">${newDate}</div>
				  <div class="card-body">
				  <p class="card-text text-center">
					  <img id="weather-icon" src="https://openweathermap.org/img/wn/${weatherIcon}.png"/>
				  </p>
				  <p class="card-text">
					  Temp: ${response.list[i].main.temp} F
				  </p>
				  <p class="card-text">
					  Humidity: ${response.list[i].main.humidity}%
				  </p>
				  </div>
			</div>`;
  
		  $("#city-week-forecast").html(cardHTML);
		}
	  });
	}
  
	// Add new city to Recent Searches list
	var cities = [];
  
	function addToRecentSearches(city) {
	  $("#recent-searches").show();
  
	  // Create Element
	  var newCity = $("<li>");
	  newCity.addClass("list-group-item");
	  newCity.text(city);
	  // Append to List
	  $("#recent-searches-list").prepend(newCity);
  
	  var cityObj = {
		city: city
	  };
  
	  cities.push(cityObj);
  
	  // Save to localStorage
	  localStorage.setItem("searches", JSON.stringify(cities));
	}
  
	// Get Recent Searches from localStorage
	function getRecentSearches() {
	  var searches = JSON.parse(localStorage.getItem("searches"));
	  if (searches != null) {
		for (var i = 0; i < searches.length; i++) {
		  // Create Element
		  var newCity = $("<li>");
		  newCity.addClass("list-group-item");
		  newCity.text(searches[i].city);
		  // Append to List
		  $("#recent-searches-list").prepend(newCity);
		}
		$("#recent-searches").show();
	  } else {
		$("#recent-searches").hide();
	  }
	}
  });
  

  //This clears the previous searches when user clicks on clear history button.
$(".clear").on("click", function() {
    localStorage.clear();
    $("#recent-searches-list").empty();
});
