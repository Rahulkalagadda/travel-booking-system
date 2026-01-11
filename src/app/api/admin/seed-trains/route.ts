import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const trainData = [
    {
        id: "12301",
        trainNumber: "12301",
        trainName: "Rajdhani Express",
        depart: "New Delhi",
        arrive: "Mumbai Central",
        departTime: "16:55",
        arriveTime: "08:35",
        duration: "15h 40m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "1A", classType: "1A", price: 3500, available: 12, status: "available" },
            { id: "2A", classType: "2A", price: 2200, available: 8, status: "available" },
            { id: "3A", classType: "3A", price: 1600, available: 5, status: "limited" },
            { id: "SL", classType: "SL", price: 600, available: 0, status: "waitlist" },
        ],
        amenities: ["WiFi", "Pantry", "Security", "Charging Points"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "12430",
        trainNumber: "12430",
        trainName: "Shatabdi Express",
        depart: "New Delhi",
        arrive: "Lucknow",
        departTime: "06:10",
        arriveTime: "12:25",
        duration: "6h 15m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "CC", classType: "CC", price: 850, available: 25, status: "available" },
            { id: "EC", classType: "EC", price: 1650, available: 10, status: "available" },
        ],
        amenities: ["WiFi", "Pantry", "AC", "Charging Points"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "12626",
        trainNumber: "12626",
        trainName: "Karnataka Express",
        depart: "New Delhi",
        arrive: "Bangalore",
        departTime: "19:50",
        arriveTime: "06:00",
        duration: "34h 10m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "1A", classType: "1A", price: 4200, available: 6, status: "limited" },
            { id: "2A", classType: "2A", price: 2800, available: 15, status: "available" },
            { id: "3A", classType: "3A", price: 2000, available: 20, status: "available" },
            { id: "SL", classType: "SL", price: 750, available: 45, status: "available" },
        ],
        amenities: ["Pantry", "Security", "Charging Points"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "12860",
        trainNumber: "12860",
        trainName: "Gitanjali Express",
        depart: "Mumbai CST",
        arrive: "Howrah",
        departTime: "06:20",
        arriveTime: "10:05",
        duration: "27h 45m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "2A", classType: "2A", price: 2600, available: 12, status: "available" },
            { id: "3A", classType: "3A", price: 1850, available: 18, status: "available" },
            { id: "SL", classType: "SL", price: 680, available: 30, status: "available" },
        ],
        amenities: ["Pantry", "Security"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "12951",
        trainNumber: "12951",
        trainName: "Mumbai Rajdhani",
        depart: "Mumbai Central",
        arrive: "New Delhi",
        departTime: "16:25",
        arriveTime: "08:35",
        duration: "16h 10m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "1A", classType: "1A", price: 3600, available: 10, status: "available" },
            { id: "2A", classType: "2A", price: 2300, available: 16, status: "available" },
            { id: "3A", classType: "3A", price: 1650, available: 24, status: "available" },
        ],
        amenities: ["WiFi", "Pantry", "Security", "Charging Points"],
        createdAt: new Date().toISOString(),
    },
    {
        id: "12723",
        trainNumber: "12723",
        trainName: "Telangana Express",
        depart: "Hyderabad",
        arrive: "New Delhi",
        departTime: "17:15",
        arriveTime: "12:05",
        duration: "24h 50m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "2A", classType: "2A", price: 2350, available: 13, status: "available" },
            { id: "3A", classType: "3A", price: 1680, available: 21, status: "available" },
            { id: "SL", classType: "SL", price: 620, available: 40, status: "available" },
        ],
        amenities: ["Pantry", "Security"],
        createdAt: new Date().toISOString(),
    },
];

export async function GET() {
    try {
        console.log('🚂 Starting automated train seeding...');

        // Check if trains already exist
        const trainsRef = collection(db, 'trains');
        const existingTrains = await getDocs(trainsRef);

        if (existingTrains.size > 0) {
            return NextResponse.json({
                success: true,
                message: `Trains collection already exists with ${existingTrains.size} trains`,
                action: 'skipped',
                count: existingTrains.size,
            });
        }

        // Add each train
        const results = [];
        for (const train of trainData) {
            try {
                const trainRef = doc(db, 'trains', train.id);
                await setDoc(trainRef, train);
                results.push({
                    id: train.id,
                    name: train.trainName,
                    status: 'success'
                });
                console.log(`✅ Added: ${train.trainName} (${train.trainNumber})`);
            } catch (error: any) {
                results.push({
                    id: train.id,
                    name: train.trainName,
                    status: 'failed',
                    error: error.message
                });
                console.error(`❌ Failed: ${train.trainName}`, error);
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const failedCount = results.filter(r => r.status === 'failed').length;

        return NextResponse.json({
            success: successCount > 0,
            message: `Seeded ${successCount} trains successfully${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
            action: 'seeded',
            count: successCount,
            failed: failedCount,
            details: results,
        });

    } catch (error: any) {
        console.error('❌ Seeding error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to seed trains',
            error: error.message,
        }, { status: 500 });
    }
}
