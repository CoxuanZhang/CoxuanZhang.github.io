mapboxgl.accessToken = 'pk.eyJ1Ijoia3oxMDgiLCJhIjoiY21rdW0zYWhhMWIwYjNkcHV2MnRwYm5oZSJ9.fz1JGZKf66I3RbK_9ADALw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: [-3.5334,51.4048],    
    zoom: 2 // starting zoom
});

map.on('load', function () {

        // Close drawer when clicking outside map and drawer
        document.addEventListener('click', function(event) {
            const drawer = document.getElementById('drawer-container');
            const mapDiv = document.getElementById('map');
            if (
                drawer &&
                !drawer.contains(event.target) &&
                mapDiv &&
                !mapDiv.contains(event.target)
            ) {
                drawer.classList.remove('drawer-expanded');
            }
        });
    map.addSource('locations', {
        type: 'geojson',    
        data: '/personal/camera/locations.geojson'
    });

    fetch('/personal/camera/locations.geojson')
        .then(response => response.json())
        .then(geojson => {
            geojson.features.forEach(feature => {
                const location = feature.properties.location;
                const layerId = `location-point-${location}`;
                map.addLayer({
                    id: layerId,
                    type: 'circle',
                    source: 'locations',
                    filter: ['==', ['get', 'location'], location],
                    paint: {
                        'circle-radius': [
                            'step',
                            ['get', 'photo_counts'],
                            8,    // default: 1-2 photos
                            3, 12, // 3-5 photos
                            6, 16, // 6-8 photos
                            9, 20  // 9+ photos
                        ],
                        'circle-color': '#054A75',
                        'circle-opacity': 0.8
                    }
                });

                // Add hover popup for this layer
                let popup;
                map.on('mouseenter', layerId, function (e) {
                    map.getCanvas().style.cursor = 'pointer';
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const name = e.features[0].properties.location;
                    popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false })
                        .setLngLat(coordinates)
                        .setHTML(`<strong>${name}</strong>`)
                        .addClassName('my-popup')
                        .addTo(map);
                });
                map.on('mouseleave', layerId, function () {
                    map.getCanvas().style.cursor = '';
                    if (popup) popup.remove();
                });
                // Add click event to expand drawer
                map.on('click', layerId, function (e) {
                    const name = e.features[0].properties.location;
                    const drawer = document.getElementById('drawer-container');
                    const content = document.getElementById('drawer-content');
                    // Fetch photos_data.json and display images for this location
                    fetch('Personal/Camera/photos_data.json')
                        .then(resp => resp.json())
                        .then(photoData => {
                            const photos = photoData[name] || [];
                            let photoHTML = '';
                            if (photos.length > 0) {
                                photoHTML = `<div id="drawer-scroll-container">` +
                                    photos.map(photo =>
                                        `<img src="/${photo.path}" alt="${photo.ID}" title="${photo.ID}">`
                                    ).join('') +
                                    `</div>`;
                            } else {
                                photoHTML = '<p>No photos available for this location.</p>';
                            }
                            content.innerHTML = `<h3>${name}</h3>${photoHTML}`;
                        });
                    drawer.classList.add('drawer-expanded');
                    // Center the map on the clicked pin
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    map.easeTo({ center: coordinates });
                    // Scroll so the map title is at the top
                    const mapTitle = document.getElementById('map-title');
                    if (mapTitle) {
                        const y = mapTitle.getBoundingClientRect().top + window.pageYOffset - 30; // 30px margin
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                });
            });
        });
});