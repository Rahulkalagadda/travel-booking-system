"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Train, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function SeedTrainsPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSeed = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/admin/seed-trains');
            const data = await response.json();
            setResult(data);
        } catch (error: any) {
            setResult({
                success: false,
                message: 'Failed to connect to seeding endpoint',
                error: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-950 dark:to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-lg border-2 border-orange-200 dark:border-orange-800 mb-4">
                        <Train className="w-8 h-8 text-orange-600" />
                        <h1 className="text-2xl font-bold">Railway Database Seeder</h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Automatically populate the Firestore trains collection
                    </p>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Seed Trains Collection</CardTitle>
                        <CardDescription>
                            This will add 6 sample trains to your Firestore database. If trains already exist, seeding will be skipped.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Trains to be added:</h3>
                                <ul className="space-y-1 text-sm">
                                    <li>• 12301 - Rajdhani Express (Delhi → Mumbai)</li>
                                    <li>• 12430 - Shatabdi Express (Delhi → Lucknow)</li>
                                    <li>• 12626 - Karnataka Express (Delhi → Bangalore)</li>
                                    <li>• 12860 - Gitanjali Express (Mumbai → Howrah)</li>
                                    <li>• 12951 - Mumbai Rajdhani (Mumbai → Delhi)</li>
                                    <li>• 12723 - Telangana Express (Hyderabad → Delhi)</li>
                                </ul>
                            </div>

                            <Button
                                onClick={handleSeed}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-lg py-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Seeding Database...
                                    </>
                                ) : (
                                    <>
                                        <Train className="w-5 h-5 mr-2" />
                                        Seed Trains Collection
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {result && (
                    <Card className={result.success ? 'border-green-500' : 'border-red-500'}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {result.success ? (
                                    <>
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        Success!
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-6 h-6 text-red-600" />
                                        Failed
                                    </>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <p className="text-lg font-semibold">{result.message}</p>

                                {result.action === 'seeded' && (
                                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                                        <p className="text-green-800 dark:text-green-200">
                                            ✅ Successfully added {result.count} trains to Firestore!
                                        </p>
                                    </div>
                                )}

                                {result.action === 'skipped' && (
                                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                                        <p className="text-blue-800 dark:text-blue-200">
                                            ℹ️ Database already contains {result.count} trains. No action needed.
                                        </p>
                                    </div>
                                )}

                                {result.details && result.details.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-semibold mb-2">Details:</h4>
                                        <div className="space-y-1 text-sm">
                                            {result.details.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    {item.status === 'success' ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                    <span>{item.name} ({item.id})</span>
                                                    {item.error && (
                                                        <span className="text-red-600 text-xs">- {item.error}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.error && (
                                    <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg mt-4">
                                        <p className="text-red-800 dark:text-red-200 font-mono text-sm">
                                            {result.error}
                                        </p>
                                    </div>
                                )}

                                {result.success && (
                                    <div className="mt-6 pt-4 border-t">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            Next steps:
                                        </p>
                                        <div className="space-y-2">
                                            <Button
                                                onClick={() => window.location.href = '/railway'}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Go to Railway Page
                                            </Button>
                                            <Button
                                                onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                View in Firebase Console
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
