import React, { useState } from 'react';
import { MessageSquare, Phone, Mail } from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Mock data for demonstration
  const tickets = [
    {
      id: 'T001',
      customer: 'Sarah Smith',
      subject: 'Refund Request',
      status: 'Open',
      priority: 'High',
      time: '2 hours ago',
      messages: [
        { sender: 'customer', message: 'I need to cancel my booking and request a refund.' },
        { sender: 'operator', message: 'I understand. Could you please provide your booking ID?' }
      ]
    },
    {
      id: 'T002',
      customer: 'James Brown',
      subject: 'Seat Change Request',
      status: 'In Progress',
      priority: 'Medium',
      time: '4 hours ago',
      messages: [
        { sender: 'customer', message: 'Can I change my seat to a window seat?' },
        { sender: 'operator', message: 'Let me check the availability for you.' }
      ]
    },
    {
      id: 'T003',
      customer: 'Emily Davis',
      subject: 'Lost Luggage',
      status: 'Open',
      priority: 'High',
      time: '1 day ago',
      messages: [
        { sender: 'customer', message: 'I cannot find my luggage after reaching the destination.' },
        { sender: 'operator', message: 'We will check with the bus staff immediately.' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customer Support</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">Support Tickets</h2>
          </div>
          <div className="divide-y">
            {tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedTicket === ticket.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{ticket.customer}</p>
                    <p className="text-sm text-gray-500">{ticket.subject}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'Open' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className="text-xs text-gray-500">{ticket.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          {selectedTicket ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    {tickets.find(t => t.id === selectedTicket)?.subject}
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                      <Mail className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {tickets.find(t => t.id === selectedTicket)?.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'operator' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === 'operator' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>Select a ticket to view the conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};