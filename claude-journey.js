// Journey map for Claude "Ash" Ashby. Needs Leaflet (loaded in index.html).
(function () {
  var el = document.getElementById('journey-map');
  if (!el || typeof L === 'undefined') return;

  var map = L.map(el, { scrollWheelZoom: false });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    className: 'muted-tiles',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var colours = { home: '#1f3a68', war: '#b3282d', travel: '#8a6d00' };

  // Wartime pins are regional: the newspapers name the theatres, not the airfields.
  var places = [
    { ll: [49.9997, -113.0845], title: 'Barons, Alberta', year: '1921–1930', text: 'Birthplace on his death registration. His father is the CPR station agent here.' },
    { ll: [49.6935, -112.8418], title: 'Lethbridge, Alberta', year: '1930–1941', text: 'Grows up here: St. Patrick\'s High School, tennis, a job at H. R. Carson Co. Enlists in the RCAF in 1941.' },
    { ll: [50.5803, -113.8707], title: 'High River, Alberta', year: '1941', text: 'His mother and stepfather live here; Samuel Thorneycroft instructs at the flying school.' },
    { ll: [52.6, -1.5], title: 'England', year: 'Nov 1941', text: 'Arrives safely in England as a sergeant. Where he landed and trained isn\'t yet known.' },
    { ll: [31.2, 26.0], title: 'Western Desert, North Africa', year: 'c. 1942–1943', text: 'Flies with the RAF\'s Western Desert Air Force over Egypt and Libya.' },
    { ll: [35.9, 14.45], title: 'Malta', year: 'c. 1942–1943', text: 'Operations over and from Malta.' },
    { ll: [37.5, 14.3], title: 'Sicily', year: '1943', text: 'Operations over Sicily, invaded by the Allies in July 1943.' },
    { ll: [41.4, 15.5], title: 'Italy', year: '1943–1944', text: 'Operations over Italy. 51 operational trips in all.' },
    { ll: [51.0447, -114.0719], title: 'Calgary, Alberta', year: '1945', text: 'Home as a warrant officer. Attends the Institute of Technology and Art.' },
    { ll: [49.2827, -123.1207], title: 'Vancouver, British Columbia', year: '1958', text: 'Promoted to Warrant Officer First Class; communications supervisor at No. 5 Air Division. Married to Betty Scott of Vancouver.' },
    { ll: [49.1579, -121.9515], title: 'Chilliwack, British Columbia', year: '1998', text: 'Retired from the Armed Forces. Dies here on 5 March 1998.' }
  ];

  places.forEach(function (p, i) {
    var war = i >= 3 && i <= 7;
    var icon = L.divIcon({ className: 'pin' + (war ? ' pin-war' : ' pin-home'), html: '<span>' + (i + 1) + '</span>', iconSize: [26, 26], iconAnchor: [13, 13] });
    L.marker(p.ll, { icon: icon, title: p.title })
      .bindPopup('<strong>' + p.title + '</strong><br><span class="pop-year">' + p.year + '</span><br>' + p.text)
      .addTo(map);
  });

  function line(pts, colour, dash, label, weight) {
    L.polyline(pts, { color: colour, weight: weight || 3, opacity: 0.9, dashArray: dash, lineCap: 'round' })
      .bindTooltip(label, { sticky: true }).addTo(map);
  }

  // Growing up in southern Alberta.
  line([[49.9997, -113.0845], [49.6935, -112.8418]], colours.home, null, 'Barons to Lethbridge, about 1930');

  // Overseas. Ports and routes aren't recorded, so these are indicative only.
  line([[49.6935, -112.8418], [47.5, -85], [45.5, -70], [44.6, -63.6], [47, -45], [52, -20], [52.6, -1.5]],
       colours.travel, '6 7', 'Autumn 1941: to England (route and ports not recorded)');
  line([[52.6, -1.5], [49.5, -6.5], [43.5, -11], [36.5, -8], [36.0, -5.5], [36.6, 2], [35.9, 14.45], [33.5, 22], [31.2, 26.0]],
       colours.travel, '6 7', 'To the Mediterranean (route not recorded)');

  // The theatres he flew over, in the order the 1958 article lists them.
  line([[31.2, 26.0], [35.9, 14.45], [37.5, 14.3], [41.4, 15.5]], colours.war, null, 'North Africa, Malta, Sicily, Italy: 51 operational trips', 4);

  line([[41.4, 15.5], [38.5, 10], [36.8, 1], [36.0, -5.5], [40, -12], [50, -8], [52.6, -1.5]],
       colours.travel, '2 7', 'Back to Britain (route not recorded)');
  line([[52.6, -1.5], [52, -20], [47, -45], [44.6, -63.6], [45.5, -70], [47.5, -85], [51.0447, -114.0719]],
       colours.travel, '2 7', 'Spring 1945: repatriated to Canada');

  // Postwar career in the West.
  line([[51.0447, -114.0719], [49.2827, -123.1207]], colours.home, '1 6', 'Postwar RCAF career; Vancouver by 1958');
  line([[49.2827, -123.1207], [49.1579, -121.9515]], colours.home, '1 6', 'Retirement in Chilliwack');

  var views = {
    all: L.latLngBounds([[55, -125], [29, 30]]),
    alberta: L.latLngBounds([[51.3, -114.6], [49.4, -112.4]]),
    war: L.latLngBounds([[46.5, 8], [29.5, 30]]),
    bc: L.latLngBounds([[49.5, -123.6], [48.95, -121.6]])
  };

  map.fitBounds(views.all, { padding: [10, 10] });

  document.querySelectorAll('[data-view]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      map.flyToBounds(views[btn.getAttribute('data-view')], { padding: [20, 20], duration: 0.8 });
    });
  });
})();
