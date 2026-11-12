// Journey map for Arthur Thomas Spears. Needs Leaflet (loaded in index.html).
(function () {
  var el = document.getElementById('journey-map');
  if (!el || typeof L === 'undefined') return;

  var dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var map = L.map(el, { scrollWheelZoom: false, worldCopyJump: false });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 12,
    className: 'muted-tiles',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var colours = { c1925: '#c0392b', c1928: '#1d6f78', c1934: '#8e5bb5', land: dark ? '#e8c766' : '#8a6d00' };

  // Places are approximate where the records give only a township or village.
  var places = [
    { ll: [51.5345, 0.0083],  title: 'West Ham, London', text: 'Arthur is born here, 4 March 1904.', year: '1904' },
    { ll: [51.4446, -0.2063], title: 'Southfields, London', text: 'Family home at 115 Elborough Street; his father lives here in 1928.', year: '1928' },
    { ll: [50.8998, -1.4044], title: 'Southampton', text: 'The <em>Megantic</em> sails for Halifax, 24 March 1928.', year: '1928' },
    { ll: [46.8139, -71.2080], title: 'Quebec City', text: 'First landing in Canada, <em>Empress of France</em>, 26 June 1925.', year: '1925' },
    { ll: [44.6390, -63.5680], title: 'Halifax', text: 'Lands from the <em>Megantic</em> (1 April 1928) and the <em>Duchess of York</em> (22 April 1934).', year: '1928 · 1934' },
    { ll: [45.3700, -79.7500], title: 'Orrville (Edgington), Parry Sound District', text: 'Works as an engineer for R. E. Wells, 1925–1928.', year: '1925–28' },
    { ll: [44.0300, -78.0900], title: 'Hamilton Township, Northumberland', text: 'Marries Inez Beatrice Willis, 30 April 1936. The Willis family farm was here.', year: '1936' },
    { ll: [43.9593, -78.1677], title: 'Cobourg', text: 'Son Clayton is born, 17 July 1940. Inez dies here, 1 January 1994.', year: '1940' },
    { ll: [44.0700, -78.1900], title: 'Camborne United Church Cemetery', text: 'Arthur (d. 1984) and Inez (d. 1994) are buried here.', year: '1984' }
  ];

  places.forEach(function (p, i) {
    var icon = L.divIcon({ className: 'pin', html: '<span>' + (i + 1) + '</span>', iconSize: [26, 26], iconAnchor: [13, 13] });
    L.marker(p.ll, { icon: icon, title: p.title })
      .bindPopup('<strong>' + p.title + '</strong><br><span class="pop-year">' + p.year + '</span><br>' + p.text)
      .addTo(map);
  });

  // Sea routes: rough great-circle tracks with waypoints so lines stay at sea.
  // The departure ports for 1925 and 1934 aren't in the index, so those lines start offshore.
  var routes = [
    { year: '1925', colour: colours.c1925, dash: '6 6', label: '1925: Empress of France to Quebec (departure port not yet known)',
      pts: [[50.0, -6.5], [51.5, -20], [52.6, -38], [51.6, -55.6], [50.1, -60.5], [49.3, -66.2], [48.2, -69.2], [46.82, -71.2]] },
    { year: '1928', colour: colours.c1928, dash: null, label: '1928: Megantic, Southampton to Halifax',
      pts: [[50.8998, -1.4044], [50.75, -1.3], [50.35, -3.5], [49.9, -6.3], [49.6, -20], [47.8, -40], [45.6, -55], [44.64, -63.57]] },
    { year: '1934', colour: colours.c1934, dash: '2 7', label: '1934: Duchess of York to Halifax (departure port not yet known)',
      pts: [[50.6, -6.8], [50.4, -20], [48.6, -40], [46.3, -55], [44.75, -63.4]] }
  ];

  routes.forEach(function (r) {
    L.polyline(r.pts, { color: r.colour, weight: 3, opacity: 0.9, dashArray: r.dash })
      .bindTooltip(r.label, { sticky: true })
      .addTo(map);
  });

  // Overland: where he was heading, then where he settled. Straight lines, not actual routes.
  L.polyline([[46.8139, -71.2080], [45.37, -79.75]], { color: colours.land, weight: 2, dashArray: '1 6', lineCap: 'round' })
    .bindTooltip('1925: onward to Orrville', { sticky: true }).addTo(map);
  L.polyline([[44.6390, -63.5680], [45.37, -79.75]], { color: colours.land, weight: 2, dashArray: '1 6', lineCap: 'round' })
    .bindTooltip('1928: back to his employer at Orrville', { sticky: true }).addTo(map);
  L.polyline([[45.37, -79.75], [44.03, -78.09]], { color: colours.land, weight: 2, dashArray: '1 6', lineCap: 'round' })
    .bindTooltip('By 1936: settles in Northumberland County', { sticky: true }).addTo(map);

  var views = {
    all: L.latLngBounds([[52.8, 1.5], [42.8, -81]]),
    england: L.latLngBounds([[51.75, 0.4], [50.7, -1.8]]),
    ontario: L.latLngBounds([[45.9, -80.6], [43.7, -77.6]]),
    cobourg: L.latLngBounds([[44.11, -78.27], [43.94, -78.03]])
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
