import React, { useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import PropTypes from 'prop-types';

// Dummy data for suspects
const suspectsData = [
  { city: 'Delhi', latitude: 28.6139, longitude: 77.209, suspects: 500 },
  { city: 'Mumbai', latitude: 19.076, longitude: 72.8777, suspects: 400 },
  { city: 'Kolkata', latitude: 22.5726, longitude: 88.3639, suspects: 300 },
  { city: 'Chennai', latitude: 13.0827, longitude: 80.2707, suspects: 200 },
  { city: 'Bangalore', latitude: 12.9716, longitude: 77.5946, suspects: 150 },
  { city: 'Hyderabad', latitude: 17.385, longitude: 78.4867, suspects: 250 },
];

// Custom component to reset map view
const ResetMapView = ({ resetTrigger }) => {
  const map = useMap(); // Hook used inside a component

  React.useEffect(() => {
    if (resetTrigger) {
      map.setView([20.5937, 78.9629], 5); // Reset to initial position and zoom level
    }
  }, [resetTrigger, map]);

  return null;
};

ResetMapView.propTypes = {
  resetTrigger: PropTypes.bool.isRequired, // Prop validation for resetTrigger
};

const ZoomToMarker = ({ lat, lon, markerRef }) => {
  const map = useMap();

  React.useEffect(() => {
    if (lat && lon) {
      map.setView([lat, lon], 10); // Zoom in to the selected city
      if (markerRef.current) {
        markerRef.current.openPopup(); // Open popup on marker
      }
    }
  }, [lat, lon, map, markerRef]);

  return null;
};

ZoomToMarker.propTypes = {
  lat: PropTypes.number.isRequired, // Prop validation for lat
  lon: PropTypes.number.isRequired, // Prop validation for lon
  markerRef: PropTypes.object.isRequired, // Reference to the marker
};

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(false); // To control the reset action
  const markerRefs = useRef({});

  const handleCityClick = (city) => {
    setSelectedCity(city); // Set the selected city
  };

  // Function to trigger map reset
  const resetMapView = () => {
    setResetTrigger(true); // Trigger the reset
    setSelectedCity(null); // Deselect any selected city
    
    // Reset the resetTrigger after a short delay
    setTimeout(() => {
      setResetTrigger(false); // Reset trigger back to false to allow future resets
    }, 100); // Timeout to ensure the map has time to reset
  };

  return (
    <div className="dashboard">
      <div className="map-container">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {suspectsData.map((city) => {
            // Create a ref for each marker to open the popup on sidebar click
            markerRefs.current[city.city] = useRef();

            return (
              <Marker
                key={city.city}
                position={[city.latitude, city.longitude]}
                eventHandlers={{
                  click: () => handleCityClick(city), // Handle marker click
                }}
                icon={L.icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Custom marker icon
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
                ref={markerRefs.current[city.city]} // Assign the ref to the marker
              >
                <Popup>
                  <strong>{city.city}</strong> <br />
                  Suspects: {city.suspects}
                </Popup>
              </Marker>
            );
          })}
          {selectedCity && (
            <ZoomToMarker
              lat={selectedCity.latitude}
              lon={selectedCity.longitude}
              markerRef={markerRefs.current[selectedCity.city]} // Pass marker ref to open popup
            />
          )}
          <ResetMapView resetTrigger={resetTrigger} /> {/* Reset map view on trigger */}
        </MapContainer>
        <button className="back-button" onClick={resetMapView}>
          Back
        </button>
      </div>
      <div className="sidebar">
        <h3>Suspects by City</h3>
        <ul>
          {suspectsData.map((city) => (
            <li
              key={city.city}
              onClick={() => handleCityClick(city)} // Handle sidebar click
              className={selectedCity?.city === city.city ? 'selected' : ''}
            >
              {city.city}: {city.suspects}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
