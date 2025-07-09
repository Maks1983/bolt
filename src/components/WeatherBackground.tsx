import React, { useMemo } from 'react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';

interface WeatherBackgroundProps {
  className?: string;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ className = '' }) => {
  // Get weather and sun data from Home Assistant
  const weatherEntity = useRealtimeDevice('weather.forecast_home');
  const sunEntity = useRealtimeDevice('sun.sun');

  // Debug logging
  console.log('🌤️ Weather entity:', weatherEntity);
  console.log('☀️ Sun entity:', sunEntity);

  // Determine current conditions
  const weatherCondition = weatherEntity?.state || 'cloudy';
  const isDaytime = sunEntity?.state === 'above_horizon';

  console.log('🌤️ Current weather condition:', weatherCondition, 'Is daytime:', isDaytime);

  // Generate background styles based on weather and time
  const backgroundConfig = useMemo(() => {
    // Weather-specific overlays and effects
    switch (weatherCondition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return {
          gradient: isDaytime 
            ? 'from-amber-400 via-yellow-300 to-orange-300'
            : 'from-indigo-900 via-purple-800 to-slate-900',
          particles: isDaytime ? 'sun-rays' : 'stars'
        };
      
      case 'cloudy':
        return {
          gradient: isDaytime 
            ? 'from-slate-400 via-gray-400 to-slate-500'
            : 'from-slate-700 via-gray-800 to-slate-600',
          particles: 'clouds'
        };
      
      case 'partlycloudy':
      case 'partly-cloudy':
      case 'partly_cloudy':
        return {
          gradient: isDaytime 
            ? 'from-blue-400 via-sky-300 to-blue-300'
            : 'from-slate-600 via-blue-700 to-slate-500',
          particles: 'partly-cloudy'
        };
      
      case 'overcast':
        return {
          gradient: isDaytime 
            ? 'from-gray-500 via-slate-400 to-gray-600'
            : 'from-slate-800 via-gray-800 to-slate-700',
          particles: 'overcast'
        };
      
      case 'rainy':
      case 'rain':
      case 'pouring':
      case 'drizzle':
      case 'showers':
        return {
          gradient: isDaytime 
            ? 'from-slate-500 via-gray-600 to-blue-700'
            : 'from-slate-800 via-gray-800 to-slate-700',
          particles: 'rain'
        };
      
      case 'snowy':
      case 'snow':
      case 'sleet':
      case 'hail':
        return {
          gradient: isDaytime 
            ? 'from-slate-300 via-blue-200 to-gray-100'
            : 'from-slate-700 via-slate-600 to-slate-500',
          particles: 'snow'
        };
      
      case 'windy':
      case 'breezy':
        return {
          gradient: isDaytime 
            ? 'from-teal-400 via-cyan-300 to-blue-400'
            : 'from-slate-600 via-gray-600 to-slate-500',
          particles: 'wind'
        };
      
      case 'fog':
      case 'foggy':
      case 'mist':
      case 'hazy':
        return {
          gradient: isDaytime 
            ? 'from-gray-300 via-slate-200 to-gray-400'
            : 'from-slate-600 via-gray-600 to-slate-500',
          particles: 'fog'
        };
      
      case 'thunderstorm':
      case 'lightning':
      case 'storm':
        return {
          gradient: isDaytime 
            ? 'from-slate-600 via-gray-700 to-slate-800'
            : 'from-slate-800 via-gray-900 to-black',
          particles: 'lightning'
        };
      
      default:
        return {
          gradient: isDaytime 
            ? 'from-blue-400 via-blue-300 to-blue-200'
            : 'from-slate-800 via-slate-700 to-slate-600',
          particles: isDaytime ? 'default-day' : 'default-night'
        };
    }
  }, [weatherCondition, isDaytime]);

  // Animated particles component
  const AnimatedParticles: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
      case 'sun-rays':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 bg-yellow-300/40 animate-pulse"
                style={{
                  height: '80px',
                  top: '20%',
                  right: `${20 + i * 8}%`,
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: 'bottom center',
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        );
      
      case 'stars':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 60 + 10}%`,
                  left: `${Math.random() * 90 + 5}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'clouds':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/40 rounded-full animate-float"
                style={{
                  width: `${60 + i * 20}px`,
                  height: `${30 + i * 10}px`,
                  top: `${15 + i * 12}%`,
                  left: `${10 + i * 20}%`,
                  animationDelay: `${i * 1}s`,
                  animationDuration: `${8 + i * 2}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'rain':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-blue-300/60 animate-rain"
                style={{
                  height: `${10 + Math.random() * 20}px`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'snow':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full animate-snow"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'partly-cloudy':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Sun rays for partly cloudy */}
            {isDaytime && [...Array(4)].map((_, i) => (
              <div
                key={`sun-${i}`}
                className="absolute w-0.5 bg-yellow-300/50 animate-pulse"
                style={{
                  height: '60px',
                  top: '15%',
                  right: `${25 + i * 10}%`,
                  transform: `rotate(${i * 30}deg)`,
                  transformOrigin: 'bottom center',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '4s'
                }}
              />
            ))}
            {/* Some clouds */}
            {[...Array(2)].map((_, i) => (
              <div
                key={`cloud-${i}`}
                className="absolute bg-white/40 rounded-full animate-float"
                style={{
                  width: `${60 + i * 15}px`,
                  height: `${30 + i * 8}px`,
                  top: `${25 + i * 20}%`,
                  left: `${20 + i * 40}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${6 + i * 2}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'lightning':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Lightning flashes */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-yellow-200/80 animate-pulse"
                style={{
                  width: '2px',
                  height: `${40 + Math.random() * 30}px`,
                  top: `${10 + Math.random() * 30}%`,
                  left: `${20 + i * 30}%`,
                  transform: `rotate(${-10 + Math.random() * 20}deg)`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: '0.2s'
                }}
              />
            ))}
            {/* Dark storm clouds */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`storm-cloud-${i}`}
                className="absolute bg-slate-700/50 rounded-full animate-float"
                style={{
                  width: `${80 + i * 25}px`,
                  height: `${40 + i * 12}px`,
                  top: `${15 + i * 12}%`,
                  left: `${5 + i * 25}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${6 + i}s`
                }}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Base gradient background - CRITICAL: This must be visible */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${backgroundConfig.gradient} transition-all duration-1000 ease-in-out`}
        style={{ zIndex: 1 }}
      />
      
      {/* Weather-specific overlay effects */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Animated particles */}
        <AnimatedParticles type={backgroundConfig.particles} />
        
        {/* Sun/Moon */}
        {isDaytime ? (
          <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-300/40 rounded-full animate-pulse" />
        ) : (
          <div className="absolute top-6 right-12 w-12 h-12 bg-slate-200/60 rounded-full" />
        )}
      </div>
      
      {/* Debug indicator - Remove this after testing */}
      <div className="absolute top-2 left-2 text-xs text-white/80 bg-black/30 px-2 py-1 rounded z-50">
        {weatherCondition} | {isDaytime ? 'Day' : 'Night'}
      </div>
    </div>
  );
};

export default WeatherBackground;