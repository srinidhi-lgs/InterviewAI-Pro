'use client';

import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../../../store/useSettingsStore';
import AppearanceSettings from '../../../components/settings/AppearanceSettings';
import SecuritySettings from '../../../components/settings/SecuritySettings';
import AiPreferences from '../../../components/settings/AiPreferences';
import NotificationSettings from '../../../components/settings/NotificationSettings';
import DangerZone from '../../../components/settings/DangerZone';
import SettingsSkeleton from '../../../components/settings/SettingsSkeleton';
import { Monitor, ShieldCheck, Bot, Bell, AlertTriangle } from 'lucide-react';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Monitor },
  { id: 'security', label: 'Security', icon: ShieldCheck },
  { id: 'ai', label: 'AI Preferences', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
];

export default function SettingsPage() {
  const { fetchSettings, isLoading, settings } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    console.log("Settings page mounted");
    fetchSettings();
  }, [fetchSettings]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-4 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? tab.danger
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : tab.danger
                        ? 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${
                    activeTab === tab.id
                      ? tab.danger ? 'text-red-700 dark:text-red-400' : 'text-indigo-700 dark:text-indigo-400'
                      : 'text-gray-400'
                  }`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
          {isLoading && !settings ? (
            <SettingsSkeleton />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {activeTab === 'appearance' && <AppearanceSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'ai' && <AiPreferences />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'danger' && <DangerZone />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
