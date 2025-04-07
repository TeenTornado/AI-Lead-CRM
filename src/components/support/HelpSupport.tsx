import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LifeBuoy, MessageCircle, Search } from "lucide-react";

const HelpSupport: React.FC = () => {
  // Mock FAQ data
  const faqs = [
    {
      id: "faq1",
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your email.",
    },
    {
      id: "faq2",
      question: "How do I import my existing leads?",
      answer:
        "Navigate to the 'Data Import/Export' section. Choose 'Import Leads', select your file format (CSV, Excel), map the columns, and start the import.",
    },
    {
      id: "faq3",
      question: "Can I integrate my email account?",
      answer:
        "Yes, go to 'Settings' > 'Integrations' and select your email provider (e.g., Gmail, Outlook). Follow the authentication process to connect your account.",
    },
    {
      id: "faq4",
      question: "How is my data secured?",
      answer:
        "We use industry-standard encryption for data at rest and in transit. Regular security audits and compliance checks are performed to ensure data protection.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Help & Support
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          How can we help you today?
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Input
          type="search"
          placeholder="Search help articles..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-gray-300"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQ Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Can't find what you need? Reach out to us.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <MessageCircle className="mr-2 h-5 w-5 text-blue-500" />
              Start Live Chat
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <LifeBuoy className="mr-2 h-5 w-5 text-green-500" />
              Submit a Support Ticket
            </Button>
            <div className="text-sm text-gray-600 dark:text-gray-400 pt-4">
              <p className="font-semibold">Support Hours:</p>
              <p>Monday - Friday, 9:00 AM - 6:00 PM (EST)</p>
              <p>Response times may vary based on ticket volume.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport;
