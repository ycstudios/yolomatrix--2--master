"use client"
import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, Settings, Users, CreditCard, FileText, 
  Search, Filter, RefreshCw, Download, AlertTriangle
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data for charts
const revenueData = [
  { name: 'Jan', amount: 125000 },
  { name: 'Feb', amount: 175000 },
  { name: 'Mar', amount: 225000 },
  { name: 'Apr', amount: 300000 },
  { name: 'May', amount: 375000 },
];

const userGrowthData = [
  { name: 'Jan', users: 1200 },
  { name: 'Feb', users: 1450 },
  { name: 'Mar', users: 1600 },
  { name: 'Apr', users: 1800 },
  { name: 'May', users: 2100 },
];

const bookingData = [
  { name: 'Mon', bookings: 45 },
  { name: 'Tue', bookings: 52 },
  { name: 'Wed', bookings: 49 },
  { name: 'Thu', bookings: 63 },
  { name: 'Fri', bookings: 75 },
  { name: 'Sat', bookings: 82 },
  { name: 'Sun', bookings: 70 },
];

// Sample data for tabs
const listings = [
  { id: 1, name: "Luxury Villa in Goa", status: "Active", views: 542, createdAt: "2025-04-15" },
  { id: 2, name: "Beachfront Apartment", status: "Pending", views: 321, createdAt: "2025-04-12" },
  { id: 3, name: "Mountain Retreat", status: "Active", views: 421, createdAt: "2025-04-10" },
  { id: 4, name: "City Center Loft", status: "Active", views: 289, createdAt: "2025-04-08" },
  { id: 5, name: "Riverside Cottage", status: "Inactive", views: 176, createdAt: "2025-04-05" },
  { id: 6, name: "Heritage Haveli Suite", status: "Active", views: 398, createdAt: "2025-04-02" },
];

const users = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@example.com", status: "Active", joinDate: "2025-03-12" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", status: "Active", joinDate: "2025-03-15" },
  { id: 3, name: "Amit Singh", email: "amit@example.com", status: "Banned", joinDate: "2025-02-28" },
  { id: 4, name: "Sneha Gupta", email: "sneha@example.com", status: "Active", joinDate: "2025-04-05" },
  { id: 5, name: "Karan Malhotra", email: "karan@example.com", status: "Inactive", joinDate: "2025-03-22" },
  { id: 6, name: "Neha Reddy", email: "neha@example.com", status: "Active", joinDate: "2025-04-10" },
];

const payouts = [
  { id: 1, host: "Vikram Mehta", amount: "₹24,500", status: "Processed", date: "2025-04-15" },
  { id: 2, host: "Neha Gupta", amount: "₹18,750", status: "Pending", date: "2025-04-16" },
  { id: 3, host: "Sunil Patel", amount: "₹32,000", status: "Processing", date: "2025-04-14" },
  { id: 4, host: "Meera Shah", amount: "₹15,800", status: "Processed", date: "2025-04-13" },
  { id: 5, host: "Arjun Nair", amount: "₹21,350", status: "Pending", date: "2025-04-16" },
  { id: 6, host: "Divya Chauhan", amount: "₹28,600", status: "Processing", date: "2025-04-15" },
];

const reports = [
  { id: 1, type: "Property Complaint", status: "New", priority: "High", date: "2025-04-15" },
  { id: 2, type: "Payment Issue", status: "In Progress", priority: "Medium", date: "2025-04-14" },
  { id: 3, type: "User Complaint", status: "Resolved", priority: "Low", date: "2025-04-12" },
  { id: 4, type: "Technical Issue", status: "New", priority: "High", date: "2025-04-15" },
  { id: 5, type: "Booking Dispute", status: "In Progress", priority: "Medium", date: "2025-04-13" },
  { id: 6, type: "Security Concern", status: "New", priority: "High", date: "2025-04-16" },
];

