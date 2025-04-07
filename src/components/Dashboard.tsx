import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Settings,
  UserPlus,
  PhoneCall,
  Mail,
  Building
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', leads: 4000, conversions: 2400 },
  { name: 'Feb', leads: 3000, conversions: 1398 },
  { name: 'Mar', leads: 2000, conversions: 9800 },
  { name: 'Apr', leads: 2780, conversions: 3908 },
  { name: 'May', leads: 1890, conversions: 4800 },
  { name: 'Jun', leads: 2390, conversions: 3800 },
];

const stats = [
  {
    name: 'Total Leads',
    value: '2,345',
    change: '+12.3%',
    icon: Users,
  },
  {
    name: 'Conversion Rate',
    value: '24.5%',
    change: '+4.1%',
    icon: BarChart3,
  },
  {
    name: 'Meetings Scheduled',
    value: '145',
    change: '+8.2%',
    icon: Calendar,
  },
  {
    name: 'Active Campaigns',
    value: '12',
    change: '+2',
    icon: Settings,
  },
];

const recentLeads = [
  {
    id: 1,
    name: 'Onim Digitals',
    contact: 'Shyamniyog',
    email: 'onimdigitals@gmail.com',
    status: 'New',
    type: 'Enterprise',
    icon: Building,
  },
  {
    id: 2,
    name: 'Tech Startups Inc',
    contact: 'Sarah Johnson',
    email: 'sarah@techstartups.com',
    status: 'In Progress',
    type: 'Startup',
    icon: UserPlus,
  },
  {
    id: 3,
    name: 'Global Solutions Ltd',
    contact: 'Michael Brown',
    email: 'michael@globalsolutions.com',
    status: 'Qualified',
    type: 'Mid-Market',
    icon: PhoneCall,
  },
];

const tasks = [
  {
    id: 1,
    title: 'Follow up with Acme Corp',
    due: '2024-03-20',
    type: 'Call',
    priority: 'High',
    icon: PhoneCall,
  },
  {
    id: 2,
    title: 'Send proposal to Tech Startups',
    due: '2024-03-21',
    type: 'Email',
    priority: 'Medium',
    icon: Mail,
  },
  {
    id: 3,
    title: 'Schedule meeting with Global Solutions',
    due: '2024-03-22',
    type: 'Meeting',
    priority: 'Low',
    icon: Calendar,
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

export default function Dashboard() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-[#3498DB]" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#2C3E50] dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-[#2C3E50] dark:text-white">
                        {stat.value}
                      </div>
                      <div className="inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        variants={itemVariants}
        className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-[#2C3E50] dark:text-white mb-6">Performance Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stackId="1" 
                stroke="#3498DB" 
                fill="#3498DB" 
                fillOpacity={0.6} 
              />
              <Area 
                type="monotone" 
                dataKey="conversions" 
                stackId="1" 
                stroke="#2ECC71" 
                fill="#2ECC71" 
                fillOpacity={0.6} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-[#2C3E50] dark:text-white mb-6">
            Recent Leads
          </h2>
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div 
                key={lead.id}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <lead.icon className="h-8 w-8 text-[#3498DB]" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-[#2C3E50] dark:text-white">{lead.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lead.contact}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-[#2C3E50] dark:text-white mb-6">
            Upcoming Tasks
          </h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <task.icon className="h-8 w-8 text-[#3498DB]" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-[#2C3E50] dark:text-white">{task.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'High' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : task.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}