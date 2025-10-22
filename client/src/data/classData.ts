export   const classroomData = {
    overview: {
      className: "Web Development 101",
      instructor: "Dr. Sophia Lee",
      totalStudents: 48,
      nextClass: "2025-10-23T14:00:00Z",
      summary:
        "Welcome to Web Dev 101! This course introduces HTML, CSS, JavaScript, and React basics for beginners. Stay consistent and practice regularly.",
    },

    modules: [
      {
        id: 1,
        title: "Introduction to Web Development",
        topics: ["What is the Web?", "HTML Structure", "Setting Up VS Code"],
        status: "Completed",
      },
      {
        id: 2,
        title: "CSS Fundamentals",
        topics: ["Selectors", "Box Model", "Flexbox", "Responsive Design"],
        status: "In Progress",
      },
      {
        id: 3,
        title: "JavaScript Basics",
        topics: ["Variables", "Functions", "DOM Manipulation"],
        status: "Upcoming",
      },
      {
        id: 4,
        title: "React Essentials",
        topics: ["JSX", "Components", "Props & State"],
        status: "Upcoming",
      },
    ],


assignments: [
  {
    _id: "6715b77a8a1c2e42c4d2a111",
    title: "Build Your First Portfolio Website",
    description:
      "Create a responsive personal portfolio website using HTML, CSS, and basic JavaScript. Include at least three sections: About, Projects, and Contact.",
    dueDate: new Date("2025-10-25T23:59:00Z"),
    createdBy: "6715b99d8a1c2e42c4d2a777", // example teacher
    maxPoints: 100,
    createdAt: new Date("2025-10-10T10:00:00Z"),
    status:"Submitted"
  },
  {
    _id: "6715b77a8a1c2e42c4d2a112",
    title: "Responsive Layout Challenge",
    description:
      "Recreate a given webpage layout using CSS Flexbox and Grid. Ensure it looks good on both mobile and desktop.",
    dueDate: new Date("2025-10-28T23:59:00Z"),
    createdBy: "6715b99d8a1c2e42c4d2a777",
    maxPoints: 50,
    createdAt: new Date("2025-10-15T12:00:00Z"),
    status:"pending"

  },
  {
    _id: "6715b77a8a1c2e42c4d2a113",
    title: "JavaScript Quiz",
    description:
      "A timed quiz covering JavaScript basics, including variables, arrays, and DOM manipulation.",
    dueDate: new Date("2025-11-02T23:59:00Z"),
    createdBy: "6715b99d8a1c2e42c4d2a777",
    maxPoints: 40,
    createdAt: new Date("2025-10-20T09:00:00Z"),
    status:"Submitted"
  },
  {
    _id: "6715b77a8a1c2e42c4d2a114",
    title: "React Component Challenge",
    description:
      "Build a small React app with at least two components and one prop/state interaction. Submit via GitHub link.",
    dueDate: new Date("2025-11-05T23:59:00Z"),
    createdBy: "6715b99d8a1c2e42c4d2a777",
    maxPoints: 70,
    createdAt: new Date("2025-10-18T14:00:00Z"),
    status:"pending"
  },
],

    notes: [
      {
        id: 1,
        topic: "HTML Basics",
        content:
          "HTML stands for HyperText Markup Language. It defines the structure of web pages using elements and tags.",
        lastUpdated: "2025-10-19",
      },
      {
        id: 2,
        topic: "CSS Flexbox",
        content:
          "Flexbox helps create flexible and responsive layouts. Remember main axis (justify-content) and cross axis (align-items).",
        lastUpdated: "2025-10-20",
      },
    ],

    leaderboard: [
      { id: 1, name: "Alice Johnson", points: 980 },
      { id: 2, name: "Ravi Patel", points: 940 },
      { id: 3, name: "Maria Gonzalez", points: 910 },
      { id: 4, name: "Liam Chen", points: 875 },
      { id: 5, name: "You", points: 860 },
    ],
  };