// import Classroom from "../models/classroom.model";

// db.classrooms.insertMany([
//   {
//     title: "Full Stack Web Development",
//     description:
//       "Learn to build full stack applications using JavaScript, Node.js, and React.",
//     overview: {
//       courseObjective:
//         "Train students to become proficient full stack developers.",
//       targetAudience: "Beginners to intermediate programmers.",
//       prerequisites: "Basic HTML, CSS, JS knowledge.",
//       learningOutcomes: [
//         "Build full stack apps",
//         "Deploy to cloud",
//         "Work with APIs",
//       ],
//       duration: "12 weeks",
//       mode: "online",
//       resources: [
//         "https://reactjs.org",
//         "https://nodejs.org",
//         "https://developer.mozilla.org",
//       ],
//     },
//     curriculum: [
//       {
//         moduleTitle: "Frontend Development",
//         moduleDescription: "Learn HTML, CSS, and React.",
//         topics: ["HTML Basics", "CSS Flexbox", "React Components"],
//         assignments: [],
//         resources: ["https://reactjs.org/docs/getting-started.html"],
//       },
//       {
//         moduleTitle: "Backend Development",
//         moduleDescription: "Learn Node.js, Express, and MongoDB.",
//         topics: ["Node.js Basics", "Express Routing", "MongoDB CRUD"],
//         assignments: [],
//         resources: [
//           "https://nodejs.org/en/docs/",
//           "https://www.mongodb.com/docs/",
//         ],
//       },
//     ],
//     syllabus: [
//       {
//         week: 1,
//         topic: "HTML & CSS",
//         description: "Basics of HTML & CSS",
//         readingMaterials: ["https://developer.mozilla.org/docs/Learn/HTML"],
//         assignments: [],
//       },
//       {
//         week: 2,
//         topic: "JavaScript Basics",
//         description: "JS fundamentals and DOM manipulation",
//         readingMaterials: [
//           "https://developer.mozilla.org/docs/Web/JavaScript/Guide",
//         ],
//         assignments: [],
//       },
//     ],
//     isPublic: true,
//     joinCode: "FSWD101",
//     tags: ["web", "full stack", "javascript"],
//     settings: {
//       maxStudents: 50,
//       allowGuests: true,
//       chatEnabled: true,
//       codeEditorEnabled: true,
//       canvasEnabled: true,
//     },
//     createdBy: "68f73f3e214b232629a9e61a",
//     schedules: ["650c8f1a0f1a2c00123abcd1"],
//     students: ["650c8f2a0f1a2c00123abcd1"],
//     assignments: ["650c8f4a0f1a2c00123abcd1"],
//     status: "active",
//     paid: true,
//     memberships: [],
//   },
//   {
//     title: "Data Science with Python",
//     description:
//       "Learn Python, Pandas, NumPy, and data visualization for data science.",
//     overview: {
//       courseObjective:
//         "Enable students to analyze and visualize data using Python.",
//       targetAudience: "Beginners and intermediate learners in data science.",
//       prerequisites: "Basic Python programming.",
//       learningOutcomes: [
//         "Analyze datasets",
//         "Create visualizations",
//         "Work with Pandas & NumPy",
//       ],
//       duration: "10 weeks",
//       mode: "offline",
//       resources: ["https://numpy.org", "https://pandas.pydata.org"],
//     },
//     curriculum: [
//       {
//         moduleTitle: "Python Basics",
//         moduleDescription: "Python fundamentals",
//         topics: ["Variables", "Loops", "Functions"],
//         assignments: [],
//         resources: ["https://docs.python.org/3/tutorial/"],
//       },
//       {
//         moduleTitle: "Data Analysis",
//         moduleDescription: "Pandas and NumPy",
//         topics: ["DataFrames", "Arrays", "Aggregations"],
//         assignments: [],
//         resources: ["https://pandas.pydata.org/docs/"],
//       },
//     ],
//     syllabus: [
//       {
//         week: 1,
//         topic: "Python Basics",
//         description: "Learn Python syntax and basics",
//         readingMaterials: ["https://docs.python.org/3/tutorial/"],
//         assignments: [],
//       },
//       {
//         week: 2,
//         topic: "Data Analysis",
//         description: "Analyze data with Pandas & NumPy",
//         readingMaterials: ["https://pandas.pydata.org/docs/"],
//         assignments: [],
//       },
//     ],
//     isPublic: true,
//     joinCode: "DS101",
//     tags: ["data science", "python", "analytics"],
//     settings: {
//       maxStudents: 40,
//       allowGuests: false,
//       chatEnabled: true,
//       codeEditorEnabled: false,
//       canvasEnabled: false,
//     },
//     createdBy: "650c8e1a0f1a2c00123abcd2",
//     schedules: ["650c8f1a0f1a2c00123abcd2"],
//     students: ["650c8f2a0f1a2c00123abcd2"],
//     assignments: ["650c8f4a0f1a2c00123abcd2"],
//     status: "active",
//     paid: false,
//     memberships: [],
//   },
//   {
//     title: "Machine Learning Essentials",
//     description: "Introduction to machine learning algorithms and techniques.",
//     overview: {
//       courseObjective: "Teach students the fundamentals of ML.",
//       targetAudience: "Intermediate programmers interested in AI.",
//       prerequisites: "Python, basic statistics.",
//       learningOutcomes: [
//         "Implement ML algorithms",
//         "Understand supervised & unsupervised learning",
//         "Model evaluation",
//       ],
//       duration: "14 weeks",
//       mode: "hybrid",
//       resources: [
//         "https://scikit-learn.org/stable/",
//         "https://tensorflow.org/",
//       ],
//     },
//     curriculum: [
//       {
//         moduleTitle: "Supervised Learning",
//         moduleDescription: "Regression and classification",
//         topics: ["Linear Regression", "Logistic Regression", "Decision Trees"],
//         assignments: [],
//         resources: ["https://scikit-learn.org/stable/"],
//       },
//       {
//         moduleTitle: "Unsupervised Learning",
//         moduleDescription: "Clustering and Dimensionality Reduction",
//         topics: ["K-Means", "PCA"],
//         assignments: [],
//         resources: ["https://scikit-learn.org/stable/"],
//       },
//     ],
//     syllabus: [
//       {
//         week: 1,
//         topic: "Intro to ML",
//         description: "History, applications, and basics of ML",
//         readingMaterials: ["https://scikit-learn.org/stable/"],
//         assignments: [],
//       },
//       {
//         week: 2,
//         topic: "Supervised Learning",
//         description: "Learn regression and classification",
//         readingMaterials: ["https://scikit-learn.org/stable/"],
//         assignments: [],
//       },
//     ],
//     isPublic: false,
//     joinCode: "ML101",
//     tags: ["machine learning", "AI", "python"],
//     settings: {
//       maxStudents: 30,
//       allowGuests: false,
//       chatEnabled: true,
//       codeEditorEnabled: true,
//       canvasEnabled: true,
//     },
//     createdBy: "68f117d819dd2f17bf734a4b",
//     schedules: ["650c8f1a0f1a2c00123abcd3"],
//     students: ["650c8f2a0f1a2c00123abcd3"],
//     assignments: ["650c8f4a0f1a2c00123abcd3"],
//     status: "active",
//     paid: true,
//     memberships: [],
//   },
//   {
//     title: "UI/UX Design Fundamentals",
//     description:
//       "Learn design principles and tools for user interface and experience.",
//     overview: {
//       courseObjective:
//         "Enable students to create beautiful and functional UI/UX designs.",
//       targetAudience: "Aspiring designers and frontend developers.",
//       prerequisites: "Basic design sense.",
//       learningOutcomes: [
//         "Wireframing",
//         "Prototyping",
//         "User Research",
//         "Adobe XD/Figma skills",
//       ],
//       duration: "8 weeks",
//       mode: "online",
//       resources: ["https://www.figma.com/resources/learn-design/"],
//     },
//     curriculum: [
//       {
//         moduleTitle: "Design Basics",
//         moduleDescription: "Colors, typography, and layouts",
//         topics: ["Color Theory", "Typography", "Layout Design"],
//         assignments: [],
//         resources: ["https://www.figma.com/resources/learn-design/"],
//       },
//       {
//         moduleTitle: "Prototyping & Testing",
//         moduleDescription: "Wireframing, prototyping, and user testing",
//         topics: ["Wireframes", "Prototypes", "User Testing"],
//         assignments: [],
//         resources: ["https://www.figma.com/resources/learn-design/"],
//       },
//     ],
//     syllabus: [
//       {
//         week: 1,
//         topic: "Intro to UI/UX",
//         description: "Basics of user interface and experience design",
//         readingMaterials: ["https://www.figma.com/resources/learn-design/"],
//         assignments: [],
//       },
//       {
//         week: 2,
//         topic: "Design Principles",
//         description: "Typography, color theory, and layout",
//         readingMaterials: ["https://www.figma.com/resources/learn-design/"],
//         assignments: [],
//       },
//     ],
//     isPublic: true,
//     joinCode: "UX101",
//     tags: ["ui", "ux", "design"],
//     settings: {
//       maxStudents: 25,
//       allowGuests: true,
//       chatEnabled: true,
//       codeEditorEnabled: false,
//       canvasEnabled: true,
//     },
//     createdBy: "68f117d819dd2f17bf734a4b",
//     schedules: ["650c8f1a0f1a2c00123abcd4"],
//     students: ["68ee29652aaa2273f68babc2"],
//     assignments: ["650c8f4a0f1a2c00123abcd4"],
//     status: "active",
//     paid: false,
//     memberships: [],
//   },
// ]);

