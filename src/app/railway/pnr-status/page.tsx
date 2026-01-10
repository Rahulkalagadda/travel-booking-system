"use client"

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Train, Calendar, MapPin, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PNRStatusPage() {
    const [pnr, setPnr] = useState('');
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkPNRStatus = async () => {
        if (!pnr || pnr.length !== 10) {
            setError('Please enter a valid 10-digit PNR number');
            return;
        }

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            const response = await fetch(`/api/trains/pnr-status?pnr=${pnr}`);
            const data = await response.json();

            if (response.ok) {
                setStatus(data.data);
            } else {
                setError(data.error || 'Failed to fetch PNR status');
            }
        } catch (err) {
            setError('Failed to check PNR status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            checkPNRStatus();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container px-4 max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 mb-4">
                            <Search className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Check PNR Status</h1>
                        <p className="text-muted-foreground">
                            Enter your 10-digit PNR number to check your ticket status
                        </p>
                    </div>

                    {/* Search Card */}
                    <Card className="mb-8 border-2">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Enter 10-digit PNR number"
                                        value={pnr}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setPnr(value);
                                            setError('');
                                        }}
                                        onKeyPress={handleKeyPress}
                                        className="h-12 text-lg"
                                        maxLength={10}
                                    />
                                    {error && (
                                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                            {error}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    onClick={checkPNRStatus}
                                    disabled={loading || pnr.length !== 10}
                                    className="h-12 px-8 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Checking...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4 mr-2" />
                                            Check Status
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* PNR Status Result */}
                    {status && (
                        <Card className="border-2">
                            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-2xl">PNR: {status.pnr}</CardTitle>
                                    <Badge className={status.chartPrepared ? 'bg-green-600' : 'bg-orange-600'}>
                                        {status.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Train Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                            <Train className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Train</p>
                                            <p className="font-bold">{status.trainName}</p>
                                            <p className="text-sm text-muted-foreground">#{status.trainNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Date of Journey</p>
                                            <p className="font-bold">{status.dateOfJourney}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">From</p>
                                            <p className="font-bold">{status.from}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                            <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">To</p>
                                            <p className="font-bold">{status.to}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Passenger Details */}
                                <div className="border-t pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Users className="w-5 h-5 text-muted-foreground" />
                                        <h3 className="font-bold text-lg">Passenger Details</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {status.passengers?.map((passenger: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900">
                                                        <span className="font-bold text-orange-600 dark:text-orange-400">
                                                            {passenger.number}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">Passenger {passenger.number}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Booking Status: {passenger.bookingStatus}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge
                                                        className={
                                                            passenger.currentStatus.includes('CNF')
                                                                ? 'bg-green-600'
                                                                : passenger.currentStatus.includes('RAC')
                                                                    ? 'bg-orange-600'
                                                                    : 'bg-red-600'
                                                        }
                                                    >
                                                        {passenger.currentStatus}
                                                    </Badge>
                                                    {passenger.coach && passenger.berth && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {passenger.coach} / {passenger.berth}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Info Section */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                <h4 className="font-semibold mb-1">Confirmed (CNF)</h4>
                                <p className="text-sm text-muted-foreground">
                                    Your ticket is confirmed with seat/berth number
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                                <h4 className="font-semibold mb-1">RAC</h4>
                                <p className="text-sm text-muted-foreground">
                                    Reservation Against Cancellation - Shared berth
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
                                <h4 className="font-semibold mb-1">Waitlist (WL)</h4>
                                <p className="text-sm text-muted-foreground">
                                    Ticket on waitlist - May get confirmed
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
