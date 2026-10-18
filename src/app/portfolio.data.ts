const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// `startDate` is "Mon YYYY". Parsed by hand: Safari's `new Date('Sep 2022')` is Invalid Date.
export function calculateDuration(startDate: string, now = new Date()): string {
  const [month, year] = startDate.split(' ');

  // Inclusive of both the start and current month, like LinkedIn
  const totalMonths = (now.getFullYear() - Number(year)) * 12 + now.getMonth() - MONTHS.indexOf(month) + 1;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let duration = '';
  if (years > 0) {
    duration += `${years} yr${years > 1 ? 's' : ''} `;
  }
  if (months > 0) {
    duration += `${months} mo${months > 1 ? 's' : ''}`;
  }

  return `${startDate} - Present · ${duration.trim()}`;
}

export const profile = {
  name: 'Balavenkatesh B',
  title: 'Full Stack Developer',
  experience: '7+ Years',
  email: 'balavenkatesh1997@gmail.com',
  mobile: '+91 86674 90991',
  location: 'Chennai, Tamil Nadu',
  avatar: '/images/avatar.jpg',
  photo: { avif: '/images/portrait.avif', jpg: '/images/portrait.jpg', width: 798, height: 1200 },
  aboutPhoto: { avif: '/images/portrait-v.avif', jpg: '/images/portrait-v.jpg', width: 664, height: 1120 },
  resume: '/balavenkatesh_resume.pdf',
  tagline:
    'Full Stack Developer specializing in Angular, Node.js, MongoDB & MySQL with expertise in building scalable web applications',
  about: `Demonstrate proficiency in problem solving techniques using the computer and the analysis of complex problems and the synthesis of solutions to those problems. Experienced Full Stack Developer with over 7 years of expertise in building robust web applications using Angular, Node.js, MongoDB, MySQL, and MS SQL Server. Passionate about creating efficient, user-friendly solutions that streamline business operations and enhance user experiences.`,
};

export const skillGroups = [
  {
    title: 'Frontend Development',
    icon: 'code',
    skills: [
      'Angular',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'JavaScript',
      'TypeScript',
    ],
  },
  {
    title: 'Backend Development',
    icon: 'server',
    skills: [
      'Node.js',
      'Express.js',
      'MySQL',
      'MS SQL Server',
      'MongoDB',
      'RESTful APIs',
    ],
  },
  {
    title: 'Tools & Technologies',
    icon: 'tool',
    skills: [
      'Git/GitHub',
      'GitHub Actions',
      'VS Code',
      'Postman',
      'Swagger',
      'NPM',
    ],
  },
];

export const experience = [
  {
    title: 'System Engineer',
    company: 'Tata Consultancy Services',
    period: calculateDuration('Sep 2022'),
    location: 'Chennai, Tamil Nadu',
    responsibilities: [
      'Working as a system engineer handling Angular projects as a developer',
      'Developing and maintaining enterprise-level web applications',
      'Implementing solutions using Angular, Node.js, MongoDB, MySQL & MS SQL Server',
      'Conducting research and implementing best practices',
      'Collaborating with cross-functional teams to deliver high-quality solutions',
    ],
  },
  {
    title: 'Senior Software Developer',
    company: 'Mescope Solutions',
    period: 'Aug 2021 - Jul 2022 · 1 yr',
    location: 'Salem, Tamil Nadu',
    responsibilities: [
      'Led development of full-fledged Angular, Node.js & MySQL projects',
      'Demonstrated leadership in guiding development teams',
      'Conducted research and implemented innovative solutions',
      'Optimized application performance and database queries',
      'Mentored junior developers and conducted code reviews',
    ],
  },
  {
    title: 'Junior Software Developer',
    company: 'Mescope Solutions',
    period: 'Nov 2019 - Jul 2021 · 1 yr 9 mos',
    location: 'Salem, Tamil Nadu',
    responsibilities: [
      'Developed Angular, Node.js & MySQL projects',
      'Built responsive user interfaces using Angular and TypeScript',
      'Developed RESTful APIs using Node.js',
      'Designed and implemented database schemas in MySQL',
      'Conducted research to improve development processes',
    ],
  },
  {
    title: 'Software Trainee',
    company: 'Mescope Solutions',
    period: 'Aug 2019 - Oct 2019 · 3 mos',
    location: 'Salem, Tamil Nadu',
    responsibilities: [
      'Completed training in full-stack web development',
      'Learned Angular, Node.js, TypeScript, and MySQL',
      'Built practice projects using HTML5, CSS3, and JavaScript',
      'Gained hands-on experience with modern web technologies',
      'Prepared for junior developer role',
    ],
  },
];

