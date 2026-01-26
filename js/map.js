mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [121.473, 31.2479],
    zoom: 2.8,
    attributionControl: true
});

const mapStage = document.getElementById('map-stage');
const drawer = document.getElementById('drawer-container');
const drawerContent = document.getElementById('drawer-content');
const drawerClose = document.getElementById('drawer-close');
let lastScrollY = window.scrollY;
let selectedCoordinates = null;

function panelWidth() {
    return window.innerWidth <= 700 ? window.innerWidth * 0.94 : window.innerWidth * 0.75;
}

function initialMapPadding() {
    return { top: 0, bottom: 0, left: 0, right: window.innerWidth > 700 ? window.innerWidth * 0.5 : 0 };
}

function closeDrawer() {
    drawer.classList.remove('drawer-expanded');
    drawer.setAttribute('aria-hidden', 'true');
    if (selectedCoordinates) {
        map.flyTo({ center: selectedCoordinates, zoom: 2.8, padding: initialMapPadding(), essential: true });
    }
}

function updateHeaderOnScroll() {
    const stageBounds = mapStage.getBoundingClientRect();
    const scrollingDown = window.scrollY > lastScrollY;
    if (scrollingDown && stageBounds.top <= 0) document.body.classList.add('camera-header-hidden');
    else if (!scrollingDown && stageBounds.bottom > 0) document.body.classList.remove('camera-header-hidden');
    lastScrollY = window.scrollY;
}

drawerClose.addEventListener('click', closeDrawer);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDrawer(); });
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
window.addEventListener('resize', () => {
    if (drawer.classList.contains('drawer-expanded')) map.resize();
    else map.setPadding(initialMapPadding());
});

map.on('load', function () {
    map.setPadding(initialMapPadding());
    map.addSource('locations', { type: 'geojson', data: 'Personal/Camera/locations.geojson' });
    fetch('Personal/Camera/locations.geojson')
        .then(response => response.json())
        .then(geojson => {
            geojson.features.forEach(feature => {
                const location = feature.properties.location;
                const layerId = `location-point-${location}`;
                map.addLayer({
                    id: layerId, type: 'circle', source: 'locations',
                    filter: ['==', ['get', 'location'], location],
                    paint: { 'circle-radius': ['step', ['get', 'photo_counts'], 8, 3, 12, 6, 16, 9, 20], 'circle-color': '#054A75', 'circle-opacity': 0.8 }
                });
                let popup;
                map.on('mouseenter', layerId, event => {
                    map.getCanvas().style.cursor = 'pointer';
                    popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                        .setLngLat(event.features[0].geometry.coordinates.slice())
                        .setHTML(`<strong>${location}</strong>`).addClassName('my-popup').addTo(map);
                });
                map.on('mouseleave', layerId, () => {
                    map.getCanvas().style.cursor = '';
                    if (popup) popup.remove();
                });
                map.on('click', layerId, event => {
                    selectedCoordinates = event.features[0].geometry.coordinates.slice();
                    fetch('Personal/Camera/photos_data.json')
                        .then(response => response.json())
                        .then(photoData => {
                            const photos = (photoData[location] || []).filter(photo => /\.(jpe?g|png|gif|webp)$/i.test(photo.path));
                            drawerContent.innerHTML = `<h2>${location}</h2>` + (photos.length
                                ? `<div class="photo-stack">${photos.map(photo => `<img src="${photo.path}" alt="${photo.ID || location}" title="${photo.ID || location}">`).join('')}</div>`
                                : '<p>No photos available for this location.</p>');
                            drawer.classList.add('drawer-expanded');
                            drawer.setAttribute('aria-hidden', 'false');
                        });
                    map.flyTo({ center: selectedCoordinates, zoom: Math.max(map.getZoom(), 4.5), padding: { top: 0, bottom: 0, left: 0, right: panelWidth() }, essential: true });
                });
            });
        });
});
