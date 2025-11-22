import { supabase } from './supabase';
import { School, Class, Subject, Teacher, TimeSlot, TimetableEntry } from '../types';

export class DatabaseService {
  // School Management
  async createSchool(school: Omit<School, 'id' | 'created_at'>): Promise<School> {
    const { data, error } = await supabase
      .from('schools')
      .insert([school])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getSchools(): Promise<School[]> {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Class Management
  async createClass(classData: Omit<Class, 'id'>): Promise<Class> {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getClassesBySchool(schoolId: string): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('school_id', schoolId)
      .order('grade_level', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Subject Management
  async createSubject(subject: Omit<Subject, 'id'>): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subject])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('nep_priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Teacher Management
  async createTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacher])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTeachersBySchool(schoolId: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('school_id', schoolId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Time Slot Management
  async createTimeSlot(timeSlot: Omit<TimeSlot, 'id'>): Promise<TimeSlot> {
    const { data, error } = await supabase
      .from('time_slots')
      .insert([timeSlot])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTimeSlots(): Promise<TimeSlot[]> {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  // Timetable Management
  async saveTimetableEntries(entries: Omit<TimetableEntry, 'id' | 'created_at'>[]): Promise<TimetableEntry[]> {
    const { data, error } = await supabase
      .from('timetable_entries')
      .insert(entries)
      .select();
    
    if (error) throw error;
    return data || [];
  }

  async getTimetableByClass(classId: string): Promise<TimetableEntry[]> {
    const { data, error } = await supabase
      .from('timetable_entries')
      .select('*')
      .eq('class_id', classId)
      .order('day_of_week', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }

  async deleteTimetableByClass(classId: string): Promise<void> {
    const { error } = await supabase
      .from('timetable_entries')
      .delete()
      .eq('class_id', classId);
    
    if (error) throw error;
  }

  // NEP Compliance Analytics
  async getNEPComplianceMetrics(schoolId: string): Promise<any> {
    // This would involve complex queries to analyze NEP compliance
    // For now, returning mock data structure
    return {
      overall_score: 89,
      categories: {
        multidisciplinary_integration: 92,
        art_education_priority: 88,
        physical_education_balance: 95,
        value_based_learning: 87,
        flexible_assessment: 85,
        holistic_development: 90
      }
    };
  }
}

export const dbService = new DatabaseService();