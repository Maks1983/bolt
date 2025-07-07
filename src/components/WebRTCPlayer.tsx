import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader, Wifi, WifiOff } from 'lucide-react';

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
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'failed' | 'disconnected'>('disconnected');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initWebRTC = async () => {
      if (!mounted) return;

      try {
        setConnectionState('connecting');
        setError(null);

        // Create RTCPeerConnection with STUN servers
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });

        pcRef.current = pc;

        // Handle incoming streams
        pc.ontrack = (event) => {
          console.log('📺 Received WebRTC track:', event.track.kind);
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            if (mounted) {
              setConnectionState('connected');
              onConnected?.();
            }
          }
        };

        // Handle connection state changes
        pc.onconnectionstatechange = () => {
          console.log('🔗 WebRTC connection state:', pc.connectionState);
          if (!mounted) return;

          switch (pc.connectionState) {
            case 'connected':
              setConnectionState('connected');
              onConnected?.();
              break;
            case 'failed':
            case 'disconnected':
              setConnectionState('failed');
              setError('WebRTC connection failed');
              onError?.('WebRTC connection failed');
              break;
            case 'connecting':
              setConnectionState('connecting');
              break;
          }
        };

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
          console.log('🧊 ICE connection state:', pc.iceConnectionState);
        };

        // Create offer for WebRTC negotiation
        const offer = await pc.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true
        });

        await pc.setLocalDescription(offer);

        // Connect to Go2RTC WebRTC endpoint
        const response = await fetch(`${streamUrl}/api/webrtc`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'offer',
            sdp: offer.sdp
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const answer = await response.json();
        
        if (answer.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          throw new Error('Invalid WebRTC answer received');
        }

      } catch (err) {
        console.error('❌ WebRTC initialization failed:', err);
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'WebRTC connection failed';
          setError(errorMessage);
          setConnectionState('failed');
          onError?.(errorMessage);
        }
      }
    };

    initWebRTC();

    return () => {
      mounted = false;
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
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
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {connectionState === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-6">
            <Loader className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Connecting to Stream</h3>
            <p className="text-sm text-gray-300">Establishing WebRTC connection...</p>
          </div>
        </div>
      )}

      {/* Camera Info Badge */}
      <div className="absolute top-3 right-3 bg-indigo-500/90 rounded-full px-3 py-1 backdrop-blur-sm">
        <span className="text-white text-xs font-medium">{cameraId}</span>
      </div>
    </div>
  );
};

export default WebRTCPlayer;