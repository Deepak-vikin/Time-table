import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Star, Users } from 'lucide-react';
import { Subject } from '../types';
import { dbService } from '../lib/database';
import toast from 'react-hot-toast';

const subjectCategories = [
  { value: 'core', label: 'Core Subject', color: 'bg-blue-100 text-blue-800' },
  { value: 'elective', label: 'Elective', color: 'bg-purple-100 text-purple-800' },
  { value: 'vocational', label: 'Vocational', color: 'bg-orange-100 text-orange-800' },
  { value: 'art_education', label: 'Art Education', color: 'bg-pink-100 text-pink-800' },
  { value: 'physical_education', label: 'Physical Education', color: 'bg-green-100 text-green-800' },
  { value: 'value_education', label: 'Value Education', color: 'bg-yellow-100 text-yellow-800' },
];

const nepPriorities = [
  { value: 'high', label: 'High Priority', icon: '🔴' },
  { value: 'medium', label: 'Medium Priority', icon: '🟡' },
  { value: 'low', label: 'Low Priority', icon: '🟢' },
];

export default function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'core' as Subject['category'],
    credit_hours: 1,
    nep_priority: 'medium' as Subject['nep_priority'],
    multidisciplinary: false,
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await dbService.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
      // Load mock data for demonstration
      setSubjects([
        { id: '1', name: 'Mathematics', code: 'MATH101', category: 'core', credit_hours: 6, nep_priority: 'high', multidisciplinary: false },
        { id: '2', name: 'English Literature', code: 'ENG101', category: 'core', credit_hours: 5, nep_priority: 'high', multidisciplinary: true },
        { id: '3', name: 'Physics', code: 'PHY101', category: 'core', credit_hours: 6, nep_priority: 'high', multidisciplinary: false },
        { id: '4', name: 'Art & Craft', code: 'ART101', category: 'art_education', credit_hours: 3, nep_priority: 'high', multidisciplinary: true },
        { id: '5', name: 'Physical Education', code: 'PE101', category: 'physical_education', credit_hours: 2, nep_priority: 'medium', multidisciplinary: false },
        { id: '6', name: 'Computer Science', code: 'CS101', category: 'vocational', credit_hours: 4, nep_priority: 'medium', multidisciplinary: true },
        { id: '7', name: 'Moral Science', code: 'MS101', category: 'value_education', credit_hours: 2, nep_priority: 'high', multidisciplinary: true },
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        // Update existing subject
        const updatedSubjects = subjects.map(s => 
          s.id === editingSubject.id 
            ? { ...editingSubject, ...formData }
            : s
        );
        setSubjects(updatedSubjects);
        toast.success('Subject updated successfully!');
      } else {
        // Create new subject
        const newSubject: Subject = {
          id: `subject-${Date.now()}`,
          ...formData,
        };
        setSubjects([...subjects, newSubject]);
        toast.success('Subject created successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error('Failed to save subject');
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      category: subject.category,
      credit_hours: subject.credit_hours,
      nep_priority: subject.nep_priority,
      multidisciplinary: subject.multidisciplinary,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        setSubjects(subjects.filter(s => s.id !== subjectId));
        toast.success('Subject deleted successfully!');
      } catch (error) {
        console.error('Error deleting subject:', error);
        toast.error('Failed to delete subject');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: 'core',
      credit_hours: 1,
      nep_priority: 'medium',
      multidisciplinary: false,
    });
    setEditingSubject(null);
    setIsModalOpen(false);
  };

  const getCategoryInfo = (category: string) => {
    return subjectCategories.find(c => c.value === category) || subjectCategories[0];
  };

  const getPriorityInfo = (priority: string) => {
    return nepPriorities.find(p => p.value === priority) || nepPriorities[1];
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="mt-2 text-gray-600">Manage subjects according to NEP 2020 guidelines</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Subject
        </button>
      </div>

      {/* NEP 2020 Guidelines */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NEP 2020 Subject Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Multidisciplinary approach encouraged</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Art education given high priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-700">Value education integrated</span>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const categoryInfo = getCategoryInfo(subject.category);
          const priorityInfo = getPriorityInfo(subject.nep_priority);
          
          return (
            <div key={subject.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(subject)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                    {categoryInfo.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">NEP Priority:</span>
                  <span className="flex items-center space-x-1">
                    <span>{priorityInfo.icon}</span>
                    <span className="text-sm font-medium">{priorityInfo.label}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Credit Hours:</span>
                  <span className="text-sm font-medium">{subject.credit_hours}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Multidisciplinary:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subject.multidisciplinary 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subject.multidisciplinary ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
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
                  Subject Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Subject['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {subjectCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Hours
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.credit_hours}
                  onChange={(e) => setFormData({ ...formData, credit_hours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NEP Priority
                </label>
                <select
                  value={formData.nep_priority}
                  onChange={(e) => setFormData({ ...formData, nep_priority: e.target.value as Subject['nep_priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {nepPriorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="multidisciplinary"
                  checked={formData.multidisciplinary}
                  onChange={(e) => setFormData({ ...formData, multidisciplinary: e.target.checked })}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="multidisciplinary" className="ml-2 text-sm text-gray-700">
                  Multidisciplinary Subject
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
                  {editingSubject ? 'Update' : 'Create'} Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}