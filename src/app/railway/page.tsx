"use client"

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Train, MapPin, Clock, Wifi, Shield, CheckCircle2, Calendar, Search, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function RailwayPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    const popularRoutes = [
        {
            from: "Delhi",
            to: "Mumbai",
            duration: "15h 50m",
            price: "From ₹1,200",
            image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600&auto=format&fit=crop"
        },
        {
            from: "Bangalore",
            to: "Chennai",
            duration: "5h 30m",
            price: "From ₹450",
            image: "https://images.unsplash.com/photo-1582972236019-6c1db6c3d3dd?q=80&w=600&auto=format&fit=crop"
        },
        {
            from: "Kolkata",
            to: "Delhi",
            duration: "17h 20m",
            price: "From ₹1,500",
            image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop"
        },
        {
            from: "Mumbai",
            to: "Goa",
            duration: "11h 45m",
            price: "From ₹800",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop"
        }
    ];

    const features = [
        { icon: Shield, title: "IRCTC Authorised Partner", desc: "Book with confidence on India's trusted platform" },
        { icon: CheckCircle2, title: "Check PNR Status", desc: "Track your booking status in real-time" },
        { icon: Train, title: "Live Train Status", desc: "Get live updates on train running status" },
        { icon: Wifi, title: "Free Cancellation", desc: "Instant full fare refund on select bookings" },
    ];

    const handleSearch = () => {
        if (from && to && date) {
            window.location.href = `/railway/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background font-sans">
            <Header />
            <main className="flex-1">

                {/* Hero Section - Matching IRCTC Design */}
                <section className="relative h-[95vh] flex items-center justify-center pt-20 overflow-hidden">
                    {/* Background with gradient overlay */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-red-50 to-yellow-50 dark:from-orange-950 dark:via-red-950 dark:to-yellow-950" />
                        <div className="absolute inset-0 opacity-20">
                            <Image
                                src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1920&auto=format&fit=crop"
                                alt="Train"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Decorative wave pattern */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
                    </div>

                    <div className="container relative z-10 px-4">
                        {/* IRCTC Badge */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-lg border-2 border-orange-200 dark:border-orange-800">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <Train className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-bold text-lg text-slate-800 dark:text-white">IRCTC Authorised Partner</span>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                                Train Ticket Booking
                            </h1>
                            <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-300 dark:border-yellow-700">
                                Holi bookings open - avoid waitlists!
                            </div>
                        </div>

                        {/* Search Form - IRCTC Style */}
                        <div className="max-w-4xl mx-auto">
                            <Card className="border-2 border-orange-200 dark:border-orange-800 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        {/* From */}
                                        <div className="relative">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">From</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                                                <Input
                                                    placeholder="Enter source station"
                                                    value={from}
                                                    onChange={(e) => setFrom(e.target.value)}
                                                    className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>

                                        {/* To */}
                                        <div className="relative">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">To</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                                                <Input
                                                    placeholder="Enter destination station"
                                                    value={to}
                                                    onChange={(e) => setTo(e.target.value)}
                                                    className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="relative">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Date of Journey</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                                                <Input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="pl-10 h-12 border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Search Button */}
                                        <div className="flex items-end">
                                            <Button
                                                onClick={handleSearch}
                                                className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-base shadow-lg"
                                            >
                                                <Search className="w-5 h-5 mr-2" />
                                                Search Trains
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => window.location.href = '/railway/pnr-status'}
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Check PNR status
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => window.location.href = '/railway/live-status'}
                                        >
                                            <Train className="w-4 h-4 mr-1" />
                                            Live train status
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-xs">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            Rail Madad
                                        </Button>
                                        <div className="ml-auto flex items-center gap-2">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" className="rounded" />
                                                <span className="text-slate-600 dark:text-slate-400">Free Cancellation</span>
                                            </label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Popular Routes */}
                <section className="py-16 container px-4 bg-muted/20">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Top Rated Train Routes</h2>
                            <p className="text-muted-foreground">Popular destinations for your next journey</p>
                        </div>
                        <Button variant="outline">View All</Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularRoutes.map((route, idx) => (
                            <Card key={idx} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer">
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={route.image}
                                        alt={`${route.from} to ${route.to}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                                    <div className="absolute bottom-3 left-4 right-4 text-white flex justify-between items-end">
                                        <div>
                                            <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Route</p>
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                {route.from} <ArrowRight className="w-4 h-4 opacity-70" /> {route.to}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4 bg-card">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                            <Clock className="w-4 h-4" />
                                            <span>{route.duration}</span>
                                        </div>
                                        <div className="font-bold text-lg text-primary">{route.price}</div>
                                    </div>
                                    <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white group-hover:shadow-lg transition-all">
                                        Book Ticket
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 container px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Why Book Train Tickets With Us?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-6 border rounded-2xl hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-300">
                                <div className="p-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 text-orange-600 dark:text-orange-400 mb-4">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Promotional Banner - Discover Bharat Sale */}
                <section className="py-12 container px-4 mb-8">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl">
                        <div className="relative z-10 max-w-xl">
                            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                <Image
                                    src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=100&h=100&fit=crop"
                                    alt="Discover Bharat"
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                />
                                Special Offer
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Discover Bharat Sale</h2>
                            <p className="text-lg opacity-90 mb-8">
                                Save up to 25% on train bookings. Use code <span className="font-mono font-bold bg-white text-orange-600 px-2 py-1 rounded">BHARAT25</span>
                            </p>
                            <Button size="lg" variant="secondary" className="font-bold bg-white text-orange-600 hover:bg-orange-50">
                                Claim Offer Now
                            </Button>
                        </div>
                        <div className="relative z-10 mt-8 md:mt-0">
                            <div className="relative w-48 h-48">
                                <Image
                                    src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=400&fit=crop"
                                    alt="Indian Railway"
                                    fill
                                    className="object-cover rounded-full border-8 border-white/20 shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Abstract Patterns */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
