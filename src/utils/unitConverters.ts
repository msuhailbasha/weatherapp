import { TemperatureUnit } from '../types';

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempVal(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatPressure(hpa: number, unit: TemperatureUnit): string {
  if (unit === 'F') {
    const inHg = (hpa * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

export function getWindDirectionCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uvIndex: number): { label: string; color: string; badge: string } {
  if (uvIndex < 3) {
    return { label: 'Low', color: 'text-emerald-500', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
  } else if (uvIndex < 6) {
    return { label: 'Moderate', color: 'text-amber-500', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
  } else if (uvIndex < 8) {
    return { label: 'High', color: 'text-orange-500', badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30' };
  } else if (uvIndex < 11) {
    return { label: 'Very High', color: 'text-rose-500', badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30' };
  } else {
    return { label: 'Extreme', color: 'text-purple-600', badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' };
  }
}

export function getAqiCategory(usAqi: number): { label: string; color: string; bg: string; text: string; advice: string } {
  if (usAqi <= 50) {
    return {
      label: 'Good',
      color: '#10b981', // emerald-500
      bg: 'bg-emerald-500/15 border-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      advice: 'Air quality is satisfactory. Great day for outdoor activities!',
    };
  } else if (usAqi <= 100) {
    return {
      label: 'Moderate',
      color: '#f59e0b', // amber-500
      bg: 'bg-amber-500/15 border-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      advice: 'Acceptable air quality; sensitive groups should consider limiting prolonged outdoor exertion.',
    };
  } else if (usAqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: '#f97316', // orange-500
      bg: 'bg-orange-500/15 border-orange-500/30',
      text: 'text-orange-600 dark:text-orange-400',
      advice: 'Sensitive groups (asthma, children, elderly) should avoid heavy outdoor exertion.',
    };
  } else if (usAqi <= 200) {
    return {
      label: 'Unhealthy',
      color: '#ef4444', // red-500
      bg: 'bg-rose-500/15 border-rose-500/30',
      text: 'text-rose-600 dark:text-rose-400',
      advice: 'Everyone may experience health effects. Limit extended outdoor activity.',
    };
  } else if (usAqi <= 300) {
    return {
      label: 'Very Unhealthy',
      color: '#8b5cf6', // purple-500
      bg: 'bg-purple-500/15 border-purple-500/30',
      text: 'text-purple-600 dark:text-purple-400',
      advice: 'Health alert! Avoid all physical activity outdoors.',
    };
  } else {
    return {
      label: 'Hazardous',
      color: '#881337', // rose-900
      bg: 'bg-rose-900/30 border-rose-700/50',
      text: 'text-rose-400',
      advice: 'Emergency health warning. Remain indoors with air purification.',
    };
  }
}
