import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useRealtimeDevice } from '../hooks/useDeviceUpdates';

interface WeatherBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ className = '', children }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    animationId: number | null;
    particles: THREE.Points[];
    clouds: THREE.Mesh[];
    sun: THREE.Mesh | null;
    moon: THREE.Mesh | null;
    stars: THREE.Points | null;
  } | null>(null);

  // Get weather and sun data from Home Assistant
  const weatherEntity = useRealtimeDevice('weather.forecast_home');
  const sunEntity = useRealtimeDevice('sun.sun');

  // Fallback values for demo/development
  const weatherState = weatherEntity?.state || 'sunny';
  const sunState = sunEntity?.state || 'above_horizon';
  const isDay = sunState === 'above_horizon';

  console.log('🌤️ Realistic Weather Background:', { weatherState, sunState, isDay });

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    mount.appendChild(renderer.domElement);

    camera.position.set(0, 0, 5);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      animationId: null,
      particles: [],
      clouds: [],
      sun: null,
      moon: null,
      stars: null
    };

    // Handle window resize
    const handleResize = () => {
      if (!sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        mount.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  // Create realistic sky gradient
  const createSkyGradient = (isDay: boolean, weather: string) => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Remove existing sky
    const existingSky = scene.getObjectByName('sky');
    if (existingSky) scene.remove(existingSky);

    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    let skyColors: THREE.Color[];

    if (isDay) {
      switch (weather) {
        case 'sunny':
        case 'clear':
          skyColors = [
            new THREE.Color(0x87CEEB), // Sky blue top
            new THREE.Color(0xB0E0E6), // Powder blue middle
            new THREE.Color(0xF0F8FF)  // Alice blue bottom
          ];
          break;
        case 'partlycloudy':
          skyColors = [
            new THREE.Color(0x6495ED), // Cornflower blue
            new THREE.Color(0x87CEFA), // Light sky blue
            new THREE.Color(0xE6F3FF)  // Very light blue
          ];
          break;
        case 'cloudy':
        case 'overcast':
          skyColors = [
            new THREE.Color(0x708090), // Slate gray
            new THREE.Color(0x9CA0A5), // Light gray
            new THREE.Color(0xD3D3D3)  // Light gray
          ];
          break;
        case 'rainy':
          skyColors = [
            new THREE.Color(0x2F4F4F), // Dark slate gray
            new THREE.Color(0x696969), // Dim gray
            new THREE.Color(0x808080)  // Gray
          ];
          break;
        case 'snowy':
          skyColors = [
            new THREE.Color(0xC0C0C0), // Silver
            new THREE.Color(0xD3D3D3), // Light gray
            new THREE.Color(0xF5F5F5)  // White smoke
          ];
          break;
        default:
          skyColors = [
            new THREE.Color(0x87CEEB),
            new THREE.Color(0xB0E0E6),
            new THREE.Color(0xF0F8FF)
          ];
      }
    } else {
      // Night colors
      switch (weather) {
        case 'clear':
          skyColors = [
            new THREE.Color(0x000428), // Very dark blue
            new THREE.Color(0x004e92), // Dark blue
            new THREE.Color(0x191970)  // Midnight blue
          ];
          break;
        case 'partlycloudy':
        case 'cloudy':
          skyColors = [
            new THREE.Color(0x1a1a2e), // Very dark blue-gray
            new THREE.Color(0x16213e), // Dark blue-gray
            new THREE.Color(0x2c3e50)  // Dark gray-blue
          ];
          break;
        case 'rainy':
          skyColors = [
            new THREE.Color(0x0f0f23), // Almost black
            new THREE.Color(0x1a1a2e), // Very dark
            new THREE.Color(0x2c2c54)  // Dark purple-gray
          ];
          break;
        default:
          skyColors = [
            new THREE.Color(0x000428),
            new THREE.Color(0x004e92),
            new THREE.Color(0x191970)
          ];
      }
    }

    // Create gradient material
    const vertexShader = `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 topColor;
      uniform vec3 middleColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        float mixFactor = pow(max(h, 0.0), exponent);
        vec3 color;
        
        if (h > 0.5) {
          color = mix(middleColor, topColor, (h - 0.5) * 2.0);
        } else {
          color = mix(bottomColor, middleColor, h * 2.0);
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: skyColors[0] },
        middleColor: { value: skyColors[1] },
        bottomColor: { value: skyColors[2] },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide
    });

    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.name = 'sky';
    scene.add(sky);
  };

  // Create realistic volumetric clouds
  const createVolumetricClouds = (weather: string, isDay: boolean) => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Remove existing clouds
    sceneRef.current.clouds.forEach(cloud => scene.remove(cloud));
    sceneRef.current.clouds = [];

    if (weather === 'sunny' || weather === 'clear') return;

    const cloudCount = weather === 'cloudy' || weather === 'overcast' ? 12 : 6;
    const cloudOpacity = isDay ? 0.8 : 0.6;
    const cloudColor = isDay ? 
      (weather === 'rainy' ? 0x404040 : 0xffffff) : 
      0x2a2a2a;

    for (let i = 0; i < cloudCount; i++) {
      // Create cloud geometry using multiple spheres for realistic shape
      const cloudGroup = new THREE.Group();
      const sphereCount = 8 + Math.random() * 6;
      
      for (let j = 0; j < sphereCount; j++) {
        const sphereGeometry = new THREE.SphereGeometry(
          0.5 + Math.random() * 1.5, // Random size
          16, 16
        );
        
        const cloudMaterial = new THREE.MeshLambertMaterial({
          color: cloudColor,
          transparent: true,
          opacity: cloudOpacity * (0.6 + Math.random() * 0.4),
          fog: true
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
        sphere.position.set(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 3
        );
        
        cloudGroup.add(sphere);
      }
      
      // Position cloud in sky
      cloudGroup.position.set(
        (Math.random() - 0.5) * 100,
        10 + Math.random() * 20,
        -20 - Math.random() * 30
      );
      
      cloudGroup.rotation.y = Math.random() * Math.PI * 2;
      cloudGroup.scale.setScalar(2 + Math.random() * 3);
      
      scene.add(cloudGroup);
      sceneRef.current.clouds.push(cloudGroup);
    }
  };

  // Create realistic sun with volumetric lighting
  const createSun = () => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Remove existing sun
    if (sceneRef.current.sun) {
      scene.remove(sceneRef.current.sun);
    }

    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(30, 25, -40);

    // Add sun glow effect
    const glowGeometry = new THREE.SphereGeometry(4, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.8 },
        p: { value: 2.0 },
        glowColor: { value: new THREE.Color(0xffaa00) },
        viewVector: { value: new THREE.Vector3() }
      },
      vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(c - dot(vNormal, vNormel), p);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4(glow, 1.0);
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGlow.position.copy(sun.position);
    
    const sunGroup = new THREE.Group();
    sunGroup.add(sun);
    sunGroup.add(sunGlow);
    
    scene.add(sunGroup);
    sceneRef.current.sun = sunGroup;

    // Add directional light for sun
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.copy(sun.position);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
  };

  // Create realistic moon with surface details
  const createMoon = () => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Remove existing moon
    if (sceneRef.current.moon) {
      scene.remove(sceneRef.current.moon);
    }

    const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    
    // Create moon texture using noise
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Base moon color
    ctx.fillStyle = '#e6e6e6';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add craters and surface details
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 20 + 5;
      
      ctx.fillStyle = `rgba(180, 180, 180, ${0.3 + Math.random() * 0.4})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const moonTexture = new THREE.CanvasTexture(canvas);
    
    const moonMaterial = new THREE.MeshLambertMaterial({
      map: moonTexture,
      emissive: 0x222222,
      emissiveIntensity: 0.1
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(25, 20, -35);
    
    scene.add(moon);
    sceneRef.current.moon = moon;

    // Add moonlight
    const moonLight = new THREE.DirectionalLight(0x9999ff, 0.3);
    moonLight.position.copy(moon.position);
    scene.add(moonLight);
  };

  // Create realistic stars
  const createStars = () => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Remove existing stars
    if (sceneRef.current.stars) {
      scene.remove(sceneRef.current.stars);
    }

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Position stars in a sphere around the scene
      const radius = 200 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Star colors (white to slightly blue/yellow)
      const colorVariation = 0.8 + Math.random() * 0.2;
      colors[i3] = colorVariation;
      colors[i3 + 1] = colorVariation;
      colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      
      // Star sizes
      sizes[i] = Math.random() * 2 + 1;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float twinkle = sin(time * 2.0 + position.x * 0.01) * 0.5 + 0.5;
          gl_PointSize = size * (300.0 / -mvPosition.z) * (0.5 + twinkle * 0.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, r);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    sceneRef.current.stars = stars;
  };

  // Create realistic precipitation
  const createPrecipitation = (weather: string) => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Remove existing precipitation
    sceneRef.current.particles.forEach(particle => scene.remove(particle));
    sceneRef.current.particles = [];

    if (weather === 'rainy') {
      // Create rain
      const rainGeometry = new THREE.BufferGeometry();
      const rainCount = 2000;
      const positions = new Float32Array(rainCount * 3);
      const velocities = new Float32Array(rainCount * 3);

      for (let i = 0; i < rainCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = Math.random() * 100 + 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
        
        velocities[i3] = (Math.random() - 0.5) * 2;
        velocities[i3 + 1] = -10 - Math.random() * 10;
        velocities[i3 + 2] = (Math.random() - 0.5) * 2;
      }

      rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      rainGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

      const rainMaterial = new THREE.PointsMaterial({
        color: 0x87ceeb,
        size: 0.5,
        transparent: true,
        opacity: 0.7
      });

      const rain = new THREE.Points(rainGeometry, rainMaterial);
      scene.add(rain);
      sceneRef.current.particles.push(rain);
      
    } else if (weather === 'snowy') {
      // Create snow
      const snowGeometry = new THREE.BufferGeometry();
      const snowCount = 1000;
      const positions = new Float32Array(snowCount * 3);
      const velocities = new Float32Array(snowCount * 3);

      for (let i = 0; i < snowCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = Math.random() * 100 + 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;
        
        velocities[i3] = (Math.random() - 0.5) * 1;
        velocities[i3 + 1] = -2 - Math.random() * 3;
        velocities[i3 + 2] = (Math.random() - 0.5) * 1;
      }

      snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      snowGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

      const snowMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8
      });

      const snow = new THREE.Points(snowGeometry, snowMaterial);
      scene.add(snow);
      sceneRef.current.particles.push(snow);
    }
  };

  // Update scene based on weather and time
  useEffect(() => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;
    
    // Clear scene
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(
      isDay ? 0x404040 : 0x202040, 
      isDay ? 0.4 : 0.1
    );
    scene.add(ambientLight);

    // Create scene elements
    createSkyGradient(isDay, weatherState);
    createVolumetricClouds(weatherState, isDay);
    
    if (isDay) {
      createSun();
    } else {
      createMoon();
      createStars();
    }
    
    createPrecipitation(weatherState);

  }, [weatherState, isDay]);

  // Animation loop
  useEffect(() => {
    if (!sceneRef.current) return;

    const animate = () => {
      if (!sceneRef.current) return;

      const { scene, camera, renderer, particles, clouds, stars } = sceneRef.current;

      // Animate clouds
      clouds.forEach((cloud, index) => {
        cloud.rotation.y += 0.001 * (index % 2 === 0 ? 1 : -1);
        cloud.position.x += 0.01 * (index % 2 === 0 ? 1 : -1);
        
        // Reset cloud position when it goes off screen
        if (Math.abs(cloud.position.x) > 60) {
          cloud.position.x = -60 * Math.sign(cloud.position.x);
        }
      });

      // Animate precipitation
      particles.forEach(particle => {
        const positions = particle.geometry.attributes.position.array as Float32Array;
        const velocities = particle.geometry.attributes.velocity.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * 0.1;
          positions[i + 1] += velocities[i + 1] * 0.1;
          positions[i + 2] += velocities[i + 2] * 0.1;

          // Reset particle when it falls below ground
          if (positions[i + 1] < -10) {
            positions[i + 1] = 60;
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;
          }
        }

        particle.geometry.attributes.position.needsUpdate = true;
      });

      // Animate stars twinkling
      if (stars && stars.material instanceof THREE.ShaderMaterial) {
        stars.material.uniforms.time.value += 0.01;
      }

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Content overlay */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default WeatherBackground;