import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send } from 'lucide-react';

interface SendCustomSMSProps {
  orderId: string;
  customerPhone?: string;
  customerName?: string;
}

export const SendCustomSMS: React.FC<SendCustomSMSProps> = ({ orderId, customerPhone, customerName }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendSMS = async () => {
    if (!customerPhone) {
      toast({ title: 'Error', description: 'Customer phone number not available', variant: 'destructive' });
      return;
    }

    if (!message.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-order-sms', {
        body: { phoneNumber: customerPhone, message, orderId, customMessage: true }
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'SMS sent successfully!' });
      setMessage('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to send SMS', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  if (!customerPhone) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 text-center">Customer has not enabled SMS notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Send Custom SMS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-600">To: {customerName || customerPhone}</Label>
        </div>
        <div>
          <Label htmlFor="smsMessage">Message</Label>
          <Textarea
            id="smsMessage"
            placeholder="Enter your custom message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={160}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/160 characters</p>
        </div>
        <Button onClick={handleSendSMS} disabled={sending || !message.trim()} className="w-full">
          <Send className="w-4 h-4 mr-2" />
          {sending ? 'Sending...' : 'Send SMS'}
        </Button>
      </CardContent>
    </Card>
  );
};