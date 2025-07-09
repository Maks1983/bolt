import React, { useMemo } from 'react';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';

interface WeatherBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ className = '', children }) => {
  // Get weather and sun data from Home Assistant
  const weatherEntity = useRealtimeDevice('weather.forecast_home');
  const sunEntity = useRealtimeDevice('sun.sun');

  // Fallback values for demo/development
  const weatherState = weatherEntity?.state || 'sunny';
  const sunState = sunEntity?.state || 'above_horizon';
  const isDay = sunState === 'above_horizon';

  console.log('🌤️ Weather Background:', { weatherState, sunState, isDay });

  // Generate background based on weather and time
  const backgroundConfig = useMemo(() => {
    const baseConfig = {
      containerClass: '',
      gradientClass: '',
      animationElements: [] as React.ReactNode[]
    };

    if (isDay) {
      switch (weatherState) {
        case 'sunny':
        case 'clear':
          return {
            containerClass: 'bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100',
            gradientClass: 'sunny-day',
            animationElements: [
              // Sun with rays
              <div key="sun" className="absolute top-8 right-8 w-20 h-20">
                <div className="relative w-full h-full">
                  {/* Sun rays */}
                  <div className="absolute inset-0 animate-spin-slow">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-8 bg-yellow-300/60 rounded-full"
                        style={{
                          top: '-16px',
                          left: '50%',
                          transformOrigin: '50% 56px',
                          transform: `translateX(-50%) rotate(${i * 45}deg)`
                        }}
                      />
                    ))}
                  </div>
                  {/* Sun body */}
                  <div className="absolute inset-2 bg-gradient-radial from-yellow-200 to-yellow-400 rounded-full shadow-lg animate-pulse-gentle" />
                </div>
              </div>,
              // Floating particles for atmosphere
              <div key="particles" className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.8}s`,
                      animationDuration: `${4 + i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            ]
          };

        case 'partlycloudy':
          return {
            containerClass: 'bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200',
            gradientClass: 'partly-cloudy-day',
            animationElements: [
              // Sun (partially visible)
              <div key="sun" className="absolute top-6 right-12 w-16 h-16 bg-gradient-radial from-yellow-200 to-yellow-400 rounded-full opacity-80 animate-pulse-gentle" />,
              // Animated clouds
              <div key="clouds" className="absolute inset-0 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-drift-slow"
                    style={{
                      left: `${-10 + i * 25}%`,
                      top: `${15 + (i % 2) * 25}%`,
                      animationDelay: `${i * 2}s`,
                      animationDuration: `${20 + i * 5}s`
                    }}
                  >
                    <svg width="120" height="60" viewBox="0 0 120 60" className="drop-shadow-sm">
                      <path
                        d="M20 40 Q10 30 20 20 Q30 10 50 20 Q70 10 90 20 Q110 30 100 40 Q90 50 70 45 Q50 50 30 45 Q10 50 20 40"
                        fill="rgba(255, 255, 255, 0.8)"
                        className="animate-cloud-morph"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ]
          };

        case 'cloudy':
        case 'overcast':
          return {
            containerClass: 'bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200',
            gradientClass: 'cloudy-day',
            animationElements: [
              // Dense cloud layer
              <div key="clouds" className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-drift-slow"
                    style={{
                      left: `${-15 + i * 20}%`,
                      top: `${5 + (i % 3) * 20}%`,
                      animationDelay: `${i * 1.5}s`,
                      animationDuration: `${25 + i * 3}s`
                    }}
                  >
                    <svg width="150" height="80" viewBox="0 0 150 80" className="drop-shadow-md">
                      <path
                        d="M25 50 Q15 35 30 25 Q45 15 70 25 Q95 15 120 25 Q135 35 125 50 Q115 65 95 60 Q75 65 55 60 Q35 65 25 50"
                        fill="rgba(255, 255, 255, 0.9)"
                        className="animate-cloud-morph"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ]
          };

        case 'rainy':
          return {
            containerClass: 'bg-gradient-to-b from-gray-600 via-gray-500 to-gray-400',
            gradientClass: 'rainy-day',
            animationElements: [
              // Rain drops
              <div key="rain" className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-4 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full animate-rain-fall opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>,
              // Dark clouds
              <div key="clouds" className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-drift-slow"
                    style={{
                      left: `${-10 + i * 30}%`,
                      top: `${10 + i * 15}%`,
                      animationDelay: `${i * 3}s`,
                      animationDuration: `${30 + i * 5}s`
                    }}
                  >
                    <svg width="180" height="90" viewBox="0 0 180 90" className="drop-shadow-lg">
                      <path
                        d="M30 60 Q20 40 35 30 Q50 20 80 30 Q110 20 140 30 Q155 40 145 60 Q135 75 115 70 Q95 75 75 70 Q55 75 30 60"
                        fill="rgba(100, 116, 139, 0.8)"
                        className="animate-cloud-morph"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ]
          };

        case 'snowy':
          return {
            containerClass: 'bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100',
            gradientClass: 'snowy-day',
            animationElements: [
              // Snowflakes
              <div key="snow" className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-white animate-snow-fall opacity-80"
                    style={{
                      left: `${Math.random() * 100}%`,
                      fontSize: `${8 + Math.random() * 8}px`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${3 + Math.random() * 4}s`
                    }}
                  >
                    ❄
                  </div>
                ))}
              </div>
            ]
          };

        default:
          return {
            containerClass: 'bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100',
            gradientClass: 'default-day',
            animationElements: []
          };
      }
    } else {
      // Night time
      switch (weatherState) {
        case 'clear':
          return {
            containerClass: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900',
            gradientClass: 'clear-night',
            animationElements: [
              // Moon
              <div key="moon" className="absolute top-8 right-8 w-16 h-16 bg-gradient-radial from-yellow-100 to-yellow-200 rounded-full opacity-90 shadow-lg animate-pulse-gentle" />,
              // Stars
              <div key="stars" className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-yellow-100 animate-twinkle opacity-80"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 60}%`,
                      fontSize: `${6 + Math.random() * 4}px`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  >
                    ✦
                  </div>
                ))}
              </div>
            ]
          };

