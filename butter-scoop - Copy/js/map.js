if (document.getElementById("map")) {
  // Correct order: [Longitude, Latitude]
  const coordinates = [-73.972295, 40.851953];

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v11",
    center: coordinates, // Fixed coordinate order
    zoom: 14,
    cooperativeGestures: true,
  });

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      },
    ],
  };

  for (const feature of geojson.features) {
    // Option A: Standard Mapbox pin (works immediately without custom CSS)
    new mapboxgl.Marker({ color: "#ff4757" })
      .setLngLat(feature.geometry.coordinates)
      .addTo(map);
  }
}
