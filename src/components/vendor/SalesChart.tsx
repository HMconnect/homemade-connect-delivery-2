import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react';

export const SalesChart: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$2,450', icon: DollarSign, change: '+12.5%', color: 'text-green-600' },
    { label: 'Total Orders', value: '87', icon: ShoppingCart, change: '+8.2%', color: 'text-blue-600' },
    { label: 'Active Products', value: '24', icon: Package, change: '+3', color: 'text-purple-600' },
    { label: 'Avg Order Value', value: '$28.16', icon: TrendingUp, change: '+4.3%', color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Sales chart visualization</p>
              <p className="text-sm">Connect analytics for detailed insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