        case 'partlycloudy':
          return {
            containerClass: 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600',
            gradientClass: 'partly-cloudy-night',
            animationElements: [
              // Dim moon behind clouds
              <div key="moon" className="absolute top-10 right-10 w-14 h-14 bg-gradient-radial from-yellow-100 to-yellow-200 rounded-full opacity-50 animate-pulse-gentle" />,
              // Night clouds
              <div key="clouds" className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-drift-slow"
                    style={{
                      left: `${-10 + i * 35}%`,
                      top: `${20 + i * 20}%`,
                      animationDelay: `${i * 2}s`,
                      animationDuration: `${25 + i * 5}s`
                    }}
                  >
                    <svg width="140" height="70" viewBox="0 0 140 70" className="drop-shadow-md">
                      <path
                        d="M25 45 Q15 30 30 25 Q45 15 70 25 Q95 15 115 25 Q130 30 120 45 Q110 55 90 50 Q70 55 50 50 Q30 55 25 45"
                        fill="rgba(71, 85, 105, 0.7)"
                        className="animate-cloud-morph"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ]
          };

        case 'cloudy':
        case 'overcast':
          return {
            containerClass: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700',
            gradientClass: 'cloudy-night',
            animationElements: [
              // Dense night clouds
              <div key="clouds" className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-drift-slow"
                    style={{
                      left: `${-15 + i * 25}%`,
                      top: `${10 + (i % 3) * 25}%`,
                      animationDelay: `${i * 2}s`,
                      animationDuration: `${30 + i * 3}s`
                    }}
                  >
                    <svg width="160" height="80" viewBox="0 0 160 80" className="drop-shadow-lg">
                      <path
                        d="M30 55 Q20 35 35 30 Q50 20 80 30 Q110 20 130 30 Q145 35 135 55 Q125 65 105 60 Q85 65 65 60 Q45 65 30 55"
                        fill="rgba(51, 65, 85, 0.8)"
                        className="animate-cloud-morph"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ]
          };

        case 'rainy':
          return {
            containerClass: 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700',
            gradientClass: 'rainy-night',
            animationElements: [
              // Night rain
              <div key="rain" className="absolute inset-0 overflow-hidden">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-4 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full animate-rain-fall opacity-50"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            ]
          };

        default:
          return {
            containerClass: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900',
            gradientClass: 'default-night',
            animationElements: []
          };
      }
    }
  }, [weatherState, isDay]);

  return (
    <div className={`fixed inset-0 -z-10 transition-all duration-1000 ${backgroundConfig.containerClass} ${className}`}>
      {/* Animated elements */}
      {backgroundConfig.animationElements}
      
      {/* Content overlay */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes drift-slow {
          from { transform: translateX(-20px); }
          to { transform: translateX(calc(100vw + 20px)); }
        }
        
        @keyframes cloud-morph {
          0%, 100% { transform: scale(1) skewX(0deg); }
          25% { transform: scale(1.02) skewX(1deg); }
          50% { transform: scale(0.98) skewX(-1deg); }
          75% { transform: scale(1.01) skewX(0.5deg); }
        }
        
        @keyframes rain-fall {
          from { transform: translateY(-100vh); }
          to { transform: translateY(100vh); }
        }
        
        @keyframes snow-fall {
          from { transform: translateY(-100vh) rotate(0deg); }
          to { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-drift-slow {
          animation: drift-slow linear infinite;
        }
        
        .animate-cloud-morph {
          animation: cloud-morph 8s ease-in-out infinite;
        }
        
        .animate-rain-fall {
          animation: rain-fall linear infinite;
        }
        
        .animate-snow-fall {
          animation: snow-fall linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default WeatherBackground;