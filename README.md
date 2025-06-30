# Smart Home Dashboard - Home Assistant Integration

A modern, responsive React dashboard for Home Assistant with real-time WebSocket integration.

## Features

- **Real-time Device Control**: Control lights, covers, media players, fans, locks, and more
- **Live Updates**: WebSocket connection for instant state updates
- **Modular Architecture**: Clean separation of concerns with TypeScript
- **Responsive Design**: Beautiful UI that works on all devices
- **Room-based Organization**: Devices organized by rooms and floors
- **Security Integration**: Full alarm control panel with numpad interface
- **Sensor Monitoring**: Temperature, humidity, motion, flood, and smoke sensors

## Architecture

### Core Components

- **DeviceContext**: Global state management for all devices
- **SocketService**: WebSocket connection handling with Home Assistant
- **Device Controls**: Modular components for each device type
- **Room Cards**: Interactive room displays with expandable controls

### File Structure

```
src/
├── components/
│   ├── DeviceControls/     # Device-specific control components
│   ├── Header.tsx          # Main header with status
│   ├── InfoRow.tsx         # System overview row
│   ├── FloorSection.tsx    # Floor organization
│   ├── RoomCard.tsx        # Individual room cards
│   └── ConnectionStatus.tsx # WebSocket status indicator
├── context/
│   └── DeviceContext.tsx   # Global device state management
├── services/
│   └── socketService.ts    # WebSocket communication
├── types/
│   └── devices.ts          # TypeScript definitions
├── config/
│   └── devices.ts          # Device configuration and mock data
├── hooks/
│   └── useDeviceUpdates.ts # Custom hooks for device management
└── utils/
    └── deviceHelpers.ts    # Utility functions
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_HA_WEBSOCKET_URL=ws://your-home-assistant-ip:8123
REACT_APP_HA_ACCESS_TOKEN=your-long-lived-access-token
```

### 2. Home Assistant Configuration

1. **Generate Long-lived Access Token**:
   - Go to Home Assistant → Profile → Long-lived Access Tokens
   - Create a new token and copy it to your `.env` file

2. **WebSocket API**: Ensure WebSocket API is enabled (default in HA)

### 3. Device Configuration

Update `src/config/devices.ts` with your actual Home Assistant entities:

```typescript
// Replace placeholder entity IDs with your actual ones
{
  entity_id: 'light.your_actual_light_entity',
  friendly_name: 'Living Room Light',
  device_type: 'light',
  room: 'Living Room',
  floor: 'Upper Floor',
  // ... other properties
}
```

### 4. Room Setup

Modify room configurations in `src/config/devices.ts`:

```typescript
export const roomConfigs: Room[] = [
  {
    id: 'living_room',
    name: 'Living Room',
    floor: 'Upper Floor',
    background_image: 'your-room-image-url',
    devices: deviceConfigs.filter(d => d.room === 'Living Room')
  }
  // ... add your rooms
];
```

## Device Types Supported

### Lights
- On/off control
- Brightness adjustment
- RGB color control
- Color temperature

### Covers (Blinds/Curtains)
- Open/close control
- Position setting (0-100%)
- Tilt control (where supported)

### Media Players
- Play/pause control
- Volume adjustment
- Source selection
- Track information display

### Sensors
- Temperature monitoring
- Humidity tracking
- Motion detection
- Window/door status
- Flood detection
- Smoke detection

### Security
- Lock control with code entry
- Alarm system with full numpad interface
- Camera integration
- Security status monitoring

### Climate Control
- Fan speed control
- HVAC system integration

## WebSocket Integration

The application connects to Home Assistant via WebSocket and handles:

- **Authentication**: Bearer token authentication
- **State Updates**: Real-time entity state changes
- **Device Control**: Sending commands to Home Assistant
- **Connection Management**: Auto-reconnection with exponential backoff

### Socket Events

**Incoming Events**:
- `entity_update`: Device state changes
- `state_changed`: Home Assistant state changes
- `devices_update`: Bulk device updates

**Outgoing Events**:
- `call_service`: Device control commands
- `subscribe_events`: Subscribe to state changes
- `get_states`: Request current states

## Customization

### Adding New Device Types

1. **Define Types**: Add new device interface in `src/types/devices.ts`
2. **Create Control Component**: Add component in `src/components/DeviceControls/`
3. **Update Context**: Add control methods in `src/context/DeviceContext.tsx`
4. **Add Socket Methods**: Implement in `src/services/socketService.ts`

### Styling

The application uses Tailwind CSS with custom components. Key design principles:

- **Apple-level aesthetics**: Clean, modern design
- **Responsive layout**: Works on all screen sizes
- **Smooth animations**: Micro-interactions and transitions
- **Consistent spacing**: 8px grid system
- **Accessible colors**: High contrast ratios

### Error Handling

- **Connection errors**: Graceful degradation with retry logic
- **Device unavailable**: Clear visual indicators
- **Command failures**: User feedback and error recovery
- **Offline mode**: Local state management when disconnected

## Development

### Running Locally

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Deployment

The application is configured for deployment to Netlify and other static hosting providers. The build output is optimized for production with:

- Code splitting
- Asset optimization
- Service worker for offline functionality
- Progressive Web App features

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**:
   - Check Home Assistant URL and port
   - Verify access token is valid
   - Ensure WebSocket API is enabled

2. **Devices Not Updating**:
   - Check entity IDs match your Home Assistant setup
   - Verify device availability in Home Assistant
   - Check browser console for errors

3. **Control Commands Not Working**:
   - Ensure access token has necessary permissions
   - Check Home Assistant logs for service call errors
   - Verify device supports the requested action

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem('debug', 'smart-home:*');
```

This will show detailed WebSocket communication in the browser console.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.