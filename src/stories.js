// Add updates here and redeploy. Use YYYY-MM; dates are displayed at month precision.
// Optional: stats [[number,label]], images [{src,thumb,w,h,alt}] (WebP; thumb = 800px wide copy; w/h = pixel size of src) (put files in public/stories/), skills [..], location.
// Set published: false to keep a draft off the public site. IDs must be unique.
export const stories = [
 {id:'bnp-innoversite-2026',date:'2026-09',category:'Hackathon',label:'BNP Paribas',title:'BNP Paribas Innoversité 2026 Hackathon – Chennai',
  excerpt:'Twenty-four hours in Chennai to build, present, and step outside my comfort zone.',
  location:'Chennai · 19–20 September 2026',stats:[['24','hour hackathon'],['2','days in Chennai']],
  images:[
   {src:'/stories/bnp-innoversite-2026.webp',thumb:'/stories/bnp-innoversite-2026-800.webp',w:1050,h:1400,alt:'Aafthab standing in front of the BNP Paribas Innoversité Hackathon banner in Chennai, 19–20 September 2026'},
   {src:'/stories/bnp-innoversite-4.webp',thumb:'/stories/bnp-innoversite-4-800.webp',w:1600,h:1200,alt:'Teams working on laptops across the hackathon hall'},
   {src:'/stories/bnp-innoversite-1.webp',thumb:'/stories/bnp-innoversite-1-800.webp',w:1600,h:1066,alt:'A BNP Paribas mentor talking a team through their idea at their desks'},
   {src:'/stories/bnp-innoversite-2.webp',thumb:'/stories/bnp-innoversite-2-800.webp',w:1200,h:1600,alt:'Participants and mentors posing in front of the Innoversité Hackathon backdrop'},
   {src:'/stories/bnp-innoversite-3.webp',thumb:'/stories/bnp-innoversite-3-800.webp',w:1600,h:1200,alt:'A group selfie with fellow participants in hackathon t-shirts'},
   {src:'/stories/bnp-innoversite-5.webp',thumb:'/stories/bnp-innoversite-5-800.webp',w:1600,h:1200,alt:'Certificate of participation, name badge and hackathon t-shirt from Innoversité 2026'}
  ],
  body:[
  'Participated in the 24-hour BNP Paribas Innoversité Hackathon held in Chennai on 19th–20th September 2026. Worked collaboratively with a team to develop and present an innovative solution to a panel, gaining valuable experience in problem-solving, teamwork, creativity, and technology.',
  'The hackathon was an engaging experience that combined intensive development with interactive activities, networking, and team-building sessions. It provided an opportunity to step outside my comfort zone, discover my strengths, work under time constraints, and deliver my best within 24 hours.',
  'A memorable experience filled with learning, collaboration, innovation, and new connections. 🚀💻'
 ],skills:['Teamwork','Problem Solving','Innovation','Creativity','Presentation','Collaboration','Time Management','Hackathon'],published:true},
 {id:'drdo-internship',date:'2026-07',category:'Life updates',title:'A chapter at DRDO, RCI.',label:'DRDO · RCI',location:'Hyderabad · May – Jul 2026',stats:[['3','months at RCI']],skills:['GitLab CI/CD','GitLab Runner','Docker','Static analysis','Embedded builds'],excerpt:'Embedded software, automated builds, and a summer working on engineering workflows.',body:[
  'From May to July 2026, I worked as a Software Engineering Intern at DRDO’s Research Centre Imarat in Hyderabad.',
  'My work focused on a GitLab CI/CD pipeline for embedded software build, verification, and static analysis. I configured GitLab Runners and Docker containers and generated automated build reports.',
  'I collaborated with DRDO scientists on embedded software development and DevOps workflow optimization.'
 ],published:true},
 {id:'cxr-web-portfolio',date:'2026-06',category:'Building',title:'Building for extended reality.',label:'GITAM CXR',location:'Visakhapatnam · May – Jun 2026',skills:['Firebase','React','Responsive UI','Security fixes','Performance'],excerpt:'Improving the web experience for the Centre for Extended Reality at GITAM.',body:[
  'During my Full Stack Developer Internship at GITAM’s Centre for Extended Reality, I worked on the CXR web portfolio across its frontend and backend.',
  'I integrated Firebase services for authentication, storage, data retrieval, and real-time updates, and worked on responsive interfaces.',
  'The work also included refactoring code, fixing bugs, resolving security vulnerabilities, and improving application performance.'
 ],published:true}
];

// Small undated cards shown after the stories in the scrolling reel, in this order.
export const milestones = [
 {id:'gdg-gitam',label:'GDG on Campus · GITAM',title:'Core member, Google Developers Group.',excerpt:'Helping run workshops and build a community of student developers.',stat:['GDG','core team']},
 {id:'azure-ai-900',label:'Microsoft Azure',title:'AI-900, certified.',excerpt:'Azure AI Fundamentals — the first certificate on the wall.',stat:['781','exam score']}
];
