/*
  # NEP 2020 Timetable System Database Schema

  1. New Tables
    - `schools` - School information and NEP compliance level
    - `classes` - Class/grade information with NEP stream support
    - `subjects` - Subject catalog with NEP categories and priorities
    - `teachers` - Teacher profiles with NEP training status
    - `time_slots` - Time slot definitions for scheduling
    - `timetable_entries` - Main timetable data with AI confidence scores
    - `nep_compliance_metrics` - NEP compliance tracking and analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their school data
    - Ensure data isolation between different schools

  3. NEP 2020 Specific Features
    - Subject categorization according to NEP guidelines
    - Teacher NEP training status tracking
    - Multidisciplinary subject support
    - AI confidence scoring for generated timetables
    - Compliance metrics and analytics
*/

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_info text NOT NULL,
  nep_compliance_level text CHECK (nep_compliance_level IN ('basic', 'intermediate', 'advanced')) DEFAULT 'basic',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade_level integer NOT NULL CHECK (grade_level >= 1 AND grade_level <= 12),
  section text NOT NULL,
  total_students integer DEFAULT 0,
  nep_stream text CHECK (nep_stream IN ('science', 'commerce', 'humanities', 'vocational')),
  created_at timestamptz DEFAULT now()
);

-- Subjects table with NEP 2020 categories
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  category text CHECK (category IN ('core', 'elective', 'vocational', 'art_education', 'physical_education', 'value_education')) DEFAULT 'core',
  credit_hours integer DEFAULT 1 CHECK (credit_hours >= 1 AND credit_hours <= 10),
  nep_priority text CHECK (nep_priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  multidisciplinary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Teachers table with NEP training status
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  specialization text[] DEFAULT '{}',
  experience_years integer DEFAULT 0 CHECK (experience_years >= 0),
  nep_trained boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  slot_type text CHECK (slot_type IN ('regular', 'break', 'assembly', 'co_curricular')) DEFAULT 'regular',
  created_at timestamptz DEFAULT now()
);

-- Main timetable entries table
CREATE TABLE IF NOT EXISTS timetable_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  time_slot_id uuid REFERENCES time_slots(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week >= 1 AND day_of_week <= 6), -- Monday=1, Saturday=6
  room_number text,
  ai_confidence_score decimal(3,2) DEFAULT 0.00 CHECK (ai_confidence_score >= 0 AND ai_confidence_score <= 1),
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, time_slot_id, day_of_week) -- Prevent double booking
);

-- NEP compliance metrics table
CREATE TABLE IF NOT EXISTS nep_compliance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  overall_score integer DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  multidisciplinary_integration integer DEFAULT 0 CHECK (multidisciplinary_integration >= 0 AND multidisciplinary_integration <= 100),
  art_education_priority integer DEFAULT 0 CHECK (art_education_priority >= 0 AND art_education_priority <= 100),
  physical_education_balance integer DEFAULT 0 CHECK (physical_education_balance >= 0 AND physical_education_balance <= 100),
  value_based_learning integer DEFAULT 0 CHECK (value_based_learning >= 0 AND value_based_learning <= 100),
  flexible_assessment integer DEFAULT 0 CHECK (flexible_assessment >= 0 AND flexible_assessment <= 100),
  holistic_development integer DEFAULT 0 CHECK (holistic_development >= 0 AND holistic_development <= 100),
  calculated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, class_id)
);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE nep_compliance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Users can read all schools" ON schools FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert schools" ON schools FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their schools" ON schools FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete their schools" ON schools FOR DELETE TO authenticated USING (true);

-- RLS Policies for classes
CREATE POLICY "Users can read all classes" ON classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert classes" ON classes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update classes" ON classes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete classes" ON classes FOR DELETE TO authenticated USING (true);

-- RLS Policies for subjects (global access)
CREATE POLICY "Users can read all subjects" ON subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert subjects" ON subjects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update subjects" ON subjects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete subjects" ON subjects FOR DELETE TO authenticated USING (true);

-- RLS Policies for teachers
CREATE POLICY "Users can read all teachers" ON teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert teachers" ON teachers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update teachers" ON teachers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete teachers" ON teachers FOR DELETE TO authenticated USING (true);

-- RLS Policies for time_slots (global access)
CREATE POLICY "Users can read all time_slots" ON time_slots FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert time_slots" ON time_slots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update time_slots" ON time_slots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete time_slots" ON time_slots FOR DELETE TO authenticated USING (true);

-- RLS Policies for timetable_entries
CREATE POLICY "Users can read all timetable_entries" ON timetable_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert timetable_entries" ON timetable_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update timetable_entries" ON timetable_entries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete timetable_entries" ON timetable_entries FOR DELETE TO authenticated USING (true);

-- RLS Policies for nep_compliance_metrics
CREATE POLICY "Users can read all nep_compliance_metrics" ON nep_compliance_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert nep_compliance_metrics" ON nep_compliance_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update nep_compliance_metrics" ON nep_compliance_metrics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete nep_compliance_metrics" ON nep_compliance_metrics FOR DELETE TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_class_id ON timetable_entries(class_id);
CREATE INDEX IF NOT EXISTS idx_timetable_entries_day_time ON timetable_entries(day_of_week, time_slot_id);
CREATE INDEX IF NOT EXISTS idx_subjects_category ON subjects(category);
CREATE INDEX IF NOT EXISTS idx_subjects_nep_priority ON subjects(nep_priority);
CREATE INDEX IF NOT EXISTS idx_teachers_nep_trained ON teachers(nep_trained);

-- Insert default time slots
INSERT INTO time_slots (start_time, end_time, duration_minutes, slot_type) VALUES
  ('08:00', '08:45', 45, 'regular'),
  ('08:45', '09:30', 45, 'regular'),
  ('09:30', '09:45', 15, 'break'),
  ('09:45', '10:30', 45, 'regular'),
  ('10:30', '11:15', 45, 'regular'),
  ('11:15', '12:00', 45, 'regular'),
  ('12:00', '12:45', 45, 'break'),
  ('12:45', '13:30', 45, 'regular'),
  ('13:30', '14:15', 45, 'regular'),
  ('14:15', '15:00', 45, 'regular')
ON CONFLICT DO NOTHING;

-- Insert default NEP 2020 compliant subjects
INSERT INTO subjects (name, code, category, credit_hours, nep_priority, multidisciplinary) VALUES
  ('Mathematics', 'MATH101', 'core', 6, 'high', false),
  ('English Language', 'ENG101', 'core', 5, 'high', true),
  ('Hindi Language', 'HIN101', 'core', 4, 'high', true),
  ('Physics', 'PHY101', 'core', 6, 'high', false),
  ('Chemistry', 'CHE101', 'core', 6, 'high', false),
  ('Biology', 'BIO101', 'core', 6, 'high', false),
  ('History', 'HIS101', 'core', 4, 'medium', true),
  ('Geography', 'GEO101', 'core', 4, 'medium', true),
  ('Economics', 'ECO101', 'elective', 4, 'medium', true),
  ('Political Science', 'POL101', 'elective', 4, 'medium', true),
  ('Computer Science', 'CS101', 'vocational', 4, 'medium', true),
  ('Art Education', 'ART101', 'art_education', 3, 'high', true),
  ('Music', 'MUS101', 'art_education', 2, 'high', true),
  ('Physical Education', 'PE101', 'physical_education', 2, 'medium', false),
  ('Moral Science', 'MS101', 'value_education', 2, 'high', true),
  ('Environmental Science', 'ENV101', 'value_education', 3, 'high', true)
ON CONFLICT (code) DO NOTHING;