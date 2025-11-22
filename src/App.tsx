import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TimetableGrid from './components/TimetableGrid';
import AIGenerator from './components/AIGenerator';
import SubjectManager from './components/SubjectManager';
import TeacherManager from './components/TeacherManager';
import Settings from './components/Settings';

// Mock data for demonstration
const mockTimeSlots = [
  { id: '1', start_time: '08:00', end_time: '08:45', duration_minutes: 45, slot_type: 'regular' as const },
  { id: '2', start_time: '08:45', end_time: '09:30', duration_minutes: 45, slot_type: 'regular' as const },
  { id: '3', start_time: '09:30', end_time: '09:45', duration_minutes: 15, slot_type: 'break' as const },
  { id: '4', start_time: '09:45', end_time: '10:30', duration_minutes: 45, slot_type: 'regular' as const },
  { id: '5', start_time: '10:30', end_time: '11:15', duration_minutes: 45, slot_type: 'regular' as const },
  { id: '6', start_time: '11:15', end_time: '12:00', duration_minutes: 45, slot_type: 'regular' as const },
  { id: '7', start_time: '12:00', end_time: '12:30', duration_minutes: 30, slot_type: 'break' as const },
  { id: '8', start_time: '12:30', end_time: '13:15', duration_minutes: 45, slot_type: 'regular' as const },
];

const mockSubjects = [
  { id: '1', name: 'Mathematics', code: 'MATH101', category: 'core' as const, credit_hours: 6, nep_priority: 'high' as const, multidisciplinary: false },
  { id: '2', name: 'English Literature', code: 'ENG101', category: 'core' as const, credit_hours: 5, nep_priority: 'high' as const, multidisciplinary: true },
  { id: '3', name: 'Physics', code: 'PHY101', category: 'core' as const, credit_hours: 6, nep_priority: 'high' as const, multidisciplinary: false },
  { id: '4', name: 'Art Education', code: 'ART101', category: 'art_education' as const, credit_hours: 3, nep_priority: 'high' as const, multidisciplinary: true },
  { id: '5', name: 'Physical Education', code: 'PE101', category: 'physical_education' as const, credit_hours: 2, nep_priority: 'medium' as const, multidisciplinary: false },
  { id: '6', name: 'Computer Science', code: 'CS101', category: 'vocational' as const, credit_hours: 4, nep_priority: 'medium' as const, multidisciplinary: true },
];

const mockTeachers = [
  { id: '1', school_id: '1', name: 'Dr. Priya Sharma', email: 'priya@school.edu', specialization: ['Mathematics', 'Statistics'], experience_years: 15, nep_trained: true },
  { id: '2', school_id: '1', name: 'Mr. Rajesh Kumar', email: 'rajesh@school.edu', specialization: ['Physics', 'Chemistry'], experience_years: 12, nep_trained: true },
  { id: '3', school_id: '1', name: 'Ms. Anita Patel', email: 'anita@school.edu', specialization: ['English', 'Literature'], experience_years: 10, nep_trained: true },
  { id: '4', school_id: '1', name: 'Mr. Suresh Nair', email: 'suresh@school.edu', specialization: ['Art', 'Craft'], experience_years: 8, nep_trained: true },
];

const mockClasses = [
  { id: '1', school_id: '1', name: 'Class 10-A', grade_level: 10, section: 'A', total_students: 45, nep_stream: 'science' as const },
  { id: '2', school_id: '1', name: 'Class 9-B', grade_level: 9, section: 'B', total_students: 42, nep_stream: 'commerce' as const },
  { id: '3', school_id: '1', name: 'Class 8-C', grade_level: 8, section: 'C', total_students: 38 },
];

const mockTimetableEntries = [
  { id: '1', school_id: '1', class_id: '1', subject_id: '1', teacher_id: '1', time_slot_id: '1', day_of_week: 1, room_number: 'Room 101', ai_confidence_score: 0.95, created_at: '2024-01-15T08:00:00Z' },
  { id: '2', school_id: '1', class_id: '1', subject_id: '3', teacher_id: '2', time_slot_id: '2', day_of_week: 1, room_number: 'Lab 1', ai_confidence_score: 0.92, created_at: '2024-01-15T08:00:00Z' },
  { id: '3', school_id: '1', class_id: '1', subject_id: '2', teacher_id: '3', time_slot_id: '4', day_of_week: 1, room_number: 'Room 102', ai_confidence_score: 0.88, created_at: '2024-01-15T08:00:00Z' },
  { id: '4', school_id: '1', class_id: '1', subject_id: '4', teacher_id: '4', time_slot_id: '5', day_of_week: 1, room_number: 'Art Room', ai_confidence_score: 0.90, created_at: '2024-01-15T08:00:00Z' },
  { id: '5', school_id: '1', class_id: '2', subject_id: '2', teacher_id: '3', time_slot_id: '1', day_of_week: 2, room_number: 'Room 103', ai_confidence_score: 0.87, created_at: '2024-01-15T08:00:00Z' },
  { id: '6', school_id: '1', class_id: '3', subject_id: '6', teacher_id: '1', time_slot_id: '3', day_of_week: 3, room_number: 'CS Lab', ai_confidence_score: 0.91, created_at: '2024-01-15T08:00:00Z' },
];

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route 
            path="/timetable" 
            element={
              <TimetableGrid 
                entries={mockTimetableEntries}
                timeSlots={mockTimeSlots}
                subjects={mockSubjects}
                teachers={mockTeachers}
                classes={mockClasses}
              />
            } 
          />
          <Route path="/ai-generator" element={<AIGenerator />} />
          <Route path="/teachers" element={<TeacherManager />} />
          <Route path="/subjects" element={<SubjectManager />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;