import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3011;

app.use(cors());
app.use(express.json());

// ==================== TYPES ====================
interface Sensor {
    id: string;
    name: string;
    type: 'temperature' | 'humidity' | 'light' | 'door' | 'crowd' | 'energy' | 'smoke' | 'fire';
    location: string;
    floor: number;
    zone: string;
    status: 'online' | 'offline' | 'error';
    lastReading: number;
    unit: string;
    batteryLevel: number;
    lastUpdated: string;
    createdAt: string;
}

interface SensorReading {
    id: string;
    sensorId: string;
    value: number;
    timestamp: string;
}

interface Alert {
    id: string;
    sensorId: string;
    type: 'threshold' | 'error' | 'offline' | 'fire' | 'smoke' | 'intrusion';
    severity: 'info' | 'warning' | 'critical';
    message: string;
    value: number;
    threshold: number;
    isResolved: boolean;
    createdAt: string;
    resolvedAt?: string;
}

// ==================== DATA STORE ====================
const sensors: Sensor[] = [
    { id: 'sen_1', name: 'Cảm biến nhiệt T1', type: 'temperature', location: 'Tầng 1 - Khu A', floor: 1, zone: 'A1', status: 'online', lastReading: 26.5, unit: '°C', batteryLevel: 85, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_2', name: 'Cảm biến độ ẩm T1', type: 'humidity', location: 'Tầng 1 - Khu A', floor: 1, zone: 'A1', status: 'online', lastReading: 65, unit: '%', batteryLevel: 82, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_3', name: 'Cảm biến ánh sáng T1', type: 'light', location: 'Tầng 1 - Khu B', floor: 1, zone: 'B2', status: 'online', lastReading: 450, unit: 'lux', batteryLevel: 90, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_4', name: 'Cảm biến cửa T1', type: 'door', location: 'Tầng 1 - Cửa chính', floor: 1, zone: 'Main', status: 'online', lastReading: 1, unit: '', batteryLevel: 75, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_5', name: 'Đếm khách T1', type: 'crowd', location: 'Tầng 1 - Lối vào', floor: 1, zone: 'Entrance', status: 'online', lastReading: 234, unit: 'người', batteryLevel: 100, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_6', name: 'Điện năng T1', type: 'energy', location: 'Tầng 1 - Tủ điện', floor: 1, zone: 'E1', status: 'online', lastReading: 45.2, unit: 'kWh', batteryLevel: 100, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_7', name: 'Cảm biến khói T1', type: 'smoke', location: 'Tầng 1 - Khu C', floor: 1, zone: 'C3', status: 'online', lastReading: 0, unit: 'ppm', batteryLevel: 88, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_8', name: 'Cảm biến nhiệt T2', type: 'temperature', location: 'Tầng 2 - Khu A', floor: 2, zone: 'A1', status: 'online', lastReading: 27.1, unit: '°C', batteryLevel: 80, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_9', name: 'Đếm khách T2', type: 'crowd', location: 'Tầng 2 - Thang cuốn', floor: 2, zone: 'Escalator', status: 'online', lastReading: 156, unit: 'người', batteryLevel: 100, lastUpdated: new Date().toISOString(), createdAt: '2024-01-01' },
    { id: 'sen_10', name: 'Cảm biến nhiệt B1', type: 'temperature', location: 'Tầng hầm - Bãi xe', floor: -1, zone: 'Parking', status: 'offline', lastReading: 0, unit: '°C', batteryLevel: 0, lastUpdated: new Date(Date.now() - 86400000).toISOString(), createdAt: '2024-01-01' },
];

const readings: SensorReading[] = [];
let nextReadingId = 1;
const alerts: Alert[] = [];
let nextAlertId = 1;

// ==================== SENSORS API ====================
app.get('/sensors', (req, res) => {
    let result = [...sensors];
    const { type, floor, status, location } = req.query;
    if (type) result = result.filter(s => s.type === type);
    if (floor) result = result.filter(s => s.floor === Number(floor));
    if (status) result = result.filter(s => s.status === status);
    if (location) result = result.filter(s => s.location.toLowerCase().includes((location as string).toLowerCase()));
    res.json({ success: true, data: result });
});

app.get('/sensors/:id', (req, res) => {
    const sensor = sensors.find(s => s.id === req.params.id);
    if (!sensor) return res.status(404).json({ success: false, message: 'Sensor not found' });
    res.json({ success: true, data: sensor });
});

app.get('/sensors/:id/data', (req, res) => {
    const { from, to, limit = '100' } = req.query;
    let result = readings.filter(r => r.sensorId === req.params.id);
    if (from) result = result.filter(r => r.timestamp >= from);
    if (to) result = result.filter(r => r.timestamp <= to);
    result = result.slice(-Number(limit));
    res.json({ success: true, data: result });
});

