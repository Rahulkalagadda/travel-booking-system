import { db } from '@/lib/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';

async function testSeed() {
    console.log('Testing simple train seed...');

    const testTrain = {
        trainNumber: "TEST001",
        trainName: "Test Express",
        depart: "Delhi",
        arrive: "Mumbai",
        departTime: "10:00",
        arriveTime: "20:00",
        duration: "10h",
        runningDays: ["Mon"],
        seats: [],
        amenities: [],
    };

    try {
        const trainRef = doc(db, 'trains', testTrain.trainNumber);
        await setDoc(trainRef, testTrain);
        console.log('✅ Test train created successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testSeed().then(() => process.exit(0)).catch(() => process.exit(1));
