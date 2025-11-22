import React, { useState } from 'react';
import { Brain, Sparkles, Settings, CheckCircle, AlertCircle, Plus, Trash2, Edit2, Calendar, Download, FileText, Send } from 'lucide-react';
import { aiGenerator } from '../lib/openai';
import { AIGenerationRequest, Subject, Class, TimeSlot, TimetableEntry, Teacher } from '../types';
import toast from 'react-hot-toast';

// Mock data for demonstration
const mockTimeSlots: TimeSlot[] = [
  { id: '1', start_time: '08:30', end_time: '09:15', duration_minutes: 45, slot_type: 'regular' },
  { id: '2', start_time: '09:15', end_time: '10:00', duration_minutes: 45, slot_type: 'regular' },
  { id: '3', start_time: '10:00', end_time: '10:15', duration_minutes: 15, slot_type: 'break' },
  { id: '4', start_time: '10:15', end_time: '11:00', duration_minutes: 45, slot_type: 'regular' },
  { id: '5', start_time: '11:00', end_time: '11:45', duration_minutes: 45, slot_type: 'regular' },
  { id: '6', start_time: '11:45', end_time: '12:30', duration_minutes: 45, slot_type: 'regular' },
  { id: '7', start_time: '12:30', end_time: '12:45', duration_minutes: 15, slot_type: 'break' },
  { id: '8', start_time: '12:45', end_time: '13:30', duration_minutes: 45, slot_type: 'regular' },
  { id: '9', start_time: '13:30', end_time: '14:15', duration_minutes: 45, slot_type: 'regular' },
  { id: '10', start_time: '14:15', end_time: '15:00', duration_minutes: 45, slot_type: 'regular' },
  { id: '11', start_time: '15:00', end_time: '15:45', duration_minutes: 45, slot_type: 'regular' },
  { id: '12', start_time: '15:45', end_time: '16:30', duration_minutes: 45, slot_type: 'regular' },
];

