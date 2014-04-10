(function($){
  $('document').ready(function(){
      var map_canvas                    = $('#map')[0],
          map_center                    = new google.maps.LatLng(32.98332409183747, -117.08404541015625),
          map_options                   = {
            zoom: 3,
            mapTypeControl: true,
            center: map_center,
            disableDefaultUI: false,
            mapTypeControl: false,
            zoomControl: true,
              zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.TOP_RIGHT
            },
            streetViewControl: false
          },
          map                           = new google.maps.Map(map_canvas, map_options),
          quake_information             = $('#quake_information .content'),
          active_location               = {
            marker    : null,
            toppos    : null,
            leftpos   : null
          },
          marker_colors                 = {
            'green'   : '#19664a',
            'blue'    : '#487b86',
            'yellow'  : '#af845a',
            'red'     : '#b75654'
          },
          my_body                       = $('body'),
          overlay                       = new google.maps.OverlayView(),
          style                         = [
            {
              elementType: 'geometry',
              stylers: [
                { saturation: -100 },
                { weight: 0.4 }
              ] 
            },
            {
              featureType: 'administrative.land_parcel',
              elementType: 'all',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ],
          styledMapType                 = new google.maps.StyledMapType(
              style, {
                map:  map,
                name: 'Styled Map'
          }),
          active_makers                 = [],
          make_infowindow               = function(item, marker_color) {
            var list_date_time          = $('<p />',{html: '<b>Date/Time:</b> '+moment(item.time).format('llll')}),
                list_magnitude          = $('<p />',{html: '<b>Magnitude:</b> '+item.mag}),
                list_region             = $('<p />',{html: '<b>Location:</b> '+item.place}),
                close_window            = $('<a />',{'class': 'close_window'})
                                          .css('background','top left url(/images/close-window.png) '+marker_color),
                infowindow_content      = $('<div />',{'class': 'infowindow_content'});
                                              
                infowindow_content.append(close_window,list_date_time,list_magnitude,list_region);
            return infowindow_content
          },
          iterate_quakes                 = function(json_data, status) {
            if(window.location.hash){
              var hash = window.location.hash;
                  hash = hash.substring(1,hash.length);
                  hash = hash.split(',');
             }
            var earth_quakes = json_data.features;
            $.each(earth_quakes,function(index,value){
              var quake_properties      = value.properties,
                  quake_geometry        = value.geometry,
                  quake_id              = value.id,
                  marker_location       = new google.maps.LatLng(quake_geometry.coordinates[1],quake_geometry.coordinates[0]),
                  marker                = new google.maps.Marker({
                    position  : marker_location,
                    title     : 'M: '+quake_properties.mag+' R: '+quake_properties.place
                  }),
                  magnitude             = Number(quake_properties.mag),
                  marker_color          = marker_colors.red,
                  infowindow;

              if (magnitude < 1 || magnitude >= 0.0 && magnitude <= 3.0) marker_color = marker_colors.green;
              if (magnitude >= 3.1 && magnitude <= 4.0) marker_color = marker_colors.blue;
              if (magnitude >= 4.1 && magnitude <= 5.0) marker_color = marker_colors.yellow;
              
              infowindow                = make_infowindow(quake_properties, marker_color)

              marker.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1,
                fillColor: marker_color,
                strokeColor: '#232323',
                strokeOpacity: 0.5,
                strokeWeight: 1,
                scale: 10
              });

              google.maps.event.addListener(marker,'click',function() {
                var infowindow_wrapper  = $('.infowindow_wrapper'),
                    infowindow_content  = infowindow_wrapper.find('.infowindow_content'),
                    projection          = overlay.getProjection(),
                    p                   = projection.fromLatLngToContainerPixel(this.position),
                    infowindow_postop,
                    infowindow_posleft;
                
                if(active_location.marker != null) infowindow_wrapper.empty();
                
                infowindow_wrapper.html(infowindow);
                
                infowindow_postop       = p.y-infowindow_wrapper.height()-25,
                infowindow_posleft      = p.x-110;

                active_location.marker  = this;
                active_location.toppos  = infowindow_postop;
                active_location.leftpos = infowindow_posleft;

                infowindow_wrapper.css({
                  'top'           : infowindow_postop,
                  'left'          : infowindow_posleft
                }).fadeIn('fast');
                window.location.hash = quake_geometry.coordinates[1]+','+quake_geometry.coordinates[0];
              });
        
              active_makers.push(marker);
              marker.setMap(map);

            });
            if(hash && (hash.length === 2)){
              map.setCenter(new google.maps.LatLng(hash[0],hash[1]));
              map.setZoom(14);
            }
          },
          request_helper                = function() {
            return $.ajax({ 
              type: 'GET', 
              url: '/get-json',  
              dataType: 'json',
            });
          },
          get_quakes                    = function(){
            var jsonRequest             = request_helper();
            if(active_makers.length != 0){
              $.each(active_makers,function(index,value){
                value.setMap(null);
              });
              active_makers = [];
            }
            jsonRequest.done(iterate_quakes);
          };

      $(document).on('click', 'a.close_window',function(){
        $('.infowindow_wrapper').fadeOut('fast',function(){
          $(this).css({
            'top'   : '-9999px',
            'left'  : '-9999px'
          });
          active_location.marker        = null;
          active_location.toppos        = null;
          active_location.leftpos       = null;
        });
      });

      google.maps.event.addListener(map,'idle',function(){
        if(active_location.marker != null){
          var infowindow_wrapper        = $('.infowindow_wrapper'),
              projection                = overlay.getProjection(),
              p                         = projection.fromLatLngToContainerPixel(active_location.marker.position),
              infowindow_postop         = p.y-infowindow_wrapper.height()-25,
              infowindow_posleft        = p.x-110;

          infowindow_wrapper.css({
            'top'           : infowindow_postop,
            'left'          : infowindow_posleft
          });
        }
      });

      map.mapTypes.set('map-style', styledMapType);
      map.setMapTypeId('map-style');

      overlay.setMap(map);
      overlay.draw                      = function() {};

      get_quakes();
      setInterval(get_quakes, 60000);

  });
})(jQuery);

