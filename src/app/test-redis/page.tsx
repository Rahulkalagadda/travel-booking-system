'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2, Database, Zap } from 'lucide-react';

/**
 * Redis Integration Test Page
 * Visit: http://localhost:3000/test-redis
 */
export default function TestRedisPage() {
    const [testResults, setTestResults] = useState<{
        status: 'idle' | 'testing' | 'success' | 'error';
        message: string;
        details: any;
    }>({
        status: 'idle',
        message: '',
        details: null,
    });

    const [cacheTest, setCacheTest] = useState<{
        firstCall: number | null;
        secondCall: number | null;
        improvement: string;
    }>({
        firstCall: null,
        secondCall: null,
        improvement: '',
    });

    // Test 1: Basic Redis Connection
    const testRedisConnection = async () => {
        setTestResults({ status: 'testing', message: 'Testing Redis connection...', details: null });

        try {
            const testKey = `test:${Date.now()}`;
            const testValue = { message: 'Hello Redis!', timestamp: new Date().toISOString() };

            // Set value
            const setResponse = await fetch('/api/cache', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: testKey,
                    value: testValue,
                    ttl: 60, // 1 minute
                }),
            });

            if (!setResponse.ok) {
                throw new Error('Failed to set cache');
            }

            // Get value
            const getResponse = await fetch(`/api/cache?key=${testKey}`);
            const getData = await getResponse.json();

            if (getData.data) {
                setTestResults({
                    status: 'success',
                    message: '✅ Redis is working perfectly!',
                    details: {
                        stored: testValue,
                        retrieved: getData.data,
                        cached: getData.cached,
                    },
                });
            } else {
                throw new Error('Failed to retrieve cached data');
            }
        } catch (error: any) {
            setTestResults({
                status: 'error',
                message: '❌ Redis connection failed',
                details: { error: error.message },
            });
        }
    };

    // Test 2: Cache Performance Test
    const testCachePerformance = async () => {
        setCacheTest({ firstCall: null, secondCall: null, improvement: '' });
        setTestResults({ status: 'testing', message: 'Testing cache performance...', details: null });

        try {
            // First call (cache miss)
            const start1 = performance.now();
            const response1 = await fetch('/api/flights?origin=DEL&destination=BOM&date=2026-02-01');
            const end1 = performance.now();
            const time1 = Math.round(end1 - start1);

            await response1.json();

            // Wait a bit
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Second call (cache hit)
            const start2 = performance.now();
            const response2 = await fetch('/api/flights?origin=DEL&destination=BOM&date=2026-02-01');
            const end2 = performance.now();
            const time2 = Math.round(end2 - start2);

            await response2.json();

            const improvement = time1 > 0 ? ((time1 - time2) / time1 * 100).toFixed(1) : '0';

            setCacheTest({
                firstCall: time1,
                secondCall: time2,
                improvement: `${improvement}% faster`,
            });

            setTestResults({
                status: 'success',
                message: '✅ Cache performance test complete!',
                details: {
                    firstCall: `${time1}ms (cache miss)`,
                    secondCall: `${time2}ms (cache hit)`,
                    speedup: `${(time1 / time2).toFixed(1)}x faster`,
                },
            });
        } catch (error: any) {
            setTestResults({
                status: 'error',
                message: '❌ Performance test failed',
                details: { error: error.message },
            });
        }
    };

    // Test 3: Check Console Logs
    const testConsoleLogs = () => {
        setTestResults({
            status: 'success',
            message: '📋 Check your browser console and terminal',
            details: {
                instruction: 'Look for these messages:',
                cacheHit: '✅ Cache HIT - Returning cached flight results',
                cacheMiss: '❌ Cache MISS - Fetching from Amadeus API',
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Redis Integration Test
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Verify that Redis caching is working correctly
                    </p>
                </div>

                {/* Test Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Test 1: Basic Connection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5" />
                                Test 1: Redis Connection
                            </CardTitle>
                            <CardDescription>
                                Test basic Redis read/write operations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={testRedisConnection} className="w-full">
                                Run Connection Test
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Test 2: Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Test 2: Cache Performance
                            </CardTitle>
                            <CardDescription>
                                Compare cached vs uncached response times
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={testCachePerformance} className="w-full">
                                Run Performance Test
                            </Button>
                            {cacheTest.firstCall && (
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>First call:</span>
                                        <span className="font-mono">{cacheTest.firstCall}ms</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Second call:</span>
                                        <span className="font-mono">{cacheTest.secondCall}ms</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-green-600">
                                        <span>Improvement:</span>
                                        <span>{cacheTest.improvement}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Test 3: Console Logs */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📋 Test 3: Console Logs
                            </CardTitle>
                            <CardDescription>
                                Check browser console and terminal for cache logs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={testConsoleLogs} variant="outline" className="w-full">
                                Show Instructions
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Display */}
                {testResults.status !== 'idle' && (
                    <Card className={`border-2 ${testResults.status === 'success' ? 'border-green-500' :
                            testResults.status === 'error' ? 'border-red-500' :
                                'border-blue-500'
                        }`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {testResults.status === 'testing' && <Loader2 className="w-5 h-5 animate-spin" />}
                                {testResults.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                {testResults.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                                Test Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold mb-4">{testResults.message}</p>
                            {testResults.details && (
                                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                                    {JSON.stringify(testResults.details, null, 2)}
                                </pre>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Manual Verification Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle>📝 Manual Verification Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Check .env.local</p>
                                <p className="text-sm text-gray-600">
                                    Ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Check Terminal Logs</p>
                                <p className="text-sm text-gray-600">
                                    Look for "✅ Cache HIT" or "❌ Cache MISS" messages
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Test Flight Search</p>
                                <p className="text-sm text-gray-600">
                                    Search twice with same parameters - second should be instant
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-semibold">Check Upstash Dashboard</p>
                                <p className="text-sm text-gray-600">
                                    Visit upstash.com to see cached keys and statistics
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>🔗 Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a
                            href="https://upstash.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
                        >
                            <p className="font-semibold">Upstash Dashboard</p>
                            <p className="text-sm text-gray-600">View your Redis database and statistics</p>
                        </a>
                        <a
                            href="/flights/results?origin=DEL&destination=BOM&date=2026-02-01"
                            className="block p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                        >
                            <p className="font-semibold">Test Flight Search</p>
                            <p className="text-sm text-gray-600">Search twice to see cache in action</p>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
