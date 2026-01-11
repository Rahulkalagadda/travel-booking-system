"use client"

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Train, User, Mail, Phone, Calendar, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Train as TrainType } from '@/lib/types';

function BookingContent() {
    const searchParams = useSearchParams();
    const trainId = searchParams.get('trainId');
    const classType = searchParams.get('class');
    const date = searchParams.get('date');

    const [train, setTrain] = useState<TrainType | null>(null);
    const [loading, setLoading] = useState(true);
    const [passengers, setPassengers] = useState(1);
    const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Payment, 4: Confirmation

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'male',
        boardingStation: '',
        destinationStation: '',
    });

    useEffect(() => {
        if (trainId) {
            fetchTrainDetails();
        }
    }, [trainId]);

    const fetchTrainDetails = async () => {
        try {
            const response = await fetch(`/api/trains/${trainId}`);
            const data = await response.json();
            setTrain(data);
            setFormData(prev => ({
                ...prev,
                boardingStation: data.depart,
                destinationStation: data.arrive,
            }));
        } catch (error) {
            console.error('Error fetching train:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedSeat = train?.seats.find(s => s.classType === classType);
    const totalPrice = selectedSeat ? selectedSeat.price * passengers : 0;

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBooking = async () => {
        // Create booking
        const booking = {
            trainId: train?.id,
            trainNumber: train?.trainNumber,
            trainName: train?.trainName,
            classType,
            passengers,
            date,
            ...formData,
            totalPrice,
            status: 'confirmed',
            pnr: generatePNR(),
            bookedAt: new Date().toISOString(),
        };

        try {
            const response = await fetch('/api/bookings/train', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking),
            });

            if (response.ok) {
                setStep(4);
            }
        } catch (error) {
            console.error('Booking error:', error);
        }
    };

    const generatePNR = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Train className="w-12 h-12 animate-bounce mx-auto mb-4 text-orange-600" />
                    <p>Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!train) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-red-600 mb-4">Train not found</p>
                        <Button onClick={() => window.location.href = '/railway'}>
                            Back to Search
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-950 dark:to-slate-900">
            <Header />
            <main className="flex-1 container px-4 py-8">
                {/* Progress Steps */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {['Details', 'Review', 'Payment', 'Confirmed'].map((label, idx) => (
                            <div key={idx} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step > idx + 1 ? 'bg-green-600 border-green-600 text-white' :
                                        step === idx + 1 ? 'bg-orange-600 border-orange-600 text-white' :
                                            'bg-white border-slate-300 text-slate-400'
                                    }`}>
                                    {step > idx + 1 ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                                </div>
                                <span className={`ml-2 text-sm font-medium ${step >= idx + 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                    {label}
                                </span>
                                {idx < 3 && <div className={`w-16 h-0.5 mx-4 ${step > idx + 1 ? 'bg-green-600' : 'bg-slate-300'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Passenger Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Number of Passengers</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="6"
                                                value={passengers}
                                                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Primary Passenger</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Full Name *</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    placeholder="Enter full name"
                                                />
                                            </div>
                                            <div>
                                                <Label>Age *</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.age}
                                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                                    placeholder="Age"
                                                />
                                            </div>
                                            <div>
                                                <Label>Email *</Label>
                                                <Input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                            <div>
                                                <Label>Phone *</Label>
                                                <Input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Gender *</Label>
                                            <RadioGroup value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="male" id="male" />
                                                        <Label htmlFor="male">Male</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="female" id="female" />
                                                        <Label htmlFor="female">Female</Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="other" id="other" />
                                                        <Label htmlFor="other">Other</Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setStep(2)}
                                        className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                                        disabled={!formData.name || !formData.email || !formData.phone || !formData.age}
                                    >
                                        Continue to Review
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {step === 2 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Review Booking</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-slate-600">Passenger Name</span>
                                            <span className="font-semibold">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-slate-600">Email</span>
                                            <span className="font-semibold">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-slate-600">Phone</span>
                                            <span className="font-semibold">{formData.phone}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-slate-600">Number of Passengers</span>
                                            <span className="font-semibold">{passengers}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-orange-600 to-red-600">
                                            Proceed to Payment
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 3 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            💳 This is a demo. No actual payment will be processed.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <Label>Card Number</Label>
                                            <Input placeholder="1234 5678 9012 3456" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Expiry Date</Label>
                                                <Input placeholder="MM/YY" />
                                            </div>
                                            <div>
                                                <Label>CVV</Label>
                                                <Input placeholder="123" type="password" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                            Back
                                        </Button>
                                        <Button onClick={handleBooking} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Pay ₹{totalPrice.toLocaleString()}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {step === 4 && (
                            <Card className="border-green-500">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                                        Your train ticket has been booked successfully
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg mb-6">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">PNR Number</p>
                                        <p className="text-3xl font-bold text-orange-600">{generatePNR()}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={() => window.location.href = '/railway'} className="flex-1">
                                            Book Another Train
                                        </Button>
                                        <Button onClick={() => window.location.href = '/railway/pnr-status'} className="flex-1 bg-gradient-to-r from-orange-600 to-red-600">
                                            Check PNR Status
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                        <Train className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{train.trainName}</p>
                                        <p className="text-sm text-slate-600">#{train.trainNumber}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">From</span>
                                        <span className="font-semibold">{train.depart}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">To</span>
                                        <span className="font-semibold">{train.arrive}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Date</span>
                                        <span className="font-semibold">{date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Class</span>
                                        <span className="font-semibold">{classType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Passengers</span>
                                        <span className="font-semibold">{passengers}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-600">Fare (₹{selectedSeat?.price} × {passengers})</span>
                                        <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span className="text-orange-600">₹{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}
