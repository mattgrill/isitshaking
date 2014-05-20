;(function ($) {
  $('document').ready(function () {
    var qs                            = (function(a) {
          var b = {},
              i,
              p;
          if (a === '') {
            return {};
          }
          for (i = 0; i < a.length; ++i) {
            p = a[i].split('=');
            if (p.length !== 2) {
              continue;
            }
            b[p[0]] = p[1].indexOf(',') > -1 ? p[1].split(',') : decodeURIComponent(p[1].replace(/\+/g, ' '));
          }
          return b;
        })(window.location.search.substr(1).split('&')),
        map_canvas                    = $('#map')[0],
        map_center                    = new google.maps.LatLng(32.98332409183747, -117.08404541015625),
        map_options                   = {
          zoom: 3,
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
        twothousandnine               = '1T8SXIdE0QVJG9lTHPHax3IMTozqXqR180iF1zjCo',
        twothousandeight              = '1j9tR6R9akhne9VU3aPJlW6EcJ41fzn7_X8yW52LZ',
        whatYear                      = function(){
          if (typeof archiveYear === 'undefined') {
            return twentythirteen;
          }
          else {
            switch (archiveYear) {
              case '2013':
                return twentythirteen;
              case '2012':
                return twentytwelve;
              case '2011':
                return twentyeleven;
              case '2010':
                return twentyten;
              case '2009':
                return twothousandnine;
              case '2008':
                return twothousandeight;
              default:
                return twentythirteen;
            }
          }
        },
        magQuery                      = qs.mag ? "'mag' >= '"+qs.mag[0]+"' and 'mag' <= '"+qs.mag[1]+"'" : undefined,
        dateQuery                     = qs.date ?
                                          qs.date instanceof Array ?
                                            qs.date[0] === qs.date[1] ?
                                              "'date' = '"+qs.date[0]+"/"+archiveYear+"'"
                                              : "'date' >= '"+qs.date[0]+"/"+archiveYear+"' AND 'date' <= '"+qs.date[1]+"/"+archiveYear+"'"                             
                                            : "'date' >= '"+qs.date+"/"+archiveYear+"'"
                                          : undefined,
        query                         = [magQuery,dateQuery].filter(function(n){ return n !== undefined; }),
        fustionTableQuery             = query.length === 1 ? query.join('') : query.join(' and '),
        layer                         = new google.maps.FusionTablesLayer({
          query: {
            select: 'latitude',
            from: whatYear(),
            where: fustionTableQuery
          },
          heatmap: {
            enabled: qs.heatmap === 'true' ? true : false
          }
        });
    layer.setMap(map);
    map.mapTypes.set('map-style', styledMapType);
    map.setMapTypeId('map-style');

    overlay.setMap(map);
    overlay.draw                      = function() {};
  });
})(jQuery);

