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
  const weatherCondition = weatherEntity?.state || weatherEntity?.condition || 'sunny';
  const isDaytime = sunEntity?.state === 'above_horizon';

  console.log('🌤️ Current weather condition:', weatherCondition, 'Is daytime:', isDaytime);

  // Generate background styles based on weather and time
  const backgroundStyles = useMemo(() => {
    const baseClasses = 'absolute inset-0 transition-all duration-1000 ease-in-out';
    
    // Time-based base colors
    const timeColors = isDaytime 
      ? 'from-blue-400 via-blue-300 to-blue-200' 
      : 'from-slate-900 via-slate-800 to-slate-700';

    // Weather-specific overlays and effects
    switch (weatherCondition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return {
          background: isDaytime 
            ? `${baseClasses} bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-300`
            : `${baseClasses} bg-gradient-to-br from-indigo-900 via-purple-800 to-slate-900`,
          overlay: isDaytime ? 'sunny-day' : 'clear-night',
          particles: isDaytime ? 'sun-rays' : 'stars'
        };
      
      case 'cloudy':
      case 'partlycloudy':
      case 'partly-cloudy':
        return {
          background: isDaytime 
            ? `${baseClasses} bg-gradient-to-br from-gray-400 via-blue-300 to-slate-400`
            : `${baseClasses} bg-gradient-to-br from-slate-700 via-gray-700 to-slate-600`,
          overlay: 'cloudy',
          particles: 'clouds'
        };
      
      case 'rainy':
      case 'rain':
      case 'pouring':
        return {
          background: isDaytime 
            ? `${baseClasses} bg-gradient-to-br from-slate-500 via-gray-600 to-blue-700`
            : `${baseClasses} bg-gradient-to-br from-slate-800 via-gray-800 to-slate-700`,
          overlay: 'rainy',
          particles: 'rain'
        };
      
      case 'snowy':
      case 'snow':
        return {
          background: isDaytime 
            ? `${baseClasses} bg-gradient-to-br from-slate-300 via-blue-200 to-gray-100`
            : `${baseClasses} bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500`,
          overlay: 'snowy',
          particles: 'snow'
        };
      
      case 'windy':
        return {
          background: isDaytime 
            ? `${baseClasses} bg-gradient-to-br from-teal-400 via-cyan-300 to-blue-400`
            : `${baseClasses} bg-gradient-to-br from-slate-600 via-gray-600 to-slate-500`,
          overlay: 'windy',
          particles: 'wind'
        };
      
      default:
        return {
          background: isDaytime 
            ? `${baseClasses} bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200`
            : `${baseClasses} bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600`,
          overlay: 'default',
          particles: isDaytime ? 'default-day' : 'default-night'
        };
    }
  }, [weatherCondition, isDaytime]);

  // Animated particles component
  const AnimatedParticles: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
      case 'sun-rays':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 bg-yellow-300/30 animate-pulse"
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
          <div className="absolute inset-0 overflow-hidden">
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
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/20 rounded-full animate-float"
                style={{
                  width: `${80 + i * 20}px`,
                  height: `${40 + i * 10}px`,
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 30}%`,
                  animationDelay: `${i * 1}s`,
                  animationDuration: `${8 + i * 2}s`
                }}
              />
            ))}
          </div>
        );
      
      case 'rain':
        return (
          <div className="absolute inset-0 overflow-hidden">
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
          <div className="absolute inset-0 overflow-hidden">
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
      
      case 'wind':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-0.5 bg-cyan-300/40 animate-wind"
                style={{
                  width: `${30 + Math.random() * 40}px`,
                  top: `${20 + i * 10}%`,
                  left: '-50px',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
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
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div className={backgroundStyles.background} />
      
      {/* Weather-specific overlay effects */}
      <div className="absolute inset-0">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        {/* Animated particles */}
        <AnimatedParticles type={backgroundStyles.particles} />
        
        {/* Additional weather effects */}
        {weatherCondition.toLowerCase().includes('rain') && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/10" />
        )}
        
        {weatherCondition.toLowerCase() === 'sunny' && isDaytime && (
          <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-300/30 rounded-full animate-pulse" />
        )}
        
        {weatherCondition.toLowerCase() === 'sunny' && isDaytime && (
          <div className="absolute top-6 right-10 w-12 h-12 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        )}
        
        {!isDaytime && (
          <div className="absolute top-6 right-12 w-12 h-12 bg-slate-200/40 rounded-full" />
        )}
      </div>
      
      {/* Content overlay to ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  );
};

export default WeatherBackground;