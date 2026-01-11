import { db } from '@/lib/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';

// Sample train data for seeding
const sampleTrains = [
    {
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

export async function seedTrains() {
    console.log('🚂 Starting train data seeding...\n');

    try {
        for (const train of sampleTrains) {
            const trainRef = doc(db, 'trains', train.trainNumber);
            await setDoc(trainRef, train);
            console.log(`✅ Created train: ${train.trainName} (${train.trainNumber})`);
        }

        console.log(`\n🎉 Successfully seeded ${sampleTrains.length} trains!`);
        console.log('\n📊 Train Routes Added:');
        sampleTrains.forEach(t => {
            console.log(`   ${t.depart} → ${t.arrive} (${t.trainName})`);
        });
    } catch (error) {
        console.error('❌ Error seeding trains:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedTrains()
        .then(() => {
            console.log('\n✨ Seeding complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Seeding failed:', error);
            process.exit(1);
        });
}
