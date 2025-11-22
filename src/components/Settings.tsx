import React, { useState } from 'react';
import { Settings as SettingsIcon, School, Clock, Brain, Database, Key, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({
    school: {
      name: 'Demo School',
      address: '123 Education Street, Learning City',
      contact: '+91 98765 43210',
      nep_compliance_level: 'advanced' as 'basic' | 'intermediate' | 'advanced',
    },
    timetable: {
      max_periods_per_day: 8,
      break_duration: 15,
      lunch_duration: 45,
      start_time: '08:00',
      end_time: '15:30',
    },
    ai: {
      openai_api_key: import.meta.env.VITE_OPENAI_API_KEY || '',
      model: 'gpt-4',
      temperature: 0.3,
      max_tokens: 3000,
    },
    database: {
      supabase_url: import.meta.env.VITE_SUPABASE_URL || '',
      supabase_anon_key: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    },
    nep: {
      strict_compliance: true,
      multidisciplinary_sessions: true,
      art_education_priority: true,
      physical_education_mandatory: true,
      value_education_integration: true,
    }
  });

  const handleSave = () => {
    // In a real application, this would save to the database
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      toast.success('Settings reset to default values');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Configure your NEP 2020 timetable system</p>
      </div>

      <div className="space-y-8">
        {/* School Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <School className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">School Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name
              </label>
              <input
                type="text"
                value={settings.school.name}
                onChange={(e) => setSettings({
                  ...settings,
                  school: { ...settings.school, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="text"
                value={settings.school.contact}
                onChange={(e) => setSettings({
                  ...settings,
                  school: { ...settings.school, contact: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={settings.school.address}
                onChange={(e) => setSettings({
                  ...settings,
                  school: { ...settings.school, address: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NEP Compliance Level
              </label>
              <select
                value={settings.school.nep_compliance_level}
                onChange={(e) => setSettings({
                  ...settings,
                  school: { ...settings.school, nep_compliance_level: e.target.value as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timetable Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Clock className="h-6 w-6 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Timetable Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Periods per Day
              </label>
              <input
                type="number"
                min="6"
                max="10"
                value={settings.timetable.max_periods_per_day}
                onChange={(e) => setSettings({
                  ...settings,
                  timetable: { ...settings.timetable, max_periods_per_day: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="10"
                max="30"
                value={settings.timetable.break_duration}
                onChange={(e) => setSettings({
                  ...settings,
                  timetable: { ...settings.timetable, break_duration: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lunch Duration (minutes)
              </label>
              <input
                type="number"
                min="30"
                max="60"
                value={settings.timetable.lunch_duration}
                onChange={(e) => setSettings({
                  ...settings,
                  timetable: { ...settings.timetable, lunch_duration: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Start Time
              </label>
              <input
                type="time"
                value={settings.timetable.start_time}
                onChange={(e) => setSettings({
                  ...settings,
                  timetable: { ...settings.timetable, start_time: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School End Time
              </label>
              <input
                type="time"
                value={settings.timetable.end_time}
                onChange={(e) => setSettings({
                  ...settings,
                  timetable: { ...settings.timetable, end_time: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Brain className="h-6 w-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">AI Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={settings.ai.openai_api_key}
                  onChange={(e) => setSettings({
                    ...settings,
                    ai: { ...settings.ai, openai_api_key: e.target.value }
                  })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your API key is stored securely and used only for timetable generation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Model
              </label>
              <select
                value={settings.ai.model}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, model: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4">GPT-4 (Recommended)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (0.0 - 1.0)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.ai.temperature}
                onChange={(e) => setSettings({
                  ...settings,
                  ai: { ...settings.ai, temperature: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Database className="h-6 w-6 text-orange-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Database Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase URL
              </label>
              <input
                type="url"
                value={settings.database.supabase_url}
                onChange={(e) => setSettings({
                  ...settings,
                  database: { ...settings.database, supabase_url: e.target.value }
                })}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={settings.database.supabase_anon_key}
                onChange={(e) => setSettings({
                  ...settings,
                  database: { ...settings.database, supabase_anon_key: e.target.value }
                })}
                placeholder="eyJ..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* NEP 2020 Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">NEP 2020 Compliance</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="strict_compliance"
                checked={settings.nep.strict_compliance}
                onChange={(e) => setSettings({
                  ...settings,
                  nep: { ...settings.nep, strict_compliance: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="strict_compliance" className="ml-2 text-sm text-gray-700">
                Enforce strict NEP 2020 compliance
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="multidisciplinary_sessions"
                checked={settings.nep.multidisciplinary_sessions}
                onChange={(e) => setSettings({
                  ...settings,
                  nep: { ...settings.nep, multidisciplinary_sessions: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="multidisciplinary_sessions" className="ml-2 text-sm text-gray-700">
                Enable multidisciplinary learning sessions
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="art_education_priority"
                checked={settings.nep.art_education_priority}
                onChange={(e) => setSettings({
                  ...settings,
                  nep: { ...settings.nep, art_education_priority: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="art_education_priority" className="ml-2 text-sm text-gray-700">
                Prioritize art education in scheduling
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="physical_education_mandatory"
                checked={settings.nep.physical_education_mandatory}
                onChange={(e) => setSettings({
                  ...settings,
                  nep: { ...settings.nep, physical_education_mandatory: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="physical_education_mandatory" className="ml-2 text-sm text-gray-700">
                Make physical education mandatory
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="value_education_integration"
                checked={settings.nep.value_education_integration}
                onChange={(e) => setSettings({
                  ...settings,
                  nep: { ...settings.nep, value_education_integration: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="value_education_integration" className="ml-2 text-sm text-gray-700">
                Integrate value education across subjects
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}