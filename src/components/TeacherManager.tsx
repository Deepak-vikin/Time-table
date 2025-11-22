import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Award, Mail, Calendar } from 'lucide-react';
import { Teacher } from '../types';
import { dbService } from '../lib/database';
import toast from 'react-hot-toast';

const specializations = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 
  'Geography', 'Economics', 'Political Science', 'Computer Science', 'Art', 'Music', 
  'Physical Education', 'Moral Science', 'Environmental Science', 'Psychology'
];

export default function TeacherManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: [] as string[],
    experience_years: 0,
    nep_trained: false,
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const data = await dbService.getTeachersBySchool('default-school');
      setTeachers(data);
    } catch (error) {
      console.error('Error loading teachers:', error);
      // Load mock data for demonstration
      setTeachers([
        { id: '1', school_id: '1', name: 'Dr. Priya Sharma', email: 'priya@school.edu', specialization: ['Mathematics', 'Statistics'], experience_years: 15, nep_trained: true },
        { id: '2', school_id: '1', name: 'Mr. Rajesh Kumar', email: 'rajesh@school.edu', specialization: ['Physics', 'Chemistry'], experience_years: 12, nep_trained: true },
        { id: '3', school_id: '1', name: 'Ms. Anita Patel', email: 'anita@school.edu', specialization: ['English', 'Literature'], experience_years: 10, nep_trained: true },
        { id: '4', school_id: '1', name: 'Mr. Suresh Nair', email: 'suresh@school.edu', specialization: ['Art', 'Craft'], experience_years: 8, nep_trained: true },
        { id: '5', school_id: '1', name: 'Ms. Kavita Singh', email: 'kavita@school.edu', specialization: ['Physical Education', 'Sports'], experience_years: 6, nep_trained: false },
        { id: '6', school_id: '1', name: 'Dr. Amit Verma', email: 'amit@school.edu', specialization: ['Computer Science', 'AI'], experience_years: 9, nep_trained: true },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.specialization.length === 0) {
      toast.error('Please select at least one specialization');
      return;
    }

    try {
      if (editingTeacher) {
        // Update existing teacher
        const updatedTeachers = teachers.map(t => 
          t.id === editingTeacher.id 
            ? { ...editingTeacher, ...formData, school_id: editingTeacher.school_id }
            : t
        );
        setTeachers(updatedTeachers);
        toast.success('Teacher updated successfully!');
      } else {
        // Create new teacher
        const newTeacher: Teacher = {
          id: `teacher-${Date.now()}`,
          school_id: 'default-school',
          ...formData,
        };
        setTeachers([...teachers, newTeacher]);
        toast.success('Teacher added successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error('Failed to save teacher');
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      specialization: teacher.specialization,
      experience_years: teacher.experience_years,
      nep_trained: teacher.nep_trained,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        setTeachers(teachers.filter(t => t.id !== teacherId));
        toast.success('Teacher deleted successfully!');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('Failed to delete teacher');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      specialization: [],
      experience_years: 0,
      nep_trained: false,
    });
    setEditingTeacher(null);
    setIsModalOpen(false);
  };

  const handleSpecializationChange = (spec: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        specialization: [...formData.specialization, spec]
      });
    } else {
      setFormData({
        ...formData,
        specialization: formData.specialization.filter(s => s !== spec)
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="mt-2 text-gray-600">Manage teaching staff and their NEP 2020 training status</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* NEP Training Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NEP Trained</p>
              <p className="text-2xl font-bold text-gray-900">
                {teachers.filter(t => t.nep_trained).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Experience</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(teachers.reduce((sum, t) => sum + t.experience_years, 0) / teachers.length || 0)} yrs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NEP Compliance</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((teachers.filter(t => t.nep_trained).length / teachers.length) * 100 || 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 mr-1" />
                    {teacher.email}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(teacher)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(teacher.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Specialization:</p>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialization.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Experience:</span>
                <span className="text-sm font-medium">{teacher.experience_years} years</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">NEP 2020 Trained:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  teacher.nep_trained 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {teacher.nep_trained ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                  {specializations.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.specialization.includes(spec)}
                        onChange={(e) => handleSpecializationChange(spec, e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="nep_trained"
                  checked={formData.nep_trained}
                  onChange={(e) => setFormData({ ...formData, nep_trained: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="nep_trained" className="ml-2 text-sm text-gray-700">
                  NEP 2020 Trained
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingTeacher ? 'Update' : 'Add'} Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}