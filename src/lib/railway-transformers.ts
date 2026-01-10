/**
 * Railway Data Transformers
 * Transform Indian Railway API responses to our internal Train type
 */

import type { Train, TrainSeat } from './types';

/**
 * Transform Indian Railway API response to our Train type
 */
export function transformAPIResponseToTrain(apiResponse: any): Train[] {
    if (!apiResponse || !apiResponse.data) {
        console.warn('Invalid API response:', apiResponse);
        return [];
    }

    const trains = Array.isArray(apiResponse.data) ? apiResponse.data : [apiResponse.data];

    return trains.map((train: any) => {
        try {
            return {
                id: train.train_number || train.trainNumber || train.number || '',
                trainNumber: train.train_number || train.trainNumber || train.number || '',
                trainName: train.train_name || train.trainName || train.name || 'Unknown Train',
                depart: train.from_station_name || train.fromStation || train.source || '',
                arrive: train.to_station_name || train.toStation || train.destination || '',
                departTime: formatTime(train.departure_time || train.departureTime || train.dept_time),
                arriveTime: formatTime(train.arrival_time || train.arrivalTime || train.arr_time),
                duration: train.duration || calculateDuration(train) || '0h 0m',
                runningDays: parseRunningDays(train.running_days || train.runDays || train.days),
                seats: transformSeats(train.classes || train.availableClasses || train.class_type || []),
                amenities: parseAmenities(train.amenities || train.facilities),
            };
        } catch (error) {
            console.error('Error transforming train data:', error, train);
            return null;
        }
    }).filter((train): train is Train => train !== null);
}

/**
 * Transform seat/class information
 */
function transformSeats(classes: any): TrainSeat[] {
    if (!classes || !Array.isArray(classes)) {
        // Return default classes if no data
        return getDefaultClasses();
    }

    return classes.map((cls: any) => {
        const available = parseInt(cls.available_seats || cls.availableSeats || cls.available || '0');

        return {
            id: cls.class_code || cls.classCode || cls.class || cls.type,
            class: cls.class_code || cls.classCode || cls.class || cls.type,
            price: parseInt(cls.fare || cls.price || cls.amount || '0'),
            available: available,
            status: determineStatus(available, cls.status),
        };
    }).filter(seat => seat.class); // Remove invalid seats
}

/**
 * Determine seat status based on availability
 */
function determineStatus(available: number, apiStatus?: string): 'available' | 'limited' | 'waitlist' {
    // If API provides status, use it
    if (apiStatus) {
        const status = apiStatus.toLowerCase();
        if (status.includes('available') || status.includes('avl')) return 'available';
        if (status.includes('rac') || status.includes('limited')) return 'limited';
        if (status.includes('wl') || status.includes('waitlist')) return 'waitlist';
    }

    // Otherwise, determine from available count
    if (available > 10) return 'available';
    if (available > 0) return 'limited';
    return 'waitlist';
}

/**
 * Parse running days from various formats
 */
