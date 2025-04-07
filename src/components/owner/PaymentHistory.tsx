import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PaymentData {
  date: string;
  amount: number;
}

const paymentData: PaymentData[] = [
  { date: 'Jan', amount: 4500 },
  { date: 'Feb', amount: 5200 },
  { date: 'Mar', amount: 6100 },
  { date: 'Apr', amount: 5800 },
  { date: 'May', amount: 7200 },
  { date: 'Jun', amount: 8100 },
  { date: 'Jul', amount: 7900 },
];

export function PaymentHistory() {
  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value:any) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
              formatter={(value:any) => [`$${value}`, 'Amount']}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}