export const projects = [
  {
    title: 'SSI - Sales, Stock & Intake',
    period: 'Nov 2022 - Present',
    company: 'Tata Consultancy Services',
    description:
      'SSI enables weekly intake planning for merchandisers by accurately forecasting demand and effectively managing inventory levels. It facilitates supplier approval through clear communication and timely order placement, ensuring seamless intake processes that support efficient inventory management.',
    technologies: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'MongoDB',
      'MS SQL Server',
    ],
    highlights: [
      'Managed user interface using Angular',
      'Ensured responsive and user-friendly experience',
      'Weekly intake planning for merchandisers',
      'Accurate demand forecasting and inventory management',
    ],
  },
  {
    title: 'HIMS - Hospital Information Management System',
    period: 'Aug 2019 - Jul 2022',
    company: 'Mescope Solutions',
    description:
      'Hospital Information Management System (HIMS) is a web application developed from scratch that manages the entire hospital through a single-window interface, integrating patient reports and records, pharmacy management, and asset tracking to streamline hospital operations efficiently.',
    technologies: [
      'Angular',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'MySQL',
    ],
    highlights: [
      'Built with Angular on front-end and Node.js on back-end',
      'Single-window hospital management interface',
      'Patient reports, pharmacy, and asset tracking',
      'Seamless user-friendly experience',
    ],
  },
  {
    title: 'Tour Tamilnadu - Tourist Information Gallery',
    period: 'Jan 2018 - Apr 2018',
    company: 'Mahendra Institutions',
    description:
      'Tour Tamilnadu is a web application that showcases a wide range of tourist destinations across Tamil Nadu, providing users with the latest images and detailed information for popular locations. Built with Angular for frontend and Node.js for backend.',
    technologies: [
      'Angular',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'MongoDB',
    ],
    highlights: [
      'Developed backend architecture',
      'Implemented core logic for seamless performance',
      'Tourist destination showcase',
      'Applied full-stack development skills',
    ],
  },
  {
    title: 'Food Bot - Online Food Selector',
    period: 'Jul 2017 - Sep 2017',
    company: 'Mahendra Institutions',
    description:
      'Food Bot is a web application featuring a smart chat interface that enables users to select food through a conversational experience. The front-end is built with Angular, while the back-end is developed in Node.js to ensure smooth, efficient, and error-free operations.',
    technologies: [
      'Angular',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'MongoDB',
    ],
    highlights: [
      'Designed and implemented back-end',
      'Smart chat interface for food selection',
      'Conversational user experience',
      'Seamless front-end and back-end integration',
    ],
  },
];

export const education = [
  {
    degree: 'B.E. (Computer Science)',
    institution: 'Mahendra Institute of Technology',
    period: '2015 – 2019',
    type: 'Bachelor',
  },
  {
    degree: 'HSC',
    institution: 'The Gugai Higher Secondary School',
    period: '2014 – 2015',
    type: 'Higher Secondary',
  },
  {
    degree: 'SSLC',
    institution: 'The Gugai Higher Secondary School',
    period: '2012 – 2013',
    type: 'Secondary',
  },
];

export const socialLinks = [
  { name: 'GitHub', icon: 'github', url: 'https://github.com/balavoffici' },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    url: 'https://linkedin.com/in/balavoffici',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    url: 'https://instagram.com/balavoffici',
  },
  { name: 'WhatsApp', icon: 'whatsapp', url: 'https://wa.me/918667490991' },
];

export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