function parseRunningDays(days: any): string[] {
    if (!days) {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }

    if (Array.isArray(days)) {
        return days.map(day => formatDay(day));
    }

    if (typeof days === 'string') {
        // Handle formats like "MTWTFSS", "1234567", "Mon,Tue,Wed"
        if (days.includes(',')) {
            return days.split(',').map(day => formatDay(day.trim()));
        }

        // Handle binary format like "1111111" or "MTWTFSS"
        const dayMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        if (days.length === 7) {
            return dayMap.filter((_, index) => days[index] !== '0' && days[index] !== 'N');
        }
    }

    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

/**
 * Format day name
 */
function formatDay(day: string): string {
    const dayMap: Record<string, string> = {
        'monday': 'Mon',
        'tuesday': 'Tue',
        'wednesday': 'Wed',
        'thursday': 'Thu',
        'friday': 'Fri',
        'saturday': 'Sat',
        'sunday': 'Sun',
        'mon': 'Mon',
        'tue': 'Tue',
        'wed': 'Wed',
        'thu': 'Thu',
        'fri': 'Fri',
        'sat': 'Sat',
        'sun': 'Sun',
        '1': 'Mon',
        '2': 'Tue',
        '3': 'Wed',
        '4': 'Thu',
        '5': 'Fri',
        '6': 'Sat',
        '7': 'Sun',
    };

    return dayMap[day.toLowerCase()] || day.substring(0, 3);
}

/**
 * Parse amenities
 */
function parseAmenities(amenities: any): string[] {
    if (!amenities) {
        return ['Pantry', 'Security'];
    }

    if (Array.isArray(amenities)) {
        return amenities;
    }

    if (typeof amenities === 'string') {
        return amenities.split(',').map(a => a.trim());
    }

    return ['Pantry', 'Security'];
}

/**
 * Format time from various formats
 */
function formatTime(time: any): string {
    if (!time) return '00:00';

    const timeStr = String(time);

    // Already in HH:MM format
    if (timeStr.includes(':')) {
        return timeStr;
    }

    // Handle HHMM format (e.g., "1430" -> "14:30")
    if (timeStr.length === 4) {
        return `${timeStr.substring(0, 2)}:${timeStr.substring(2)}`;
    }

    // Handle HMM format (e.g., "930" -> "09:30")
    if (timeStr.length === 3) {
        return `0${timeStr.substring(0, 1)}:${timeStr.substring(1)}`;
    }

    return timeStr;
}

/**
 * Calculate duration from departure and arrival times
 */
function calculateDuration(train: any): string {
    try {
        const deptTime = train.departure_time || train.departureTime || train.dept_time;
        const arrTime = train.arrival_time || train.arrivalTime || train.arr_time;

        if (!deptTime || !arrTime) return '0h 0m';

        const [deptHour, deptMin] = formatTime(deptTime).split(':').map(Number);
        const [arrHour, arrMin] = formatTime(arrTime).split(':').map(Number);

        let totalMinutes = (arrHour * 60 + arrMin) - (deptHour * 60 + deptMin);

        // Handle overnight journeys
        if (totalMinutes < 0) {
            totalMinutes += 24 * 60;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${hours}h ${minutes}m`;
    } catch (error) {
        console.error('Error calculating duration:', error);
        return '0h 0m';
    }
}

/**
 * Get default train classes
 */
function getDefaultClasses(): TrainSeat[] {
    return [
        { id: '1A', class: '1A', price: 3500, available: 0, status: 'waitlist' },
        { id: '2A', class: '2A', price: 2200, available: 0, status: 'waitlist' },
        { id: '3A', class: '3A', price: 1600, available: 0, status: 'waitlist' },
        { id: 'SL', class: 'SL', price: 600, available: 0, status: 'waitlist' },
    ];
}

/**
 * Transform PNR status response
 */
export function transformPNRStatus(apiResponse: any) {
    if (!apiResponse || !apiResponse.data) {
        throw new Error('Invalid PNR status response');
    }

    const data = apiResponse.data;

    return {
        pnr: data.pnr || data.pnrNumber,
        trainNumber: data.train_number || data.trainNumber,
        trainName: data.train_name || data.trainName,
        from: data.from_station || data.fromStation || data.boarding_point,
        to: data.to_station || data.toStation || data.destination,
        dateOfJourney: data.doj || data.dateOfJourney || data.journey_date,
        chartPrepared: data.chart_prepared || data.chartPrepared || false,
        passengers: (data.passengers || []).map((p: any, index: number) => ({
            number: index + 1,
            currentStatus: p.current_status || p.currentStatus || 'Unknown',
            bookingStatus: p.booking_status || p.bookingStatus || 'Unknown',
            coach: p.coach || p.coach_position || '',
            berth: p.berth || p.berth_position || '',
        })),
    };
}

/**
 * Transform live train status response
 */
export function transformLiveStatus(apiResponse: any) {
    if (!apiResponse || !apiResponse.data) {
        throw new Error('Invalid live status response');
    }

    const data = apiResponse.data;

    return {
        trainNumber: data.train_number || data.trainNumber,
        trainName: data.train_name || data.trainName,
        currentStation: data.current_station || data.currentStation || 'Unknown',
        delay: data.delay || data.running_status || '0 min',
        expectedArrival: data.eta || data.expectedArrival || 'N/A',
        lastUpdated: data.last_updated || data.lastUpdated || new Date().toISOString(),
    };
}
