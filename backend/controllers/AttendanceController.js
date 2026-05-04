import Attendance from "../models/Attendance.js";
export const markAttendance = async (req, res) => {
  try {
    const { qrData, latitude, longitude } = req.body;
    const userId = req.user.id;
    // QR validation
    if (qrData !== "OFFICE_ATTENDANCE_QR") {
      return res.status(400).json({ message: "Invalid QR" });
    }
    // Location validation
    const office = { lat: 19.0760, lon: 72.8777 };
    const distance = getDistance(
      latitude,
      longitude,
      office.lat,
      office.lon
    );
    if (distance > 50) {
      return res.status(403).json({
        message: "Outside office range",
      });
    }
    // Check already marked today
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const exists = await Attendance.findOne({
      userId,
      createdAt: { $gte: start, $lte: end },
    });
    if (exists) {
      return res.json({ message: "Already checked in today" });
    }
    // Save attendance
    await Attendance.create({
      userId,
      time: new Date(),
    });
    res.json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// Helper function
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
