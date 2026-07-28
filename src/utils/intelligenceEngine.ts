import { FullWeatherData, IntelligenceInsights } from '../types';
import { getWeatherCodeInfo } from './weatherCodes';

export function generateWeatherIntelligence(data: FullWeatherData): IntelligenceInsights {
  const { current, hourly, daily, airQuality } = data;
  const temp = current.temperature;
  const apparentTemp = current.apparentTemperature;
  const humidity = current.relativeHumidity;
  const wind = current.windSpeed;
  const gusts = current.windGusts;
  const uv = current.uvIndex;
  const precip = current.precipitation;
  const code = current.weatherCode;
  const codeInfo = getWeatherCodeInfo(code);
  const aqi = airQuality?.usAqi ?? 40;

  // 1. Calculate Comfort Score (0 to 100)
  // Ideal range: 18-24°C, 40-60% humidity, wind < 15km/h, AQI < 50, UV < 6, precip = 0
  let comfort = 100;
  
  // Temp penalty
  if (temp < 18) {
    comfort -= Math.min(40, Math.pow(18 - temp, 1.3) * 2);
  } else if (temp > 24) {
    comfort -= Math.min(40, Math.pow(temp - 24, 1.3) * 2.5);
  }

  // Humidity penalty
  if (humidity < 30) comfort -= 10;
  else if (humidity > 70) comfort -= Math.min(25, (humidity - 70) * 0.8);

  // Wind penalty
  if (wind > 20) comfort -= Math.min(25, (wind - 20) * 0.8);

  // Rain penalty
  if (precip > 0 || codeInfo.category === 'rain' || codeInfo.category === 'drizzle') {
    comfort -= 30;
  } else if (codeInfo.category === 'snow') {
    comfort -= 25;
  } else if (codeInfo.category === 'thunderstorm') {
    comfort -= 50;
  }

  // AQI penalty
  if (aqi > 50) comfort -= Math.min(30, (aqi - 50) * 0.25);

  const comfortScore = Math.max(10, Math.min(100, Math.round(comfort)));

  // 2. Outfit & Wardrobe Recommendation
  const recommendedItems: string[] = [];
  let layersLevel: 'Light' | 'Moderate' | 'Heavy' | 'Extreme Warmth' = 'Light';
  const umbrellaNeeded = precip > 0 || codeInfo.category === 'rain' || codeInfo.category === 'drizzle' || daily[0]?.precipitationProbabilityMax > 40;
  const sunglassesNeeded = (uv >= 3 || codeInfo.category === 'clear') && current.isDay;

  if (temp < 0) {
    layersLevel = 'Extreme Warmth';
    recommendedItems.push('Heavy down winter coat', 'Thermal underwear layer', 'Wool beanie & scarf', 'Insulated waterproof boots', 'Thermal gloves');
  } else if (temp < 10) {
    layersLevel = 'Heavy';
    recommendedItems.push('Puffer or heavy wool coat', 'Warm fleece sweater', 'Long trousers / denim', 'Enclosed boots or thick sneakers');
  } else if (temp < 18) {
    layersLevel = 'Moderate';
    recommendedItems.push('Light jacket or trench coat', 'Long sleeve shirt or cardigan', 'Jeans or chinos');
  } else if (temp < 26) {
    layersLevel = 'Light';
    recommendedItems.push('Breathable t-shirt or polo', 'Light shorts or linen pants', 'Comfortable sneakers or loafers');
  } else {
    layersLevel = 'Light';
    recommendedItems.push('Ultra-light cotton / linen outfit', 'Breathable shorts', 'Open sandals or light canvas shoes', 'Sun hat');
  }

  if (umbrellaNeeded) {
    recommendedItems.push('Compact windproof umbrella', 'Water-resistant footwear');
  }
  if (sunglassesNeeded) {
    recommendedItems.push('UV400 Polarized sunglasses', 'Broad spectrum SPF 30+ sunscreen');
  }
  if (wind > 35) {
    recommendedItems.push('Windbreaker jacket');
  }

  const outfitTitle = temp > 28 ? 'Breathable Hot-Weather Attire' : temp > 18 ? 'Mild Casual Layering' : temp > 8 ? 'Warm Layered Jacket Weather' : 'Insulated Cold-Weather Gear';
  const outfitDesc = `Based on feels-like temperature of ${Math.round(apparentTemp)}°C and ${codeInfo.description.toLowerCase()} conditions, ${layersLevel.toLowerCase()} layering is recommended today.`;

  // 3. Outdoor Activity & Sport Planner
  let activityScore = 90;
  if (precip > 0 || codeInfo.category === 'rain') activityScore -= 45;
  if (codeInfo.category === 'thunderstorm') activityScore -= 80;
  if (codeInfo.category === 'snow') activityScore -= 35;
  if (wind > 30) activityScore -= 30;
  if (temp > 32 || temp < 2) activityScore -= 30;
  if (aqi > 100) activityScore -= 35;

  activityScore = Math.max(5, Math.min(100, Math.round(activityScore)));

  let verdict: 'Ideal' | 'Good' | 'Fair' | 'Poor' | 'Hazardous' = 'Ideal';
  if (activityScore >= 80) verdict = 'Ideal';
  else if (activityScore >= 65) verdict = 'Good';
  else if (activityScore >= 45) verdict = 'Fair';
  else if (activityScore >= 25) verdict = 'Poor';
  else verdict = 'Hazardous';

  // Find best hourly window for outdoor exercise in next 12 hours
  const next12Hours = hourly.slice(0, 12);
  let bestHour = next12Hours[0];
  let bestHourScore = -999;

  next12Hours.forEach((h) => {
    const hTime = new Date(h.time);
    const hourNum = hTime.getHours();
    let score = 100 - Math.abs(h.temperature - 21) * 3 - h.precipitationProbability * 0.8 - h.windSpeed * 0.5;
    if (hourNum >= 6 && hourNum <= 10) score += 15; // Prefer morning exercise
    if (hourNum >= 17 && hourNum <= 20) score += 10; // Late afternoon
    if (hourNum < 6 || hourNum > 22) score -= 30; // Late night
    if (score > bestHourScore) {
      bestHourScore = score;
      bestHour = h;
    }
  });

  const bestTimeDate = new Date(bestHour?.time || Date.now());
  const bestTimeStr = bestTimeDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

  const suitableActivities: string[] = [];
  const unsuitableActivities: string[] = [];

  if (activityScore >= 65) {
    suitableActivities.push('Outdoor jogging & running', 'Cycling & road biking', 'Park walks & picnics', 'Outdoor tennis / basketball');
    unsuitableActivities.push('Heavy endurance without hydration');
  } else if (activityScore >= 45) {
    suitableActivities.push('Brisk walking in sheltered areas', 'Gym workout', 'Indoor rock climbing');
    unsuitableActivities.push('Open-air cycling', 'Water sports', 'High-altitude hiking');
  } else {
    suitableActivities.push('Indoor fitness & yoga studio', 'Swimming in indoor pools', 'Mall walking');
    unsuitableActivities.push('Outdoor running', 'Cycling on wet/slick roads', 'Boating or sailing');
  }

  // 4. Commute & Travel Hazard Watch
  let hazardLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let roadConditions = 'Dry and clean traction';
  let visibilityStatus = 'Clear optical range (>10 km)';
  let commuteAdvice = 'Smooth travel conditions. Normal driving speed recommended.';

  if (codeInfo.category === 'thunderstorm' || gusts > 60) {
    hazardLevel = 'Severe';
    roadConditions = 'Severely slick with standing water and possible debris';
    visibilityStatus = 'Poor visibility during heavy downdrafts';
    commuteAdvice = 'Allow extra travel time. Maintain increased braking distance and watch for fallen branches or localized flooding.';
  } else if (codeInfo.category === 'snow' || temp <= 0) {
    hazardLevel = 'High';
    roadConditions = 'Potential icy patches, slush, or black ice on bridges';
    visibilityStatus = 'Reduced range due to active snowfall';
    commuteAdvice = 'Drive with low beams, gentle braking, and check tire pressure.';
  } else if (codeInfo.category === 'rain' || precip > 1.5) {
    hazardLevel = 'Moderate';
    roadConditions = 'Wet asphalt with hydroplaning risk at highway speeds';
    visibilityStatus = 'Moderate reduction from road spray';
    commuteAdvice = 'Use wipers, turn on headlights, and leave extra space behind vehicles.';
  } else if (codeInfo.category === 'fog') {
    hazardLevel = 'High';
    roadConditions = 'Moist surface roads';
    visibilityStatus = 'Dense fog alert with visibility under 1 km';
    commuteAdvice = 'Use low-beam fog lights, avoid sudden lane changes, and slow down significantly.';
  }

  // 5. Health & UV Advisory
  const uvRisk = uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : uv < 11 ? 'Very High' : 'Extreme';
  let burnTimeMinutes: number | null = null;
  if (uv >= 3) {
    burnTimeMinutes = Math.max(10, Math.round(200 / (uv * 1.5)));
  }

  let airQualityImpact = 'Fresh air with minimal particulate matter.';
  if (aqi > 100) {
    airQualityImpact = 'Elevated PM2.5 levels may trigger coughs or breathing discomfort for sensitive individuals.';
  } else if (aqi > 50) {
    airQualityImpact = 'Moderate particulate presence. Safe for most healthy adults.';
  }

  // Barometric pressure change notice
  const pressureTrend = current.pressureMsl;
  let jointSensitivityNotice = 'Stable atmospheric pressure (around 1013 hPa). Minimal joint sensitivity anticipated.';
  if (pressureTrend < 1005) {
    jointSensitivityNotice = 'Low barometric pressure detected. Individuals with migraines or joint stiffness may feel heightened sensitivity.';
  } else if (pressureTrend > 1025) {
    jointSensitivityNotice = 'High barometric pressure system present. Clear skies and stable atmospheric density.';
  }

  let hydrationAdvice = 'Standard daily fluid intake (~2 Liters) is sufficient.';
  if (temp > 28 || humidity < 35) {
    hydrationAdvice = 'High thermal load! Target at least 3+ Liters of electrolyte-rich hydration today.';
  }

  // 6. Home, Garden & Energy
  const gardenWateringNeeded = precip === 0 && daily[0]?.precipitationSum < 1.0 && temp > 15;
  const windowDryingFeasible = precip === 0 && humidity < 65 && wind > 8 && codeInfo.category !== 'fog';
  
  let energyTip = 'Moderate climate. Natural cross-ventilation can reduce air conditioning usage.';
  if (temp < 10) {
    energyTip = 'Cold outdoor temps: Seal drafty doors, draw heavy curtains at sunset to trap heat indoors.';
  } else if (temp > 28) {
    energyTip = 'High cooling demand: Close blinds on sun-facing windows during peak afternoon hours.';
  }

  const homeAdvice = gardenWateringNeeded
    ? 'Soil moisture is declining. Ideal time to water garden plants early morning or late evening.'
    : 'Recent rain or cool temps mean garden soil retains ample moisture. No irrigation required today.';

  // 7. Outdoor Event & Dining
  let outdoorFeasibility: 'Highly Recommended' | 'Feasible with Precautions' | 'Not Recommended' = 'Highly Recommended';
  if (precip > 0 || codeInfo.category === 'rain' || codeInfo.category === 'thunderstorm' || wind > 35) {
    outdoorFeasibility = 'Not Recommended';
  } else if (temp > 30 || temp < 12 || humidity > 80 || uv >= 8) {
    outdoorFeasibility = 'Feasible with Precautions';
  }

  const eveningComfort = temp > 22 ? 'Warm, balmy evening perfect for outdoor patio dining.' : temp > 15 ? 'Pleasant evening; light jacket recommended for outdoor seating.' : 'Chilly night ahead; indoor dining or heated outdoor space is advised.';

  // Summary headline synthesis
  const summaryParts: string[] = [];
  summaryParts.push(`Today in ${data.location.name}: Expect ${codeInfo.description.toLowerCase()} conditions with temperatures around ${Math.round(temp)}°C (feels like ${Math.round(apparentTemp)}°C).`);
  
  if (umbrellaNeeded) {
    summaryParts.push('Keep an umbrella handy due to precipitation chance.');
  } else if (sunglassesNeeded) {
    summaryParts.push(`Moderate to high UV index (${uv}) suggests sun protection.`);
  }

  if (activityScore >= 75) {
    summaryParts.push(`Overall outdoor activity index is excellent (${activityScore}/100).`);
  } else {
    summaryParts.push(`Outdoor activity index is limited (${activityScore}/100) due to ${codeInfo.category}.`);
  }

  return {
    overallSummary: summaryParts.join(' '),
    comfortScore,
    outfitAdvice: {
      title: outfitTitle,
      description: outfitDesc,
      recommendedItems,
      umbrellaNeeded,
      sunglassesNeeded,
      layersLevel,
    },
    outdoorActivity: {
      score: activityScore,
      verdict,
      bestTimeWindow: bestTimeStr,
      advice: `Best time window for outdoor exercise is around ${bestTimeStr}. ${activityScore >= 65 ? 'Conditions are well-suited for cardio workouts.' : 'Consider indoor alternatives.'}`,
      suitableActivities,
      unsuitableActivities,
    },
    commuteTravel: {
      hazardLevel,
      roadConditions,
      visibilityStatus,
      commuteAdvice,
    },
    healthUV: {
      uvRisk,
      burnTimeMinutes,
      airQualityImpact,
      jointSensitivityNotice,
      hydrationAdvice,
    },
    homeGarden: {
      gardenWateringNeeded,
      windowDryingFeasible,
      energyEfficiencyTip: energyTip,
      advice: homeAdvice,
    },
    eventOutdoor: {
      outdoorFeasibility,
      eveningComfort,
      advice: outdoorFeasibility === 'Highly Recommended'
        ? 'Great day for outdoor events, weddings, rooftop dining, or park gatherings!'
        : outdoorFeasibility === 'Feasible with Precautions'
        ? 'Outdoor events are manageable provided shade, hydration, or light outer layers are supplied.'
        : 'Plan indoor backup venues due to rain or extreme thermal conditions.',
    },
  };
}
