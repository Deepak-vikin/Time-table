export interface School {
  id: string;
  name: string;
  address: string;
  contact_info: string;
  nep_compliance_level: 'basic' | 'intermediate' | 'advanced';
  created_at: string;
}

export interface Class {
  id: string;
  school_id: string;
  name: string;
  grade_level: number;
  section: string;
  total_students: number;
  nep_stream?: 'science' | 'commerce' | 'humanities' | 'vocational';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  category: 'core' | 'elective' | 'vocational' | 'art_education' | 'physical_education' | 'value_education';
  credit_hours: number;
  nep_priority: 'high' | 'medium' | 'low';
  multidisciplinary: boolean;
}

export interface Teacher {
  id: string;
  school_id: string;
  name: string;
  email: string;
  specialization: string[];
  experience_years: number;
  nep_trained: boolean;
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  slot_type: 'regular' | 'break' | 'assembly' | 'co_curricular';
}

export interface TimetableEntry {
  id: string;
  school_id: string;
  class_id: string;
  subject_id: string;
  teacher_id: string;
  time_slot_id: string;
  day_of_week: number; // 1-6 (Monday-Saturday)
  room_number?: string;
  ai_confidence_score: number;
  created_at: string;
}

export interface AIGenerationRequest {
  school_id: string;
  class_ids: string[];
  constraints: {
    max_periods_per_day: number;
    break_duration: number;
    nep_compliance_strict: boolean;
    multidisciplinary_sessions: boolean;
    co_curricular_mandatory: boolean;
  };
  preferences: {
    morning_subjects: string[];
    afternoon_subjects: string[];
    avoid_consecutive: string[];
  };
}

export interface NEPComplianceMetrics {
  overall_score: number;
  multidisciplinary_integration: number;
  art_education_priority: number;
  physical_education_balance: number;
  value_based_learning: number;
  flexible_assessment: number;
  holistic_development: number;
}

export interface AITimetableResponse {
  success: boolean;
  timetable: TimetableEntry[];
  metadata: {
    generation_time: string;
    nep_compliance: 'low' | 'medium' | 'high';
    optimization_score: number;
    multidisciplinary_integration: boolean;
  };
  compliance_metrics: NEPComplianceMetrics;
}