"use client"

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, Clock, Calendar, ArrowRight, Wifi, Coffee, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Train as TrainType } from '@/lib/types';

export default function RailwaySearchPage() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';

    const [trains, setTrains] = useState<TrainType[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
    const [dataSource, setDataSource] = useState<'api' | 'firestore'>('firestore');

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await fetch(`/api/trains/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
                if (response.ok) {
                    const result = await response.json();
                    // Handle both old and new response formats
                    const trainData = result.data || result;
                    setTrains(Array.isArray(trainData) ? trainData : []);
                    setDataSource(result.source || 'firestore');
                }
            } catch (error) {
                console.error('Error fetching trains:', error);
            } finally {
                setLoading(false);
            }
        };

        if (from && to) {
            fetchTrains();
        } else {
            setLoading(false);
        }
    }, [from, to, date]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getClassBadgeColor = (className: string) => {
        const colors: Record<string, string> = {
            '1A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            '2A': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            '3A': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'SL': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            '2S': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[className] || 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    };

    const getStatusColor = (status: string) => {
        if (status === 'available') return 'text-green-600 dark:text-green-400';
        if (status === 'limited') return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container px-4">
                    {/* Search Summary */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-3xl font-bold">
                                {from} <ArrowRight className="inline w-6 h-6 mx-2" /> {to}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{date ? formatDate(date) : 'Select Date'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Train className="w-4 h-4" />
                                <span>{trains.length} trains found</span>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            <p className="mt-4 text-muted-foreground">Searching for trains...</p>
                        </div>
                    )}

                    {/* No Results */}
                    {!loading && trains.length === 0 && (
                        <Card className="p-12 text-center">
                            <Train className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h2 className="text-2xl font-bold mb-2">No trains found</h2>
                            <p className="text-muted-foreground mb-6">
                                Try searching for a different route or date
                            </p>
                            <Button onClick={() => window.history.back()}>
                                Go Back to Search
                            </Button>
                        </Card>
                    )}

                    {/* Train Results */}
                    <div className="space-y-4">
                        {trains.map((train) => (
                            <Card key={train.id} className="overflow-hidden border-2 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
                                <CardContent className="p-0">
                                    {/* Main Train Info */}
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            {/* Train Details */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg">
                                                        <Train className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{train.trainName}</h3>
                                                        <p className="text-sm text-muted-foreground">#{train.trainNumber}</p>
                                                    </div>
                                                </div>

                                                {/* Timing */}
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-2xl font-bold">{train.departTime}</p>
                                                        <p className="text-sm text-muted-foreground">{train.depart}</p>
                                                    </div>
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                                                        <div className="text-center">
                                                            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                                                            <p className="text-xs text-muted-foreground">{train.duration}</p>
                                                        </div>
                                                        <div className="flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold">{train.arriveTime}</p>
                                                        <p className="text-sm text-muted-foreground">{train.arrive}</p>
                                                    </div>
                                                </div>

                                                {/* Running Days */}
                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">Runs on:</span>
                                                    <div className="flex gap-1">
                                                        {train.runningDays?.map((day, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs px-2 py-0">
                                                                {day}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Classes & Booking */}
                                            <div className="md:w-80 border-l-0 md:border-l pl-0 md:pl-6">
                                                <div className="space-y-2">
                                                    {train.seats?.slice(0, 3).map((seat, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                                                            <div className="flex items-center gap-2">
                                                                <Badge className={getClassBadgeColor(seat.class)}>
                                                                    {seat.class}
                                                                </Badge>
                                                                <span className={`text-sm font-semibold ${getStatusColor(seat.status)}`}>
                                                                    {seat.status === 'available' ? `${seat.available} Available` :
                                                                        seat.status === 'limited' ? 'Limited' : 'Waitlist'}
                                                                </span>
                                                            </div>
                                                            <span className="font-bold text-lg">₹{seat.price}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <Button
                                                    className="w-full mt-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold"
                                                    onClick={() => setExpandedTrain(expandedTrain === train.id ? null : train.id)}
                                                >
                                                    {expandedTrain === train.id ? (
                                                        <>View Less <ChevronUp className="ml-2 w-4 h-4" /></>
                                                    ) : (
                                                        <>View All Classes <ChevronDown className="ml-2 w-4 h-4" /></>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedTrain === train.id && (
                                        <div className="border-t bg-slate-50 dark:bg-slate-900/50 p-6">
                                            <h4 className="font-semibold mb-4">All Available Classes</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {train.seats?.map((seat, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border">
                                                        <div className="flex items-center gap-3">
                                                            <Badge className={getClassBadgeColor(seat.class)}>
                                                                {seat.class}
                                                            </Badge>
                                                            <div>
                                                                <p className="font-semibold">₹{seat.price}</p>
                                                                <p className={`text-sm ${getStatusColor(seat.status)}`}>
                                                                    {seat.status === 'available' ? `${seat.available} seats` :
                                                                        seat.status === 'limited' ? 'Limited availability' : 'Waitlist only'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            disabled={seat.status === 'waitlist'}
                                                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                                                        >
                                                            Book Now
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Amenities */}
                                            {train.amenities && train.amenities.length > 0 && (
                                                <div className="mt-6">
                                                    <h4 className="font-semibold mb-3">Amenities</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {train.amenities.map((amenity, idx) => (
                                                            <Badge key={idx} variant="outline" className="flex items-center gap-1">
                                                                {amenity === 'WiFi' && <Wifi className="w-3 h-3" />}
                                                                {amenity === 'Pantry' && <Coffee className="w-3 h-3" />}
                                                                {amenity === 'Security' && <Shield className="w-3 h-3" />}
                                                                {amenity}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
