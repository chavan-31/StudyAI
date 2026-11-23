const curriculum = {
  "1st Semester": {
    "Engineering Mathematics I": [
      "Matrices",
      "Differential Calculus",
      "Integral Calculus",
    ],
    "Engineering Physics": ["Mechanics", "Optics", "Modern Physics"],
    "Engineering Chemistry": [
      "Atomic Structure",
      "Chemical Bonding",
      "Electrochemistry",
    ],
    "Programming for Problem Solving": [
      "C Basics",
      "Operators",
      "Conditions",
      "Loops",
      "Functions",
      "Arrays",
    ],
    "Basic Electrical Engineering": [
      "DC Circuits",
      "AC Circuits",
      "Electrical Machines",
    ],
    "Engineering Graphics": ["Projections", "Sections", "Isometric Views"],
    "Communication Skills": [
      "Grammar",
      "Vocabulary",
      "Technical Communication",
    ],
  },

  "2nd Semester": {
    "Engineering Mathematics II": [
      "Differential Equations",
      "Vector Calculus",
      "Numerical Methods",
    ],
    "Data Structures Fundamentals": [
      "Arrays",
      "Stacks",
      "Queues",
      "Linked Lists",
    ],
    "Object-Oriented Programming": [
      "Classes",
      "Objects",
      "Inheritance",
      "Polymorphism",
    ],
    "Basic Electronics": ["Diodes", "Transistors", "Amplifiers"],
    "Digital Design": [
      "Number Systems",
      "Logic Gates",
      "Boolean Algebra",
      "Flip-Flops",
    ],
    "Environmental Studies": ["Ecosystems", "Pollution", "Sustainability"],
  },

  "3rd Semester": {
    "Discrete Mathematics": ["Logic", "Sets", "Relations", "Graph Theory"],
    "Data Structures": ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees"],
    "Computer Organization": [
      "CPU",
      "Memory",
      "Instruction Set",
      "I/O Organization",
    ],
    "Operating Systems": [
      "Processes",
      "Threads",
      "Scheduling",
      "Memory Management",
      "Deadlocks",
    ],
    "Java Programming": [
      "Basics",
      "OOP",
      "Arrays",
      "Strings",
      "Collections",
      "Exception Handling",
    ],
    "Python Programming": [
      "Basics",
      "Data Types",
      "Loops",
      "Functions",
      "Lists",
      "OOP",
    ],
    DBMS: ["SQL", "Keys", "Joins", "Normalization", "Transactions"],
  },

  "4th Semester": {
    "Design and Analysis of Algorithms": [
      "Complexity",
      "Searching",
      "Sorting",
      "Greedy",
      "Dynamic Programming",
    ],
    "Computer Networks": [
      "Network Models",
      "TCP/IP",
      "IP Addressing",
      "Routing",
      "Transport Layer",
    ],
    "Software Engineering": [
      "SDLC",
      "Requirements",
      "Design",
      "Testing",
      "Agile",
    ],
    "Web Technology": ["HTML", "CSS", "JavaScript", "DOM", "Web Forms"],
    "Theory of Computation": [
      "Finite Automata",
      "Regular Expressions",
      "CFG",
      "Turing Machines",
    ],
    "Advanced DBMS": [
      "Advanced SQL",
      "Indexing",
      "Transactions",
      "Query Processing",
    ],
  },

  "5th Semester": {
    "Artificial Intelligence": [
      "Search Algorithms",
      "Knowledge Representation",
      "Expert Systems",
    ],
    "Machine Learning": [
      "Supervised Learning",
      "Unsupervised Learning",
      "Regression",
      "Classification",
    ],
    "Compiler Design": [
      "Lexical Analysis",
      "Parsing",
      "Syntax Trees",
      "Code Generation",
    ],
    "Full Stack Development": [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js",
      "Node.js",
      "Express.js",
    ],
    "Cloud Computing": [
      "Cloud Models",
      "Virtualization",
      "Cloud Storage",
      "Cloud Security",
    ],
    "Data Science": [
      "Data Preparation",
      "Statistics",
      "Data Visualization",
      "Data Analysis",
    ],
    "Cyber Security": [
      "Security Basics",
      "Cryptography",
      "Network Security",
      "Web Security",
    ],
  },

  "6th Semester": {
    "Deep Learning": ["Neural Networks", "CNN", "RNN", "Training Models"],
    "Big Data Analytics": ["Hadoop", "MapReduce", "Spark", "Data Processing"],
    "Mobile Application Development": [
      "Android Basics",
      "Activities",
      "Layouts",
      "APIs",
    ],
    "Distributed Systems": [
      "Architecture",
      "Communication",
      "Consistency",
      "Fault Tolerance",
    ],
    "Internet of Things": [
      "IoT Architecture",
      "Sensors",
      "Protocols",
      "IoT Security",
    ],
    DevOps: ["Git", "CI/CD", "Docker", "Deployment", "Monitoring"],
    "Software Testing": [
      "Testing Fundamentals",
      "Unit Testing",
      "Integration Testing",
      "Automation",
    ],
  },

  "7th Semester": {
    "Generative AI": [
      "LLMs",
      "Prompt Engineering",
      "AI Applications",
      "Responsible AI",
    ],
    "Natural Language Processing": [
      "Text Processing",
      "Tokenization",
      "Embeddings",
      "Language Models",
    ],
    "Data Analytics": [
      "Excel",
      "SQL",
      "Python Analytics",
      "Power BI",
      "Data Visualization",
    ],
    "Advanced Web Development": [
      "React",
      "REST APIs",
      "Authentication",
      "MERN Stack",
    ],
    "Information Security": [
      "Access Control",
      "Encryption",
      "Threats",
      "Risk Management",
    ],
    "Project Work": [
      "Project Planning",
      "System Design",
      "Implementation",
      "Testing",
    ],
    Internship: [
      "Technical Skills",
      "Industry Practices",
      "Project Documentation",
    ],
  },

  "8th Semester": {
    "Major Project": [
      "Problem Definition",
      "Architecture",
      "Implementation",
      "Testing",
      "Deployment",
    ],
    Internship: ["Workplace Skills", "Technical Tasks", "Documentation"],
    "Technical Seminar": ["Research", "Presentation", "Technical Writing"],
    "Professional Elective": [
      "Subject Fundamentals",
      "Applications",
      "Advanced Concepts",
    ],
    "Placement Preparation": [
      "Aptitude",
      "DSA",
      "Java",
      "SQL",
      "Technical Interviews",
      "HR Interviews",
    ],
  },
};

function getSemesters() {
  return Object.keys(curriculum);
}

function getSubjects(semester) {
  return curriculum[semester] ? Object.keys(curriculum[semester]) : [];
}

function getTopics(semester, subject) {
  return curriculum[semester]?.[subject] || [];
}

function isValidTopic(semester, subject, topic) {
  return getTopics(semester, subject).includes(topic);
}

module.exports = {
  curriculum,
  getSemesters,
  getSubjects,
  getTopics,
  isValidTopic,
};
