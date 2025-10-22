import React, { useEffect, useState } from "react";


// Component to show student row
const StudentRow = ({ student }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-2 px-4 text-center">{student.rank}</td>
    <td className="py-2 px-4 flex items-center gap-2">
      <img
        src={student.student.avatar}
        alt={student.student.name}
        className="w-8 h-8 rounded-full"
      />
      {student.student.name}
    </td>
    <td className="py-2 px-4 text-center">{student.assignmentsScore}</td>
    <td className="py-2 px-4 text-center">{student.attendance}%</td>
    <td className="py-2 px-4 text-center font-semibold">{student.totalScore}</td>
  </tr>
);

const LeaderboardPage = () => {
 
    const students =  [
    {
      student: { name: "Alice", avatar: "https://i.pravatar.cc/50?img=1" },
      assignmentsScore: 92,
      attendance: 95,
      totalScore: 187,
      rank: 1,
    },
    {
      student: { name: "Bob", avatar: "https://i.pravatar.cc/50?img=2" },
      assignmentsScore: 88,
      attendance: 90,
      totalScore: 178,
      rank: 2,
    },
    {
      student: { name: "Charlie", avatar: "https://i.pravatar.cc/50?img=3" },
      assignmentsScore: 85,
      attendance: 85,
      totalScore: 170,
      rank: 3,
    },
  ];


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Classroom Leaderboard</h1>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-center">Rank</th>
              <th className="py-2 px-4 text-left">Student</th>
              <th className="py-2 px-4 text-center">Assignments</th>
              <th className="py-2 px-4 text-center">Attendance</th>
              <th className="py-2 px-4 text-center">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <StudentRow key={student.student.name} student={student} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Stats Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Additional Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.student.name}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <h3 className="font-medium">{student.student.name}</h3>
              <p>Assignments Score: {student.assignmentsScore}</p>
              <p>Attendance: {student.attendance}%</p>
              <p>Total Score: {student.totalScore}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
