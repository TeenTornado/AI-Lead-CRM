import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FileSpreadsheet, FileJson, File as FileCsv, AlertCircle, Check, ArrowUpDown, Search, RefreshCw } from 'lucide-react';
import Papa from 'papaparse';
import { read, utils } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ImportedData {
  [key: string]: any;
}

interface LeadData extends ImportedData {
  revenue?: number;
}

const DataImportExport: React.FC = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<LeadData[]>([]);
  const [highRevenueLeads, setHighRevenueLeads] = useState<LeadData[]>([]);
  const [lowRevenueLeads, setLowRevenueLeads] = useState<LeadData[]>([]);
  const [revenueField, setRevenueField] = useState<string>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'low'>('all');
  const [thresholdValue, setThresholdValue] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [rowsToShow, setRowsToShow] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (importedData.length > 0) {
      segregateLeads();
    }
  }, [importedData, revenueField, sortOrder]);

  const segregateLeads = () => {
    setIsLoading(true);

    // Attempt to automatically detect revenue field if not explicitly set
    if (!revenueField && importedData.length > 0) {
      const possibleRevenueFields = Object.keys(importedData[0]).filter(key => 
        key.toLowerCase().includes('revenue') || 
        key.toLowerCase().includes('amount') || 
        key.toLowerCase().includes('value')
      );
      
      if (possibleRevenueFields.length > 0) {
        setRevenueField(possibleRevenueFields[0]);
      }
    }
    
    // First, sort all data by revenue
    const sortedData = [...importedData].sort((a, b) => {
      const aValue = parseFloat(a[revenueField]) || 0;
      const bValue = parseFloat(b[revenueField]) || 0;
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
    
    // Calculate the midpoint - where to split the data for 50/50
    const midpointIndex = Math.floor(sortedData.length / 2);
    
    // Determine the threshold value at the split point
    if (midpointIndex > 0 && midpointIndex < sortedData.length) {
      const thresholdAtMidpoint = parseFloat(sortedData[midpointIndex - 1][revenueField]) || 0;
      setThresholdValue(thresholdAtMidpoint);
    }
    
    // Separate into high and low revenue segments (top 50% vs bottom 50%)
    const high = sortedData.slice(0, midpointIndex);
    const low = sortedData.slice(midpointIndex);
    
    setImportedData(sortedData);
    setHighRevenueLeads(high);
    setLowRevenueLeads(low);
    setIsLoading(false);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setError(null);
    setSuccess(null);
    setImportProgress(0);
    setIsLoading(true);

    try {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          complete: (results) => {
            handleImportedData(results.data);
            setIsLoading(false);
          },
          header: true,
          error: (error) => {
            setError(`Error parsing CSV: ${error}`);
            setIsLoading(false);
          },
          progress: (progress) => {
            setImportProgress(Math.round(progress.percent));
          }
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet);
            handleImportedData(jsonData);
            setIsLoading(false);
          } catch (error) {
            setError(`Error parsing Excel file: ${error}`);
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            handleImportedData(jsonData);
            setIsLoading(false);
          } catch (error) {
            setError(`Error parsing JSON file: ${error}`);
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
      } else {
        setError('Unsupported file format. Please use CSV, Excel, or JSON files.');
        setIsLoading(false);
      }
    } catch (error) {
      setError(`Error processing file: ${error}`);
      setIsLoading(false);
    }
  };

  const handleImportedData = (data: LeadData[]) => {
    if (data.length === 0) {
      setError('No data found in the imported file.');
      return;
    }
    
    // Attempt to detect revenue field automatically
    const headers = Object.keys(data[0]);
    const possibleRevenueFields = headers.filter(key => 
      key.toLowerCase().includes('revenue') || 
      key.toLowerCase().includes('amount') || 
      key.toLowerCase().includes('value') ||
      key.toLowerCase().includes('deal')
    );
    
    if (possibleRevenueFields.length > 0) {
      setRevenueField(possibleRevenueFields[0]);
    } else {
      // If no obvious revenue field, prompt user
      setError('Could not detect a revenue field. Please select the revenue field from the dropdown.');
    }
    
    setImportedData(data);
    setSuccess(`Successfully imported ${data.length} leads`);
    setImportProgress(100);
  };

  const exportData = (format: 'csv' | 'xlsx' | 'pdf', dataType: 'all' | 'high' | 'low' = 'all') => {
    setIsLoading(true);
    try {
      // Determine which dataset to export
      let dataToExport: LeadData[];
      let filename = 'exported-leads';
      
      switch (dataType) {
        case 'high':
          dataToExport = highRevenueLeads;
          filename = 'top-50-percent-revenue-leads';
          break;
        case 'low':
          dataToExport = lowRevenueLeads;
          filename = 'bottom-50-percent-revenue-leads';
          break;
        default:
          dataToExport = importedData;
          break;
      }
      
      if (dataToExport.length === 0) {
        setError('No data available to export.');
        setIsLoading(false);
        return;
      }

      if (format === 'csv') {
        const csv = Papa.unparse(dataToExport);
        downloadFile(csv, `${filename}.csv`, 'text/csv');
      } else if (format === 'xlsx') {
        const worksheet = utils.json_to_sheet(dataToExport);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Leads');
        // Note: XLSX write function would go here
        // This part would need additional implementation with a library that supports client-side XLSX generation
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        
        // Add title to the PDF
        doc.setFontSize(16);
        doc.text(dataType === 'high' ? 'Top 50% Revenue Leads' : 
                 dataType === 'low' ? 'Bottom 50% Revenue Leads' : 
                 'All Leads', 14, 15);
        
        // Add threshold information
        doc.setFontSize(10);
        if (thresholdValue !== null) {
          doc.text(`Revenue Threshold: ₹${thresholdValue.toLocaleString()}`, 14, 22);
        }
        doc.text(`Total Records: ${dataToExport.length}`, 14, 27);
        
        // Create the table
        doc.autoTable({
          startY: 35,
          head: [Object.keys(dataToExport[0] || {})],
          body: dataToExport.map(row => Object.values(row))
        });
        
        doc.save(`${filename}.pdf`);
      }
      
      setSuccess(`Successfully exported ${dataToExport.length} leads as ${format.toUpperCase()}`);
    } catch (error) {
      setError(`Error exporting data: ${error}`);
    }
    setIsLoading(false);
  };

  const downloadFile = (content: any, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getDataForActiveTab = () => {
    const dataMap = {
      'high': highRevenueLeads,
      'low': lowRevenueLeads,
      'all': importedData
    };
    
    const data = dataMap[activeTab];
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      return data.filter(item => 
        Object.values(item).some(val => 
          val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return data;
  };

  const loadMoreRows = () => {
    setRowsToShow(prev => prev + 10);
  };

  // Calculate stats
  const calculateAverageRevenue = (data: LeadData[]) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + (parseFloat(item[revenueField]) || 0), 0);
    return sum / data.length;
  };

  const filteredData = getDataForActiveTab();
  const averageRevenue = calculateAverageRevenue(filteredData);
  const maxRevenue = filteredData.length > 0 ? Math.max(...filteredData.map(item => parseFloat(item[revenueField]) || 0)) : 0;
  const totalRevenue = filteredData.reduce((sum, item) => sum + (parseFloat(item[revenueField]) || 0), 0);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            className="mr-3"
          >
            {isLoading ? <RefreshCw className="h-6 w-6 text-blue-500" /> : <FileSpreadsheet className="h-6 w-6 text-blue-500" />}
          </motion.div>
          Lead Data Import & Revenue Analysis
        </h2>

        {/* Import Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-500" />
            Import Leads Data
          </h3>
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: isDragActive ? -10 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="mx-auto h-12 w-12 text-blue-500" />
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                Drag & drop your leads file here, or click to select files
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Supported formats: CSV, Excel, JSON
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                File should contain lead details with a revenue/amount column
              </p>
            </motion.div>
            
            {isDragActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center z-10"
              >
                <p className="text-lg font-medium text-blue-600 dark:text-blue-300">
                  Drop your file to import
                </p>
              </motion.div>
            )}
          </div>

          {/* Progress Bar */}
          {importProgress > 0 && importProgress < 100 && (
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${importProgress}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-600 h-2 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Importing... {importProgress}%
              </p>
            </div>
          )}

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 rounded-lg flex items-center"
            >
              <Check className="h-5 w-5 mr-2" />
              {success}
            </motion.div>
          )}
        </div>

        {/* Configuration Section - visible after import */}
        {importedData.length > 0 && (
          <div className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-500" />
              Lead Analysis Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Revenue Field
                </label>
                <select
                  value={revenueField}
                  onChange={(e) => setRevenueField(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {importedData.length > 0 &&
                    Object.keys(importedData[0]).map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Segmentation Method
                </label>
                <div className="py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 rounded-md border border-blue-200 dark:border-blue-800">
                  Top 50% by Revenue (Dynamic Threshold)
                </div>
              </div>
            </div>
            
            {thresholdValue !== null && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue Threshold</p>
                    <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                      ₹{thresholdValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Leads Above Threshold</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-300">
                      {highRevenueLeads.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Leads Below Threshold</p>
                    <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-300">
                      {lowRevenueLeads.length}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort Order
              </label>
              <button
                onClick={toggleSortOrder}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ArrowUpDown className="h-5 w-5 mr-2 text-blue-500" />
                {sortOrder === 'desc' ? 'Highest Revenue First' : 'Lowest Revenue First'}
              </button>
            </div>
          </div>
        )}

        {/* Export Section - visible after import */}
        {importedData.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2 text-blue-500" />
              Export Leads Data
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Leads ({importedData.length})
              </button>
              <button
                onClick={() => setActiveTab('high')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'high'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Top 50% Revenue ({highRevenueLeads.length})
              </button>
              <button
                onClick={() => setActiveTab('low')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'low'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Bottom 50% Revenue ({lowRevenueLeads.length})
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => exportData('csv', activeTab as any)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FileCsv className="h-5 w-5 mr-2 text-blue-500" />
                Export as CSV
              </button>
              <button
                onClick={() => exportData('xlsx', activeTab as any)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2 text-green-500" />
                Export as Excel
              </button>
              <button
                onClick={() => exportData('pdf', activeTab as any)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FileJson className="h-5 w-5 mr-2 text-red-500" />
                Export as PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Preview Section with enhanced design */}
      {importedData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  {activeTab === 'high' ? (
                    <>
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Top 50% Revenue Leads
                    </>
                  ) : activeTab === 'low' ? (
                    <>
                      <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      Bottom 50% Revenue Leads
                    </>
                  ) : (
                    <>
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                      All Leads Preview
                    </>
                  )}
                </h3>
                {thresholdValue !== null && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {activeTab === 'high' 
                      ? `Leads with revenue ≥ ₹${thresholdValue.toLocaleString()}` 
                      : activeTab === 'low' 
                        ? `Leads with revenue < ₹${thresholdValue.toLocaleString()}` 
                        : 'All imported leads sorted by revenue'}
                  </p>
                )}
              </div>
              
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all"
                />
              </div>
            </div>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Average Revenue</p>
                <p className="text-xl font-bold text-blue-800 dark:text-blue-200">₹{averageRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Highest Revenue</p>
                <p className="text-xl font-bold text-green-800 dark:text-green-200">₹{maxRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Total Revenue</p>
                <p className="text-xl font-bold text-purple-800 dark:text-purple-200">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {importedData.length > 0 && Object.keys(importedData[0] || {}).map((header) => (
                    <th
                      key={header}
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        header === revenueField
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {header} {header === revenueField && '(Revenue)'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.slice(0, rowsToShow).map((item, index) => (
                  <tr 
                    key={index}
                    className={
                      activeTab === 'all' && (parseFloat(item[revenueField]) || 0) >= (thresholdValue || 0)
                        ? 'bg-green-50 dark:bg-green-900/10'
                        : ''
                    }
                  >
                    {Object.keys(importedData[0] || {}).map((key) => (
                      <td
                        key={key}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          key === revenueField
                            ? 'font-medium text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {key === revenueField && typeof item[key] === 'number'
                          ? `₹${Number(item[key]).toLocaleString()}`
                          : String(item[key] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length > rowsToShow && (
              <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={loadMoreRows}
                  className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Load More Records
                </button>
              </div>
            )}
            
            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No matching records found.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImportExport;