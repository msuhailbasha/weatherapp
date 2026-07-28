import { AirQualityData, CurrentWeather, DailyForecastItem, FullWeatherData, HourlyForecastItem, LocationData } from '../types';

export const POPULAR_CITIES: LocationData[] = [
  { id: 2988507, name: 'Paris', latitude: 48.8534, longitude: 2.3488, country: 'France', country_code: 'FR', admin1: 'Île-de-France' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.6917, country: 'Japan', country_code: 'JP', admin1: 'Tokyo' },
  { id: 5128581, name: 'New York', latitude: 40.7143, longitude: -74.006, country: 'United States', country_code: 'US', admin1: 'New York' },
  { id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom', country_code: 'GB', admin1: 'England' },
  { id: 2147714, name: 'Sydney', latitude: -33.8678, longitude: 151.2073, country: 'Australia', country_code: 'AU', admin1: 'New South Wales' },
  { id: 360630, name: 'Cairo', latitude: 30.0626, longitude: 31.2497, country: 'Egypt', country_code: 'EG', admin1: 'Cairo' },
  { id: 5391959, name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, country: 'United States', country_code: 'US', admin1: 'California' },
  { id: 3451190, name: 'Rio de Janeiro', latitude: -22.9064, longitude: -43.1822, country: 'Brazil', country_code: 'BR', admin1: 'Rio de Janeiro' },
];

export async function searchCities(query: string): Promise<LocationData[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to search locations');
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code || '',
      admin1: item.admin1 || '',
      elevation: item.elevation,
      timezone: item.timezone,
    }));
  } catch (err) {
    console.error('Error searching cities:', err);
    return [];
  }
}

export async function getLocationFromCoords(lat: number, lon: number): Promise<LocationData> {
  try {
    // Attempt reverse geocoding via Open-Meteo or BigDataCloud
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const name = data.locality || data.city || data.principalSubdivision || 'Your Location';
      return {
        id: Math.round(lat * 1000 + lon * 1000),
        name,
        latitude: lat,
        longitude: lon,
        country: data.countryName || '',
        country_code: data.countryCode || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch {
    // Fallback if reverse geocode service fails
  }

  return {
    id: Math.round(lat * 1000 + lon * 1000),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    country: '',
    country_code: '',
  };
}

export async function fetchFullWeatherData(location: LocationData): Promise<FullWeatherData> {
  const { latitude: lat, longitude: lon } = location;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto`;

  const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,alder_pollen,birch_pollen,grass_pollen,ragweed_pollen`;

  const [weatherRes, aqRes] = await Promise.allSettled([
    fetch(weatherUrl),
    fetch(airQualityUrl),
  ]);

  if (weatherRes.status === 'rejected' || !weatherRes.value.ok) {
    throw new Error('Failed to retrieve weather data from Open-Meteo.');
  }

  const wData = await weatherRes.value.json();

  let aqData: AirQualityData | null = null;
  if (aqRes.status === 'fulfilled' && aqRes.value.ok) {
    try {
      const aqJson = await aqRes.value.json();
      if (aqJson.current) {
        aqData = {
          usAqi: aqJson.current.us_aqi ?? 35,
          pm10: aqJson.current.pm10 ?? 12,
          pm2_5: aqJson.current.pm2_5 ?? 8,
          carbonMonoxide: aqJson.current.carbon_monoxide ?? 200,
          nitrogenDioxide: aqJson.current.nitrogen_dioxide ?? 15,
          sulphurDioxide: aqJson.current.sulphur_dioxide ?? 3,
          ozone: aqJson.current.ozone ?? 45,
          dust: aqJson.current.dust ?? 0,
          alderPollen: aqJson.current.alder_pollen,
          birchPollen: aqJson.current.birch_pollen,
          grassPollen: aqJson.current.grass_pollen,
          ragweedPollen: aqJson.current.ragweed_pollen,
        };
      }
    } catch {
      aqData = null;
    }
  }

  // Parse current weather
  const curr = wData.current;
  const current: CurrentWeather = {
    time: curr.time,
    temperature: curr.temperature_2m,
    apparentTemperature: curr.apparent_temperature,
    relativeHumidity: curr.relative_humidity_2m,
    isDay: Boolean(curr.is_day),
    precipitation: curr.precipitation,
    rain: curr.rain,
    showers: curr.showers,
    snowfall: curr.snowfall,
    weatherCode: curr.weather_code,
    cloudCover: curr.cloud_cover,
    pressureMsl: curr.pressure_msl,
    surfacePressure: curr.surface_pressure,
    windSpeed: curr.wind_speed_10m,
    windDirection: curr.wind_direction_10m,
    windGusts: curr.wind_gusts_10m,
    uvIndex: curr.uv_index,
  };

  // Parse hourly (next 48 items)
  const h = wData.hourly;
  const hourly: HourlyForecastItem[] = [];
  const hourlyLen = Math.min(48, h.time?.length || 0);

  for (let i = 0; i < hourlyLen; i++) {
    hourly.push({
      time: h.time[i],
      temperature: h.temperature_2m[i],
      apparentTemperature: h.apparent_temperature[i],
      relativeHumidity: h.relative_humidity_2m[i],
      dewPoint: h.dew_point_2m[i],
      precipitationProbability: h.precipitation_probability[i],
      precipitation: h.precipitation[i],
      weatherCode: h.weather_code[i],
      pressureMsl: h.pressure_msl[i],
      cloudCover: h.cloud_cover[i],
      visibility: h.visibility[i],
      windSpeed: h.wind_speed_10m[i],
      windDirection: h.wind_direction_10m[i],
      uvIndex: h.uv_index[i],
      isDay: Boolean(h.is_day[i]),
    });
  }

  // Parse daily (7 days)
  const d = wData.daily;
  const daily: DailyForecastItem[] = [];
  const dailyLen = d.time?.length || 0;

  for (let i = 0; i < dailyLen; i++) {
    daily.push({
      date: d.time[i],
      weatherCode: d.weather_code[i],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      apparentTempMax: d.apparent_temperature_max[i],
      apparentTempMin: d.apparent_temperature_min[i],
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
      uvIndexMax: d.uv_index_max[i],
      precipitationSum: d.precipitation_sum[i],
      precipitationProbabilityMax: d.precipitation_probability_max[i],
      windSpeedMax: d.wind_speed_10m_max[i],
      windGustsMax: d.wind_gusts_10m_max[i],
      windDirectionDominant: d.wind_direction_10m_dominant[i],
    });
  }

  return {
    location,
    current,
    hourly,
    daily,
    airQuality: aqData,
    fetchedAt: new Date(),
  };
}
