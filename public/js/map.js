mapboxgl.accessToken = window.mapboxToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: window.coordinates,
    zoom: 9
});

const popup = new mapboxgl.Popup({
    offset: 25,
    className: 'my-popup'
}).setHTML(`
    <h4>Listing location: ${window.listingLocation}</h4>
    <p>Exact location provided after booking</p>
`);

new mapboxgl.Marker()
    .setLngLat(window.coordinates)
    .setPopup(popup)
    .addTo(map);
