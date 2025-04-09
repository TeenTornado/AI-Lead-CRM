import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Settings, Trash2, Save } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  trigger: "immediate" | "24h" | "3d" | "7d" | "14d" | "30d";
}

export default function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Initial Contact",
      subject: "Welcome to {{company}}",
      content:
        "Dear {{name}},\n\nThank you for your interest in {{company}}...",
      trigger: "immediate",
    },
    {
      id: "2",
      name: "3-Day Follow-up",
      subject: "Following up on your interest",
      content:
        "Hi {{name}},\n\nI wanted to follow up on our previous conversation...",
      trigger: "3d",
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate | null>(
    null
  );

  const triggerLabels = {
    immediate: "Immediate",
    "24h": "24 Hours",
    "3d": "3 Days",
    "7d": "7 Days",
    "14d": "14 Days",
    "30d": "30 Days",
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedTemplate({ ...template });
    setIsEditing(false);
  };

  const handleTemplateUpdate = () => {
    if (editedTemplate) {
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.id === editedTemplate.id ? editedTemplate : template
        )
      );
      setSelectedTemplate(editedTemplate);
      setIsEditing(false);
    }
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((template) => template.id !== templateId)
    );
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
      setEditedTemplate(null);
    }
  };

  const handleTemplateCreate = () => {
    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      name: "New Template",
      subject: "Subject",
      content: "Content",
      trigger: "immediate",
    };
    setTemplates((prev) => [...prev, newTemplate]);
    handleTemplateSelect(newTemplate);
    setIsEditing(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Email Templates
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Available Templates
            </h3>
            <button
              onClick={handleTemplateCreate}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Mail className="h-4 w-4 mr-2" />
              New Template
            </button>
          </div>

          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedTemplate?.id === template.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-500"
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {template.subject}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Clock className="h-3 w-3 mr-1" />
                    {triggerLabels[template.trigger]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Template Editor */}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 lg:pl-6 pt-6 lg:pt-0">
          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {isEditing ? "Edit Template" : "Template Details"}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleTemplateDelete(selectedTemplate.id)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {isEditing && (
                    <button
                      onClick={handleTemplateUpdate}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={
                      isEditing ? editedTemplate?.name : selectedTemplate.name
                    }
                    onChange={(e) =>
                      setEditedTemplate((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={
                      isEditing
                        ? editedTemplate?.subject
                        : selectedTemplate.subject
                    }
                    onChange={(e) =>
                      setEditedTemplate((prev) =>
                        prev ? { ...prev, subject: e.target.value } : null
                      )
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Content
                  </label>
                  <textarea
                    rows={8}
                    value={
                      isEditing
                        ? editedTemplate?.content
                        : selectedTemplate.content
                    }
                    onChange={(e) =>
                      setEditedTemplate((prev) =>
                        prev ? { ...prev, content: e.target.value } : null
                      )
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trigger Timing
                  </label>
                  <select
                    value={
                      isEditing
                        ? editedTemplate?.trigger
                        : selectedTemplate.trigger
                    }
                    onChange={(e) =>
                      setEditedTemplate((prev) =>
                        prev
                          ? {
                              ...prev,
                              trigger: e.target
                                .value as EmailTemplate["trigger"],
                            }
                          : null
                      )
                    }
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    {Object.entries(triggerLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No Template Selected
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a template from the list to edit or create a new one
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
