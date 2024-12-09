// Initialize the map
const map = L.map("map").setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Enable geolocation
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: true, // Add a marker at the found location
})
  .on("markgeocode", function (e) {
    const bbox = e.geocode.bbox; // Bounding box of the location
    const poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest(),
    ]);
    map.fitBounds(poly.getBounds()); // Adjust the map to fit the location
  })
  .addTo(map);
