import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Balavenkatesh';
  currentYear = new Date().getFullYear();

  // Profile Data
  profile = {
    name: 'Balavenkatesh B',
    title: 'MEAN Stack Developer',
    experience: '6+ Years',
    email: 'balavenkatesh1997@gmail.com',
    phone: '+91 90957 24650',
    mobile: '+91 86674 90991',
    location: 'Chennai, Tamil Nadu',
    photo: 'photo1.jpg',
    tagline:
      'Full Stack Developer specializing in Angular, Node.js, MongoDB & MySQL with expertise in building scalable web applications',
    about: `Demonstrate proficiency in problem solving techniques using the computer and the analysis of complex problems and the synthesis of solutions to those problems. Experienced Full Stack Developer with over 6 years of expertise in building robust web applications using Angular, Node.js, MongoDB, MySQL, and MS SQL Server. Passionate about creating efficient, user-friendly solutions that streamline business operations and enhance user experiences.`,
  };

  // Skills
  skills = {
    frontend: [
      { name: 'Angular', level: 95 },
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 95 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 90 },
    ],
    backend: [
      { name: 'Node.js', level: 90 },
      { name: 'Express.js', level: 85 },
      { name: 'MySQL', level: 90 },
      { name: 'MS SQL Server', level: 85 },
      { name: 'MongoDB', level: 80 },
      { name: 'RESTful APIs', level: 90 },
    ],
    tools: [
      { name: 'Git/GitHub', level: 85 },
      { name: 'GitHub Actions', level: 80 },
      { name: 'VS Code', level: 95 },
      { name: 'Postman', level: 85 },
      { name: 'Swagger', level: 80 },
      { name: 'NPM', level: 90 },
    ],
  };

  // Experience
  experience = [
    {
      title: 'System Engineer',
      company: 'Tata Consultancy Services',
      period: 'Sep 2022 - Present · 3 yrs 2 mos',
      location: 'Chennai, Tamil Nadu (Hybrid)',
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

  // Projects
  projects = [
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

  // Education
  education = [
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

  // Social Links
  socialLinks = [
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
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      url: 'https://wa.me/918667490991',
    },
  ];

  // Current section for scroll highlighting
  currentSection = 'home';

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onScroll() {
    const sections = [
      'home',
      'about',
      'experience',
      'education',
      'skills',
      'projects',
      'contact',
    ];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          this.currentSection = section;
          break;
        }
      }
    }
  }
}
