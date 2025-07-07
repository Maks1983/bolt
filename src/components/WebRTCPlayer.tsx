import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader, Wifi, WifiOff } from 'lucide-react';
import Peer from 'simple-peer';

interface WebRTCPlayerProps {
  streamUrl: string;
  cameraId: string;
  className?: string;
  onError?: (error: string) => void;
  onConnected?: () => void;
}

const WebRTCPlayer: React.FC<WebRTCPlayerProps> = ({
  streamUrl,
  cameraId,
  className = '',
  onError,
  onConnected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'failed' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initWebRTC = async () => {
      if (!mounted) return;

      try {
        setConnectionState('connecting');
        setError(null);

        console.log('🔄 Initializing WebRTC with simple-peer...');

        // Create peer connection using simple-peer
        const peer = new Peer({
          initiator: true,
          trickle: false,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' }
            ]
          }
        });

        peerRef.current = peer;

        // Handle peer events
        peer.on('signal', async (data) => {
          console.log('📡 Peer signal generated:', data.type);
          
          try {
            // Send offer to Go2RTC
            const response = await fetch(`${streamUrl}/api/webrtc`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: data.type,
                sdp: data.sdp
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const answer = await response.json();
            console.log('📥 Received answer from Go2RTC:', answer.type);
            
            if (answer.type === 'answer') {
              peer.signal(answer);
            }
          } catch (err) {
            console.error('❌ Failed to exchange signals:', err);
            if (mounted) {
              const errorMessage = err instanceof Error ? err.message : 'Signal exchange failed';
              setError(errorMessage);
              setConnectionState('failed');
              onError?.(errorMessage);
            }
          }
        });

        peer.on('stream', (stream) => {
          console.log('📺 Received stream from peer');
          if (videoRef.current && mounted) {
            videoRef.current.srcObject = stream;
            setConnectionState('connected');
            onConnected?.();
          }
        });

        peer.on('connect', () => {
          console.log('✅ Peer connected');
          if (mounted) {
            setConnectionState('connected');
            onConnected?.();
          }
        });

        peer.on('error', (err) => {
          console.error('❌ Peer error:', err);
          if (mounted) {
            const errorMessage = err.message || 'Peer connection failed';
            setError(errorMessage);
            setConnectionState('failed');
            onError?.(errorMessage);
          }
        });

        peer.on('close', () => {
          console.log('🔌 Peer connection closed');
          if (mounted) {
            setConnectionState('disconnected');
          }
        });

      } catch (err) {
        console.error('❌ WebRTC initialization failed:', err);
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'WebRTC initialization failed';
          setError(errorMessage);
          setConnectionState('failed');
          onError?.(errorMessage);
        }
      }
    };

    initWebRTC();

    return () => {
      mounted = false;
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [streamUrl, cameraId, onError, onConnected]);

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'connecting':
        return <Loader className="w-4 h-4 animate-spin text-blue-500" />;
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connecting':
        return 'Connecting to WebRTC stream...';
      case 'connected':
        return 'Connected';
      case 'failed':
        return error || 'Connection failed';
      default:
        return 'Disconnected';
    }
  };

  const handleRetry = () => {
    setConnectionState('disconnected');
    setError(null);
    // Trigger re-initialization by updating a dependency
    window.location.reload();
  };

  return (
    <div className={`relative w-full h-full bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={false}
        controls
        className="w-full h-full object-cover"
        style={{ backgroundColor: '#000' }}
      />

      {/* Connection Status Overlay */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 bg-black/70 rounded-full px-3 py-2 backdrop-blur-sm">
        {getStatusIcon()}
        <span className="text-white text-sm font-medium">{getStatusText()}</span>
      </div>

      {/* Error State */}
      {connectionState === 'failed' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
            <p className="text-sm text-gray-300 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry Connection
              </button>
              <div className="text-xs text-gray-400">
                Using simple-peer WebRTC library
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {connectionState === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-6">
            <Loader className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Connecting to Stream</h3>
            <p className="text-sm text-gray-300">Establishing WebRTC connection with simple-peer...</p>
          </div>
        </div>
      )}

      {/* Camera Info Badge */}
      <div className="absolute top-3 right-3 bg-indigo-500/90 rounded-full px-3 py-1 backdrop-blur-sm">
        <span className="text-white text-xs font-medium">{cameraId}</span>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-3 left-3 bg-black/70 rounded px-2 py-1 text-xs text-white">
          simple-peer v{require('simple-peer/package.json').version}
        </div>
      )}
    </div>
  );
};

export default WebRTCPlayer;