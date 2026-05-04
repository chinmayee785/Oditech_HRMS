import mongoose from 'mongoose';
const AttendanceSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  date: { 
    type: String, 
    required: true // YYYY-MM-DD
  },
  checkIn: { 
    type: Date 
  },
  workHours: { 
    type: String, 
    default: '0h 0m' 
  },
  overtime: { 
    type: String, 
    default: '0h 0m' 
  },
  workStatus: { 
    type: String, 
    enum: ['Completed', 'Pending', 'Not Submitted'], 
    default: 'Pending' 
  },
  status: { 
    type: String, 
    enum: ['Present', 'Late', 'Absent', 'Half Day'], 
    default: 'Present' 
  },
  location: {
    lat: Number,
    lng: Number
  },
  // New field: store QR validation status
  qrVerified: {
    type: Boolean,
    default: false
  },
  // New field: distance from office (for admin audit)
  distanceFromOffice: {
    type: Number // in meters
  },
  // New field: device/browser info (optional but useful)
  deviceInfo: {
    type: String
  },
  remarks: { 
    type: String 
  }

}, { timestamps: true });

// Prevent multiple check-ins per day for same employee
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);
