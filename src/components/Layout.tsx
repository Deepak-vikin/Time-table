import React from 'react';
import { Calendar, BookOpen, Settings, Brain, GraduationCap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Calendar },
  { name: 'AI Generator', href: '/ai-generator', icon: Brain },
  { name: 'Subjects', href: '/subjects', icon: GraduationCap },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">NEP Scheduler</span>
          </div>
        </div>
        
        <nav className="mt-6 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-green-50 p-4">
            <h3 className="text-sm font-medium text-gray-900">NEP 2020 Compliant</h3>
            <p className="mt-1 text-xs text-gray-600">
              This system follows National Education Policy guidelines for holistic education.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}