export default function AdminDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 5;

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Simulate refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filter data based on search and status
  const filterData = (data, type) => {
    let filteredData = [...data];
    
    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        if (type === "listings") {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (type === "users") {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 item.email.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (type === "payouts") {
          return item.host.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (type === "reports") {
          return item.type.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filteredData = filteredData.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    return filteredData;
  };

  // Get paginated data
  const getPaginatedData = (data, type) => {
    const filteredData = filterData(data, type);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Format large numbers to Indian format
  const formatIndianCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Status badge component
  const StatusBadge = ({ status, type }) => {
    let color = "bg-gray-100 text-gray-800";
    
    if (type === "status") {
      if (status === "Active") color = "bg-green-100 text-green-800";
      else if (status === "Pending") color = "bg-yellow-100 text-yellow-800";
      else if (status === "Inactive" || status === "Banned") color = "bg-red-100 text-red-800";
      else if (status === "Processing") color = "bg-blue-100 text-blue-800";
      else if (status === "New") color = "bg-red-100 text-red-800";
      else if (status === "In Progress") color = "bg-blue-100 text-blue-800";
      else if (status === "Resolved") color = "bg-green-100 text-green-800";
    } else if (type === "priority") {
      if (status === "High") color = "bg-red-100 text-red-800";
      else if (status === "Medium") color = "bg-yellow-100 text-yellow-800";
      else if (status === "Low") color = "bg-green-100 text-green-800";
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {status}
      </span>
    );
  };

  // Loading skeleton component
  const TableSkeleton = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-1/4" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="default" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Alert for new reports - only show if there are high priority new reports */}
      {reports.some(report => report.priority === "High" && report.status === "New") && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-red-700 font-medium">
                You have {reports.filter(r => r.priority === "High" && r.status === "New").length} high priority report(s) that need your attention.
              </p>
              <Button variant="link" className="p-0 h-auto text-red-700 hover:text-red-900" onClick={() => setActiveTab("reports")}>
                View Reports
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </>
        ) : (
          <>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                    <h2 className="text-3xl font-bold mt-1">1,245</h2>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> +12% from last month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Revenue (This Month)</p>
                    <h2 className="text-3xl font-bold mt-1">{formatIndianCurrency(375000)}</h2>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> +25% from last month
                    </p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1V23" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">User Growth</p>
                    <h2 className="text-3xl font-bold mt-1">+8.5%</h2>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> 245 new users
                    </p>
                  </div>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-500">Quick Actions</p>
                    <div className="mt-3 space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Add New User
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Add New Listing
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </>
        ) : (
          <>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Revenue Trend (2025)</h3>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="View" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value/1000}k`} />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        activeDot={{ r: 8 }} 
                        dot={{ stroke: '#3B82F6', strokeWidth: 2, fill: '#FFF', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Weekly Bookings</h3>
                  <Select defaultValue="thisWeek">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastWeek">Last Week</SelectItem>
                      <SelectItem value="thisWeek">This Week</SelectItem>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bookingData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="bookings" 
                        fill="#8B5CF6" 
                        barSize={30} 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabs Section */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Tabs defaultValue="listings" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap">
              <TabsTrigger value="listings" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Manage Listings
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </TabsTrigger>
              <TabsTrigger value="payouts" className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payments & Payouts
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Reports
                {reports.filter(r => r.status === "New").length > 0 && (
                  <Badge className="ml-2 bg-red-500">{reports.filter(r => r.status === "New").length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div className="flex-1 w-full sm:w-auto flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    {activeTab === "reports" && (
                      <>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>

            {loading ? (
              <TableSkeleton />
            ) : (
              <>
                <TabsContent value="listings">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getPaginatedData(listings, "listings").map((listing) => (
                       <tr key={listing.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{listing.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={listing.status} type="status" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.views}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="users">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getPaginatedData(users, "users").map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={user.status} type="status" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-600">Ban</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="payouts">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getPaginatedData(payouts, "payouts").map((payout) => (
                          <tr key={payout.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.host}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={payout.status} type="status" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">View</Button>
                                <Button variant="ghost" size="sm" className="text-green-600">Process</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="reports">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getPaginatedData(reports, "reports").map((report) => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={report.status} type="status" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={report.priority} type="priority" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">View</Button>
                                <Button variant="ghost" size="sm" className="text-blue-600">Assign</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </>
            )}

            {/* Pagination */}
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(2)} isActive={currentPage === 2}>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(3)} isActive={currentPage === 3}>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" onClick={() => setCurrentPage(prev => prev + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>© 2025 TravelStay Admin Dashboard. All rights reserved.</p>
      </div>
    </div>
  );
}