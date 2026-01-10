"use client"

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Search, Train, MapPin, Clock, Calendar as CalendarIcon, AlertCircle, Navigation } from 'lucide-react';
import { format } from 'date-fns';

export default function LiveTrainStatusPage() {
    const [trainNumber, setTrainNumber] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkLiveStatus = async () => {
        if (!trainNumber) {
            setError('Please enter a train number');
            return;
        }

        setLoading(true);
        setError('');
        setStatus(null);

        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const response = await fetch(
                `/api/trains/live-status?trainNumber=${trainNumber}&date=${formattedDate}`
            );
            const data = await response.json();

            if (response.ok) {
                setStatus(data.data);
            } else {
                setError(data.error || 'Failed to fetch live train status');
            }
        } catch (err) {
            setError('Failed to check live status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            checkLiveStatus();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container px-4 max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-4">
                            <Navigation className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Live Train Status</h1>
                        <p className="text-muted-foreground">
                            Track your train in real-time and get live running status
                        </p>
                    </div>

                    {/* Search Card */}
                    <Card className="mb-8 border-2">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium mb-2 block">
                                        Train Number
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="e.g., 12301"
                                        value={trainNumber}
                                        onChange={(e) => {
                                            setTrainNumber(e.target.value);
                                            setError('');
                                        }}
                                        onKeyPress={handleKeyPress}
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">
                                        Date of Journey
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {format(date, 'PPP')}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(newDate) => newDate && setDate(newDate)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            {error && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-4">
                                    {error}
                                </p>
                            )}
                            <Button
                                onClick={checkLiveStatus}
                                disabled={loading || !trainNumber}
                                className="w-full mt-4 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Tracking...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4 mr-2" />
                                        Track Train
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Live Status Result */}
                    {status && (
                        <Card className="border-2">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl">{status.trainName}</CardTitle>
                                        <p className="text-muted-foreground">Train #{status.trainNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-medium">Live</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {/* Current Location */}
                                <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-600 rounded-full">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Station</p>
                                            <p className="text-2xl font-bold">{status.currentStation}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Expected Arrival</p>
                                                <p className="font-bold">{status.expectedArrival}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Delay</p>
                                                <Badge
                                                    className={
                                                        status.delay === '0 min' || status.delay === 'On Time'
                                                            ? 'bg-green-600'
                                                            : 'bg-red-600'
                                                    }
                                                >
                                                    {status.delay}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Last Updated */}
                                <div className="text-center text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Last updated: {new Date(status.lastUpdated).toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Popular Trains */}
                    <div className="mt-8">
                        <h3 className="font-bold text-lg mb-4">Popular Trains</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { number: '12301', name: 'Rajdhani' },
                                { number: '12002', name: 'Shatabdi' },
                                { number: '12951', name: 'Mumbai Rajdhani' },
                                { number: '12431', name: 'Rajdhani Express' },
                            ].map((train) => (
                                <Button
                                    key={train.number}
                                    variant="outline"
                                    className="h-auto py-3 flex-col items-start"
                                    onClick={() => {
                                        setTrainNumber(train.number);
                                        setError('');
                                    }}
                                >
                                    <span className="font-bold">{train.number}</span>
                                    <span className="text-xs text-muted-foreground">{train.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <Navigation className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Real-Time Tracking</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Get live updates on train location and expected arrival times
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Delay Information</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Check if your train is running late and by how much
                                        </p>
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
