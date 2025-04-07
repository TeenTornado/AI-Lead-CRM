import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FileSpreadsheet, FileJson, File as FileCsv, AlertCircle, Check } from 'lucide-react';
import Papa from 'papaparse';
import { read, utils } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ImportedData {
  [key: string]: any;
}

const DataImportExport: React.FC = () => {
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<ImportedData[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setError(null);
    setSuccess(null);
    setImportProgress(0);

    try {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          complete: (results) => {
            handleImportedData(results.data);
          },
          header: true,
          error: (error) => {
            setError(`Error parsing CSV: ${error}`);
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
          } catch (error) {
            setError(`Error parsing Excel file: ${error}`);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            handleImportedData(jsonData);
          } catch (error) {
            setError(`Error parsing JSON file: ${error}`);
          }
        };
        reader.readAsText(file);
      } else {
        setError('Unsupported file format. Please use CSV, Excel, or JSON files.');
      }
    } catch (error) {
      setError(`Error processing file: ${error}`);
    }
  };

  const handleImportedData = (data: ImportedData[]) => {
    setImportedData(data);
    setSuccess(`Successfully imported ${data.length} records`);
    setImportProgress(100);
  };

  const exportData = (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      if (format === 'csv') {
        const csv = Papa.unparse(importedData);
        downloadFile(csv, 'exported-data.csv', 'text/csv');
      } else if (format === 'xlsx') {
        const worksheet = utils.json_to_sheet(importedData);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Data');
        // Note: XLSX write function would go here
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.autoTable({
          head: [Object.keys(importedData[0] || {})],
          body: importedData.map(row => Object.values(row))
        });
        doc.save('exported-data.pdf');
      }
    } catch (error) {
      setError(`Error exporting data: ${error}`);
    }
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

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Data Import/Export
        </h2>

        {/* Import Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Import Data
          </h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Drag & drop your files here, or click to select files
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Supported formats: CSV, Excel, JSON
            </p>
          </div>

          {/* Progress Bar */}
          {importProgress > 0 && importProgress < 100 && (
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
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

        {/* Export Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Export Data
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => exportData('csv')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileCsv className="h-5 w-5 mr-2" />
              Export as CSV
            </button>
            <button
              onClick={() => exportData('xlsx')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileSpreadsheet className="h-5 w-5 mr-2" />
              Export as Excel
            </button>
            <button
              onClick={() => exportData('pdf')}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FileJson className="h-5 w-5 mr-2" />
              Export as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {importedData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Imported Data Preview
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {Object.keys(importedData[0] || {}).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {importedData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                      >
                        {value?.toString() || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImportExport;