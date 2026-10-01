// All personal content and external links live here. Empty URLs are safely hidden.
export const profile = {
  name: 'Aafthab Ali Shaik', role: 'Software Engineer', email: 'aafthabali08@gmail.com',
  phone: '+91 7075952588', location: 'Visakhapatnam, India', github: 'https://github.com/aafthabali08', linkedin: 'https://www.linkedin.com/in/aafthab-ali-shaik',
  resumeUrl: '/aafthab-ali-shaik-resume.pdf', available: true,
  summary: 'I’m a Computer Science student who enjoys turning complex problems into useful software. From responsive interfaces and scalable APIs to real-time machine learning, I build across the stack—with a focus on the details that make things work well.'
};
export const projects = [
  {id:'studymind',name:'StudyMind',category:'AI / ML',also:['Full stack'],eyebrow:'AI STUDY WORKSPACE',date:'SEP 2026',description:'Read it. Ask it. Revise it.',summary:'An AI study workspace that turns your documents into cited answers, notes, quizzes, and study plans, with an Interview Studio that practises questions from your résumé.',tags:['React','Firebase','Gemini API','Transformers.js'],color:'sage',live:'https://studymind-u6nh.onrender.com',github:'https://github.com/Aafthabali08/studymind',features:['Upload PDFs, DOCX, and TXT files and ask questions answered with page citations, using hybrid keyword (BM25) and semantic retrieval (RAG).','Generates notes, 2/5/8-mark question banks, quizzes, and multi-document study plans from your own material.','Interview Studio: questions from your résumé, on-device speech-to-text (Moonshine, Whisper), and STAR-based answer coaching.','Gemini API plus on-device open models (Transformers.js) in Web Workers, with instant fallbacks and OCR for scanned PDFs.','Firebase Authentication and Firestore with security rules, an admin dashboard for tickets and feedback, and 160 Vitest tests.']},
  {id:'routewise',name:'RouteWise',category:'Full stack',eyebrow:'SMART JOURNEY PLANNER',date:'SEP 2026',description:'A better way to get from A to B.',summary:'A real-time journey planner for Visakhapatnam that compares buses, autos, cabs, bikes, and walking by cost and travel time.',tags:['React','TypeScript','FastAPI','Supabase'],color:'lime',live:'https://routewise-4led.onrender.com',github:'https://github.com/Aafthabali08/travel',features:['Multi-modal route comparison powered by Google Maps APIs.','Bayesian fare estimates learn from rider votes, with outlier rejection and time-decayed weighting.','Live GPS navigation, off-route detection, and Google / Apple Maps hand-off.','Docker deployment on Render and 62 automated tests.']},
  {id:'expression',name:'Expression',category:'AI / ML',eyebrow:'REAL-TIME EMOTION DETECTION',date:'SEP 2026',description:'Human expressions. Machine understanding.',summary:'A browser-based facial expression detection application with real-time camera processing and cross-platform support.',tags:['React','Flask','ONNX','MediaPipe'],color:'lilac',live:'https://image-detection-z6s4.onrender.com',github:'https://github.com/Aafthabali08/image_detection',features:['Live camera-based emotion detection with ONNX Runtime and MediaPipe.','Android and iOS browser compatibility improvements.','GitHub Actions testing and Docker deployment.','Render health checks keep the service ready.']},
  {id:'taxpal',name:'TaxPal',category:'Full stack',eyebrow:'PERSONAL FINANCE & TAX',date:'FEB 2026',description:'A little more clarity for your money.',summary:'A full-stack finance application for tracking income, managing expenses, and estimating taxes through a clear, interactive dashboard.',tags:['React','Node.js','MySQL','Chart.js'],color:'peach',live:'',github:'',features:['Income and expense management through RESTful APIs.','JWT-based authentication for secure access.','Interactive financial visualizations using Chart.js.','Tax estimation and optimized backend request handling.']},
  {id:'voice',name:'AI Voice Assistant',category:'AI / ML',eyebrow:'CONVERSATIONAL AI',date:'DEC 2025',description:'An idea, a question, a conversation.',summary:'An AI-powered voice assistant that brings real-time speech processing and response generation into a conversational interface.',tags:['OpenAI API','Gemini API','Speech processing'],color:'blue',live:'',github:'',features:['Integrates OpenAI and Gemini APIs.','Real-time speech processing.','AI-powered response generation.']}
];
// Newest first. `summary` is the one-line brief on the journey card; `points` are the full details.
export const experience = [
 {company:'DRDO · Research Centre Imarat (RCI)',role:'Software Engineering Intern',date:'MAY — JUL 2026',location:'Hyderabad',
  summary:'Built a CI/CD pipeline for embedded software build, verification, and static analysis.',
  points:['Designed and developed a CI/CD pipeline for embedded software build, verification, and static analysis using GitLab CI/CD.','Configured GitLab Runners and Docker containers to automate embedded software build workflows.','Performed static code analysis and generated automated build reports to improve software quality.','Collaborated with DRDO scientists on embedded software development and DevOps workflow optimization.'],
  tags:['GitLab CI/CD','GitLab Runner','Docker','Static analysis']},
 {company:'Centre for Extended Reality (CXR) · GITAM University',role:'Full Stack Developer Intern',date:'MAY — JUN 2026',location:'Visakhapatnam',
  summary:'Enhanced the CXR Web Portfolio across frontend and backend with Firebase-powered features.',
  points:['Developed and enhanced the CXR Web Portfolio by improving both frontend and backend user interfaces for a responsive and user-friendly experience.','Integrated Firebase services by implementing API calls for data retrieval, storage, authentication, and real-time updates while ensuring seamless frontend-backend communication.','Refactored the codebase by fixing bugs, improving code quality, resolving security vulnerabilities, and optimizing application performance for a stable production-ready deployment.'],
  tags:['Full stack','Firebase','Security','Performance']},
 {company:'Suvehi Interactive Technologies Pvt. Ltd.',role:'Software Engineering Intern',date:'JAN — APR 2026',location:'Visakhapatnam',
  summary:'Designed and built an internal company website and worked across several software projects.',
  points:['Designed and developed an internal company website by implementing responsive frontend interfaces and scalable backend functionalities.','Worked on multiple software development projects, including website development, game version upgrades, feature implementation, software maintenance, and bug fixing.'],
  tags:['Web development','Backend','Game upgrades','Maintenance']},
 {company:'Infosys Springboard',role:'Full Stack Developer Intern',date:'DEC 2025 — FEB 2026',location:'',
  summary:'Built TaxPal, a full-stack finance app with React.js, Node.js, and MySQL.',
  points:['Designed and implemented a full-stack web application using React.js, Node.js, and MySQL.','Developed RESTful APIs and optimized backend request handling.','Implemented JWT-based authentication and integrated Chart.js for financial data visualization in the TaxPal project.'],
  tags:['React','Node.js','MySQL','JWT','Chart.js']},
 {company:'BharatVersity',role:'AI / ML Intern',date:'APR — JUL 2025',location:'BITS Hyderabad',
  summary:'Built a music recommendation system using Retrieval-Augmented Generation (RAG).',
  points:['Built a Music Recommendation System using Retrieval-Augmented Generation (RAG).','Implemented data preprocessing, feature engineering, and model evaluation pipelines.','Automated ML workflows and structured data pipelines for improved retrieval accuracy.'],
  tags:['RAG','Machine learning','Data pipelines']}
];
export const skills = {
 'Frontend':['React.js','TypeScript','JavaScript','Vite'],
 'Backend':['Node.js','Express.js','Flask','FastAPI','REST APIs'],
 'AI / ML':['TensorFlow','ONNX Runtime','MediaPipe','RAG'],
 'Languages':['Python','Java','C','C#'],
 'Data':['PostgreSQL','MySQL','MongoDB','Firebase','Supabase'],
 'Tools':['Git','GitHub','Docker','GitLab CI/CD','GitLab Runner','Render','Vercel','Transformers.js'],
 'Testing':['Pytest','Playwright','Vitest','React Testing Library','Static analysis'],
 'Foundations':['Data structures','Algorithms','OOP','DBMS','Operating systems','Embedded build automation']
};
