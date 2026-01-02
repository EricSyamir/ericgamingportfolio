// Portfolio Projects Data
export const projectsData = [
  {
    id: 1,
    title: "AI Human Detection Drone",
    description: "Real-time computer vision model integrated with autonomous drone controls.",
    longDescription: "Developed an autonomous drone system with real-time human detection capabilities using YOLOv8 and OpenCV. The system processes video streams in real-time, identifies humans, and adjusts flight patterns accordingly. Deployed on AWS for remote monitoring and control.",
    tech: ["Python", "OpenCV", "TensorFlow", "AWS", "YOLOv8", "Raspberry Pi"],
    video: "videos/drone.mp4",
    link: "Portfolio/projects/drone/index.html",
    category: "AI/ML",
    year: "2024"
  },
  {
    id: 2,
    title: "Proton DX Smart Dashcam",
    description: "AI-enhanced IoT dashcam featuring motion detection and alert systems.",
    longDescription: "Created an intelligent dashcam system for Proton DX Hackathon (1st Runner Up). Features real-time motion detection, automatic incident recording, cloud storage integration, and mobile alerts. Built with Raspberry Pi and Azure IoT Hub.",
    tech: ["Python", "Raspberry Pi", "OpenCV", "Azure", "IoT Hub", "Computer Vision"],
    video: "videos/proton.mp4",
    link: "https://github.com/EricSyamir/protonair",
    category: "IoT",
    year: "2024"
  },
  {
    id: 3,
    title: "Smart Attendance System",
    description: "Facial recognition and educational analytics with ML backend.",
    longDescription: "Built a comprehensive attendance management system using facial recognition technology. Features include automated attendance tracking, student analytics, real-time reporting, and admin dashboards. Utilizes Flask backend with MySQL database and facial recognition ML models.",
    tech: ["Flask", "Python", "MySQL", "Docker", "Face Recognition", "ML"],
    video: "videos/attendance.mp4",
    link: "https://studentexcellence.great-site.net/index.php",
    category: "Full-Stack",
    year: "2024"
  },
  {
    id: 4,
    title: "Shopee Web Scraper",
    description: "Python-powered e-commerce data extraction and Website Dashboards.",
    longDescription: "Developed a sophisticated web scraping tool for extracting product data from Shopee. Features data cleaning, analysis, and visualization through interactive dashboards. Implemented with Python, Pandas, and NumPy for efficient data processing.",
    tech: ["Python", "Pandas", "NumPy", "HTML", "CSS", "Web Scraping", "BeautifulSoup"],
    video: "videos/shopee.mp4",
    link: "Portfolio/projects/shopee/index.html",
    category: "Data Analytics",
    year: "2024"
  },
  {
    id: 5,
    title: "Smart IoT Pillow",
    description: "Using Arduino and WiFi to implement IoT in daily life.",
    longDescription: "Created an innovative IoT pillow that monitors sleep patterns and provides smart alarm features. Uses Arduino with WiFi connectivity for data transmission and mobile app integration. Features include sleep quality tracking and smart wake-up alarms.",
    tech: ["Arduino", "WiFi", "HTML", "CSS", "IoT", "C++"],
    video: "videos/srp.mp4",
    link: "Portfolio/projects/srp.html",
    category: "IoT",
    year: "2023"
  },
  {
    id: 6,
    title: "IoT Dustbin Monitor",
    description: "Cloud-connected waste management prototype with automatic reporting.",
    longDescription: "Developed an intelligent waste management system using IoT sensors to monitor dustbin fill levels. Features automatic notifications, route optimization for collection, and cloud-based analytics dashboard. Implemented with Arduino, AWS IoT, and MySQL database.",
    tech: ["Arduino", "AWS", "MySQL", "IoT", "Cloud Computing"],
    video: "videos/dustbin.mp4",
    link: "https://github.com/EricSyamir/Sentinel",
    category: "IoT",
    year: "2023"
  },
  {
    id: 7,
    title: "AI Anime Desktop Helper",
    description: "NLP-driven animated assistant enhancing user productivity.",
    longDescription: "Built an AI-powered desktop assistant with anime-style interface. Features voice recognition, NLP processing, task automation, and personalized responses. Developed using Python, PyTorch for NLP models, and Electron for the desktop app.",
    tech: ["Python", "PyTorch", "Electron", "NLP", "Voice Recognition"],
    video: "videos/ai.mp4",
    link: "https://github.com/EricSyamir/mikudekstopai",
    category: "AI/ML",
    year: "2024"
  },
  {
    id: 8,
    title: "Responsive E-commerce Platforms",
    description: "Engineered modern, responsive e-commerce platforms with optimized checkout flows, secure auth, and scalable APIs.",
    longDescription: "Developed full-stack e-commerce platforms with modern UX/UI. Features include product management, shopping cart, secure payment integration, user authentication, order tracking, and admin dashboards. Built with React, Node.js, MySQL, and Docker for containerization.",
    tech: ["React", "Node.js", "MySQL", "Docker", "REST API", "JWT"],
    video: "videos/fullstack-project.mp4",
    link: "https://github.com/EricSyamir/ecom",
    category: "Full-Stack",
    year: "2024"
  },
  {
    id: 9,
    title: "Digitizing Competition System",
    description: "End-to-end digital platform for competition registration, scoring, and real-time leaderboards with admin dashboards.",
    longDescription: "Created a comprehensive competition management system for coding events. Features participant registration, real-time scoring, leaderboards, automated judging, and analytics dashboards. Built with React, Express.js, MongoDB, and deployed on AWS.",
    tech: ["React", "Express.js", "MongoDB", "AWS", "WebSockets", "Real-time"],
    video: "videos/comp.mp4",
    link: "https://github.com/EricSyamir/nasigoreng",
    category: "Full-Stack",
    year: "2024"
  }
];

// Get projects by category
export function getProjectsByCategory(category) {
  if (!category || category === 'all') return projectsData;
  return projectsData.filter(p => p.category === category);
}

// Get project by ID
export function getProjectById(id) {
  return projectsData.find(p => p.id === id);
}

// Get all unique categories
export function getCategories() {
  const categories = [...new Set(projectsData.map(p => p.category))];
  return ['all', ...categories];
}

