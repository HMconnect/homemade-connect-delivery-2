import { useState } from 'react';
import { Shield, Copy, Check, Database, Terminal, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminSetup() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sqlCommands = [
    {
      id: 'add-column',
      title: 'Step 1: Add is_admin column',
      description: 'Run this SQL in your Supabase SQL Editor',
      code: `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;`
    },
    {
      id: 'make-admin',
      title: 'Step 2: Promote a user to admin',
      description: 'Replace YOUR_USER_EMAIL with the actual email',
      code: `UPDATE user_profiles SET is_admin = true WHERE email = 'YOUR_USER_EMAIL';`
    },
    {
      id: 'first-user-trigger',
      title: 'Step 3: Auto-admin for first user (Optional)',
      description: 'Creates a trigger to make the first registered user an admin automatically',
      code: `CREATE OR REPLACE FUNCTION make_first_user_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM user_profiles) = 1 THEN
    NEW.is_admin = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER first_user_admin_trigger
  BEFORE INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION make_first_user_admin();`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Setup Guide</h1>
          <p className="text-lg text-gray-600">Configure administrator access for your cottage food marketplace</p>
        </div>

        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertDescription className="text-gray-700">
            <strong>Important:</strong> Admin access must be configured through your Supabase dashboard for security. Follow the steps below to set up your first administrator.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Setup
              </CardTitle>
              <CardDescription>Run these SQL commands in your Supabase SQL Editor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sqlCommands.map((cmd) => (
                <div key={cmd.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{cmd.title}</h3>
                      <p className="text-sm text-gray-600">{cmd.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(cmd.code, cmd.id)}
                    >
                      {copied === cmd.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{cmd.code}</code>
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Quick Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 list-decimal list-inside text-gray-700">
                <li>
                  <strong>Open Supabase Dashboard</strong>
                  <p className="ml-6 text-sm text-gray-600 mt-1">Go to your project at supabase.com</p>
                </li>
                <li>
                  <strong>Navigate to SQL Editor</strong>
                  <p className="ml-6 text-sm text-gray-600 mt-1">Find it in the left sidebar</p>
                </li>
                <li>
                  <strong>Run Step 1 SQL</strong>
                  <p className="ml-6 text-sm text-gray-600 mt-1">Copy and execute the first SQL command to add the is_admin column</p>
                </li>
                <li>
                  <strong>Run Step 2 SQL</strong>
                  <p className="ml-6 text-sm text-gray-600 mt-1">Replace YOUR_USER_EMAIL with your email and execute to become admin</p>
                </li>
                <li>
                  <strong>(Optional) Run Step 3 SQL</strong>
                  <p className="ml-6 text-sm text-gray-600 mt-1">Set up automatic admin for the first user who registers</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Managing Additional Admins
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">To promote additional users to admin after initial setup:</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Option 1: Via SQL Editor</p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>UPDATE user_profiles SET is_admin = true WHERE email = 'user@example.com';</code>
                </pre>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Option 2: Via Table Editor</p>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside ml-2">
                  <li>Go to Table Editor → user_profiles</li>
                  <li>Find the user you want to promote</li>
                  <li>Check the is_admin checkbox</li>
                  <li>Save changes</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Button onClick={() => window.location.href = '/'} size="lg">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
