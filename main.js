function getWeatherIcon(icon) {
    return "http://openweathermap.org/img/wn/" + icon + "@4x.png";
  }

  function formatTemp(tmp, unit) {
    var dreeg = "&deg"
    var newtmp = "0" + dreeg;
    if (unit == 1) {
      newtmp = parseFloat(tmp) - 273.15;
    } else {
      newtmp = tmp;
    }
    return Math.round(newtmp) + dreeg;
  }

  function formatDate(date, format) {
    const d = new Date(date * 1000);
    var f = null
    switch (format) {
      case "d":
        f = new Intl.DateTimeFormat('en', {
          weekday: 'short',
        });
        break
      default:
        f = new Intl.DateTimeFormat('en', {
          hour: '2-digit',
          hour12: true
        });
    }
    return f.format(d).replace(/^\s+|\s+/gm, '');
  }

  $(document).ready(function() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall';
    var lat = '25.6901743';
    var lon = '80.3768795';
    var units = 'imperial';
    var key = 'b2abcd946c66781d4035319066085f2b';

    var mapAipURL = "http://maps.openweathermap.org/maps/2.0/weather/PAR0/10/"+lat+"/"+lon+"?date=1527811200&opacity=0.9&fill_bound=true&appid="+key
    console.log(encodeURIComponent(mapAipURL))
   /*  var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
        zoom: 4
      })
    });

    var temp = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: encodeURIComponent(mapAipURL),
        })
    });
    map.addLayer(temp); */

    $.ajax({
      url: apiURL, //API Call
      dataType: "json",
      type: "GET",
      data: {
        lat: lat,
        lon: lon,
        units: units,
        appid: key,
      },
      success: function(data) {
        $("#temp").html(formatTemp(data.current.temp, 0));
        $("#icon").attr('src', getWeatherIcon(data.current.weather[0].icon));
        $("#description").html(data.current.weather[0].description);

        var hwf = "";
        $.each(data.hourly, function(index, hourly) {
          hwf += '<div id ="hw_item" class="mui-col-xs-1 mui-col-md-1 round">';
          hwf += '<img id="hw_icon" class="icon_32 icon_center_horizontal" src="';
          hwf += getWeatherIcon(hourly.weather[0].icon);
          hwf += '"/>';
          hwf += '<div id="hw_Rain" class="font_14 bold center_horizontal">';
          hwf += hourly.pop;
          hwf += '%</div>';
          hwf += '<div id="hw_temp" class="font_14 bold center_horizontal">';
          hwf += formatTemp(hourly.temp, 0);
          hwf += '</div>';
          hwf += '<div id="hw_temp" class="font_14 bold center_horizontal">';
          hwf += formatDate(hourly.dt);
          hwf += '</div>';
          hwf += '</div>';
        });
        hwf += '<div class="clear"></div>';
        $("#hourly").html(hwf);

        var dwf = "";
        $.each(data.daily, function(index, daily) {
          dwf += '<div class="mui-row">';
          dwf += '<div class="mui-col-xs-1 mui-col-md-2 icon_margin_10">';
          dwf += '<span id="dw_dt" class="font_24 bold center uppercase">';
          dwf += formatDate(daily.dt, "d");
          dwf += '</span>';
          dwf += '</div>';
          dwf += '<div class="mui-col-xs-1 mui-col-md-1 icon_margin_10">';
          dwf += '<img id="dw_icon" class="icon_64" src="';
          dwf += getWeatherIcon(daily.weather[0].icon);
          dwf += '"/>';
          dwf += '</div>';
          dwf += '<div class="mui-col-xs-7 mui-col-md-5">';
          dwf += '<span id="dw_rain" class="font_24 bold center">';
          dwf += daily.pop;
          dwf += '%</span>';
          dwf += '</div>';
          dwf += '<div class="mui-col-xs-1 mui-col-md-1">';
          dwf += '<span id="dw_min_temp" class="font_24 bold center">';
          dwf += formatTemp(daily.temp.min, 0);
          dwf += '</span>';
          dwf += '</div>';
          dwf += '<div class="mui-col-xs-1 mui-col-md-1">';
          dwf += '<span id="dw_max_temp" class="font_24 bold center">';
          dwf += formatTemp(daily.temp.max, 0);
          dwf += '</span>';
          dwf += '</div>';
          dwf += '</div>';
          dwf += '<div class="mui-divider"></div>';
        });
        $("#daily").html(dwf);
      }
    });
  });     