import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { MessageSquare, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SMSLog {
  id: string;
  phone_number: string;
  message: string;
  status: string;
  twilio_sid: string;
  error_message?: string;
  sent_at: string;
  delivered_at?: string;
  order_id: string;
}

export const SMSLogsTable: React.FC = () => {
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSMSLogs();
    const subscription = supabase
      .channel('sms_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sms_logs' }, () => {
        fetchSMSLogs();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSMSLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('sms_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching SMS logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
      sent: { color: 'bg-blue-500', icon: Clock, label: 'Sent' },
      failed: { color: 'bg-red-500', icon: XCircle, label: 'Failed' },
      pending: { color: 'bg-yellow-500', icon: AlertCircle, label: 'Pending' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading SMS logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          SMS Delivery Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Message</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Sent At</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{log.phone_number}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{log.message}</td>
                  <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3">{format(new Date(log.sent_at), 'MMM d, h:mm a')}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No SMS logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};