function highlight(latlng) {
  map.panTo(latlng)
}

function initMap() {
  locations = JSON.parse(localStorage.getItem('locations'))
  var center = {
    lat: Number(locations[0].lat),
    lng: Number(locations[0].lng)
  }
  console.log(center)
  window.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
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

function showAddLocation(){
  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
    openPrompt(event.latLng)
  })
}

function addLocation(){
  var latlng = JSON.parse($('#latlng').val())
  var title = $('#title').val()
  var desc = $('#desc').val()
  var isPublic = $('#isPublic').val()
  var data = {
    title:title,
    description:desc,
    lat:latlng.lat,
    lng:latlng.lng,
    isPublic:isPublic
  }
  $.post('api/createLocation', data, function(result){
    console.log(result)
  })
}

function openPrompt(latlng){
  $('#prompt').addClass('visible')
  $('#latlng').val(JSON.stringify(latlng))
}

function displayLocations(locations) {
  console.log(locations)
  localStorage.setItem('locations', JSON.stringify(locations))
  $('#locations').text('');
  locations.forEach(function (location) {
    $('#locations').append("<h3 id=" + location.id + "><button class='header' onclick='highlight({lat:" + location.lat + ", lng:" + location.lng + "})'>" + location.title + "</button><button class='header edit' onclick='editLocation(" + location.id + ")'></button></h3>")
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
    if (result.success) {
      displayLocations(result.locations);
    } else {
      displayLocations(JSON.parse(localStorage.getItem('locations')))
      $("#locations").text("Could not retrieve locations.");
    }
  });
}

getLocations();

function editLocation(locationId){
  $('#'+locationId+'+p').append($('#editForm'))
//  $('#')
}
