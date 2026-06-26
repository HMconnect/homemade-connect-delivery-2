# Twilio SMS Setup Instructions

## 1. Add Database Columns

Run this SQL in Supabase SQL Editor:

```sql
-- Add SMS fields to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT true;

-- Create SMS logs table
CREATE TABLE IF NOT EXISTS sms_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  twilio_sid TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all SMS" ON sms_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin')
);

CREATE POLICY "Users view own SMS" ON sms_logs FOR SELECT USING (user_id = auth.uid());
```

## 2. Create Edge Function

Create `supabase/functions/send-order-sms/index.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { phoneNumber, message, orderId, userId } = await req.json();
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

  const twilioUrl = \`https://api.twilio.com/2010-04-01/Accounts/\${accountSid}/Messages.json\`;
  const formData = new URLSearchParams({ To: phoneNumber, From: twilioPhone, Body: message });

  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: { 'Authorization': \`Basic \${btoa(\`\${accountSid}:\${authToken}\`)}\`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  });

  const data = await response.json();
  return new Response(JSON.stringify({ success: true, sid: data.sid }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
```

## 3. Add Twilio Secrets

In Supabase Dashboard > Edge Functions > Secrets:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN  
- TWILIO_PHONE_NUMBER

## 4. Deploy Function

```bash
supabase functions deploy send-order-sms
```
