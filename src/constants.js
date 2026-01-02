export const scaleFactor = 4; // Map scale
export const playerScale = scaleFactor * 2; // Player scale (1.5x larger than map) - adjust multiplier to change character size

// RPG-style dialogues - each array element is one "page" (max 3 lines)
// Player presses Enter to advance to next page
export const dialogueData = {
  bed: [
    "A cozy bed for rest.",
    "About Me: CS Student @ UTP",
    "YUTP MARA Scholar. Passionate developer!"
  ],
  
  desk: [
    "My coding workstation.",
    "Check out my projects here!",
    "GitHub: github.com/ericsyamir"
  ],
  
  bookshelf: [
    "Programming books and resources.",
    "Skills: JavaScript, Python, React...",
    "Node.js, HTML/CSS, Git, and more!"
  ],
  
  computer: [
    "My development setup.",
    "View my portfolio projects!",
    "Web apps, games, and more..."
  ],
  
  gate: [
    "⚠️ WARNING: Dangerous Area Ahead!",
    "Slimes roam the fields beyond.",
    "Press F to attack. Good luck!"
  ],
  
  awards: [
    "🏆 Awards & Achievements",
    "YUTP MARA Scholarship recipient",
    "Academic excellence awards..."
  ],
  
  projects: [
    "📁 My Portfolio Projects",
    "2D RPG Portfolio (this game!)",
    "Web applications, games, and more..."
  ],
  
  education: [
    "🎓 Education",
    "Computer Science @ UTP",
    "YUTP MARA Scholar"
  ],
  
  contact: [
    "📞 Contact Information",
    "WhatsApp: +60 13-254 3999",
    "LinkedIn: Muhammad Eric Syamir"
  ],
  
  achievements: [
    "⭐ Achievements & Stats",
    "GitHub contributions",
    "Projects completed, skills learned..."
  ],
  
  skills: [
    "💻 Technical Skills",
    "Frontend: React, HTML, CSS, JS",
    "Backend: Node.js, Python..."
  ],
  
  welcome: [
    "👋 Welcome to My Portfolio!",
    "Explore to learn about me.",
    "Press E to interact with objects!"
  ],
  
  pc: [
    "💻 This is my workstation where I code daily.",
    "I'm proficient in Python, C++, JavaScript, PHP, SQL, and R.",
    "For AI/ML, I use TensorFlow, Scikit-learn, PyTorch, and OpenCV.",
    "I build web apps with Flask, React, Node.js, and Bootstrap.",
    "Databases? MySQL, PostgreSQL, and MongoDB are my go-to choices.",
    "Check out my work on GitHub! → github.com/ericsyamir"
  ],

  "cs-degree": [
    "🎓 UNIVERSITI TEKNOLOGI PETRONAS (UTP)",
    "Bachelor of Computer Science | 2024 – Present",
    "Focus: AI, Data Engineering, Software Systems",
    "🏆 YUTP MARA Scholar for academic excellence!",
    "📜 Dean's List Recipient - Foundation & Bachelor",
    "Coursework: ML, Software Design, Cloud Computing"
  ],

  "sofa-table": [
    "👋 Hey! I'm Eric Syamir!",
    "A passionate CS student who believes in tech's power to transform lives.",
    "My journey began with curiosity and evolved into innovation!",
    "🎮 I love gaming & sim racing - even won a competition!",
    "📚 I teach web development to 150+ students.",
    "🤝 I mentor peers in AI & data analytics workshops."
  ],

  tv: [
    "🏆 AWARDS & ACHIEVEMENTS",
    "🥇 Champion - Oh My Code Competition",
    "   Algorithmic & Design Excellence",
    "🥈 1st Runner Up - Proton DX Hackathon",
    "   Smart IoT & AI Dashboard Innovation",
    "🥈 1st Runner Up - Hacking Weekend Hackathon",
    "🎓 YUTP MARA Scholarship Recipient",
    "📜 Dean's List - Foundation & Bachelor CS"
  ],

  bed: [
    "💡 MY PHILOSOPHY",
    "Great ideas come when I'm relaxing here...",
    "I believe in building scalable, real-world solutions.",
    "📊 Using data to drive meaningful decisions.",
    "🤖 Leveraging AI for positive impact.",
    "👥 Empowering others through knowledge sharing.",
    "\"Technology is best when it brings people together.\""
  ],

  resume: [
    "💼 HEAD OF SPONSORSHIP - Convofest 2025 UTP",
    "Secured RM100,000+ in sponsorships!",
    "Led event logistics with multiple stakeholders.",
    "💼 HEAD OF TECHNICAL - Syntech UTP",
    "Directed teams building event software & IoT systems.",
    "Maintained timelines using Agile techniques.",
    "💼 WEB DEV TEACHER - 2019-2023",
    "Taught 150+ students front-end & back-end tech.",
    "💼 FREELANCE DEVELOPER - 2020-Present",
    "Built scalable web apps with ML features.",
    "📧 Contact: ericsyamir46@gmail.com",
    "📱 Phone: +6013-254 3999"
  ],

  projects: [
    "🚀 MY PORTFOLIO PROJECTS",
    "I've built 9 amazing projects across",
    "AI/ML, IoT, Full-Stack, and Data Analytics!",
    "",
    "📱 Click to open the interactive menu",
    "🎮 Browse through all my projects",
    "📹 Watch demo videos",
    "🔗 Visit GitHub repositories",
    "",
    "Press E or SPACE to view all projects!"
  ],

  library: [
    "📜 CERTIFICATIONS",
    "• Huawei Certified Network Analyst (HCNA)",
    "• Microsoft Power BI Data Analyst Associate",
    "• Google Data Analytics Certificate",
    "🛠️ TOOLS & SKILLS",
    "Cloud: AWS, Azure, GCP",
    "DevOps: Docker, GitHub Actions, CI/CD",
    "Network: CISCO, WireShark, ENSP, NMAP",
    "Collab: Git, Figma, Jupyter, Colab"
  ],
  
  github: [
    "🐙 MY GITHUB",
    "Check out my repositories!",
    "github.com/ericsyamir"
  ],

  exit: [
    "👋 THANKS FOR VISITING!",
    "Hope you enjoyed exploring my portfolio game!",
    "Let's connect and build something amazing!",
    "📧 ericsyamir46@gmail.com",
    "📱 +6013-254 3999",
    "💼 LinkedIn: Muhammad Eric Syamir",
    "💻 GitHub: @ericsyamir",
    "💬 WhatsApp: wa.me/60132543999"
  ],
};

// Friendly names for each interactive object
export const objectNames = {
  bed: "ABOUT ME",
  desk: "PROJECTS",
  bookshelf: "SKILLS",
  computer: "PORTFOLIO",
  gate: "GATE",
  awards: "AWARDS",
  projects: "PROJECTS",
  education: "EDUCATION",
  contact: "CONTACT",
  achievements: "ACHIEVEMENTS",
  skills: "SKILLS",
  welcome: "WELCOME",
  
  pc: "💻 MY PC",
  "cs-degree": "🎓 CS DEGREE",
  "sofa-table": "🛋️ ABOUT ME",
  tv: "📺 AWARDS",
  bed: "🛏️ PHILOSOPHY",
  resume: "📋 EXPERIENCE",
  projects: "🚀 PROJECTS",
  library: "📚 SKILLS",
  github: "🐙 GITHUB",
  exit: "🚪 CONTACT",
};
