import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NEP Timetable Server is running' });
});

// Timetable generation endpoint
app.post('/api/generate-timetable', async (req, res) => {
  try {
    const { constraints, preferences } = req.body;
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI-generated timetable response
    const mockResponse = {
      success: true,
      timetable: [
        {
          id: 'ai-gen-1',
          subject_id: '1',
          teacher_id: '1',
          time_slot_id: '1',
          day_of_week: 1,
          room_number: 'AI-Room-101',
          ai_confidence_score: 0.95,
          nep_compliance_score: 0.93
        },
        {
          id: 'ai-gen-2',
          subject_id: '2',
          teacher_id: '3',
          time_slot_id: '2',
          day_of_week: 1,
          room_number: 'AI-Room-102',
          ai_confidence_score: 0.91,
          nep_compliance_score: 0.89
        }
      ],
      metadata: {
        generation_time: '4.2s',
        nep_compliance: 'high',
        optimization_score: 92,
        multidisciplinary_integration: true
      }
    };
    
    res.json(mockResponse);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// NEP compliance analysis
app.post('/api/analyze-nep-compliance', (req, res) => {
  const { timetable } = req.body;
  
  const analysis = {
    overall_score: 89,
    categories: {
      multidisciplinary_integration: 92,
      art_education_priority: 88,
      physical_education_balance: 95,
      value_based_learning: 87,
      flexible_assessment: 85,
      holistic_development: 90
    },
    recommendations: [
      'Consider adding more multidisciplinary sessions between Science and Mathematics',
      'Schedule Art Education during peak creativity hours (morning)',
      'Ensure Physical Education is not scheduled immediately after meals'
    ]
  };
  
  res.json(analysis);
});

app.listen(PORT, () => {
  console.log(`NEP Timetable Server running on http://localhost:${PORT}`);
});