// export const noteData = [
//   {
//     title: "React Hooks Overview",
//     content: "We covered useState, useEffect, and custom hooks in React.",
//     owner: "68ee29ab2aaa2273f68babdd",
//     sharedWith: ["68ee29652aaa2273f68babc2", "650c8f2a0f1a2c00123abcd3"],
//     isPublic: true,
//     classroom: "650c8f4a0f1a2c00123abcd1",
//     date: "2025-10-20T10:00:00Z",
//     module: "Frontend Development",
//     attachments: ["https://example.com/react-hooks.pdf"],
//   },
//   {
//     title: "Node.js Routing",
//     content: "Covered Express routing, middleware, and error handling.",
//     owner: "68ee29ab2aaa2273f68babdd",
//     sharedWith: [],
//     isPublic: true,
//     classroom: "650c8f4a0f1a2c00123abcd1",
//     date: "2025-10-20T11:00:00Z",
//     module: "Backend Development",
//     attachments: [],
//   },
//   {
//     title: "Python Pandas Basics",
//     content:
//       "Introduced DataFrames, Series, and basic data manipulation in Pandas.",
//     owner: "68ee29ab2aaa2273f68babdd",
//     sharedWith: ["68ee29652aaa2273f68babc2"],
//     isPublic: false,
//     classroom: "650c8f4a0f1a2c00123abcd2",
//     date: "2025-10-21T09:30:00Z",
//     module: "Data Analysis",
//     attachments: ["https://example.com/pandas-basics.pdf"],
//   },
//   {
//     title: "NumPy Arrays and Operations",
//     content:
//       "Explored arrays, indexing, slicing, and basic operations in NumPy.",
//     owner: "68ee29652aaa2273f68babc2",
//     sharedWith: [],
//     isPublic: true,
//     classroom: "650c8f4a0f1a2c00123abcd2",
//     date: "2025-10-21T10:30:00Z",
//     module: "Data Analysis",
//     attachments: [],
//   },
//   {
//     title: "Supervised Learning Introduction",
//     content:
//       "Covered linear regression, logistic regression, and decision trees.",
//     owner: "650c8f2a0f1a2c00123abcd3",
//     sharedWith: ["650c8f2a0f1a2c00123abcd1, 68ee29ab2aaa2273f68babdd"],
//     isPublic: true,
//     classroom: "650c8f4a0f1a2c00123abcd3",
//     date: "2025-10-22T11:00:00Z",
//     module: "Supervised Learning",
//     attachments: [],
//   },
//   {
//     title: "K-Means Clustering",
//     content:
//       "Discussed unsupervised learning, clustering, and K-Means algorithm.",
//     owner: "68ee29652aaa2273f68babc2",
//     sharedWith: [],
//     isPublic: false,
//     classroom: "650c8f4a0f1a2c00123abcd3",
//     date: "2025-10-22T12:00:00Z",
//     module: "Unsupervised Learning",
//     attachments: ["https://example.com/kmeans.pdf"],
//   },
//   {
//     title: "UI Design Principles",
//     content: "Covered color theory, typography, and layout design for UI/UX.",
//     owner: "68ee29652aaa2273f68babc2",
//     sharedWith: [
//       "650c8f2a0f1a2c00123abcd2",
//       "68ee29ab2aaa2273f68babdd",
//       "650c8f2a0f1a2c00123abcd3",
//     ],
//     isPublic: true,
//     classroom: "650c8f4a0f1a2c00123abcd4",
//     date: "2025-10-23T09:00:00Z",
//     module: "Design Basics",
//     attachments: [],
//   },
//   {
//     title: "Prototyping and User Testing",
//     content:
//       "Introduced wireframes, interactive prototypes, and user testing techniques.",
//     owner: "68ee29652aaa2273f68babc2",
//     sharedWith: ["68ee29ab2aaa2273f68babdd"],
//     isPublic: true,
//     classroom: "650c8f4a0f1a2c00123abcd4",
//     date: "2025-10-23T10:30:00Z",
//     module: "Prototyping & Testing",
//     attachments: ["https://example.com/prototyping.pdf"],
//   },
// ];

