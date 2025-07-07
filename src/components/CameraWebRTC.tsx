import React from 'react';

interface CameraWebRTCProps {
  cameraId: string;
  className?: string;
  style?: React.CSSProperties;
}

const CameraWebRTC: React.FC<CameraWebRTCProps> = ({ 
  cameraId, 
  className = '',
  style = {}
}) => {
  const url = `https://nvr.alfcent.com:8555/stream.html?src=${cameraId}&video&audio`;

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    ...style
  };

  return (
    <div 
      className={`w-full h-full ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <iframe
        src={url}
        title={`Camera Feed - ${cameraId}`}
        style={defaultStyle}
        allow="camera; microphone; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-popups"
        allowFullScreen
      />
    </div>
  );
};

export default CameraWebRTC;