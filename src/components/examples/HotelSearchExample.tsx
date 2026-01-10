'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setHotels, updateSearchFilters, setLoading } from '@/store/slices/hotelSlice';
import { addToast } from '@/store/slices/uiSlice';

/**
 * Example Component: Hotel Search with Redux State Management
 * This demonstrates how to use Redux for state management
 */

export default function HotelSearchExample() {
    const dispatch = useAppDispatch();

    // Select state from Redux store
    const hotels = useAppSelector((state) => state.hotel.hotels);
    const searchFilters = useAppSelector((state) => state.hotel.searchFilters);
    const loading = useAppSelector((state) => state.hotel.loading);

    const handleSearch = async () => {
        try {
            dispatch(setLoading(true));

            // Call API with Redis caching
            const response = await fetch('/api/hotels/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchFilters),
            });

            const result = await response.json();

            // Update Redux store with results
            dispatch(setHotels(result.data));

            // Show toast notification
            dispatch(addToast({
                message: result.cached
                    ? '✅ Results loaded from cache (instant!)'
                    : '🔍 Fresh results from API',
                type: result.cached ? 'success' : 'info',
            }));

        } catch (error) {
            dispatch(addToast({
                message: 'Failed to search hotels',
                type: 'error',
            }));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleFilterChange = (key: string, value: any) => {
        dispatch(updateSearchFilters({ [key]: value }));
    };

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Hotel Search (Redux + Redis Example)</h2>

            {/* Search Filters */}
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Location"
                    value={searchFilters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="date"
                        value={searchFilters.checkIn}
                        onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                        className="p-2 border rounded"
                    />
                    <input
                        type="date"
                        value={searchFilters.checkOut}
                        onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Guests"
                        value={searchFilters.guests}
                        onChange={(e) => handleFilterChange('guests', parseInt(e.target.value))}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Rooms"
                        value={searchFilters.rooms}
                        onChange={(e) => handleFilterChange('rooms', parseInt(e.target.value))}
                        className="p-2 border rounded"
                    />
                </div>

                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search Hotels'}
                </button>
            </div>

            {/* Results */}
            <div className="space-y-3">
                <h3 className="font-semibold">Results ({hotels.length})</h3>
                {hotels.map((hotel) => (
                    <div key={hotel.id} className="p-4 border rounded shadow-sm">
                        <h4 className="font-bold">{hotel.name}</h4>
                        <p className="text-sm text-gray-600">{hotel.location}</p>
                        <p className="text-lg font-semibold mt-2">${hotel.price}/night</p>
                        <div className="flex gap-2 mt-2">
                            {hotel.amenities?.map((amenity) => (
                                <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