// export const assignmentData = [
//   {
//     classroom: "650c8f4a0f1a2c00123abcd1",
//     title: "React Components Assignment",
//     description:
//       "Build a React app with functional components and state management.",
//     dueDate: "2025-10-30T23:59:00Z",
//     createdBy: "68f73f3e214b232629a9e61a",
//     status: "pending",
//     maxPoints: 100,
//   },
//   {
//     classroom: "650c8f4a0f1a2c00123abcd2",
//     title: "Pandas DataFrame Exercise",
//     description:
//       "Perform data analysis using Pandas, including filtering, grouping, and aggregations.",
//     dueDate: "2025-10-28T23:59:00Z",
//     createdBy: "68f73f3e214b232629a9e61a",
//     status: "pending",
//     maxPoints: 80,
//   },
//   {
//     classroom: "650c8f4a0f1a2c00123abcd3",
//     title: "Linear Regression Project",
//     description:
//       "Implement a linear regression model and evaluate its performance.",
//     dueDate: "2025-11-05T23:59:00Z",
//     createdBy: "68f73f3e214b232629a9e61a",
//     status: "pending",
//     maxPoints: 120,
//   },
//   {
//     classroom: "650c8f4a0f1a2c00123abcd4",
//     title: "UI Wireframe Submission",
//     description: "Design wireframes for a mobile app using Figma or Adobe XD.",
//     dueDate: "2025-10-25T23:59:00Z",
//     createdBy: "68f73f3e214b232629a9e61a",
//     status: "pending",
//     maxPoints: 70,
//   },
//   {
//     classroom: "650c8f4a0f1a2c00123abcd1",
//     title: "React Hooks Mini Project",
//     description:
//       "Create a small React app demonstrating useState and useEffect hooks.",
//     dueDate: "2025-10-27T23:59:00Z",
//     createdBy: "68f73f3e214b232629a9e61a",
//     status: "pending",
//     maxPoints: 90,
//   },
// ];

// // const initdata = async () => {
// //   try {
// //     const res = await Classroom.insertMany(classdata);
// //     console.log("response : ", res);
// //   } catch (error) {
// //     console.log("error", error);
// //   }
// // };

// // initdata();
