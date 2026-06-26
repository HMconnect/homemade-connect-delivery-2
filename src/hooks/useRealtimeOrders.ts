import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface RealtimeOrder {
  id: string;
  customer_id: string;
  vendor_id: string;
  status: string;
  total_amount: number;
  items: any[];
  delivery_address: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  vendor_name?: string;
}

export const useRealtimeOrders = (userId?: string, role?: string) => {
  const [orders, setOrders] = useState<RealtimeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      let query = supabase.from('orders').select('*');
      
      if (role === 'vendor') {
        query = query.eq('vendor_id', userId);
      } else {
        query = query.eq('customer_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: role === 'vendor' ? `vendor_id=eq.${userId}` : `customer_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as RealtimeOrder, ...prev]);
            toast({
              title: role === 'vendor' ? 'New Order!' : 'Order Placed',
              description: `Order #${(payload.new as any).id.slice(-8)} received`
            });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new as RealtimeOrder : o));
            toast({
              title: 'Order Updated',
              description: `Status: ${(payload.new as any).status}`
            });
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role]);

  return { orders, loading, setOrders };
};
