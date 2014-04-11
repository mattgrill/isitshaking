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
          twentythirteen                = '1v-vUEe3wcApsZUug589sG_T3eop_fFEZivS0QMHR',
          twentytwelve                  = '1195ofpuopUS_AGnifU5LGMHD3nlNdpNYJPpOp9Ju',
          twentyeleven                  = '1rjSS-u8ftde3yZCdPsTVs5uoll6ckq_lElYzX3pG',
          twentyten                     = '1aJCQmwcj4gRWxpLpXErdBB0K0lSZdssMv-B3Hv3Z',
          whatYear                      = function(){
            if (typeof archiveYear === 'undefined') {
              return twentythirteen;
            }
            else {
              switch (archiveYear) {
                case '2013':
                  return twentythirteen;
                  break;
                case '2012':
                  return twentytwelve;
                  break;
                case '2011':
                  return twentyeleven;
                  break;
                case '2010':
                  return twentyten;
                  break;
                default:
                  return twentythirteen;
              }
            }
          },
          layer                         = new google.maps.FusionTablesLayer({
            query: {
              select: 'latitude',
              from: whatYear()
            }
          });
            
      layer.setMap(map);
      map.mapTypes.set('map-style', styledMapType);
      map.setMapTypeId('map-style');

      overlay.setMap(map);
      overlay.draw                      = function() {};

  });
})(jQuery);

