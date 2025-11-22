import React from 'react';
import { TimetableEntry, TimeSlot, Subject, Teacher, Class } from '../types';

interface TimetableGridProps {
  entries: TimetableEntry[];
  timeSlots: TimeSlot[];
  subjects: Subject[];
  teachers: Teacher[];
  classes?: Class[]; // Optional classes data
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const subjectColors: Record<string, string> = {
  'core': 'bg-blue-100 text-blue-800',
  'elective': 'bg-purple-100 text-purple-800',
  'vocational': 'bg-orange-100 text-orange-800',
  'art_education': 'bg-pink-100 text-pink-800',
  'physical_education': 'bg-green-100 text-green-800',
  'value_education': 'bg-yellow-100 text-yellow-800',
  'break': 'bg-pink-50 text-pink-800',
};

// Group entries by class
const groupEntriesByClass = (entries: TimetableEntry[]) => {
  const grouped: Record<string, TimetableEntry[]> = {};
  entries.forEach(entry => {
    if (!grouped[entry.class_id]) {
      grouped[entry.class_id] = [];
    }
    grouped[entry.class_id].push(entry);
  });
  return grouped;
};

// Create a schedule matrix for a specific class
const createScheduleMatrix = (
  classEntries: TimetableEntry[], 
  timeSlots: TimeSlot[], 
  subjects: Subject[], 
  teachers: Teacher[]
) => {
  const schedule: Record<string, Record<string, { subject: Subject | null; teacher: Teacher | null; room: string | null; type: string }>> = {};
  
  // Initialize schedule
  days.forEach(day => {
    schedule[day] = {};
    timeSlots.forEach(slot => {
      schedule[day][slot.id] = {
        subject: null,
        teacher: null,
        room: null,
        type: slot.slot_type
      };
    });
  });
  
  // Fill in the actual entries
  classEntries.forEach(entry => {
    const day = days[entry.day_of_week - 1];
    if (day && schedule[day] && schedule[day][entry.time_slot_id]) {
      const subject = subjects.find(s => s.id === entry.subject_id) || null;
      const teacher = teachers.find(t => t.id === entry.teacher_id) || null;
      
      schedule[day][entry.time_slot_id] = {
        subject,
        teacher,
        room: entry.room_number || null,
        type: subject ? (subject.category === 'physical_education' ? 'lab' : 'theory') : 
              (entry.time_slot_id.includes('break') ? 'break' : 'free')
      };
    }
  });
  
  return schedule;
};

export default function TimetableGrid({ entries, timeSlots, subjects, teachers, classes }: TimetableGridProps) {
  const groupedEntries = groupEntriesByClass(entries);
  
  const getClass = (classId: string) => {
    return classes?.find(c => c.id === classId);
  };

  const getSubject = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

  const getTeacher = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
        <p className="mt-2 text-gray-600">NEP 2020 Compliant Schedule</p>
      </div>

      <div className="p-6">
        {Object.entries(groupedEntries).map(([classId, classEntries]) => {
          const classInfo = getClass(classId);
          const schedule = createScheduleMatrix(classEntries, timeSlots, subjects, teachers);
          
          return (
            <div key={classId} className="section-timetable glass-card mb-8">
              <div className="section-header flex justify-between items-center mb-4">
                <h3 className="section-title text-xl font-semibold text-gray-900">
                  {classInfo ? `${classInfo.name}` : `Class ${classId}`}
                </h3>
                {classInfo && (
                  <span className="room-info text-sm text-gray-600">
                    🏢 {classInfo.total_students} students
                  </span>
                )}
              </div>
              
              <div className="timetable-table-container overflow-x-auto">
                <table className="timetable-table min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day/Time
                      </th>
                      {timeSlots.map(slot => (
                        <th 
                          key={slot.id} 
                          className="border border-gray-200 px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {slot.start_time}-{slot.end_time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map(day => (
                      <tr key={day}>
                        <td className="border border-gray-200 px-4 py-2 bg-blue-50 font-medium text-gray-700">
                          {day}
                        </td>
                        {timeSlots.map(slot => {
                          const entry = schedule[day][slot.id];
                          const cellClass = entry.type === 'break' ? 'break-cell bg-pink-50' : 
                                          entry.type === 'lab' ? 'lab-cell bg-green-50' : 
                                          entry.type === 'free' ? 'free-cell bg-gray-50' : 
                                          'theory-cell bg-blue-50';
                          
                          return (
                            <td 
                              key={`${day}-${slot.id}`} 
                              className={`border border-gray-200 px-2 py-2 text-center ${cellClass}`}
                            >
                              {entry.subject ? (
                                <div className="subject-info">
                                  <div className="subject-name font-medium text-sm">
                                    {entry.subject.name}
                                  </div>
                                  {entry.teacher && (
                                    <div className="faculty-name text-xs text-gray-600 mt-1">
                                      {entry.teacher.name}
                                    </div>
                                  )}
                                  {entry.room && (
                                    <div className="room-name text-xs text-gray-500 mt-1">
                                      {entry.room}
                                    </div>
                                  )}
                                </div>
                              ) : entry.type === 'break' ? (
                                <div className="text-pink-700 font-medium">Break Time</div>
                              ) : (
                                <div className="text-gray-400">Free Period</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}