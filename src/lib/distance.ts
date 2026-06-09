export type Coordinates = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function calculateDistanceMiles(
  from: Coordinates,
  to: Coordinates,
) {
  const latDifference = toRadians(to.lat - from.lat);
  const lngDifference = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(fromLat) *
      Math.cos(toLat) *
      Math.sin(lngDifference / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_MILES *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}
