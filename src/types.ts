export type TemperatureUnit = 'C' | 'F';

export interface LocationData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State / Region
  country_code: string;
  elevation?: number;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  pressureMsl: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface AirQualityData {
  usAqi: number;
  pm10: number;
  pm2_5: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  ozone: number;
  dust?: number;
  alderPollen?: number;
  birchPollen?: number;
  grassPollen?: number;
  ragweedPollen?: number;
}

export interface FullWeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality: AirQualityData | null;
  fetchedAt: Date;
}

export interface IntelligenceInsights {
  overallSummary: string;
  comfortScore: number; // 0 to 100
  outfitAdvice: {
    title: string;
    description: string;
    recommendedItems: string[];
    umbrellaNeeded: boolean;
    sunglassesNeeded: boolean;
    layersLevel: 'Light' | 'Moderate' | 'Heavy' | 'Extreme Warmth';
  };
  outdoorActivity: {
    score: number; // 0 to 100
    verdict: 'Ideal' | 'Good' | 'Fair' | 'Poor' | 'Hazardous';
    bestTimeWindow: string;
    advice: string;
    suitableActivities: string[];
    unsuitableActivities: string[];
  };
  commuteTravel: {
    hazardLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    roadConditions: string;
    visibilityStatus: string;
    commuteAdvice: string;
  };
  healthUV: {
    uvRisk: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
    burnTimeMinutes: number | null;
    airQualityImpact: string;
    jointSensitivityNotice: string;
    hydrationAdvice: string;
  };
  homeGarden: {
    gardenWateringNeeded: boolean;
    windowDryingFeasible: boolean;
    energyEfficiencyTip: string;
    advice: string;
  };
  eventOutdoor: {
    outdoorFeasibility: 'Highly Recommended' | 'Feasible with Precautions' | 'Not Recommended';
    eveningComfort: string;
    advice: string;
  };
}