app.post('/sensors/:id/reading', (req, res) => {
    const { value } = req.body;
    const sensor = sensors.find(s => s.id === req.params.id);
    if (!sensor) return res.status(404).json({ success: false, message: 'Sensor not found' });
    const reading: SensorReading = {
        id: `read_${String(nextReadingId++).padStart(6, '0')}`,
        sensorId: sensor.id,
        value: Number(value),
        timestamp: new Date().toISOString(),
    };
    readings.push(reading);
    sensor.lastReading = Number(value);
    sensor.lastUpdated = reading.timestamp;
    sensor.status = 'online';
    res.json({ success: true, data: reading });
});

// ==================== ENERGY API ====================
app.get('/energy', (req, res) => {
    const { floor, from, to } = req.query;
    let energySensors = sensors.filter(s => s.type === 'energy');
    if (floor) energySensors = energySensors.filter(s => s.floor === Number(floor));
    const total = energySensors.reduce((sum, s) => sum + s.lastReading, 0);
    const data = energySensors.map(s => ({
        id: s.id, name: s.name, location: s.location,
        current: s.lastReading, unit: 'kWh',
        readings: readings.filter(r => r.sensorId === s.id).slice(-24),
    }));
    res.json({ success: true, data: { total, sensors: data } });
});

// ==================== TEMPERATURE API ====================
app.get('/temperature', (req, res) => {
    const { floor } = req.query;
    let tempSensors = sensors.filter(s => s.type === 'temperature');
    if (floor) tempSensors = tempSensors.filter(s => s.floor === Number(floor));
    const avg = tempSensors.reduce((sum, s) => sum + s.lastReading, 0) / tempSensors.length;
    res.json({
        success: true, data: {
            average: Math.round(avg * 10) / 10,
            min: Math.min(...tempSensors.map(s => s.lastReading)),
            max: Math.max(...tempSensors.map(s => s.lastReading)),
            sensors: tempSensors,
        },
    });
});

// ==================== CROWD API ====================
app.get('/crowd', (req, res) => {
    const { floor } = req.query;
    let crowdSensors = sensors.filter(s => s.type === 'crowd');
    if (floor) crowdSensors = crowdSensors.filter(s => s.floor === Number(floor));
    const total = crowdSensors.reduce((sum, s) => sum + s.lastReading, 0);
    res.json({
        success: true, data: {
            total: Math.round(total),
            byLocation: crowdSensors.map(s => ({ location: s.location, count: s.lastReading, floor: s.floor })),
        },
    });
});

// ==================== ALERTS API ====================
app.get('/alerts', (req, res) => {
    let result = [...alerts];
    const { severity, isResolved, type } = req.query;
    if (severity) result = result.filter(a => a.severity === severity);
    if (isResolved === 'true') result = result.filter(a => a.isResolved);
    if (isResolved === 'false') result = result.filter(a => !a.isResolved);
    if (type) result = result.filter(a => a.type === type);
    res.json({ success: true, data: result });
});

app.post('/alerts', (req, res) => {
    const { sensorId, type, severity, message, value, threshold } = req.body;
    if (!sensorId || !type || !message) return res.status(400).json({ success: false, message: 'sensorId, type and message are required' });
    const alert: Alert = {
        id: `alert_${String(nextAlertId++).padStart(6, '0')}`,
        sensorId, type, severity: severity || 'warning',
        message, value: value || 0, threshold: threshold || 0,
        isResolved: false, createdAt: new Date().toISOString(),
    };
    alerts.push(alert);
    res.status(201).json({ success: true, data: alert });
});

app.put('/alerts/:id/resolve', (req, res) => {
    const alert = alerts.find(a => a.id === req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    alert.isResolved = true;
    alert.resolvedAt = new Date().toISOString();
    res.json({ success: true, data: alert });
});

// ==================== DASHBOARD API ====================
app.get('/dashboard', (req, res) => {
    const online = sensors.filter(s => s.status === 'online').length;
    const offline = sensors.filter(s => s.status === 'offline').length;
    const error = sensors.filter(s => s.status === 'error').length;
    const totalEnergy = sensors.filter(s => s.type === 'energy').reduce((sum, s) => sum + s.lastReading, 0);
    const totalCrowd = sensors.filter(s => s.type === 'crowd').reduce((sum, s) => sum + s.lastReading, 0);
    const avgTemp = sensors.filter(s => s.type === 'temperature').reduce((sum, s, _, arr) => sum + s.lastReading / arr.length, 0);
    const unresolvedAlerts = alerts.filter(a => !a.isResolved).length;

    res.json({
        success: true, data: {
            sensors: { total: sensors.length, online, offline, error },
            energy: { total: Math.round(totalEnergy * 100) / 100, unit: 'kWh' },
            crowd: { total: Math.round(totalCrowd), unit: 'người' },
            temperature: { average: Math.round(avgTemp * 10) / 10, unit: '°C' },
            alerts: { unresolved: unresolvedAlerts, total: alerts.length },
        },
    });
});

app.listen(PORT, () => console.log(`📡 IoT Service running on port ${PORT}`));
export default app;