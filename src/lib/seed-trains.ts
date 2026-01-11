import { createTrain } from '@/lib/data';

// Sample train data for seeding
const sampleTrains = [
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
            { id: "1A", class: "1A", price: 3500, available: 12, status: "available" },
            { id: "2A", class: "2A", price: 2200, available: 8, status: "available" },
            { id: "3A", class: "3A", price: 1600, available: 5, status: "limited" },
            { id: "SL", class: "SL", price: 600, available: 0, status: "waitlist" },
        ],
        amenities: ["WiFi", "Pantry", "Security", "Charging Points"]
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
            { id: "CC", class: "CC", price: 850, available: 25, status: "available" },
            { id: "EC", class: "EC", price: 1650, available: 10, status: "available" },
        ],
        amenities: ["WiFi", "Pantry", "AC", "Charging Points"]
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
            { id: "1A", class: "1A", price: 4200, available: 6, status: "limited" },
            { id: "2A", class: "2A", price: 2800, available: 15, status: "available" },
            { id: "3A", class: "3A", price: 2000, available: 20, status: "available" },
            { id: "SL", class: "SL", price: 750, available: 45, status: "available" },
        ],
        amenities: ["Pantry", "Security", "Charging Points"]
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
            { id: "2A", class: "2A", price: 2600, available: 12, status: "available" },
            { id: "3A", class: "3A", price: 1850, available: 18, status: "available" },
            { id: "SL", class: "SL", price: 680, available: 30, status: "available" },
        ],
        amenities: ["Pantry", "Security"]
    },
    {
        id: "12434",
        trainNumber: "12434",
        trainName: "Chennai Rajdhani",
        depart: "Chennai Central",
        arrive: "New Delhi",
        departTime: "15:50",
        arriveTime: "07:30",
        duration: "27h 40m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        seats: [
            { id: "1A", class: "1A", price: 4100, available: 8, status: "available" },
            { id: "2A", class: "2A", price: 2500, available: 14, status: "available" },
            { id: "3A", class: "3A", price: 1800, available: 22, status: "available" },
        ],
        amenities: ["WiFi", "Pantry", "Security", "Charging Points"]
    },
    {
        id: "12002",
        trainNumber: "12002",
        trainName: "Bhopal Shatabdi",
        depart: "New Delhi",
        arrive: "Bhopal",
        departTime: "06:00",
        arriveTime: "13:40",
        duration: "7h 40m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "CC", class: "CC", price: 920, available: 30, status: "available" },
            { id: "EC", class: "EC", price: 1850, available: 12, status: "available" },
        ],
        amenities: ["WiFi", "Pantry", "AC", "Charging Points"]
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
            { id: "1A", class: "1A", price: 3600, available: 10, status: "available" },
            { id: "2A", class: "2A", price: 2300, available: 16, status: "available" },
            { id: "3A", class: "3A", price: 1650, available: 24, status: "available" },
        ],
        amenities: ["WiFi", "Pantry", "Security", "Charging Points"]
    },
    {
        id: "12259",
        trainNumber: "12259",
        trainName: "Duronto Express",
        depart: "Sealdah",
        arrive: "New Delhi",
        departTime: "16:50",
        arriveTime: "10:05",
        duration: "17h 15m",
        runningDays: ["Mon", "Wed", "Fri", "Sun"],
        seats: [
            { id: "1A", class: "1A", price: 3800, available: 7, status: "limited" },
            { id: "2A", class: "2A", price: 2400, available: 11, status: "available" },
            { id: "3A", class: "3A", price: 1700, available: 19, status: "available" },
            { id: "SL", class: "SL", price: 650, available: 35, status: "available" },
        ],
        amenities: ["Pantry", "Security", "Charging Points"]
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
            { id: "2A", class: "2A", price: 2350, available: 13, status: "available" },
            { id: "3A", class: "3A", price: 1680, available: 21, status: "available" },
            { id: "SL", class: "SL", price: 620, available: 40, status: "available" },
        ],
        amenities: ["Pantry", "Security"]
    },
    {
        id: "12617",
        trainNumber: "12617",
        trainName: "Mangala Lakshadweep Express",
        depart: "Ernakulam",
        arrive: "New Delhi",
        departTime: "11:00",
        arriveTime: "06:50",
        duration: "43h 50m",
        runningDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        seats: [
            { id: "2A", class: "2A", price: 3100, available: 9, status: "available" },
            { id: "3A", class: "3A", price: 2200, available: 17, status: "available" },
            { id: "SL", class: "SL", price: 850, available: 32, status: "available" },
        ],
        amenities: ["Pantry", "Security", "Charging Points"]
    }
];

export async function seedTrains() {
    console.log('Starting train data seeding...');

    try {
        for (const train of sampleTrains) {
            await createTrain(train);
            console.log(`✓ Created train: ${train.trainName} (${train.trainNumber})`);
        }

        console.log(`\n✅ Successfully seeded ${sampleTrains.length} trains!`);
    } catch (error) {
        console.error('❌ Error seeding trains:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    seedTrains()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
