'use client';
import { GoogleMap, Marker, Circle, useLoadScript } from '@react-google-maps/api';
import { useMemo } from 'react';

const MapComponent = () => {
  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(() => ({ lat: 20.675285, lng: -101.355475 }), []);
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <div className="flex relative w-full items-center justify-center aspect-square rounded">Loading Map...</div>;
  }

  return (
    <div className="relative w-full aspect-square rounded">
      <GoogleMap
        options={mapOptions}
        zoom={8}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
        onLoad={(map) => console.log('Map Loaded')}
      >
        <Marker
          position={mapCenter}
          onLoad={() => console.log('Marker Loaded')}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: 1.0,
            strokeWeight: 1,
            strokeColor: 'white',
            scale: 5,
          }}
        />

        <Circle
          center={mapCenter}
          radius={75000}
          onLoad={() => console.log('Circle Load...')}
          options={{
            fillColor: '#7eb2e0',
            fillOpacity: 0.4,
            strokeColor: '#7eb2e0',
            strokeOpacity: 0.5,
            strokeWeight: 1,
          }}
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