const mockTeachers: Teacher[] = [
  { id: '1', school_id: '1', name: 'Dr. Priya Sharma', email: 'priya@school.edu', specialization: ['Mathematics', 'Statistics'], experience_years: 15, nep_trained: true },
  { id: '2', school_id: '1', name: 'Mr. Rajesh Kumar', email: 'rajesh@school.edu', specialization: ['Physics', 'Chemistry'], experience_years: 12, nep_trained: true },
  { id: '3', school_id: '1', name: 'Ms. Anita Patel', email: 'anita@school.edu', specialization: ['English', 'Literature'], experience_years: 10, nep_trained: true },
  { id: '4', school_id: '1', name: 'Mr. Suresh Nair', email: 'suresh@school.edu', specialization: ['Art', 'Craft'], experience_years: 8, nep_trained: true },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AIGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', code: 'MATH101', category: 'core', credit_hours: 6, nep_priority: 'high', multidisciplinary: false },
    { id: '2', name: 'Computer Science', code: 'CS101', category: 'vocational', credit_hours: 4, nep_priority: 'high', multidisciplinary: true },
    { id: '3', name: 'Artificial Intelligence', code: 'AI101', category: 'vocational', credit_hours: 5, nep_priority: 'high', multidisciplinary: true },
    { id: '4', name: 'Data Science', code: 'DS101', category: 'vocational', credit_hours: 4, nep_priority: 'high', multidisciplinary: true },
  ]);
  
  const [classes, setClasses] = useState<Class[]>([
    { id: '1', school_id: '1', name: 'AIML A', grade_level: 10, section: 'A', total_students: 60 },
    { id: '2', school_id: '1', name: 'AIML B', grade_level: 10, section: 'B', total_students: 55 },
  ]);
  
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    category: 'core' as Subject['category'],
    credit_hours: 1,
    nep_priority: 'medium' as Subject['nep_priority'],
    multidisciplinary: false,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [generatedTimetable, setGeneratedTimetable] = useState<any>(null);
  
  const [generationRequest, setGenerationRequest] = useState<AIGenerationRequest>({
    school_id: '',
    class_ids: [],
    constraints: {
      max_periods_per_day: 8,
      break_duration: 15,
      nep_compliance_strict: true,
      multidisciplinary_sessions: true,
      co_curricular_mandatory: true,
    },
    preferences: {
      morning_subjects: ['Mathematics', 'Computer Science'],
      afternoon_subjects: ['Artificial Intelligence', 'Data Science'],
      avoid_consecutive: ['Mathematics', 'Computer Science'],
    },
  });

  // Function to generate time slots dynamically based on constraints
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    let currentTime = 8 * 60 + 30; // Start at 8:30 AM in minutes
    let slotId = 1;
    
    // Generate up to 12 periods to ensure we have enough for max 8 periods
    for (let i = 0; i < 12; i++) {
      // Add regular period
      const startHours = Math.floor(currentTime / 60);
      const startMinutes = currentTime % 60;
      const startTime = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')}`;
      
      currentTime += 45; // Regular period is 45 minutes
      const endHours = Math.floor(currentTime / 60);
      const endMinutes = currentTime % 60;
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      slots.push({
        id: (slotId++).toString(),
        start_time: startTime,
        end_time: endTime,
        duration_minutes: 45,
        slot_type: 'regular'
      });
      
      // Add break after every 3 periods (except after the last period)
      if ((i + 1) % 3 === 0 && i < 11) {
        const breakStartHours = Math.floor(currentTime / 60);
        const breakStartMinutes = currentTime % 60;
        const breakStartTime = `${breakStartHours.toString().padStart(2, '0')}:${breakStartMinutes.toString().padStart(2, '0')}`;
        
        currentTime += generationRequest.constraints.break_duration; // Use dynamic break duration
        const breakEndHours = Math.floor(currentTime / 60);
        const breakEndMinutes = currentTime % 60;
        const breakEndTime = `${breakEndHours.toString().padStart(2, '0')}:${breakEndMinutes.toString().padStart(2, '0')}`;
        
        slots.push({
          id: (slotId++).toString(),
          start_time: breakStartTime,
          end_time: breakEndTime,
          duration_minutes: generationRequest.constraints.break_duration,
          slot_type: 'break'
        });
      }
    }
    
    return slots;
  };
  
  // Generate dynamic time slots
  const dynamicTimeSlots = generateTimeSlots();
  
  // Constraint chat states
  const [constraintInput, setConstraintInput] = useState('');
  const [customConstraints, setCustomConstraints] = useState<string[]>([]);
  const [showConstraintChat, setShowConstraintChat] = useState(false);

  const subjectCategories = [
    { value: 'core', label: 'Core Subject' },
    { value: 'elective', label: 'Elective' },
    { value: 'vocational', label: 'Vocational' },
    { value: 'art_education', label: 'Art Education' },
    { value: 'physical_education', label: 'Physical Education' },
    { value: 'value_education', label: 'Value Education' },
  ];

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (isEditing && editingSubjectId) {
      // Update existing subject
      setSubjects(subjects.map(s => 
        s.id === editingSubjectId 
          ? { ...s, ...newSubject }
          : s
      ));
      toast.success('Subject updated successfully!');
    } else {
      // Add new subject
      const subject: Subject = {
        id: `subject-${Date.now()}`,
        ...newSubject,
      };
      setSubjects([...subjects, subject]);
      toast.success('Subject added successfully!');
    }
    
    // Reset form
    setNewSubject({
      name: '',
      code: '',
      category: 'core',
      credit_hours: 1,
      nep_priority: 'medium',
      multidisciplinary: false,
    });
    setIsEditing(false);
    setEditingSubjectId(null);
  };

  const handleEditSubject = (subject: Subject) => {
    setNewSubject({
      name: subject.name,
      code: subject.code,
      category: subject.category,
      credit_hours: subject.credit_hours,
      nep_priority: subject.nep_priority,
      multidisciplinary: subject.multidisciplinary,
    });
    setIsEditing(true);
    setEditingSubjectId(subject.id);
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(s => s.id !== subjectId));
      toast.success('Subject deleted successfully!');
    }
  };

  const handleAddConstraint = () => {
    if (constraintInput.trim() !== '') {
      setCustomConstraints([...customConstraints, constraintInput.trim()]);
      setConstraintInput('');
    }
  };

  const handleRemoveConstraint = (index: number) => {
    setCustomConstraints(customConstraints.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (subjects.length === 0) {
      toast.error('Please add at least one subject before generating timetable');
      return;
    }
    
    if (classes.length === 0) {
      toast.error('Please add at least one class before generating timetable');
      return;
    }

    setIsGenerating(true);
    try {
      toast.success('AI timetable generation started!');
      
      // Prepare the generation request with custom constraints
      const request: AIGenerationRequest = {
        school_id: 'default-school',
        class_ids: classes.map(cls => cls.id),
        constraints: generationRequest.constraints,
        preferences: generationRequest.preferences,
      };

      // Generate dynamic time slots based on current constraints
      const currentTimeSlots = generateTimeSlots();

      // Call the OpenAI API with subjects, teachers, time slots, request, and custom constraints
      // If API key is not configured, it will use the fallback implementation
      const response = await aiGenerator.generateTimetable(
        subjects,
        mockTeachers,
        currentTimeSlots,
        request,
        customConstraints
      );
      
      if (response.success) {
        // Transform the AI response into the format expected by the timetable display
        const timetableData = classes.map(cls => {
          const schedule: Record<string, any[]> = {};
          
          days.forEach(day => {
            // Filter time slots based on the maximum periods per day setting
            // Count regular slots and limit to max_periods_per_day
            let regularSlotCount = 0;
            const filteredTimeSlots = currentTimeSlots.filter(slot => {
              if (slot.slot_type === 'break') {
                return true; // Always include breaks
              } else {
                // Only include regular slots up to the maximum periods per day
                if (regularSlotCount < request.constraints.max_periods_per_day) {
                  regularSlotCount++;
                  return true;
                }
                return false;
              }
            });
            
            schedule[day] = filteredTimeSlots.map(slot => {
              if (slot.slot_type === 'break') {
                return {
                  subject: 'Break Time',
                  faculty: '-',
                  room: '-',
                  type: 'break',
                  slotId: slot.id // Add slotId for easier matching
                };
              } else {
                // Find matching timetable entry for this class, slot and day
                const entry = response.timetable.find(
                  e => e.class_id === cls.id && e.day_of_week === days.indexOf(day) + 1 && e.time_slot_id === slot.id
                );
                
                if (entry) {
                  const subject = subjects.find(s => s.id === entry.subject_id);
                  return {
                    subject: subject?.name || 'Unknown Subject',
                    faculty: '-', // Removed teacher names as requested
                    room: entry.room_number || `Room ${Math.floor(Math.random() * 20) + 100}`,
                    type: subject?.category === 'physical_education' ? 'lab' : 'theory',
                    slotId: slot.id // Add slotId for easier matching
                  };
                } else {
                  // If no entry found, this is a free period
                  return {
                    subject: '',
                    faculty: '-',
                    room: '-',
                    type: 'free',
                    slotId: slot.id // Add slotId for easier matching
                  };
                }
              }
            });
          });
          
          return {
            section: cls.name,
            room: `${cls.total_students} students`,
            schedule: schedule
          };
        });
        
        setGeneratedTimetable(timetableData);
        setIsGenerating(false);
        toast.success('Timetable generated successfully with AI!');
      } else {
        throw new Error('Failed to generate timetable');
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate timetable. Please try again.');
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!generatedTimetable) {
      toast.error('Please generate a timetable first');
      return;
    }
    
    // Create a new window for PDF content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }
    
    // Generate dynamic time slots based on current constraints
    const currentTimeSlots = generateTimeSlots();
    
    // Filter time slots based on the maximum periods per day setting for PDF display
    let regularSlotCount = 0;
    const filteredTimeSlots = currentTimeSlots.filter(slot => {
      if (slot.slot_type === 'break') {
        return true; // Always include breaks
      } else {
        // Only include regular slots up to the maximum periods per day
        if (regularSlotCount < generationRequest.constraints.max_periods_per_day) {
          regularSlotCount++;
          return true;
        }
        return false;
      }
    });
    
    const doc = printWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Timetable Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background: #f2f2f2; font-weight: bold; }
          .break { background: #ffebee; }
          .lab { background: #e8f5e8; }
          .theory { background: #e3f2fd; }
          .header { text-align: center; margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Academic Timetable Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          ${customConstraints.length > 0 ? `<p><strong>Custom Constraints Applied:</strong> ${customConstraints.join(', ')}</p>` : ''}
        </div>
    `);
    
    generatedTimetable.forEach((timetable: any) => {
      doc.write(`
        <div class="section-title">${timetable.section} - ${timetable.room}</div>
        <table>
          <thead>
            <tr>
              <th>Day/Time</th>
              ${filteredTimeSlots.map(slot => `<th>${slot.start_time}-${slot.end_time}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
      `);
      
      days.forEach(day => {
        doc.write(`<tr><td><strong>${day}</strong></td>`);
        // Display the filtered time slots from the schedule
        timetable.schedule[day].forEach((entry: any) => {
          const className = entry.type === 'break' ? 'break' : 
                           entry.type === 'lab' ? 'lab' : 'theory';
          doc.write(`
            <td class="${className}">
              <div>${entry.subject}</div>
              ${entry.faculty !== '-' ? `<small>${entry.faculty}</small>` : ''}
              ${entry.room !== '-' ? `<small>${entry.room}</small>` : ''}
            </td>
          `);
        });
        doc.write('</tr>');
      });
      
      doc.write('</tbody></table>');
    });
    
    doc.write(`
      </body>
      </html>
    `);
    doc.close();
    
    // Auto print after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 1000);
    
    toast.success('PDF will be downloaded shortly!');
  };

  const getCategoryLabel = (category: string) => {
    const cat = subjectCategories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">AI Timetable Generator</h1>
              <p className="text-blue-100 mt-1">NEP 2020 Compliant Intelligent Scheduling for College Classes</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Constraint Chat Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowConstraintChat(!showConstraintChat)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showConstraintChat ? 'Hide' : 'Show'} Custom Constraints
            </button>
          </div>

          {/* Constraint Chat Panel */}
          {showConstraintChat && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Timetable Constraints</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add custom constraints that will be applied to the timetable generation process.
              </p>
              
              {/* Custom Constraints List */}
              {customConstraints.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Active Constraints:</h4>
                  <div className="flex flex-wrap gap-2">
                    {customConstraints.map((constraint, index) => (
                      <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span>{constraint}</span>
                        <button 
                          onClick={() => handleRemoveConstraint(index)}
                          className="ml-2 text-blue-600 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Constraint Input */}
              <div className="flex">
                <input
                  type="text"
                  value={constraintInput}
                  onChange={(e) => setConstraintInput(e.target.value)}
                  placeholder="e.g., No classes after 4 PM, Mathematics should be in morning"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddConstraint()}
                />
                <button
                  onClick={handleAddConstraint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter or click the send button to add a constraint
              </p>
              
              {/* Display current constraints in the UI */}
              {customConstraints.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> The following constraints will be applied during AI generation:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-sm text-blue-700">
                    {customConstraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Classes Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">College Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-600">{cls.total_students} students</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Section {cls.section}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Input Form */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics, Computer Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MATH101, CS101"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newSubject.category}
                  onChange={(e) => setNewSubject({...newSubject, category: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subjectCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Hours
                </label>
                <input
                  type="number"
                  value={newSubject.credit_hours}
                  onChange={(e) => setNewSubject({...newSubject, credit_hours: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NEP Priority
                </label>
                <select
                  value={newSubject.nep_priority}
                  onChange={(e) => setNewSubject({...newSubject, nep_priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  checked={newSubject.multidisciplinary}
                  onChange={(e) => setNewSubject({...newSubject, multidisciplinary: e.target.checked})}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Multidisciplinary Subject
                </label>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleAddSubject}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Subject' : 'Add Subject'}
              </button>
              
              {isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingSubjectId(null);
                    setNewSubject({
                      name: '',
                      code: '',
                      category: 'core',
                      credit_hours: 1,
                      nep_priority: 'medium',
                      multidisciplinary: false,
                    });
                  }}
                  className="ml-2 inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Subjects List */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Subjects ({subjects.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NEP Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryLabel(subject.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {subject.credit_hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subject.nep_priority === 'high' ? 'bg-red-100 text-red-800' :
                          subject.nep_priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {subject.nep_priority.charAt(0).toUpperCase() + subject.nep_priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditSubject(subject)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* NEP Compliance Features */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              NEP 2020 Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Multidisciplinary Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Holistic Development Focus</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Flexible Curriculum Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Art & Value Education Priority</span>
              </div>
            </div>
          </div>

          {/* Constraints Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Schedule Constraints
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Periods per Day
                  </label>
                  <input
                    type="number"
                    value={generationRequest.constraints.max_periods_per_day}
                    onChange={(e) => setGenerationRequest({
                      ...generationRequest,
                      constraints: {
                        ...generationRequest.constraints,
                        max_periods_per_day: parseInt(e.target.value)
                      }
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
                    value={generationRequest.constraints.break_duration}
                    onChange={(e) => setGenerationRequest({
                      ...generationRequest,
                      constraints: {
                        ...generationRequest.constraints,
                        break_duration: parseInt(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                NEP Compliance Options
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={generationRequest.constraints.nep_compliance_strict}
                    onChange={(e) => setGenerationRequest({
                      ...generationRequest,
                      constraints: {
                        ...generationRequest.constraints,
                        nep_compliance_strict: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Strict NEP 2020 Compliance
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={generationRequest.constraints.multidisciplinary_sessions}
                    onChange={(e) => setGenerationRequest({
                      ...generationRequest,
                      constraints: {
                        ...generationRequest.constraints,
                        multidisciplinary_sessions: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Enable Multidisciplinary Sessions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={generationRequest.constraints.co_curricular_mandatory}
                    onChange={(e) => setGenerationRequest({
                      ...generationRequest,
                      constraints: {
                        ...generationRequest.constraints,
                        co_curricular_mandatory: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Mandatory Co-curricular Activities
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`
                inline-flex items-center px-8 py-3 rounded-lg text-white font-medium text-lg
                ${isGenerating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating AI Timetable...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Timetable
                </>
              )}
            </button>
            
            {/* Show applied constraints below the button */}
            {customConstraints.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md max-w-2xl mx-auto">
                <p className="text-sm text-blue-800">
                  <strong>Applied Constraints:</strong> {customConstraints.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Generated Timetable Display */}
          {generatedTimetable && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generated Timetable</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={downloadPDF}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {generatedTimetable.map((timetable: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {timetable.section}
                        </h3>
                        <span className="text-sm text-gray-600">
                          🏢 {timetable.room}
                        </span>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto p-4">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="border border-gray-200 px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Day/Time
                            </th>
                            {/* Filter time slots based on the maximum periods per day setting */}
                            {(() => {
                              // Generate dynamic time slots based on current constraints
                              const currentTimeSlots = generateTimeSlots();
                              
                              let regularSlotCount = 0;
                              return currentTimeSlots.filter(slot => {
                                if (slot.slot_type === 'break') {
                                  return true; // Always include breaks
                                } else {
                                  // Only include regular slots up to the maximum periods per day
                                  if (regularSlotCount < generationRequest.constraints.max_periods_per_day) {
                                    regularSlotCount++;
                                    return true;
                                  }
                                  return false;
                                }
                              }).map(slot => (
                                <th 
                                  key={slot.id} 
                                  className="border border-gray-200 px-3 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {slot.start_time}-{slot.end_time}
                                </th>
                              ));
                            })()}
                          </tr>
                        </thead>
                        <tbody>
                          {days.map(day => (
                            <tr key={day}>
                              <td className="border border-gray-200 px-3 py-2 bg-blue-50 font-medium text-gray-700 text-sm">
                                {day}
                              </td>
                              {/* Display the filtered time slots from the schedule */}
                              {timetable.schedule[day].map((entry: any) => {
                                const cellClass = entry.type === 'break' ? 'bg-pink-50' : 
                                                entry.type === 'lab' ? 'bg-green-50' : 
                                                entry.type === 'free' ? 'bg-gray-50' : 
                                                'bg-blue-50';
                                
                                return (
                                  <td 
                                    key={`${day}-${entry.slotId}`} 
                                    className={`border border-gray-200 px-2 py-2 text-center ${cellClass}`}
                                  >
                                    {entry.subject ? (
                                      <div className="subject-info">
                                        <div className="subject-name font-medium text-xs">
                                          {entry.subject}
                                        </div>
                                        {/* Removed faculty/teacher name display as requested */}
                                        {entry.room && entry.room !== '-' && (
                                          <div className="room-name text-xs text-gray-500 mt-1">
                                            {entry.room}
                                          </div>
                                        )}
                                      </div>
                                    ) : entry.type === 'break' ? (
                                      <div className="text-pink-700 font-medium text-xs">Break Time</div>
                                    ) : (
                                      <div className="text-gray-400 text-xs">Free Period</div>
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
                ))}
              </div>
            </div>
          )}

          {/* API Key Notice */}
          {!import.meta.env.VITE_OPENAI_API_KEY && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="font-medium text-yellow-800">OpenAI API Key Required</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    To use AI-powered timetable generation, please add your OpenAI API key to the environment variables.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}