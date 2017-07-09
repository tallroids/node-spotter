function highlight(latlng) {
  map.panTo(latlng)
}

function initMap() {
  locations = JSON.parse(localStorage.getItem('locations'))
  var center = {
    lat: Number(locations[0].lat),
    lng: Number(locations[0].lng)
  }
  window.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: center
  });
  locations.forEach(function (each) {
    var marker = new google.maps.Marker({
      position: {
        lat: Number(each.lat),
        lng: Number(each.lng)
      },
      map: map,
      title: each.title
    });
  })
}

function addLocation(){
  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
    openPrompt(event.latLng)
  })
}

function openPrompt(latlng){
  $('#prompt').addClass('visible')
}

function displayLocations(locations) {
  localStorage.setItem('locations', JSON.stringify(locations))
  $('#locations').text('');
  locations.forEach(function (location) {
    $('#locations').append("<h3><button class='header' onclick='highlight({lat:" + location.lat + ", lng:" + location.lng + "})'>" + location.title + "</button></h3>")
    $('#locations').append("<p>" + location.description + "</p>")
  })
}

function filter(categoryId) {
  $.get("/api/getLocationsByCategoryId/" + categoryId, function (result) {
    if (typeof (result) == 'object' && result.success) {
      displayLocations(result.locations);
    } else {
      $("#locations").text("Could not retrieve locations.");
    }
  });
}

function showPage(page) {
  if (page.toLowerCase() == 'favorites') {
    $('#locations').text('')
    $.get("/api/getFavorites", function (result) {
      if (typeof (result) == 'object' && result.success) {
        displayLocations(result.locations);
      } else {
        $("#locations").text("Could not retrieve locations.");
      }
    });
    $('#pageName').text(page)
  } else if (page == 'home') {
    getLocations();
  }
  $('#sidenav-overlay').click();
}

$.get("/api/getCategories", function (result) {
  if (typeof (result) == 'object' && result.success) {
    result.categories.forEach(function (category) {
      $('#categories').append("<h3><button class='header' onclick='filter(" + category.id + ")'>" + category.title + "</button></h3>")
    })
  } else {
    $("#categories").text("Could not retrieve categories.");
  }
});

function getLocations() {
  $('#locations').text('')
  $.get("/api/getLocations", function (result) {
    if (typeof (result) == 'object' && result.success) {
      displayLocations(result.locations);
    } else {
      $("#locations").text("Could not retrieve locations.");
    }
  });
}

getLocations();
