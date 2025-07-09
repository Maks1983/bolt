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

  // Generate realistic background based on weather and time
  const backgroundConfig = useMemo(() => {
    if (isDay) {
      switch (weatherState) {
        case 'sunny':
        case 'clear':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Sky gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100" />
                
                {/* Sun with realistic glow */}
                <div className="absolute top-16 right-20">
                  {/* Sun glow effect */}
                  <div className="absolute w-32 h-32 -top-8 -left-8 bg-yellow-200/30 rounded-full blur-xl animate-pulse" />
                  <div className="absolute w-24 h-24 -top-4 -left-4 bg-yellow-300/40 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
                  
                  {/* Sun body */}
                  <div className="relative w-16 h-16 bg-gradient-radial from-yellow-100 via-yellow-300 to-yellow-400 rounded-full shadow-lg">
                    <div className="absolute inset-1 bg-gradient-radial from-yellow-50/80 to-transparent rounded-full" />
                  </div>
                  
                  {/* Subtle sun rays */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '60s' }}>
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-12 bg-gradient-to-t from-transparent via-yellow-200/20 to-transparent"
                        style={{
                          top: '-24px',
                          left: '50%',
                          transformOrigin: '50% 56px',
                          transform: `translateX(-50%) rotate(${i * 30}deg)`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Atmospheric particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                      style={{
                        left: `${15 + i * 12}%`,
                        top: `${25 + (i % 4) * 15}%`,
                        animationDelay: `${i * 1.2}s`,
                        animationDuration: `${6 + i * 0.8}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          };

        case 'partlycloudy':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Sky gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-100" />
                
                {/* Sun partially behind clouds */}
                <div className="absolute top-12 right-16 w-20 h-20">
                  <div className="absolute w-28 h-28 -top-4 -left-4 bg-yellow-200/25 rounded-full blur-xl animate-pulse" />
                  <div className="w-full h-full bg-gradient-radial from-yellow-100 via-yellow-300 to-yellow-400 rounded-full opacity-70" />
                </div>

                {/* Realistic clouds */}
                <div className="absolute inset-0 overflow-hidden">
                  {[
                    { size: 'large', x: 10, y: 15, delay: 0 },
                    { size: 'medium', x: 45, y: 25, delay: 5 },
                    { size: 'large', x: 70, y: 10, delay: 10 },
                    { size: 'small', x: 25, y: 40, delay: 15 }
                  ].map((cloud, i) => (
                    <div
                      key={i}
                      className="absolute animate-drift"
                      style={{
                        left: `${cloud.x}%`,
                        top: `${cloud.y}%`,
                        animationDelay: `${cloud.delay}s`,
                        animationDuration: '120s'
                      }}
                    >
                      <svg 
                        width={cloud.size === 'large' ? 200 : cloud.size === 'medium' ? 150 : 100} 
                        height={cloud.size === 'large' ? 80 : cloud.size === 'medium' ? 60 : 40} 
                        viewBox="0 0 200 80"
                        className="drop-shadow-lg"
                      >
                        <defs>
                          <radialGradient id={`cloudGrad${i}`} cx="50%" cy="30%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                            <stop offset="70%" stopColor="rgba(255,255,255,0.85)" />
                            <stop offset="100%" stopColor="rgba(240,248,255,0.7)" />
                          </radialGradient>
                        </defs>
                        <path
                          d="M40 50 Q20 30 45 25 Q60 15 85 25 Q110 10 140 25 Q170 30 160 50 Q150 65 125 60 Q100 70 75 60 Q50 65 40 50"
                          fill={`url(#cloudGrad${i})`}
                          className="animate-cloud-breathe"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        case 'cloudy':
        case 'overcast':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Overcast sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200" />
                
                {/* Dense cloud layer */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-drift"
                      style={{
                        left: `${-20 + i * 15}%`,
                        top: `${5 + (i % 4) * 15}%`,
                        animationDelay: `${i * 8}s`,
                        animationDuration: '100s'
                      }}
                    >
                      <svg width="250" height="100" viewBox="0 0 250 100" className="drop-shadow-md">
                        <defs>
                          <linearGradient id={`overcastGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                            <stop offset="50%" stopColor="rgba(248,250,252,0.85)" />
                            <stop offset="100%" stopColor="rgba(226,232,240,0.8)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M50 65 Q30 40 55 35 Q75 25 105 35 Q135 20 165 35 Q195 40 185 65 Q175 80 150 75 Q125 85 100 75 Q75 80 50 65"
                          fill={`url(#overcastGrad${i})`}
                          className="animate-cloud-breathe"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        case 'rainy':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Storm sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-600 via-slate-500 to-slate-400" />
                
                {/* Dark storm clouds */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-drift"
                      style={{
                        left: `${-15 + i * 20}%`,
                        top: `${8 + (i % 3) * 20}%`,
                        animationDelay: `${i * 6}s`,
                        animationDuration: '80s'
                      }}
                    >
                      <svg width="220" height="90" viewBox="0 0 220 90" className="drop-shadow-xl">
                        <defs>
                          <linearGradient id={`stormGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(100,116,139,0.9)" />
                            <stop offset="70%" stopColor="rgba(71,85,105,0.85)" />
                            <stop offset="100%" stopColor="rgba(51,65,85,0.8)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M45 60 Q25 35 50 30 Q70 20 100 30 Q130 15 160 30 Q185 35 175 60 Q165 75 140 70 Q115 80 90 70 Q65 75 45 60"
                          fill={`url(#stormGrad${i})`}
                          className="animate-cloud-breathe"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Realistic rain */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(100)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-rain"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.3 + Math.random() * 0.4}s`
                      }}
                    >
                      <div className="w-0.5 h-6 bg-gradient-to-b from-blue-200/80 to-blue-300/60 rounded-full opacity-70" />
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        case 'snowy':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Winter sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100" />
                
                {/* Snow clouds */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-drift"
                      style={{
                        left: `${-10 + i * 25}%`,
                        top: `${10 + (i % 3) * 20}%`,
                        animationDelay: `${i * 10}s`,
                        animationDuration: '120s'
                      }}
                    >
                      <svg width="180" height="80" viewBox="0 0 180 80" className="drop-shadow-sm">
                        <path
                          d="M35 55 Q25 35 40 30 Q55 20 80 30 Q105 20 130 30 Q145 35 135 55 Q125 65 105 60 Q85 65 65 60 Q45 65 35 55"
                          fill="rgba(255,255,255,0.95)"
                          className="animate-cloud-breathe"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Realistic snowflakes */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-white animate-snow opacity-80"
                      style={{
                        left: `${Math.random() * 100}%`,
                        fontSize: `${6 + Math.random() * 6}px`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${4 + Math.random() * 6}s`
                      }}
                    >
                      ❄
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        default:
          return {
            background: (
              <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100" />
            )
          };
      }
    } else {
      // Night time
      switch (weatherState) {
        case 'clear':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Night sky gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-blue-900 to-purple-900" />
                
                {/* Moon with realistic glow */}
                <div className="absolute top-16 right-20">
                  <div className="absolute w-24 h-24 -top-4 -left-4 bg-blue-200/10 rounded-full blur-2xl" />
                  <div className="absolute w-20 h-20 -top-2 -left-2 bg-blue-100/15 rounded-full blur-xl" />
                  <div className="relative w-16 h-16 bg-gradient-radial from-gray-100 via-gray-200 to-gray-300 rounded-full shadow-lg">
                    {/* Moon craters/texture */}
                    <div className="absolute top-2 left-3 w-2 h-2 bg-gray-400/30 rounded-full" />
                    <div className="absolute top-6 right-2 w-1.5 h-1.5 bg-gray-400/20 rounded-full" />
                    <div className="absolute bottom-3 left-2 w-1 h-1 bg-gray-400/25 rounded-full" />
                  </div>
                </div>

                {/* Realistic stars */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-twinkle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 70}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                      }}
                    >
                      <div className="w-1 h-1 bg-white rounded-full shadow-sm" />
                      <div className="absolute inset-0 w-1 h-1 bg-white/50 rounded-full blur-sm animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        case 'partlycloudy':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Night sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600" />
                
                {/* Dim moon behind clouds */}
                <div className="absolute top-12 right-16 w-16 h-16">
                  <div className="absolute w-20 h-20 -top-2 -left-2 bg-blue-100/8 rounded-full blur-xl" />
                  <div className="w-full h-full bg-gradient-radial from-gray-200 to-gray-300 rounded-full opacity-40" />
                </div>

                {/* Night clouds */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-drift"
                      style={{
                        left: `${-5 + i * 30}%`,
                        top: `${15 + (i % 3) * 20}%`,
                        animationDelay: `${i * 15}s`,
                        animationDuration: '150s'
                      }}
                    >
                      <svg width="180" height="70" viewBox="0 0 180 70" className="drop-shadow-md">
                        <defs>
                          <linearGradient id={`nightCloudGrad${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(71,85,105,0.8)" />
                            <stop offset="100%" stopColor="rgba(51,65,85,0.6)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M35 50 Q25 30 40 25 Q55 15 80 25 Q105 15 130 25 Q145 30 135 50 Q125 60 105 55 Q85 60 65 55 Q45 60 35 50"
                          fill={`url(#nightCloudGrad${i})`}
                          className="animate-cloud-breathe"
                        />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Fewer stars due to clouds */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-twinkle opacity-60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 50}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                      }}
                    >
                      <div className="w-0.5 h-0.5 bg-white rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        case 'rainy':
          return {
            background: (
              <div className="absolute inset-0">
                {/* Dark stormy night */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700" />
                
                {/* Night rain */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(80)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute animate-rain"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.4 + Math.random() * 0.3}s`
                      }}
                    >
                      <div className="w-0.5 h-5 bg-gradient-to-b from-slate-300/60 to-slate-400/40 rounded-full opacity-60" />
                    </div>
                  ))}
                </div>
              </div>
            )
          };

        default:
          return {
            background: (
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-blue-900 to-purple-900" />
            )
          };
      }
    }
  }, [weatherState, isDay]);

  return (
    <div className={`fixed inset-0 -z-10 transition-all duration-1000 ${className}`}>
      {backgroundConfig.background}
      
      {/* Content overlay */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
      
      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 1; }
        }
        
        @keyframes drift {
          from { transform: translateX(-50px); }
          to { transform: translateX(calc(100vw + 50px)); }
        }
        
        @keyframes cloud-breathe {
          0%, 100% { transform: scale(1) skewX(0deg); }
          25% { transform: scale(1.02) skewX(0.5deg); }
          50% { transform: scale(0.98) skewX(-0.5deg); }
          75% { transform: scale(1.01) skewX(0.2deg); }
        }
        
        @keyframes rain {
          from { transform: translateY(-100vh) translateX(0px); }
          to { transform: translateY(100vh) translateX(-20px); }
        }
        
        @keyframes snow {
          from { transform: translateY(-100vh) rotate(0deg); }
          to { transform: translateY(100vh) rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-drift {
          animation: drift linear infinite;
        }
        
        .animate-cloud-breathe {
          animation: cloud-breathe 12s ease-in-out infinite;
        }
        
        .animate-rain {
          animation: rain linear infinite;
        }
        
        .animate-snow {
          animation: snow linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default WeatherBackground;