import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast.tsx';

export interface Bus {
  id: string;
  number: string;
  name: string;
  route?: string;
  seats: number;
  status: 'on-time' | 'delayed' | 'cancelled';
  driver?: {
    name: string;
    phone?: string;
  };
  departureTime?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone?: string;
}

// Cache for driver profiles
const driverCache = new Map<string, DriverProfile>();
// Cache for bus data
const busCache = new Map<string, Bus[]>();
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const fetchBuses = useCallback(async (force = false) => {
    // Check if we should use cached data
    const now = Date.now();
    if (!force && now - lastFetchTime < CACHE_DURATION) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Check cache first
      const cachedBuses = busCache.get('all');
      if (cachedBuses && !force) {
        setBuses(cachedBuses);
        setLastFetched(new Date());
        setIsLoading(false);
        return;
      }
      
      // Fetch buses with pagination
      const { data: busesData, error: busesError } = await supabase
        .from('buses')
        .select(`
          id,
          name,
          bus_number,
          capacity,
          route,
          status,
          assigned_driver
        `)
        .limit(10)
        .order('name', { ascending: true });
      
      if (busesError) throw busesError;
      
      if (!busesData || busesData.length === 0) {
        setBuses([]);
        setLastFetched(new Date());
        return;
      }
      
      // Get unique driver IDs that aren't in cache
      const driverIds = busesData
        .filter(bus => bus.assigned_driver)
        .map(bus => bus.assigned_driver)
        .filter((id): id is string => id !== null && !driverCache.has(id));
        
      // Only fetch drivers that aren't cached
      if (driverIds.length > 0) {
        const { data: drivers, error: driversError } = await supabase
          .from('profiles')
          .select('id, name, phone')
          .in('id', driverIds);
          
        if (driversError) throw driversError;
        
        if (drivers) {
          // Update cache with new driver data
          drivers.forEach(driver => {
            driverCache.set(driver.id, driver);
          });
        }
      }
      
      // Format the bus data using cached driver profiles
      const formattedBuses: Bus[] = busesData.map(bus => {
        const driver = bus.assigned_driver ? driverCache.get(bus.assigned_driver) : undefined;
        
        return {
          id: bus.id,
          number: bus.bus_number,
          name: bus.name,
          route: bus.route,
          seats: bus.capacity,
          status: bus.status === 'active' ? 'on-time' : 'delayed',
          driver: driver ? {
            name: driver.name,
            phone: driver.phone
          } : undefined,
          departureTime: '4:30 PM'
        };
      });
      
      if (isMounted.current) {
        // Update cache
        busCache.set('all', formattedBuses);
        lastFetchTime = now;
        setBuses(formattedBuses);
        setLastFetched(new Date());
      }
    } catch (err) {
      const errorInstance = err instanceof Error ? err : new Error('An unknown error occurred fetching buses');
      console.error('Error fetching buses:', err);
      if (isMounted.current) {
        setError(errorInstance);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchBuses(true); // Initial fetch
    
    // Set up polling with a longer interval
    const intervalId = setInterval(() => {
      fetchBuses(false);
    }, 30000); // Poll every 30 seconds
    
    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [fetchBuses]);

  return { 
    buses, 
    isLoading, 
    error, 
    refetch: () => fetchBuses(true), 
    lastFetched 
  };
}
