import PropTypes from 'prop-types';
import { useMapEvents } from 'react-leaflet';

const MapClickHandler = ({ setNewLocation }) => {
  useMapEvents({
    click(e) {
      setNewLocation((prev) => ({
        ...prev,
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6),
      }));
    },
  });
  return null;
};

MapClickHandler.propTypes = {
  setNewLocation: PropTypes.func.isRequired,
};

export default MapClickHandler;