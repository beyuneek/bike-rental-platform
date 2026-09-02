import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, Icon } from 'react-leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import "../styles/Marker.scss"

const MapComponent = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [endCoordinates, setEndCoordinates] = useState(null);
  const [markers, setMarkers] = useState([]);

  const mapCenter = startCoordinates || [56.1304, -106.3468]; // Center of Canada
  const mapBounds = [[41.7, -141], [83, -52]]; // Bounds of Canada

  const mapRef = useRef(null);
  // ---------------- Ebike Listing
  const [ebikes, setEbikes] = useState([]);
  const [markers2, setMarkers2] = useState([]);

  useEffect(() => {
    // Fetch eBikes data from your API
    const fetchEbikes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ebikes?only=streetAddress'); // Adjust the URL according to your backend route
        setEbikes(response.data); // Assuming response.data contains the array of eBikes
      } catch (error) {
        console.error('Error fetching eBikes:', error);
      }
    };

    fetchEbikes();
  }, []);

  const fetchCoordinates = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchMarkers = async () => {
      const markers2 = await Promise.all(
        ebikes.map(async (ebike) => {
          const { streetAddress } = ebike;
          const coordinates = await fetchCoordinates(streetAddress);
          if (coordinates) {
            return (
              <Marker key={ebike._id} position={[coordinates.lat, coordinates.lng]} icon={customIcon}>
                <Popup>
                  <div>
                    <h3>{ebike.model}</h3>
                    <p>Price: ${ebike.price}</p>
                    <p>Location: {ebike.streetAddress}</p>
                    <img src={ebike.listingPhotoPaths[0]} alt={"Bike"}></img>
                  </div>
                </Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })
      );
      setMarkers2(markers2);
    };

    fetchMarkers();
  }, [ebikes]);

  // Define a custom icon
  const customIcon = L.divIcon({
    className: 'custom-marker-icon',
  });

  // ------------------------- Ebike Listing
  const HandleRouting = () => {
    const map = useMap();
    if (startCoordinates && endCoordinates) {
      map.setView(mapCenter);
      L.Routing.control({
        waypoints: [
          L.latLng(startCoordinates[0], startCoordinates[1]),
          L.latLng(endCoordinates[0], endCoordinates[1]),
        ],
        router: new L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
        }),
        lineOptions: {
          styles: [{ color: '#0066ff', opacity: 0.7, weight: 5 }],
        },
      }).addTo(map);
    }
    return null;
  };

  // Function to fetch coordinates of a location using Nominatim
  const fetchCoordinatesA = async (location, setter) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}&countrycodes=CA`);
      const data = await response.json();
      if (data.length > 0) {
        setter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        console.log('Error fetching location coordinates');
        alert('Location not found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
      alert('Error fetching location coordinates. Please try again.');
    }
  };

  // Function to handle location input change
  const handleLocationChange = (e, setter) => {
    setter(e.target.value);
    if (setter === setStartLocation) {
      setStartCoordinates(null); // Reset start coordinates when input changes
    } else {
      setEndCoordinates(null); // Reset end coordinates when input changes
    }
  };

  // Function to remove all markers from the map
  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  // Effect to clear markers when start or end coordinates change
  useEffect(() => {
    clearMarkers();
  }, [startCoordinates, endCoordinates]);

  // Function to add a marker to the map
  const addMarker = (coordinates) => {
    if (mapRef.current) {
      const marker = L.marker(coordinates).addTo(mapRef.current);
      setMarkers(prevMarkers => [...prevMarkers, marker]);
    }
  };

  // Effect to add markers when start or end coordinates change
  useEffect(() => {
    if (startCoordinates) {
      addMarker(startCoordinates);
    }
    if (endCoordinates) {
      addMarker(endCoordinates);
    }
  }, [startCoordinates, endCoordinates]);

  // Function to get current location and find the nearest bike location
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const userLocation = `${latitude},${longitude}`;
          
          // Fetch coordinates of all bike locations
          const bikeCoordinates = await Promise.all(
            ebikes.map(async (ebike) => {
              const { streetAddress } = ebike;
              const coordinates = await fetchCoordinates(streetAddress);
              return coordinates;
            })
          );

          // Calculate distances between user location and bike locations
          const distances = bikeCoordinates.map((bikeLocation) => {
            return L.latLng(latitude, longitude).distanceTo(L.latLng(bikeLocation.lat, bikeLocation.lng));
          });

          // Find the index of the nearest bike location
          const nearestBikeIndex = distances.indexOf(Math.min(...distances));
          
          // Set the nearest bike location as the start location
          setStartCoordinates([bikeCoordinates[nearestBikeIndex].lat, bikeCoordinates[nearestBikeIndex].lng]);
          
          // Set the user location as the end location
          setEndCoordinates([latitude, longitude]);
        },
        error => {
          console.error('Error getting current location:', error);
          alert('Error getting current location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <div className='form'>
      <input
        type="text"
        placeholder="Start Location (e.g., Centennial College)"
        value={startLocation}
        onChange={e => handleLocationChange(e, setStartLocation)}
      />
      <button onClick={() => { fetchCoordinatesA(startLocation, setStartCoordinates); }}>Set Start Location</button>
      <button onClick={getCurrentLocation}>Use Current Location</button>
      
      <input
        type="text"
        placeholder="End Location (e.g., CN Tower)"
        value={endLocation}
        onChange={e => handleLocationChange(e, setEndLocation)}
      />
      <button onClick={() => { fetchCoordinatesA(endLocation, setEndCoordinates); }}>Set End Location</button>
      </div>
      <br />
      <MapContainer center={mapCenter} zoom={4} style={{ height: '600px', width: '100%' }} bounds={mapBounds} whenCreated={mapInstance => mapRef.current = mapInstance}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HandleRouting />
        {markers2}
      </MapContainer>
    </div>
  );
};

export default MapComponent;


