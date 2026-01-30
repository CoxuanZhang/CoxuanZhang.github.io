mapboxgl.accessToken = 'pk.eyJ1Ijoia3oxMDgiLCJhIjoiY21rdW0zYWhhMWIwYjNkcHV2MnRwYm5oZSJ9.fz1JGZKf66I3RbK_9ADALw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: [-74.5, 40],    
    zoom: 3 // starting zoom
});

map.on('load', function () {
    map.addSource('locations', {
        type: 'geojson',    
        data: '/personal/camera/locations.geojson'
    });
    map.addLayer({
        id: 'locations-points',
        type: 'circle',
        source: 'locations',
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
});