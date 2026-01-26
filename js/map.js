mapboxgl.accessToken = 'pk.eyJ1Ijoia3oxMDgiLCJhIjoiY21rdW0zYWhhMWIwYjNkcHV2MnRwYm5oZSJ9.fz1JGZKf66I3RbK_9ADALw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
        center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 3 // starting zoom
    });