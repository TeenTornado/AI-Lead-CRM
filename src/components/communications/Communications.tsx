import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MessageSquare, Send } from "lucide-react";

const Communications: React.FC = () => {
  // Mock data for recent communications
  const recentComms = [
    {
      id: 1,
      type: "Email",
      subject: "Follow up on proposal",
      contact: "Alice Johnson",
      date: "2024-07-25",
      icon: <Mail className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 2,
      type: "Call",
      subject: "Introductory Call",
      contact: "Bob Williams",
      date: "2024-07-24",
      icon: <Phone className="h-4 w-4 text-green-500" />,
    },
    {
      id: 3,
      type: "SMS",
      subject: "Meeting Reminder",
      contact: "Charlie Brown",
      date: "2024-07-24",
      icon: <MessageSquare className="h-4 w-4 text-purple-500" />,
    },
    {
      id: 4,
      type: "Email",
      subject: "Re: Project Update",
      contact: "Diana Prince",
      date: "2024-07-23",
      icon: <Mail className="h-4 w-4 text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Communications Hub
      </h2>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>
                Send an email, SMS, or log a call.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  SMS
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Log Call
                </Button>
              </div>
              <Input placeholder="Recipient (Email or Phone)" />
              <Input placeholder="Subject (Optional for SMS/Call)" />
              <Textarea placeholder="Your message..." rows={5} />
              <div className="flex justify-end">
                <Button>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbox">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Your recent incoming messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Inbox feature coming soon!
              </p>
              {/* Placeholder for inbox list */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>
                Recent outbound and logged communications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentComms.map((comm) => (
                  <li
                    key={comm.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      {comm.icon}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {comm.subject}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {comm.type} with {comm.contact}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comm.date}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center">
                <Button variant="link" size="sm">
                  View All History
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;
