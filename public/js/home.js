/* eslint-env node, browser */
/* global $ */
/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

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

function showAddLocation() {
  $('#prompt').addClass('visible')
  $('#prompt').text('Click on the map to add a marker')
  google.maps.event.addListener(map, 'click', function (event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
    openPrompt(event.latLng)
  })
}

function addLocation() {
  var latlng = JSON.parse($('#latlng').val())
  var title = $('#title').val()
  var desc = $('#desc').val()
  var isPublic = $('#isPublic').val()
  var data = {
    title: title,
    description: desc,
    lat: latlng.lat,
    lng: latlng.lng,
    isPublic: isPublic
  }
  $.post('api/createLocation', data, function (result) {
    if (result.success) {
      refreshLocations("added location")
    }
  })
}

function openPrompt(latlng) {
  $('#prompt').removeClass('visible')
  $('#newLocation').addClass('visible')
  $('#latlng').val(JSON.stringify(latlng))
}

function displayLocations(locations) {
  localStorage.setItem('locations', JSON.stringify(locations))
  $('#locations').text('');
  locations.forEach(function (location) {
    $('#locations').append("<h3 id=" + location.id + "><button class='header' onclick='highlight({lat:" + location.lat + ", lng:" + location.lng + "})'>" + location.title + "</button><button class='header edit' onclick='showEditLocation(" + location.id + ")'></button></h3>")
    $('#locations').append("<p>" + location.description + "</p>")
  })
  initMap();
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

function showEditLocation(locationId) {
  $('#' + locationId + '+p').append($('#editForm'))
  $.get('api/getLocationById/' + locationId, function (result) {
    if (result.success) {
      $('#editTitle').val(result.location.title);
      $('#editDesc').val(result.location.description);
      $('#editIsPublic').val(result.location.isPublic);
      $('#locationId').val(result.location.id);
    }
  })
}

function editLocation() {
  var id = $('#locationId').val();
  var title = $('#editTitle').val();
  var desc = $('#editDesc').val();
  var isPublic = $('#editIsPublic')[0].checked;
  var data = {
    id: id,
    title: title,
    description: desc,
    isPublic: isPublic
  }
  $.ajax({
    url: 'api/updateLocation',
    data: data,
    type: 'PUT',
    success: function (result) {
      if (result.success) {
        refreshLocations("updated location")
      }
    }
  })
}

function deleteLocation() {
  var locationId = $('#locationId').val();
  $.ajax({
    url: 'api/deleteLocation/' + locationId,
    type: 'DELETE',
    success: function (result) {
      if (result.success) {
        refreshLocations("deleted location");
      }
    }
  })
}

function refreshLocations(message) {
  $('#newLocation').removeClass('visible')
  $('#hidden').append($('#editForm'))
  $('#prompt').addClass('visible')
  $('#prompt').text("Successfully " + message)
  getLocations();
}
