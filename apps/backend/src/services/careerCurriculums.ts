export interface ResourceItem {
  title: string;
  url: string;
  isFree: boolean;
}

export interface SemesterBlueprint {
  theme: string;
  focusSummary: string;
  coreSubject: {
    title: string;
    description: string;
    resources: ResourceItem[];
    actionChecklist?: string[];
  };
  skill: {
    title: string;
    description: string;
    resources: ResourceItem[];
    actionChecklist?: string[];
  };
  project: {
    title: string;
    description: string;
    resources: ResourceItem[];
    actionChecklist?: string[];
  };
  careerMilestone: {
    category: 'certification' | 'internship';
    title: string;
    description: string;
    resources: ResourceItem[];
    actionChecklist?: string[];
  };
}

export type CurriculumMap = Record<number, SemesterBlueprint>;

// ==========================================
// 1. FULL STACK ENGINEER CURRICULUM
// ==========================================
export const FULL_STACK_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Web Foundations & Modern JavaScript Standards',
    focusSummary: 'Master semantic HTML5, modern CSS3 layout engines, core JavaScript ES6+, and Git version control.',
    coreSubject: {
      title: 'Internet Protocols & Web Architecture Foundations',
      description: 'Study HTTP/HTTPS protocols, DNS resolution, DOM tree rendering, and browser event loops.',
      resources: [
        { title: 'MDN Web Docs: Web Standards', url: 'https://developer.mozilla.org', isFree: true },
        { title: 'NPTEL Official: Internet Technologies', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Study client-server architectures and request-response lifecycles',
        'Learn HTTP status codes, headers, and CORS security constraints',
        'Analyze browser rendering pipelines and critical rendering path',
      ],
    },
    skill: {
      title: 'Modern JavaScript (ES6+), DOM Manipulation & Git Workflows',
      description: 'Master closures, asynchronous promises, async/await, modern DOM APIs, and GitHub branch collaboration.',
      resources: [
        { title: 'javascript.info: Modern JS Tutorial', url: 'https://javascript.info', isFree: true },
        { title: 'freeCodeCamp: Git & GitHub Crash Course', url: 'https://www.freecodecamp.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 20 hands-on JavaScript ES6+ coding exercises',
        'Build interactive DOM event-driven UI components without frameworks',
        'Create a GitHub profile with automated actions and commit streaks',
      ],
    },
    project: {
      title: 'Responsive Developer Portfolio & Interactive Web Utility',
      description: 'Design and deploy a semantic, mobile-first portfolio showcasing projects with live GitHub API integration.',
      resources: [
        { title: 'GitHub Pages Deployment Guide', url: 'https://pages.github.com', isFree: true },
      ],
      actionChecklist: [
        'Write responsive CSS with Flexbox, CSS Grid, and custom properties',
        'Integrate GitHub REST API to showcase live repository metrics',
        'Deploy with 95+ Google Lighthouse accessibility and performance score',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'freeCodeCamp Responsive Web Design & HackerRank JS Badge',
      description: 'Earn your first verified web credentials and complete 30 algorithmic problem sets.',
      resources: [
        { title: 'freeCodeCamp Web Certification', url: 'https://www.freecodecamp.org', isFree: true },
        { title: 'HackerRank JavaScript Track', url: 'https://www.hackerrank.com', isFree: true },
      ],
      actionChecklist: [
        'Complete freeCodeCamp 300-hour Responsive Web Design track',
        'Earn HackerRank JavaScript 5-star problem solving badge',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Data Structures & Component-Driven UI',
    focusSummary: 'Master foundational data structures, object-oriented TypeScript, and modern styling architectures.',
    coreSubject: {
      title: 'Data Structures & Algorithmic Problem Solving',
      description: 'Master arrays, linked lists, hash tables, stacks, queues, and Big-O computational complexity.',
      resources: [
        { title: 'NPTEL: Data Structures and Algorithms', url: 'https://nptel.ac.in', isFree: true },
        { title: 'GeeksforGeeks DSA Mastery Hub', url: 'https://www.geeksforgeeks.org', isFree: true },
      ],
      actionChecklist: [
        'Implement fundamental data structures in TypeScript from scratch',
        'Analyze time and space complexity using asymptotic Big-O notation',
        'Solve recurring interview patterns (Two Pointers, Sliding Window)',
      ],
    },
    skill: {
      title: 'TypeScript Mastery & Modern CSS Architectures (Tailwind CSS)',
      description: 'Type-safe interfaces, generics, utility types, and rapid modern UI prototyping with utility-first CSS.',
      resources: [
        { title: 'TypeScript Official Handbook', url: 'https://www.typescriptlang.org', isFree: true },
        { title: 'Tailwind CSS Official Documentation', url: 'https://tailwindcss.com', isFree: true },
      ],
      actionChecklist: [
        'Convert vanilla JavaScript codebases into strict-mode TypeScript',
        'Design modular responsive UI layouts with Tailwind CSS',
        'Solve 50 LeetCode Easy/Medium problems in TypeScript',
      ],
    },
    project: {
      title: 'Algorithmic Visualizer & Interactive Simulation Tool',
      description: 'Build an interactive web visualizer showcasing sorting, searching, or graph pathfinding with real-time UI controls.',
      resources: [
        { title: 'Vite Getting Started Guide', url: 'https://vitejs.dev', isFree: true },
      ],
      actionChecklist: [
        'Implement sorting animations (Quicksort, Mergesort) with step controls',
        'Render dynamic data charts with accessible SVG or Canvas elements',
        'Deploy on Vercel with zero runtime TypeScript warnings',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: '50 LeetCode Problems Solved & Swayam NPTEL Certificate',
      description: 'Target 50 algorithmic problems on LeetCode and complete an accredited NPTEL curriculum course.',
      resources: [
        { title: 'LeetCode Explore Track', url: 'https://leetcode.com', isFree: true },
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Reach 50 solved DSA problems milestone on LeetCode',
        'Enroll in Swayam/NPTEL semester proctored certification course',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Frontend Frameworks & Single-Page Applications',
    focusSummary: 'Master React, functional components, hooks, client-side routing, and scalable client state.',
    coreSubject: {
      title: 'Modern Frontend Architecture & Single Page Applications (SPA)',
      description: 'Virtual DOM reconciliation, synthetic event loops, component composition patterns, and client-side routing.',
      resources: [
        { title: 'React Official Documentation (react.dev)', url: 'https://react.dev', isFree: true },
        { title: 'Frontend Masters: Web Development Roadmaps', url: 'https://frontendmasters.com', isFree: true },
      ],
      actionChecklist: [
        'Understand React fiber architecture and reconciliation algorithms',
        'Master custom hooks lifecycle and memoization (useMemo, useCallback)',
        'Structure scalable folder hierarchies for large-scale web apps',
      ],
    },
    skill: {
      title: 'React 19, Hooks, Context API & State Management',
      description: 'Build reactive user interfaces, manage global state with Zustand or Redux Toolkit, and consume REST APIs.',
      resources: [
        { title: 'TanStack Query Docs', url: 'https://tanstack.com', isFree: true },
        { title: 'Zustand State Management', url: 'https://zustand-demo.pmnd.rs', isFree: true },
      ],
      actionChecklist: [
        'Implement asynchronous server state caching with TanStack Query',
        'Manage auth tokens and user session states globally with Zustand',
        'Build reusable accessible modal, dropdown, and tab components',
      ],
    },
    project: {
      title: 'Dynamic E-Commerce Storefront with Cart & Checkout Engine',
      description: 'A feature-complete React SPA featuring product filtering, live search, cart calculations, and responsive checkout.',
      resources: [
        { title: 'DummyJSON Free Products API', url: 'https://dummyjson.com', isFree: true },
      ],
      actionChecklist: [
        'Implement debounced product search, price filtering, and pagination',
        'Create persistent local storage shopping cart with quantity controls',
        'Add toast notifications and accessible keyboard navigation',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Meta Frontend Developer Professional Certificate / NPTEL Honors',
      description: 'Validate React and modern frontend competency through an accredited industry credential.',
      resources: [
        { title: 'Coursera Meta Frontend Track', url: 'https://www.coursera.org', isFree: true },
      ],
      actionChecklist: [
        'Complete Meta Frontend specialization course modules',
        'Publish modular open-source component library to npm or GitHub',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Server-Side Engineering & Database Systems',
    focusSummary: 'Build production RESTful APIs with Node.js, Express, PostgreSQL relational modeling, and JWT authentication.',
    coreSubject: {
      title: 'Database Management Systems & Relational Schema Modeling',
      description: 'Relational normalization (1NF to BCNF), ACID transactions, SQL indexing strategies, and relational algebra.',
      resources: [
        { title: 'NPTEL Official: Database Management Systems', url: 'https://nptel.ac.in', isFree: true },
        { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org', isFree: true },
      ],
      actionChecklist: [
        'Design 3NF normalized database schemas with foreign key constraints',
        'Write complex SQL joins, aggregations, and window functions',
        'Benchmark database query plans using EXPLAIN ANALYZE',
      ],
    },
    skill: {
      title: 'Node.js, Express, Prisma ORM & PostgreSQL',
      description: 'Design modular REST endpoints, validate input schemas with Zod, implement bcrypt hashing, and JWT tokens.',
      resources: [
        { title: 'Node.js Official Documentation', url: 'https://nodejs.org', isFree: true },
        { title: 'Prisma ORM Getting Started', url: 'https://www.prisma.io', isFree: true },
      ],
      actionChecklist: [
        'Implement secure password hashing with bcrypt and HMAC JWT signing',
        'Validate incoming payloads using Zod schemas with error mapping',
        'Build structured middleware for role-based access control (RBAC)',
      ],
    },
    project: {
      title: 'Citizen Services & E-Commerce Web Portal (Full Stack)',
      description: 'Authenticated full-stack application with role-based access control, SQL indexing, transactional integrity, and live deployment.',
      resources: [
        { title: 'Render Free Hosting Guide', url: 'https://render.com', isFree: true },
      ],
      actionChecklist: [
        'Architect PostgreSQL database tables with Prisma ORM migrations',
        'Build secure user authentication with refresh tokens in HTTP-only cookies',
        'Deploy live backend on Render/Railway with hosted PostgreSQL database',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'PostgreSQL Associate / Swayam DBMS Certificate',
      description: 'Earn an accredited database and backend credential and achieve 100+ DSA problems milestone.',
      resources: [
        { title: 'Smart India Hackathon (SIH) Portal', url: 'https://sih.gov.in', isFree: true },
        { title: 'PostgreSQL Certification Track', url: 'https://www.postgresql.org', isFree: true },
      ],
      actionChecklist: [
        'Pass Swayam/NPTEL proctored DBMS examination with elite score',
        'Participate in college internal Smart India Hackathon round',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Full-Stack Integration & Performance Optimization',
    focusSummary: 'Unify frontend and backend using Next.js (App Router), server actions, Redis caching, and WebSockets.',
    coreSubject: {
      title: 'Distributed Web Architecture & Web Performance Optimization',
      description: 'Explore caching strategies (Cache-Aside, Write-Through), WebSocket bidirectional communication, and Core Web Vitals.',
      resources: [
        { title: 'web.dev by Google: Core Web Vitals', url: 'https://web.dev', isFree: true },
        { title: 'System Design Primer (Donne Martin)', url: 'https://github.com/donnemartin/system-design-primer', isFree: true },
      ],
      actionChecklist: [
        'Analyze LCP, FID/INP, and CLS performance metrics using Chrome DevTools',
        'Implement Redis memory caching for high-read database queries',
        'Design WebSocket state channels for bidirectional real-time events',
      ],
    },
    skill: {
      title: 'Next.js Full-Stack App Router, Server Actions & Redis Caching',
      description: 'Server components, dynamic streaming with Suspense, SEO metadata generation, and Redis session stores.',
      resources: [
        { title: 'Next.js Official Documentation', url: 'https://nextjs.org', isFree: true },
        { title: 'Redis University Free Courses', url: 'https://university.redis.com', isFree: true },
      ],
      actionChecklist: [
        'Build React Server Components (RSC) with zero client bundle overhead',
        'Set up Upstash Redis for distributed API rate limiting',
        'Implement optimistic UI updates for instant interactive feedback',
      ],
    },
    project: {
      title: 'Real-Time Collaborative Workspace with WebSockets',
      description: 'Collaborative productivity platform with instant presence tracking, live document editing, and Redis pub/sub sync.',
      resources: [
        { title: 'Socket.io Documentation', url: 'https://socket.io', isFree: true },
      ],
      actionChecklist: [
        'Build WebSocket server handling room connections and user presence',
        'Implement conflict-free operational transforms or lock mechanisms',
        'Deploy on Vercel with serverless WebSocket or persistent backend',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'AWS Certified Cloud Practitioner & SIH Hackathon Participation',
      description: 'Validate cloud knowledge and compete in national AICTE hackathons.',
      resources: [
        { title: 'AWS Skill Builder Official Free Tier', url: 'https://skillbuilder.aws', isFree: true },
        { title: 'AICTE Smart India Hackathon', url: 'https://sih.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear AWS Certified Cloud Practitioner (CLF-C02) examination',
        'Submit hackathon prototype to AICTE Smart India Hackathon portal',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Microservices, Containerization & CI/CD Pipelines',
    focusSummary: 'Containerize full-stack services with Docker, orchestrate microservices, and build automated testing pipelines.',
    coreSubject: {
      title: 'Advanced System Design & Scalability Engineering',
      description: 'High-throughput low-latency architecture, CDN edge caching, database sharding, observability, and SLO/SLA metrics.',
      resources: [
        { title: 'Google SRE Book (Free Online)', url: 'https://sre.google/sre-book/table-of-contents', isFree: true },
        { title: 'NPTEL Cloud Computing & Distributed Systems', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Study horizontal vs vertical scaling, load balancers, and reverse proxies',
        'Design idempotency keys and retry policies for distributed transactions',
        'Configure Prometheus metrics collection and Grafana dashboard alerts',
      ],
    },
    skill: {
      title: 'Docker Containerization, GitHub Actions CI/CD & Automated Testing',
      description: 'Docker multi-stage builds, automated linting and unit testing with Jest/Vitest, and continuous delivery pipelines.',
      resources: [
        { title: 'Docker Official Getting Started Hub', url: 'https://docs.docker.com', isFree: true },
        { title: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions', isFree: true },
      ],
      actionChecklist: [
        'Write multi-stage Dockerfiles optimizing image size under 100MB',
        'Set up GitHub Actions workflow executing unit and integration tests',
        'Implement automated staging deployments on git push to main',
      ],
    },
    project: {
      title: 'Production SaaS with Automated CI/CD & Performance Monitoring',
      description: 'Deploy a multi-tenant SaaS application featuring automated GitHub Actions CI/CD, Prometheus metrics, and rate limiting.',
      resources: [
        { title: 'Grafana & Prometheus Monitoring Guide', url: 'https://grafana.com', isFree: true },
      ],
      actionChecklist: [
        'Configure multi-tenant data isolation and organization switching',
        'Add Stripe subscription billing integration with webhook verification',
        'Benchmark endpoint throughput using k6 or Autocannon load testing',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'AWS Certified Solutions Architect Associate / Swayam Honors',
      description: 'Clear an industry-recognized cloud architecture exam and prepare technical portfolio for placement.',
      resources: [
        { title: 'AWS Certification Portal', url: 'https://aws.amazon.com/certification', isFree: true },
        { title: 'AICTE Internship Portal Registration', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Clear AWS Certified Solutions Architect Associate (SAA-C03)',
        'Register verified profile on AICTE National Internship Portal',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — High-Scale System Design & Full-Stack Industry Internship',
    focusSummary: 'Prepare for senior technical interviews, master scalable system architectures, and complete an industry internship.',
    coreSubject: {
      title: 'System Design Interviews & Algorithmic Problem Solving',
      description: 'Scalable system architecture, concurrency, microservices decomposition, and 150 top technical interview problems.',
      resources: [
        { title: 'Tech Interview Handbook (Free)', url: 'https://www.techinterviewhandbook.org', isFree: true },
        { title: 'NeetCode 150 System & DSA Roadmap', url: 'https://neetcode.io', isFree: true },
      ],
      actionChecklist: [
        'Solve NeetCode 150 top interview algorithms under timed constraints',
        'Practice designing URL shortener, Rate Limiter, and Notification System',
        'Participate in weekly peer mock behavioral and technical interviews',
      ],
    },
    skill: {
      title: 'Production Code Optimization & Mock Technical Interviews',
      description: 'Master memory leak detection, database query indexing, security audits, and peer technical interviews.',
      resources: [
        { title: 'Pramp Free Peer Mock Interviews', url: 'https://www.pramp.com', isFree: true },
        { title: 'LeetCode Mock Assessment', url: 'https://leetcode.com', isFree: true },
      ],
      actionChecklist: [
        'Complete 10 peer mock technical interviews on Pramp',
        'Profile memory allocations and optimize database connection pooling',
        'Prepare behavioral STAR method stories for placement rounds',
      ],
    },
    project: {
      title: 'Pre-Capstone: AI-Augmented Full-Stack Production System',
      description: 'Innovative web application integrating modern AI copilot features, vector search, and production role-based access.',
      resources: [
        { title: 'GitHub Open Source Capstone Showcases', url: 'https://github.com', isFree: true },
      ],
      actionChecklist: [
        'Integrate OpenAI / Gemini API with streaming responses in Next.js',
        'Implement vector embeddings search with pgvector or Pinecone',
        'Conduct end-to-end security audit and sanitization tests',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Industry Summer Internship (Full Stack Engineering)',
      description: 'Complete an 8-12 week supervised industry internship via the official AICTE Portal or top tech enterprises.',
      resources: [
        { title: 'AICTE Official Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
        { title: 'National Career Service Portal', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks industry internship with evaluated supervisor sign-off',
        'Document real-world contribution in technical internship project report',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Major Production Web Capstone & Career Launch',
    focusSummary: 'Deliver your definitive degree capstone project, pass final placement rounds, and transition smoothly into full-time roles.',
    coreSubject: {
      title: 'Software Architecture, Security Governance & OWASP Standards',
      description: 'Enterprise security standards, threat modeling, OWASP Top 10 mitigation, code quality auditing, and ethical practices.',
      resources: [
        { title: 'OWASP Top 10 Security Guidelines', url: 'https://owasp.org', isFree: true },
        { title: 'IEEE Computer Society Standards', url: 'https://www.computer.org', isFree: true },
      ],
      actionChecklist: [
        'Perform static analysis security testing (SAST) with SonarQube',
        'Write comprehensive OpenAPI 3.0 / Swagger API documentation',
        'Audit web compliance for data privacy and encryption standards',
      ],
    },
    skill: {
      title: 'End-to-End Automated Testing, Auditing & Documentation',
      description: 'Implement unit and integration testing with Jest/Playwright, produce OpenAPI specifications, and technical documentation.',
      resources: [
        { title: 'Playwright & Testing Framework Docs', url: 'https://playwright.dev', isFree: true },
        { title: 'OpenAPI Specification Standard', url: 'https://swagger.io', isFree: true },
      ],
      actionChecklist: [
        'Achieve 80%+ test coverage across core API routes and components',
        'Write end-to-end user journey tests in Playwright',
        'Create technical documentation with diagrams and deployment instructions',
      ],
    },
    project: {
      title: 'Major Degree Capstone: Production Full Stack Solution',
      description: 'Definitive degree capstone project featuring comprehensive architecture, live cloud deployment, load testing, and technical docs.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Deploy production system supporting live authenticated users',
        'Conduct load testing demonstrating 500+ requests/second stability',
        'Publish complete project demo video, documentation, and source code',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus Placement Drives & AICTE National Career Launch',
      description: 'Participate in on-campus and national placement drives, finalize full-time job offers, and join alumni mentorship networks.',
      resources: [
        { title: 'AICTE National Placement Portal', url: 'https://internship.aicte-india.org', isFree: true },
        { title: 'National Career Service (NCS)', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear on-campus placement rounds for Associate Software Engineer roles',
        'Finalize employment offer letters and register on alumni portal',
      ],
    },
  },
};

// ==========================================
// 2. MACHINE LEARNING & AI CURRICULUM
// ==========================================
export const ML_AI_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Python for Scientific Computing & Mathematical Foundations',
    focusSummary: 'Establish strong mathematical foundations in Linear Algebra, Vector Calculus, and idiomatic scientific Python.',
    coreSubject: {
      title: 'Mathematics for Machine Learning: Linear Algebra & Vector Calculus',
      description: 'Vector spaces, matrix decomposition (Eigenvalues, SVD), dot products, projections, gradients, and multivariable derivatives.',
      resources: [
        { title: 'MIT OpenCourseWare: Linear Algebra (Gilbert Strang)', url: 'https://ocw.mit.edu', isFree: true },
        { title: '3Blue1Brown: Essence of Linear Algebra', url: 'https://www.3blue1brown.com', isFree: true },
      ],
      actionChecklist: [
        'Master matrix transformations, determinants, and matrix inverses',
        'Compute partial derivatives and gradient vectors by hand',
        'Understand Principal Component Analysis (PCA) mathematical derivation',
      ],
    },
    skill: {
      title: 'Python Scientific Stack (NumPy, SciPy, Vectorization)',
      description: 'Master vectorized operations, broadcasting rules, multi-dimensional array slicing, and memory layouts in NumPy.',
      resources: [
        { title: 'NumPy Official User Guide', url: 'https://numpy.org/doc', isFree: true },
        { title: 'Kaggle: Python for Data Science', url: 'https://www.kaggle.com/learn/python', isFree: true },
      ],
      actionChecklist: [
        'Eliminate Python loops by writing high-speed vectorized NumPy code',
        'Implement matrix multiplication and dot product routines from scratch',
        'Solve 30 computational linear algebra programming challenges',
      ],
    },
    project: {
      title: 'Mathematical Computation Engine & Matrix Algorithm Solver',
      description: 'Build a Python library computing matrix factorizations, Gaussian elimination, and gradient descent step visualizations.',
      resources: [
        { title: 'SciPy Lectures Notes', url: 'https://scipy-lectures.org', isFree: true },
      ],
      actionChecklist: [
        'Write pure NumPy implementation of Gaussian elimination and SVD',
        'Generate gradient descent contour plots using Matplotlib',
        'Publish package on GitHub with complete docstrings and tests',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Kaggle Python & Pandas Certified Badges',
      description: 'Earn foundational scientific computation badges on Kaggle and complete introductory data challenges.',
      resources: [
        { title: 'Kaggle Learn Portal', url: 'https://www.kaggle.com/learn', isFree: true },
      ],
      actionChecklist: [
        'Complete Kaggle Python, Pandas, and Data Visualization courses',
        'Reach Kaggle Discussion / Notebooks Contributor tier',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Probability, Statistics & Exploratory Data Science',
    focusSummary: 'Master probability distributions, statistical hypothesis testing, and exploratory data analysis.',
    coreSubject: {
      title: 'Probability Distributions, Inferential Statistics & Bayesian Reasoning',
      description: 'Random variables, conditional probability, Bayes Theorem, Central Limit Theorem, p-values, and hypothesis testing.',
      resources: [
        { title: 'NPTEL: Probability and Statistics for Data Science', url: 'https://nptel.ac.in', isFree: true },
        { title: 'Khan Academy: Statistics and Probability', url: 'https://www.khanacademy.org', isFree: true },
      ],
      actionChecklist: [
        'Formulate null and alternative hypotheses with z-tests and t-tests',
        'Calculate prior, likelihood, and posterior distributions using Bayes rule',
        'Analyze real-world data variance and standard error limits',
      ],
    },
    skill: {
      title: 'Data Wrangling with Pandas & Visual Analytics (Seaborn/Plotly)',
      description: 'Data cleaning, imputation of missing values, encoding categorical variables, and publishing interactive data stories.',
      resources: [
        { title: 'Pandas Official Documentation', url: 'https://pandas.pydata.org', isFree: true },
        { title: 'Seaborn Statistical Data Visualization', url: 'https://seaborn.pydata.org', isFree: true },
      ],
      actionChecklist: [
        'Clean messy multi-table datasets with merging, grouping, and pivots',
        'Perform outlier detection using IQR and z-score methods',
        'Create correlation heatmaps and distribution pair plots',
      ],
    },
    project: {
      title: 'Exploratory Socio-Economic Data Analysis & Interactive Report',
      description: 'Perform complete exploratory data analysis (EDA) on census, healthcare, or climate datasets and publish actionable insights.',
      resources: [
        { title: 'Data.gov.in Official India Open Data Portal', url: 'https://data.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Extract and clean 100,000+ records from open government data portals',
        'Conduct hypothesis testing confirming statistically significant findings',
        'Deploy an interactive Streamlit exploratory analytics dashboard',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Probability & Statistics for Data Science Certificate',
      description: 'Appear for the national proctored NPTEL/Swayam examination and earn accredited academic honors.',
      resources: [
        { title: 'Swayam Examination Registration', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete all weekly NPTEL assignments with 80%+ average',
        'Appear for the official proctored Swayam examination',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Classical Machine Learning Algorithms & Scikit-Learn',
    focusSummary: 'Implement regression, decision trees, random forests, SVMs, and clustering from mathematical principles.',
    coreSubject: {
      title: 'Applied Machine Learning Theory & Pattern Recognition',
      description: 'Supervised vs. unsupervised learning, cost functions, gradient descent optimization, bias-variance tradeoff, and regularizations (L1/L2).',
      resources: [
        { title: 'Stanford CS229: Machine Learning (Andrew Ng)', url: 'https://cs229.stanford.edu', isFree: true },
        { title: 'Scikit-Learn User Guide', url: 'https://scikit-learn.org', isFree: true },
      ],
      actionChecklist: [
        'Derive ordinary least squares and gradient descent updates mathematically',
        'Analyze precision, recall, F1-score, ROC-AUC, and confusion matrices',
        'Master K-Fold cross-validation and hyperparameter search techniques',
      ],
    },
    skill: {
      title: 'Scikit-Learn, Feature Engineering & Hyperparameter Tuning',
      description: 'Build robust pipelines using ColumnTransformer, StandardScaler, OneHotEncoder, GridSearchCV, and model persistence with Joblib.',
      resources: [
        { title: 'Scikit-Learn Tutorials', url: 'https://scikit-learn.org/stable/tutorial', isFree: true },
      ],
      actionChecklist: [
        'Construct leakage-free Scikit-Learn transformation pipelines',
        'Benchmark Logistic Regression, Random Forest, and Gradient Boosting models',
        'Optimize model hyperparameters using Optuna or RandomizedSearchCV',
      ],
    },
    project: {
      title: 'Automated Credit Risk & Fraud Prediction Pipeline',
      description: 'Develop an end-to-end predictive pipeline detecting fraudulent transactions or loan defaults with model explainability.',
      resources: [
        { title: 'Kaggle Credit Card Fraud Dataset', url: 'https://www.kaggle.com/datasets', isFree: true },
      ],
      actionChecklist: [
        'Handle severe class imbalance using SMOTE and class-weight balancing',
        'Achieve 92%+ ROC-AUC on unseen out-of-time test partitions',
        'Generate feature importance charts using SHAP values',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Kaggle Machine Learning Competitions Bronze Medal / Swayam ML',
      description: 'Compete in active Kaggle tabular competitions and achieve recognized ranking.',
      resources: [
        { title: 'Kaggle Competitions Hub', url: 'https://www.kaggle.com/competitions', isFree: true },
      ],
      actionChecklist: [
        'Submit competitive predictions to a featured Kaggle tabular competition',
        'Earn a verified competition or notebook medal on Kaggle',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Deep Learning Fundamentals & Neural Networks',
    focusSummary: 'Master backpropagation, computational graphs, activation functions, and deep neural architectures with PyTorch.',
    coreSubject: {
      title: 'Neural Network Architectures, Optimization & Backpropagation Theory',
      description: 'Perceptrons, multi-layer feedforward networks, matrix chain rule backprop, vanishing/exploding gradients, and optimizers (Adam, RMSProp).',
      resources: [
        { title: 'Deep Learning Book (Ian Goodfellow, MIT Press)', url: 'https://www.deeplearningbook.org', isFree: true },
        { title: 'NPTEL: Deep Learning (IIT Madras)', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Derive backpropagation equations for a 2-layer MLP on paper',
        'Understand Batch Normalization, Dropout, and weight initialization (He, Xavier)',
        'Analyze learning rate scheduling and early stopping strategies',
      ],
    },
    skill: {
      title: 'PyTorch Deep Learning Framework & Tensor Computation',
      description: 'Custom nn.Module architectures, Dataset and DataLoader pipelines, GPU acceleration (CUDA), and training loops.',
      resources: [
        { title: 'PyTorch Official Tutorials', url: 'https://pytorch.org/tutorials', isFree: true },
        { title: 'fast.ai: Practical Deep Learning for Coders', url: 'https://course.fast.ai', isFree: true },
      ],
      actionChecklist: [
        'Write modular PyTorch training, validation, and checkpointing loops',
        'Implement custom loss functions and learning rate warm-up schedules',
        'Profile tensor operations and leverage mixed precision (torch.cuda.amp)',
      ],
    },
    project: {
      title: 'Custom Convolutional Neural Network for Medical Diagnostics',
      description: 'Train a deep CNN (or fine-tune ResNet) to detect pneumonia, skin lesions, or diabetic retinopathy from medical scans.',
      resources: [
        { title: 'Torchvision Models Hub', url: 'https://pytorch.org/vision', isFree: true },
      ],
      actionChecklist: [
        'Apply data augmentations (flips, affine transforms, CutMix) to prevent overfitting',
        'Fine-tune pre-trained ResNet-50 with transfer learning on medical scans',
        'Compute Grad-CAM activation maps highlighting diagnostic regions',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'DeepLearning.AI Deep Learning Specialization / NPTEL DL',
      description: 'Complete the industry standard Deep Learning Specialization by Andrew Ng on Coursera.',
      resources: [
        { title: 'DeepLearning.AI Specialization', url: 'https://www.deeplearning.ai', isFree: true },
      ],
      actionChecklist: [
        'Complete all 5 courses of the Deep Learning Specialization',
        'Verify certificate badge on LinkedIn and resume',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Computer Vision, NLP & Transformer Architectures',
    focusSummary: 'Build advanced Vision and Natural Language models using Hugging Face Transformers and Attention mechanisms.',
    coreSubject: {
      title: 'Natural Language Processing & Transformer Attention Mechanisms',
      description: 'Word embeddings (Word2Vec), RNNs, LSTMs, Scaled Dot-Product Attention, Multi-Head Attention, and Encoder-Decoder architectures.',
      resources: [
        { title: 'Stanford CS224N: Natural Language Processing with Deep Learning', url: 'https://web.stanford.edu/class/cs224n', isFree: true },
        { title: 'Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer', isFree: true },
      ],
      actionChecklist: [
        'Understand Q, K, V self-attention equations and positional encodings',
        'Compare BERT (masked language modeling) vs. GPT (causal autoregressive)',
        'Analyze tokenization strategies (Byte-Pair Encoding, WordPiece)',
      ],
    },
    skill: {
      title: 'Hugging Face Transformers, Tokenization & Fine-Tuning',
      description: 'Pre-trained models, datasets library, Hugging Face Trainer API, token classification, and sequence classification.',
      resources: [
        { title: 'Hugging Face NLP Course', url: 'https://huggingface.co/learn/nlp-course', isFree: true },
      ],
      actionChecklist: [
        'Fine-tune BERT / RoBERTa for domain sentiment and intent classification',
        'Implement Named Entity Recognition (NER) pipeline on Indian legal/medical texts',
        'Evaluate models using Perplexity, BLEU, and ROUGE metrics',
      ],
    },
    project: {
      title: 'Multimodal Semantic Search & Visual Question Answering Engine',
      description: 'Combine vision and language using CLIP embeddings to perform cross-modal image retrieval and question answering.',
      resources: [
        { title: 'OpenAI CLIP Open Source', url: 'https://github.com/openai/CLIP', isFree: true },
      ],
      actionChecklist: [
        'Generate vector embeddings for 50,000+ images using CLIP',
        'Store and query embeddings with low latency using Faiss or ChromaDB',
        'Deploy an interactive web search interface demonstrating natural language queries',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'AWS Certified Machine Learning Specialty / TensorFlow Developer',
      description: 'Validate advanced machine learning competency through an industry certification.',
      resources: [
        { title: 'AWS Machine Learning Specialty', url: 'https://aws.amazon.com/certification/certified-machine-learning-specialty', isFree: true },
      ],
      actionChecklist: [
        'Prepare and clear the AWS Certified Machine Learning Specialty examination',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — MLOps, Model Serving & Automated Pipeline Engineering',
    focusSummary: 'Package models into high-throughput inference APIs with FastAPI, ONNX, MLflow, and Docker.',
    coreSubject: {
      title: 'Machine Learning Operations (MLOps) & Production Lifecycle',
      description: 'Model registry, artifact versioning, data drift (concept drift vs. covariate shift), latency SLAs, and canary deployments.',
      resources: [
        { title: 'Made With ML (Goku Mohandas)', url: 'https://madewithml.com', isFree: true },
        { title: 'Full Stack Deep Learning Course', url: 'https://fullstackdeeplearning.com', isFree: true },
      ],
      actionChecklist: [
        'Design automated retraining triggers based on statistical distribution drift',
        'Understand ONNX runtime graph optimizations and FP16/INT8 quantization',
        'Structure reproducible ML experiments with Git, DVC, and MLflow',
      ],
    },
    skill: {
      title: 'Model Serving (FastAPI, ONNX, TorchServe) & Docker Deployment',
      description: 'Build asynchronous model inference endpoints, containerize with Docker, and track experiments with MLflow.',
      resources: [
        { title: 'FastAPI Documentation', url: 'https://fastapi.tiangolo.com', isFree: true },
        { title: 'MLflow Documentation', url: 'https://mlflow.org', isFree: true },
      ],
      actionChecklist: [
        'Export PyTorch models to ONNX runtime achieving 3x inference speedup',
        'Build asynchronous batch inference API in FastAPI with worker threads',
        'Containerize the inference engine with Docker multi-stage builds',
      ],
    },
    project: {
      title: 'Production Real-Time Sentiment & Anomaly Streaming Pipeline',
      description: 'Deploy an automated MLOps pipeline consuming streaming events, generating predictions, and logging drift metrics.',
      resources: [
        { title: 'Evidently AI: ML Monitoring', url: 'https://www.evidentlyai.com', isFree: true },
      ],
      actionChecklist: [
        'Stream incoming requests through Kafka or Redis pub/sub queue',
        'Monitor data drift and model accuracy degradation with Evidently AI',
        'Automate Docker container deployment with GitHub Actions CI/CD',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Databricks / Google Cloud Professional Machine Learning Engineer',
      description: 'Earn an enterprise cloud MLOps and Machine Learning certification.',
      resources: [
        { title: 'Google Cloud Professional ML Engineer', url: 'https://cloud.google.com/certification/machine-learning-engineer', isFree: true },
      ],
      actionChecklist: [
        'Pass Google Cloud Professional Machine Learning Engineer examination',
        'Publish verified credential to LinkedIn and GitHub profile',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — Distributed Model Training & Industry AI Internship',
    focusSummary: 'Train models across multi-GPU clusters, explore LLM fine-tuning (LoRA), and complete an AI industry internship.',
    coreSubject: {
      title: 'Distributed Deep Learning, Quantization & LLM Architectures',
      description: 'Data parallelism (DDP), tensor parallelism (DeepSpeed/Megatron), Parameter-Efficient Fine-Tuning (PEFT/LoRA), and vLLM serving.',
      resources: [
        { title: 'PyTorch Distributed Documentation', url: 'https://pytorch.org/tutorials/intermediate/ddp_tutorial.html', isFree: true },
        { title: 'Hugging Face PEFT Documentation', url: 'https://huggingface.co/docs/peft', isFree: true },
      ],
      actionChecklist: [
        'Analyze rank decomposition in LoRA and QLoRA 4-bit quantization',
        'Understand KV-cache management and PagedAttention in vLLM',
        'Compare Zero Redundancy Optimizer (ZeRO) stages in DeepSpeed',
      ],
    },
    skill: {
      title: 'LoRA/QLoRA Fine-Tuning, vLLM High-Throughput Serving & GPU Profiling',
      description: 'Fine-tune open-weight LLMs (Llama 3 / Mistral) using PEFT, configure vLLM inference server, and evaluate outputs.',
      resources: [
        { title: 'vLLM Fast Inference Engine', url: 'https://docs.vllm.ai', isFree: true },
        { title: 'Axolotl LLM Training Framework', url: 'https://github.com/OpenAccess-AI-Collective/axolotl', isFree: true },
      ],
      actionChecklist: [
        'Fine-tune Llama 3 8B with QLoRA on a single consumer GPU for custom instructions',
        'Serve fine-tuned weights with vLLM achieving 50+ tokens/second',
        'Profile GPU memory footprint using PyTorch profiler and nvidia-smi',
      ],
    },
    project: {
      title: 'Pre-Capstone: Domain-Specific Fine-Tuned LLM with RAG Knowledge Base',
      description: 'Deliver an enterprise intelligence copilot combining a fine-tuned open-source LLM with hybrid vector and keyword retrieval.',
      resources: [
        { title: 'LangChain Documentation', url: 'https://python.langchain.com', isFree: true },
      ],
      actionChecklist: [
        'Curate high-quality instruction dataset in Indian legal / healthcare domain',
        'Implement hybrid retrieval combining BM25 keyword search and dense vector search',
        'Evaluate hallucinations and response accuracy using Ragas evaluation suite',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Industry Summer Internship (Machine Learning & AI)',
      description: 'Complete an 8-12 week supervised AI industry internship via AICTE Portal or top research laboratories.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks AI/ML engineering internship at accredited enterprise',
        'Submit evaluated industry project documentation to university supervisor',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Autonomous AI Capstone & Production Placement',
    focusSummary: 'Deliver an end-to-end autonomous AI system with evaluation guardrails and secure deployment.',
    coreSubject: {
      title: 'AI Ethics, Bias Mitigation, Hallucination Auditing & Model Governance',
      description: 'Ethical considerations in generative models, red-teaming, prompt injection defense, differential privacy, and governance standards.',
      resources: [
        { title: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework', isFree: true },
        { title: 'OWASP Top 10 for Large Language Models', url: 'https://llmtop10.info', isFree: true },
      ],
      actionChecklist: [
        'Implement NeMo Guardrails or Llama Guard for safety moderation',
        'Test vulnerabilities against direct and indirect prompt injections',
        'Document model cards outlining training data, evaluation metrics, and limits',
      ],
    },
    skill: {
      title: 'Model Evaluation (Ragas, Trulens), Guardrails AI & Latency Profiling',
      description: 'Rigorous benchmark evaluation, automated guardrails, latency profiling, and packaging for multi-cloud deployment.',
      resources: [
        { title: 'Ragas: Evaluation for RAG', url: 'https://docs.ragas.io', isFree: true },
      ],
      actionChecklist: [
        'Set up automated CI/CD evaluation benchmarking every model release',
        'Optimize end-to-end inference latency under 200ms first-token time',
        'Build executive presentation and interactive demo web dashboard',
      ],
    },
    project: {
      title: 'Major Degree Capstone: Production Machine Learning Engineer Solution',
      description: 'Autonomous multi-agent intelligence and predictive platform with live streaming inference, automated retraining, and audit logs.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Deploy complete AI system on cloud with automated autoscaling',
        'Demonstrate benchmark accuracy improvements over baseline models',
        'Present project to academic defense panel and industry recruiters',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus AI Placement Drives & AICTE National Career Launch',
      description: 'Participate in on-campus and national placement drives for ML Engineer, Data Scientist, and AI Specialist roles.',
      resources: [
        { title: 'AICTE National Placement Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Clear Machine Learning Engineer technical interview rounds',
        'Finalize full-time employment offer in AI/ML industry',
      ],
    },
  },
};

// ==========================================
// 3. CYBERSECURITY ANALYST CURRICULUM
// ==========================================
export const CYBERSECURITY_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Computer Systems, Linux Hardening & Network Protocols',
    focusSummary: 'Master network packet structures, OSI model, Linux terminal security, and port reconnaissance.',
    coreSubject: {
      title: 'Network Protocols, Packet Inspection & TCP/IP Architecture',
      description: 'OSI 7-layer model, TCP three-way handshake, UDP, ICMP, DNS, ARP poisoning, and Wireshark packet capture.',
      resources: [
        { title: 'Wireshark User Guide & Packet Analysis', url: 'https://www.wireshark.org', isFree: true },
        { title: 'NPTEL: Computer Networks and Internet Protocol', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Capture and analyze TCP handshakes, TLS handshakes, and DNS requests in Wireshark',
        'Understand IP addressing, CIDR subnetting, and broadcast domains',
        'Detect SYN flood attacks and ARP spoofing in packet captures',
      ],
    },
    skill: {
      title: 'Linux Security Hardening, Shell Commands & Wireshark',
      description: 'Linux file permissions (chmod/chown), sudoers configuration, IPTables firewalls, systemd services, and log inspection.',
      resources: [
        { title: 'Linux Journey Security Guide', url: 'https://linuxjourney.com', isFree: true },
      ],
      actionChecklist: [
        'Harden a clean Linux server using SSH keys, fail2ban, and disabled root login',
        'Configure basic UFW and IPTables firewall rule chains',
        'Inspect /var/log/auth.log to identify unauthorized login attempts',
      ],
    },
    project: {
      title: 'Custom Network Sniffer & Packet Analyzer Tool in Python',
      description: 'Build a raw socket or Scapy-based network packet sniffer that flags suspicious port scans and unencrypted credentials.',
      resources: [
        { title: 'Scapy Packet Manipulation Documentation', url: 'https://scapy.net', isFree: true },
      ],
      actionChecklist: [
        'Write Python script using Scapy to capture live interface traffic',
        'Alert on unencrypted HTTP passwords, FTP credentials, and port scans',
        'Export captured telemetry into standard PCAP format for analysis',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'CompTIA Security+ / Cisco Networking Academy Security Badge',
      description: 'Complete foundational network security coursework and earn accredited introductory badge.',
      resources: [
        { title: 'Cisco Networking Academy', url: 'https://www.netacad.com', isFree: true },
      ],
      actionChecklist: [
        'Complete Cisco CyberOps Associate or Security+ study modules',
        'Solve 20 network security challenges on TryHackMe',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Cryptography & Security Scripting',
    focusSummary: 'Understand symmetric/asymmetric encryption, hashing algorithms, PKI, and write automated Python scripts.',
    coreSubject: {
      title: 'Applied Cryptography, Public Key Infrastructure (PKI) & Digital Signatures',
      description: 'AES, RSA, ECC elliptic curve cryptography, SHA-256 hashing, HMAC, SSL/TLS certificates, and Certificate Authorities.',
      resources: [
        { title: 'NPTEL: Information Security and Cryptography', url: 'https://nptel.ac.in', isFree: true },
        { title: 'Crypto101 (Free Cryptography Book)', url: 'https://www.crypto101.io', isFree: true },
      ],
      actionChecklist: [
        'Differentiate symmetric block ciphers (AES-GCM) vs asymmetric key exchange (ECDH)',
        'Understand cryptographic salt, rainbow tables, and key derivation (PBKDF2/Argon2)',
        'Verify digital signature authenticity and certificate revocation (CRL/OCSP)',
      ],
    },
    skill: {
      title: 'Python for Security Automation & Cryptographic Libraries',
      description: 'Automate security audits, port scanners, and implement secure data encryption using PyCryptodome and Cryptography library.',
      resources: [
        { title: 'Python Cryptography Library Docs', url: 'https://cryptography.io', isFree: true },
      ],
      actionChecklist: [
        'Implement AES-256 file encryption utility with secure IV generation',
        'Generate custom self-signed RSA certificates and sign CSRs with OpenSSL',
        'Write multi-threaded TCP banner grabbing tool in Python',
      ],
    },
    project: {
      title: 'End-to-End Encrypted Secure Messaging System with Key Exchange',
      description: 'Build a secure client-server chat application featuring Diffie-Hellman key exchange, AES-GCM encryption, and HMAC integrity.',
      resources: [
        { title: 'OpenSSL Official Documentation', url: 'https://www.openssl.org', isFree: true },
      ],
      actionChecklist: [
        'Implement Diffie-Hellman ephemeral key exchange between client and server',
        'Ensure forward secrecy and authenticate payload signatures',
        'Conduct man-in-the-middle (MITM) test validating certificate pinning',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Information Security and Cryptography Accredited Exam',
      description: 'Appear for the national proctored NPTEL/Swayam examination in Cryptography.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Submit all weekly NPTEL cryptography assignments',
        'Appear for the official proctored examination and earn certificate',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Web Application Security & OWASP Top 10',
    focusSummary: 'Identify, exploit, and remediate SQL injection, XSS, CSRF, SSRF, and broken access controls.',
    coreSubject: {
      title: 'Web Application Architecture & OWASP Top 10 Vulnerability Mechanics',
      description: 'In-depth study of injection flaws, broken object-level authorization (BOLA), cross-site scripting (XSS), and security misconfigurations.',
      resources: [
        { title: 'OWASP Top 10 Official Documentation', url: 'https://owasp.org/www-project-top-ten', isFree: true },
        { title: 'PortSwigger Web Security Academy', url: 'https://portswigger.net/web-security', isFree: true },
      ],
      actionChecklist: [
        'Analyze mechanics of Union-based and Blind SQL injection vulnerabilities',
        'Differentiate Stored, Reflected, and DOM-based Cross-Site Scripting (XSS)',
        'Understand Server-Side Request Forgery (SSRF) and metadata service exploitation',
      ],
    },
    skill: {
      title: 'Burp Suite Professional, OWASP ZAP & Web Vulnerability Scanning',
      description: 'Intercept HTTP traffic, automate payload fuzzing with Burp Intruder, analyze session tokens, and write custom scan rules.',
      resources: [
        { title: 'Burp Suite Community Edition Tutorial', url: 'https://portswigger.net/burp', isFree: true },
      ],
      actionChecklist: [
        'Configure browser proxy to inspect, modify, and repeat HTTP requests in Burp',
        'Automate parameter fuzzing using custom wordlists to uncover IDOR flaws',
        'Solve 25 interactive labs on PortSwigger Web Security Academy',
      ],
    },
    project: {
      title: 'Vulnerable Web App Lab Environment with Remediation Playbook',
      description: 'Deploy a controlled vulnerable web application (DVWA/Juice Shop), execute documented exploits, and write secure source code patches.',
      resources: [
        { title: 'OWASP Juice Shop Project', url: 'https://owasp.org/www-project-juice-shop', isFree: true },
      ],
      actionChecklist: [
        'Deploy OWASP Juice Shop in Docker and solve 15 vulnerability challenges',
        'Write executive vulnerability disclosure reports with CVSS 3.1 severity scores',
        'Implement code fixes (parameterized queries, Content Security Policy headers)',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'PortSwigger Web Security Academy Practitioner Badge',
      description: 'Solve practitioner-level web vulnerability challenges on PortSwigger Academy.',
      resources: [
        { title: 'PortSwigger Academy Certification', url: 'https://portswigger.net/web-security/certification', isFree: true },
      ],
      actionChecklist: [
        'Complete all apprentice and practitioner labs on PortSwigger Academy',
        'Earn verified Web Security Practitioner badge',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Penetration Testing Methodologies & Ethical Hacking',
    focusSummary: 'Learn network penetration testing, reconnaissance, vulnerability exploitation, and privilege escalation.',
    coreSubject: {
      title: 'Penetration Testing Frameworks & Ethical Hacking Methodologies',
      description: 'PTES (Penetration Testing Execution Standard), active/passive OSINT reconnaissance, vulnerability scanning, and privilege escalation.',
      resources: [
        { title: 'PTES Standard Documentation', url: 'http://www.pentest-standard.org', isFree: true },
        { title: 'NPTEL: Ethical Hacking (IIT Kharagpur)', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Master the 5 phases of ethical hacking: Recon, Scanning, Gaining Access, Maintaining Access, Covering Tracks',
        'Study Linux privilege escalation via SUID binaries and misconfigured cron jobs',
        'Understand Windows privilege escalation via unquoted service paths',
      ],
    },
    skill: {
      title: 'Kali Linux Tooling (Nmap, Metasploit, Hydra, John the Ripper)',
      description: 'Advanced Nmap NSE scripting, Metasploit payload generation (msfvenom), password cracking, and reverse shells.',
      resources: [
        { title: 'Nmap Network Scanning Guide (Fyodor)', url: 'https://nmap.org/book', isFree: true },
        { title: 'Metasploit Unleashed (Offensive Security)', url: 'https://www.offsec.com/metasploit-unleashed', isFree: true },
      ],
      actionChecklist: [
        'Perform advanced Nmap SYN, UDP, and service version detection scans',
        'Configure Metasploit multi-handler to capture reverse shell connections',
        'Audit password strength using John the Ripper and custom wordlists',
      ],
    },
    project: {
      title: 'Simulated Corporate Network Penetration Test & Executive Report',
      description: 'Conduct a simulated black-box penetration test against vulnerable virtual machine networks and deliver professional findings.',
      resources: [
        { title: 'VulnHub Vulnerable Virtual Machines', url: 'https://www.vulnhub.com', isFree: true },
      ],
      actionChecklist: [
        'Compromise root access on 3 distinct VulnHub / TryHackMe network targets',
        'Document step-by-step proof-of-concept exploit chains with screenshots',
        'Produce standard industry audit report with actionable risk mitigations',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'eLearnSecurity Junior Penetration Tester (eJPT) / CEH Prep',
      description: 'Validate hands-on practical penetration testing skills through industry certification.',
      resources: [
        { title: 'INE Security eJPT Certification', url: 'https://ine.com/certifications/ejpt', isFree: true },
      ],
      actionChecklist: [
        'Pass eLearnSecurity Junior Penetration Tester (eJPT) practical exam',
        'Reach Top 10% ranking on TryHackMe or HackTheBox',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Network Defense, Firewalls & SIEM / SOC Operations',
    focusSummary: 'Configure enterprise firewalls (pfSense), Suricata IDS/IPS, and analyze security logs in Splunk/Wazuh.',
    coreSubject: {
      title: 'Defensive Security Architectures, Intrusion Detection & Threat Hunting',
      description: 'Defense-in-depth, network segmentation, stateful firewalls, signature vs anomaly intrusion detection, and SOC analyst workflows.',
      resources: [
        { title: 'Suricata Official Documentation', url: 'https://suricata.io', isFree: true },
        { title: 'Wazuh Open Source Security Platform', url: 'https://wazuh.com', isFree: true },
      ],
      actionChecklist: [
        'Design multi-tier network DMZ with isolated internal and management VLANs',
        'Write custom Suricata IDS rules detecting command-and-control beaconing',
        'Learn SOC Tier 1 triage, alert correlation, and false positive tuning',
      ],
    },
    skill: {
      title: 'SIEM Log Analysis (Splunk / Wazuh), Snort Rules & Log Telemetry',
      description: 'Deploy Wazuh SIEM agents, write Splunk Search Processing Language (SPL) queries, parse Windows Event logs, and configure alert rules.',
      resources: [
        { title: 'Splunk Free Training & Fundamentals', url: 'https://www.splunk.com/en_us/training.html', isFree: true },
      ],
      actionChecklist: [
        'Ingest Windows Sysmon and Linux auth logs into centralized Wazuh manager',
        'Write Splunk SPL queries detecting brute-force and pass-the-hash attacks',
        'Configure automated webhook alerts notifying of high-severity incidents',
      ],
    },
    project: {
      title: 'Self-Hosted Security Operations Center (SOC) Lab with Wazuh SIEM',
      description: 'Build a functioning SOC homelab with pfSense firewall, Suricata IDS, Wazuh SIEM, and simulated adversarial attacks.',
      resources: [
        { title: 'pfSense Community Documentation', url: 'https://docs.netgate.com', isFree: true },
      ],
      actionChecklist: [
        'Install pfSense virtual router with Snort/Suricata package inspection',
        'Simulate MITRE ATT&CK techniques (T1059, T1003) and verify SIEM alert triggers',
        'Build real-time Grafana/Kibana security dashboard displaying live threat telemetry',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Blue Team Level 1 (BTL1) / Splunk Core Certified User',
      description: 'Earn a verified defense and SIEM certification for Security Operations Center analyst readiness.',
      resources: [
        { title: 'Security Blue Team BTL1', url: 'https://securityblue.team', isFree: true },
      ],
      actionChecklist: [
        'Pass Blue Team Level 1 (BTL1) or Splunk Core Certified User examination',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Digital Forensics & Incident Response (DFIR)',
    focusSummary: 'Investigate security breaches, memory forensics (Volatility), disk imaging, and malware triage.',
    coreSubject: {
      title: 'Digital Forensics Standards, Chain of Custody & Memory Analysis',
      description: 'Forensic acquisition (dd/FTK Imager), memory artifacts analysis, Volatility framework, registry analysis, and legal evidence handling.',
      resources: [
        { title: 'Volatility Foundation Documentation', url: 'https://volatilityfoundation.org', isFree: true },
        { title: 'NPTEL: Computer Forensics', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Maintain legal chain of custody and compute SHA-256 evidence integrity hashes',
        'Analyze raw RAM dumps extracting running processes, DLLs, and network sockets',
        'Investigate Windows Registry artifacts (UserAssist, Shimcache, Amcache)',
      ],
    },
    skill: {
      title: 'Memory Forensics (Volatility 3), Autopsy & Malware Static Analysis',
      description: 'Triage suspected malware, extract IOCs (IPs, domains, hashes), inspect PE headers with Ghidra/PEStudio, and parse timeline artifacts.',
      resources: [
        { title: 'Autopsy Digital Forensics Tool', url: 'https://www.autopsy.com', isFree: true },
        { title: 'Ghidra NSA Open Source Reverse Engineering', url: 'https://ghidra-sre.org', isFree: true },
      ],
      actionChecklist: [
        'Analyze malware memory dumps with Volatility 3 to locate injected code',
        'Extract static IOCs and strings from obfuscated binaries using Ghidra',
        'Reconstruct disk event timelines using Autopsy and Sleuth Kit',
      ],
    },
    project: {
      title: 'Real-World Ransomware Incident Response Case Study & Forensic Report',
      description: 'Investigate a simulated corporate ransomware breach, trace patient-zero infection vectors, and deliver an executive forensic report.',
      resources: [
        { title: 'SANS Reading Room Incident Response Whitepapers', url: 'https://www.sans.org/white-papers', isFree: true },
      ],
      actionChecklist: [
        'Determine initial access vector, lateral movement, and data exfiltration timeline',
        'Extract ransomware command-and-control IP addresses and cryptographic keys',
        'Publish structured Incident Response timeline and technical remediation recommendations',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Certified Incident Handler (EC-Council ECIH) / Swayam Forensics',
      description: 'Validate incident response and digital forensics knowledge through accredited testing.',
      resources: [
        { title: 'AICTE Internship Portal Registration', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete Swayam/NPTEL Cyber Forensics proctored examination',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — Enterprise Security Compliance & SOC Internship',
    focusSummary: 'Understand ISO 27001, SOC 2, NIST CSF compliance frameworks, cloud security, and complete SOC analyst internship.',
    coreSubject: {
      title: 'Governance, Risk & Compliance (GRC) & Zero Trust Architecture',
      description: 'ISO/IEC 27001 ISMS, NIST Cybersecurity Framework (CSF), GDPR/DPDP Act 2023 compliance, threat modeling, and risk assessments.',
      resources: [
        { title: 'NIST Cybersecurity Framework Official', url: 'https://www.nist.gov/cyberframework', isFree: true },
        { title: 'India Digital Personal Data Protection (DPDP) Act Guidelines', url: 'https://www.meity.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Formulate risk assessment matrix calculating impact and likelihood scores',
        'Map enterprise security controls to NIST CSF 2.0 and ISO 27001 clauses',
        'Understand Zero Trust architecture principles (verify explicitly, least privilege)',
      ],
    },
    skill: {
      title: 'Cloud Security Auditing (AWS Security Hub) & Threat Modeling',
      description: 'Audit cloud infrastructure against CIS Benchmarks, inspect IAM least-privilege policies, and automate vulnerability alerts.',
      resources: [
        { title: 'CIS Benchmarks Official Portal', url: 'https://www.cisecurity.org/cis-benchmarks', isFree: true },
      ],
      actionChecklist: [
        'Run automated Prowler or ScoutSuite scans across AWS cloud accounts',
        'Remediate overly permissive IAM roles and unencrypted S3 buckets',
        'Perform STRIDE threat modeling on modern web and microservice architectures',
      ],
    },
    project: {
      title: 'Pre-Capstone: Automated Enterprise Vulnerability Management & Alerting System',
      description: 'Deploy an automated vulnerability assessment pipeline scanning internal infrastructure, tracking remediation SLAs, and reporting metrics.',
      resources: [
        { title: 'OpenVAS / Greenbone Vulnerability Management', url: 'https://www.greenbone.net', isFree: true },
      ],
      actionChecklist: [
        'Deploy OpenVAS scanner scanning scheduled subnets for CVE vulnerabilities',
        'Aggregate vulnerability findings into centralized tracking database',
        'Generate automated compliance reports for management review',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Enterprise Cybersecurity Summer Internship',
      description: 'Complete an 8-12 week supervised industry internship in a Security Operations Center or enterprise security team.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks supervised cybersecurity internship in active SOC/GRC role',
        'Document incident response cases and receive formal supervisor verification',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Red vs. Blue Simulation Capstone & Security Placement',
    focusSummary: 'Conduct full-scale attack-defense simulations and step into enterprise cybersecurity analyst roles.',
    coreSubject: {
      title: 'Advanced Persistent Threats (APT), MITRE ATT&CK & Security Governance',
      description: 'Threat actor TTPs, Active Directory attack paths (Kerberoasting, BloodHound), defense-in-depth, and enterprise security policy.',
      resources: [
        { title: 'MITRE ATT&CK Enterprise Matrix', url: 'https://attack.mitre.org', isFree: true },
      ],
      actionChecklist: [
        'Map complex multi-stage attack scenarios to MITRE ATT&CK techniques',
        'Analyze Active Directory attack paths using BloodHound graph models',
        'Design enterprise security disaster recovery and containment playbooks',
      ],
    },
    skill: {
      title: 'Active Directory Security, Purple Team Collaboration & Hardening',
      description: 'Audit Active Directory domain controllers, configure Group Policies (GPO), enforce MFA, and detect lateral movement.',
      resources: [
        { title: 'Active Directory Security Lab (Cybex)', url: 'https://adsecurity.org', isFree: true },
      ],
      actionChecklist: [
        'Deploy Windows Server Active Directory domain lab with multi-tier OUs',
        'Execute and defend against Kerberoasting and Golden Ticket simulations',
        'Enforce credential guard, LAPS, and tiered administrative privileges',
      ],
    },
    project: {
      title: 'Major Capstone: Attack-Defense Simulation with Real-Time SOC Telemetry',
      description: 'Complete enterprise cyber range simulation featuring automated red team exploitation and automated blue team detection and response.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Execute multi-vector attack simulation against isolated enterprise network',
        'Demonstrate automated detection, containment, and firewall rule push in <60 seconds',
        'Deliver definitive technical presentation to security review committee',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus Cyber Placement Drives & AICTE National Career Launch',
      description: 'Participate in placement drives for SOC Analyst, Penetration Tester, and Cyber Security Consultant roles.',
      resources: [
        { title: 'National Career Service Portal', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear cybersecurity technical interviews and live practical challenges',
        'Secure full-time position in enterprise cybersecurity or security consulting',
      ],
    },
  },
};

// ==========================================
// 4. CIVIL SERVICES / UPSC ASPIRANT CURRICULUM
// ==========================================
export const CIVIL_SERVICES_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Indian Polity & Constitutional Framework (GS Paper II)',
    focusSummary: 'Master the Constitution of India, Preamble, Fundamental Rights, Directive Principles, and Union Executive.',
    coreSubject: {
      title: 'Indian Constitution, Historical Underpinnings & Fundamental Rights',
      description: 'Constituent Assembly debates, Preamble, Articles 12-35 (Fundamental Rights), DPSP, Fundamental Duties, and Basic Structure Doctrine.',
      resources: [
        { title: 'Constitution of India (Legislative Dept, Govt of India)', url: 'https://legislative.gov.in/constitution-of-india', isFree: true },
        { title: 'Indian Polity by M. Laxmikanth (Reference Study)', url: 'https://www.mheducation.co.in', isFree: false },
      ],
      actionChecklist: [
        'Memorize key Articles of the Indian Constitution and landmark Supreme Court rulings (Kesavananda Bharati, Maneka Gandhi)',
        'Compare Fundamental Rights vs Directive Principles of State Policy (DPSP)',
        'Analyze the balance of power between Judiciary, Legislature, and Executive',
      ],
    },
    skill: {
      title: 'Analytical Note Synthesis & Primary Constitutional Text Reading',
      description: 'Synthesize complex legal and constitutional commentaries into succinct, exam-ready revision notes and comparative tables.',
      resources: [
        { title: 'PRS Legislative Research: Bills & Acts Summaries', url: 'https://prsindia.org', isFree: true },
      ],
      actionChecklist: [
        'Extract core arguments from monthly PRS Legislative policy briefs',
        'Draft structured comparative tables of Parliamentary vs Presidential systems',
        'Summarize 25 landmark Supreme Court constitutional judgments',
      ],
    },
    project: {
      title: 'Comparative Synthesis of Indian Constitutional Features vs. Global Democracies',
      description: 'Write a comprehensive research monograph comparing federalism, emergency provisions, and judicial review in India, USA, and UK.',
      resources: [
        { title: 'Swayam: Indian Federalism and Governance', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Evaluate asymmetrical federalism in India (Articles 370, 371A-J, 5th & 6th Schedules)',
        'Synthesize emergency provisions under Articles 352, 356, and 360 with historical precedents',
        'Submit structured 3,000-word monograph reviewed against UPSC answer evaluation criteria',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Swayam Indian Polity & Governance Proctored Examination',
      description: 'Enroll in and clear the national Swayam accredited exam on Indian Governance and Constitution.',
      resources: [
        { title: 'Swayam Examination Registration', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete all weekly assignments on Swayam Indian Polity course',
        'Appear for the official proctored Swayam examination',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — History, Art & Culture of India (GS Paper I)',
    focusSummary: 'Comprehensive study of Ancient, Medieval, and Modern Indian History, Indian National Movement, and Art Forms.',
    coreSubject: {
      title: 'Modern Indian History, National Movement & Indian Culture',
      description: 'Colonial expansion, Revolt of 1857, socio-religious reform movements, Indian National Congress phases, Gandhian movements, and architecture/sculpture.',
      resources: [
        { title: 'NCERT Official Textbooks: Modern India', url: 'https://ncert.nic.in', isFree: true },
        { title: 'NPTEL: History of Independent India', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Master the timeline of Governor Generals, Viceroys, and major land revenue settlements (Zamindari, Ryotwari, Mahalwari)',
        'Analyze causes, courses, and consequences of Non-Cooperation, Civil Disobedience, and Quit India movements',
        'Differentiate temple architecture styles: Nagara, Dravida, and Vesara',
      ],
    },
    skill: {
      title: 'Timeline Chronology Mapping & Thematic Historiography Notes',
      description: 'Build comprehensive visual timelines linking socio-economic movements, tribal revolts, and colonial legislative acts.',
      resources: [
        { title: 'Center for Cultural Resources and Training (CCRT)', url: 'http://ccrtindia.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Map major peasant, tribal, and civil uprisings from 1757 to 1947',
        'Create visual comparative flashcards of classical Indian dances and musical traditions',
        'Solve 100 historical multiple-choice questions from past 10 years of UPSC Prelims',
      ],
    },
    project: {
      title: 'Documentary Analysis of Indian Freedom Struggle Landmarks (1857–1947)',
      description: 'Produce an in-depth analytical document tracing the evolution of constitutional demands from Nehru Report to Indian Independence Act.',
      resources: [
        { title: 'National Archives of India Online Records', url: 'https://nationalarchives.nic.in', isFree: true },
      ],
      actionChecklist: [
        'Trace constitutional evolution from Morley-Minto (1909) to Govt of India Act 1935',
        'Examine ideological contributions of Gandhi, Nehru, Bose, Ambedkar, and Patel',
        'Deliver structured historiographical essay evaluated on GS-1 Mains parameters',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL History of Independent India Certification',
      description: 'Clear an accredited NPTEL/Swayam certification in Modern Indian History with top percentile score.',
      resources: [
        { title: 'NPTEL Course Portal', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Complete NPTEL Modern Indian History curriculum assignments',
        'Score 75%+ on the official national proctored exam',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Physical, Social & Economic Geography (GS Paper I)',
    focusSummary: 'Master geomorphology, climatology, oceanography, Indian monsoon patterns, and demographic distribution.',
    coreSubject: {
      title: 'Indian & World Physical Geography, Climatology & Natural Resources',
      description: 'Plate tectonics, volcanism, earthquakes, atmospheric circulation, El Niño/La Niña, Indian monsoon mechanisms, soils, and drainage basins.',
      resources: [
        { title: 'NCERT Geography Fundamentals (Class 11 & 12)', url: 'https://ncert.nic.in', isFree: true },
        { title: 'NPTEL: Earth Sciences and Physical Geography', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Understand atmospheric pressure belts, Coriolis force, and tropical cyclone lifecycles',
        'Analyze Tibetan plateau heating, Somali jet, and Indian Ocean Dipole (IOD) influence on monsoons',
        'Map soil degradation, deforestation, and water table depletion patterns across India',
      ],
    },
    skill: {
      title: 'Geographical Atlas Mapping, River Basin Studies & Mineral Locations',
      description: 'Master hand-drawn map illustrations of mountain passes, river tributaries, national parks, and mineral distribution corridors.',
      resources: [
        { title: 'Survey of India Educational Maps', url: 'https://surveyofindia.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Draw rapid 30-second outlines of India with river systems and mountain ranges',
        'Locate all UNESCO World Heritage natural sites, Ramsar wetlands, and Tiger reserves',
        'Solve 50 map-based UPSC Prelims questions covering national and international chokepoints',
      ],
    },
    project: {
      title: 'Comprehensive Atlas & Resource Allocation Mapping of Indian River Basins',
      description: 'Produce a comprehensive cartographic dossier analyzing inter-state water disputes, river inter-linking projects, and drought mitigation.',
      resources: [
        { title: 'Central Water Commission (CWC) Reports', url: 'http://cwc.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Map major river interlinking links (Ken-Betwa, Godavari-Krishna) and environmental impacts',
        'Analyze Cauvery and Krishna water disputes in light of Interstate River Water Disputes Act',
        'Publish hand-illustrated map dossier with agricultural crop-suitability overlays',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NCERT Comprehensive Geography Foundation Series Completion',
      description: 'Complete verified mastery tests across all NCERT Physical and Human Geography syllabi.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete all NCERT Class 11 & 12 geography end-of-chapter analyses',
        'Score 85%+ on full-length Geography Prelims sectional mock test',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Indian Economy & Social Development (GS Paper III)',
    focusSummary: 'Study macroeconomic principles, Union Budget, Economic Survey, inclusive growth, banking, and public policy.',
    coreSubject: {
      title: 'Macroeconomics, Public Finance, Monetary Policy & Indian Planning',
      description: 'GDP/GVA calculations, inflation indices (CPI/WPI), RBI monetary policy tools (Repo, Reverse Repo, CRR), fiscal deficit, GST, and banking NPAs.',
      resources: [
        { title: 'Union Budget & Economic Survey (Ministry of Finance)', url: 'https://www.indiabudget.gov.in', isFree: true },
        { title: 'NPTEL: Indian Economy (IIT Kharagpur)', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Analyze revenue deficit vs fiscal deficit and FRBM Act targets',
        'Understand monetary transmission mechanisms and RBI Monetary Policy Committee (MPC) mandates',
        'Study structural transformations from agriculture to manufacturing and services in India',
      ],
    },
    skill: {
      title: 'Economic Survey Synthesis, Budget Analysis & Government Scheme Evaluation',
      description: 'Deconstruct Union Budget tables, extract macroeconomic indicators, and evaluate key government interventions (DBT, PLI schemes).',
      resources: [
        { title: 'NITI Aayog Strategy Reports', url: 'https://www.niti.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Synthesize the latest Union Budget speech into 10 high-yield policy thematic summaries',
        'Extract key recommendations from the latest Economic Survey chapters',
        'Draft structured comparative analyses of Direct Benefit Transfer (DBT) vs Universal Basic Income (UBI)',
      ],
    },
    project: {
      title: 'Policy Evaluation Report on Flagship Schemes (DBT, PM-KISAN, Ayushman Bharat)',
      description: 'Author a 5,000-word policy evaluation monograph assessing implementation bottlenecks, leakage reductions, and socio-economic outcomes.',
      resources: [
        { title: 'PIB (Press Information Bureau) Official Portal', url: 'https://pib.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Audit Aadhaar-enabled DBT payment delivery and ghost beneficiary reduction metrics',
        'Evaluate Ayushman Bharat PM-JAY hospital empanelment and out-of-pocket health expenditure trends',
        'Present policy recommendations structured as official committee cabinet notes',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Public Policy and Governance Certification',
      description: 'Earn an accredited certification in Indian Economic Policy and Public Governance.',
      resources: [
        { title: 'NPTEL Official Portal', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Pass NPTEL Public Policy and Governance examination with distinction',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Environment, Science & Internal Security (GS Paper III)',
    focusSummary: 'Study biodiversity conservation, climate agreements, disaster management, and India’s security challenges.',
    coreSubject: {
      title: 'Ecology, Environmental Conventions, Cyber Security & Border Management',
      description: 'UNFCCC COP summits, Paris Agreement, National Action Plan on Climate Change (NAPCC), coastal security, Left-Wing Extremism (LWE), and money laundering.',
      resources: [
        { title: 'Ministry of Environment, Forest and Climate Change (MoEFCC)', url: 'https://moef.gov.in', isFree: true },
        { title: 'IDSA (Manohar Parrikar Institute for Defence Studies and Analyses)', url: 'https://www.idsa.in', isFree: true },
      ],
      actionChecklist: [
        'Study India’s Panchamrit commitments and Long-Term Low-Emission Development Strategy (LT-LEDS)',
        'Analyze border security management across Pakistan, China, Myanmar, and Bangladesh borders',
        'Understand institutional mechanisms: NDMA, NDRF, CERT-In, and NIA',
      ],
    },
    skill: {
      title: 'Disaster Risk Assessment & Daily High-Yield Current Affairs Synthesis',
      description: 'Analyze daily national developments from The Hindu, Indian Express, and PIB into categorized civil services study notes.',
      resources: [
        { title: 'The Hindu & Indian Express Editorial Analysis', url: 'https://www.thehindu.com', isFree: false },
        { title: 'PIB Daily Releases', url: 'https://pib.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Synthesize daily editorial columns into GS-1, GS-2, GS-3, and GS-4 categorized digital files',
        'Create visual flowcharts of Sendai Framework disaster risk reduction stages',
        'Draft 10 practice answers on internal security and environmental governance',
      ],
    },
    project: {
      title: 'District-Level Disaster Management & Climate Adaptation Action Blueprint',
      description: 'Formulate an actionable District Disaster Management Plan (DDMP) for flood, cyclone, or heatwave mitigation for an Indian district.',
      resources: [
        { title: 'National Disaster Management Authority (NDMA) Guidelines', url: 'https://ndma.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Conduct multi-hazard vulnerability assessment for a chosen vulnerable coastal/hilly district',
        'Design standard operating procedures (SOPs) for early warning, evacuation, and medical relief',
        'Integrate satellite remote sensing and drone deployment strategies into rapid response',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'UNEP / Swayam Environmental Law & Policy Certification',
      description: 'Earn a recognized credential in environmental governance, wildlife conservation, and climate policy.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete Swayam Environmental Law and Policy curriculum proctored examination',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Ethics, Integrity & Aptitude (GS Paper IV)',
    focusSummary: 'Master moral thinkers, ethical dilemmas in administration, emotional intelligence, and case studies.',
    coreSubject: {
      title: 'Ethics and Human Interface, Probity in Governance & Philosophical Thinkers',
      description: 'Determinants of ethics, attitude, emotional intelligence in administration, Western & Indian moral thinkers (Socrates, Kant, Gandhi, Kautilya), and RTI Act.',
      resources: [
        { title: '2nd Administrative Reforms Commission (ARC) 4th Report: Ethics in Governance', url: 'https://darpg.gov.in', isFree: true },
        { title: 'NPTEL: Ethics in Public Administration', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Study Nolan Committee 7 Principles of Public Life: Selflessness, Integrity, Objectivity, Accountability, Openness, Honesty, Leadership',
        'Apply Kantian deontology vs utilitarianism to civil administrative decision making',
        'Analyze Citizen Charters, Sevottam model, and Whistleblower Protection Act',
      ],
    },
    skill: {
      title: 'Ethical Case Study Deconstruction & Structured Dilemma Resolution',
      description: 'Deconstruct complex bureaucratic ethical dilemmas, identify stakeholders, evaluate courses of action, and justify moral decisions.',
      resources: [
        { title: 'Ethics Case Studies Archive (LBSNAA Training Modules)', url: 'https://www.lbsnaa.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Solve 50 comprehensive GS-4 case studies using structured stakeholder frameworks',
        'Structure ethical decisions balancing legal obligations, humanitarian concerns, and public interest',
        'Refine answer writing cadence to complete Section B case studies within 75 minutes',
      ],
    },
    project: {
      title: 'Case Study Compendium: 25 Ethical Dilemmas in Public Administration with Solutions',
      description: 'Author a definitive case study compendium solving realistic civil administrative dilemmas (land acquisition, communal tensions, corruption pressures).',
      resources: [
        { title: 'DARPG Good Governance Practices Portal', url: 'https://darpg.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Draft 25 original multi-stakeholder administrative case studies with model responses',
        'Incorporate constitutional values (Articles 14, 21), moral philosophy, and administrative pragmatism',
        'Have compendium peer-reviewed by civil services mentorship faculty',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Swayam Ethics in Public Governance Accreditation',
      description: 'Clear the accredited national exam on Administrative Ethics and Public Probity.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Pass Swayam Ethics in Governance proctored examination with top grade',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — Rigorous Mains Answer Writing & Test Series',
    focusSummary: 'Timed answer writing (GS I to IV), essay structuring, diagram insertion, and mock Prelims test series.',
    coreSubject: {
      title: 'Mains Answer Writing Structure, Multi-Dimensional Analysis & Keyword Enrichment',
      description: 'Introduction-Body-Conclusion framework, incorporating Article numbers, committee recommendations, data points, and forward-looking conclusions.',
      resources: [
        { title: 'UPSC Previous Years Question Papers (Official)', url: 'https://upsc.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Master the PESTLE (Political, Economic, Social, Technological, Legal, Environmental) analytical framework',
        'Integrate official committee names: Sarkaria, Punchhi, Kelkar, Kasturirangan, Swaminathan',
        'Practice inserting micro-diagrams, flowcharts, and geographical maps in under 60 seconds',
      ],
    },
    skill: {
      title: 'Speed Answer Writing (7-minute & 11-minute templates) & Essay Structuring',
      description: 'Write 10-marker (150 words) and 15-marker (250 words) answers within strict 7-minute and 11-minute timers with zero cognitive lag.',
      resources: [
        { title: 'UPSC Mains Evaluated Topper Answer Copies', url: 'https://upsc.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Write 5 answers daily across GS 1, 2, 3, and 4 under timed conditions',
        'Write 2 full-length 250-mark essays exploring philosophical and socio-political themes',
        'Review evaluated answer scripts and incorporate feedback on structure and legibility',
      ],
    },
    project: {
      title: 'Compilation of 100 Evaluated Mains Model Answers across All Four GS Papers',
      description: 'Build a personalized master compilation of 100 peer-evaluated answers covering all major syllabus keywords for final sprint revision.',
      resources: [
        { title: 'Vision IAS / Insights on India Open Question Banks', url: 'https://insightsonindia.com', isFree: true },
      ],
      actionChecklist: [
        'Compile 25 high-scoring model answers for GS-1, GS-2, GS-3, and GS-4 each',
        'Enrich each answer with verified statistics from Economic Survey, NFHS-5, and NITI Aayog',
        'Create rapid one-page summary cheat-sheets for each GS paper',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'All India UPSC Prelims Mock Test Series (50+ Full-Length Tests Completed)',
      description: 'Complete 50+ full-length General Studies and CSAT mock test papers with detailed score analysis.',
      resources: [
        { title: 'All India Prelims Test Series Portal', url: 'https://upsc.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete 50 full-length GS Paper-1 mock tests achieving consistent 110+ scores',
        'Complete 20 CSAT Paper-2 mock tests ensuring safe 100+ qualification buffer',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Final UPSC Examination Simulation & Interview Readiness',
    focusSummary: 'Comprehensive revision of current affairs (past 2 years), CSAT mastery, and mock personality interview prep.',
    coreSubject: {
      title: 'Contemporary National & International Geopolitics & Constitutional Nuances',
      description: 'G20 outcomes, India’s Neighborhood First policy, Indo-Pacific quad, UNSC reforms, constitutional amendment debates, and economic resilience.',
      resources: [
        { title: 'Ministry of External Affairs (MEA) Official Briefings', url: 'https://www.mea.gov.in', isFree: true },
        { title: 'Rajya Sabha TV / Sansad TV Perspective Discussions', url: 'https://sansadtv.nic.in', isFree: true },
      ],
      actionChecklist: [
        'Review past 24 months of major government initiatives, statutory bodies, and global summits',
        'Analyze conflicting legal perspectives on Uniform Civil Code, Electoral Reforms, and Federal Disputes',
        'Engage in peer discussion panels on contemporary socio-economic challenges',
      ],
    },
    skill: {
      title: 'Personality Interview Articulation, DAF Analysis & Body Language',
      description: 'Analyze Detailed Application Form (DAF), home state governance challenges, hobby nuances, and articulate balanced administrative views.',
      resources: [
        { title: 'LBSNAA Training Video Archives & Guidance', url: 'https://www.lbsnaa.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Prepare detailed research dossier on native district, home state culture, and graduation background',
        'Participate in 5 mock personality interview panels with retired senior civil servants',
        'Refine posture, voice modulation, balanced perspective, and polite assertion skills',
      ],
    },
    project: {
      title: 'District Governance Action Dossier & Socio-Economic Transformation Plan',
      description: 'Author a definitive 360-degree transformation plan for a designated Aspirational District targeting education, health, and agriculture KPIs.',
      resources: [
        { title: 'NITI Aayog Aspirational Districts Programme Portal', url: 'https://www.niti.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Analyze delta rankings and baseline indicators of an Aspirational District in your home state',
        'Design low-cost, high-impact administrative interventions leveraging local self-help groups (SHGs)',
        'Defend the governance blueprint in simulated mock interview board panel',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'National Civil Services Aspirant Mock Examination & Interview Clearance',
      description: 'Successfully complete all-India simulated Prelims, Mains, and Interview cycles with top ranking.',
      resources: [
        { title: 'National Career Service Portal (UPSC Cell)', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Appear for the official UPSC Civil Services Preliminary Examination',
        'Maintain candidate registration and join regional civil services aspirant network',
      ],
    },
  },
};

// ==========================================
// 5. CLOUD ARCHITECT & DEVOPS CURRICULUM
// ==========================================
export const CLOUD_DEVOPS_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Linux Administration & Enterprise Networking Fundamentals',
    focusSummary: 'Master Linux terminal administration, systemd, user permissions, and TCP/IP networking essentials.',
    coreSubject: {
      title: 'Enterprise Computer Networking & Internet Architectures',
      description: 'TCP/IP 4-layer model, CIDR subnetting, VLANs, DNS routing mechanisms, BGP protocols, and proxy architectures.',
      resources: [
        { title: 'NPTEL: Computer Networks', url: 'https://nptel.ac.in', isFree: true },
        { title: 'Cisco Networking Basics', url: 'https://www.netacad.com', isFree: true },
      ],
      actionChecklist: [
        'Calculate IPv4 subnets, broadcast addresses, and routing tables',
        'Inspect DNS query resolution and propagation using dig, nslookup, and traceroute',
        'Configure network bonding and virtual interfaces on Linux servers',
      ],
    },
    skill: {
      title: 'Linux Systems Administration & Shell Automation (Bash)',
      description: 'File permissions (POSIX/ACLs), process signals, cron automation, systemd unit files, and Bash scripting.',
      resources: [
        { title: 'Linux Journey Admin Tutorials', url: 'https://linuxjourney.com', isFree: true },
      ],
      actionChecklist: [
        'Write modular Bash automation scripts with error handling and logging',
        'Create and manage custom systemd service units with auto-restart policies',
        'Harden Linux SSH access with key pairs, non-standard ports, and fail2ban',
      ],
    },
    project: {
      title: 'Automated Multi-Service Linux Bastion Server with Firewall Hardening',
      description: 'Configure and provision an automated Linux bastion host featuring UFW/IPTables rules, auditd monitoring, and SSH certificates.',
      resources: [
        { title: 'DigitalOcean Linux Hardening Guides', url: 'https://www.digitalocean.com/community', isFree: true },
      ],
      actionChecklist: [
        'Deploy hardened Linux VM with automated provisioning bash script',
        'Configure IPTables rate-limiting rules preventing brute-force login attempts',
        'Verify zero listening vulnerabilities using nmap and lynis security audits',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Linux Professional Institute (LPI) Linux Essentials / CompTIA Network+',
      description: 'Earn an accredited foundational Linux and networking credential.',
      resources: [
        { title: 'Linux Professional Institute', url: 'https://www.lpi.org', isFree: true },
      ],
      actionChecklist: [
        'Pass LPI Linux Essentials or CompTIA Network+ certification exam',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — Cloud Computing Principles & AWS Core Services',
    focusSummary: 'Understand multi-tenant cloud economics, IAM security policies, virtual networks, and compute instances.',
    coreSubject: {
      title: 'Cloud Computing Architecture & Multi-Tenant Virtualization',
      description: 'Hypervisors, elasticity, shared responsibility model, regions/availability zones, and cloud economics (CapEx vs OpEx).',
      resources: [
        { title: 'AWS Cloud Practitioner Essentials (Free)', url: 'https://aws.amazon.com/training', isFree: true },
        { title: 'NPTEL: Cloud Computing', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Differentiate IaaS, PaaS, and SaaS cloud service delivery models',
        'Evaluate high-availability topologies across multi-AZ regions',
        'Analyze AWS pricing calculator and cost optimization strategies',
      ],
    },
    skill: {
      title: 'AWS Core Services (VPC, EC2, S3, IAM, Security Groups)',
      description: 'Architect Virtual Private Clouds (VPCs), configure private/public subnets, NAT gateways, EC2 instances, and S3 bucket policies.',
      resources: [
        { title: 'AWS Documentation & Whitepapers', url: 'https://docs.aws.amazon.com', isFree: true },
      ],
      actionChecklist: [
        'Build custom VPC with public and private subnets, internet gateway, and route tables',
        'Launch and secure EC2 instances using custom IAM instance profiles (no hardcoded keys)',
        'Configure S3 lifecycle rules and encrypted bucket policies with SSE-S3/KMS',
      ],
    },
    project: {
      title: 'High-Availability Two-Tier Web Architecture on AWS with Auto-Scaling',
      description: 'Deploy an auto-scaling group of web servers behind an Application Load Balancer (ALB) across multiple availability zones.',
      resources: [
        { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected', isFree: true },
      ],
      actionChecklist: [
        'Configure Application Load Balancer with target group health checks',
        'Set up EC2 Auto-Scaling Group dynamically scaling based on CPU utilization metrics',
        'Demonstrate zero-downtime failover during simulated instance termination',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      description: 'Earn the official AWS foundational cloud certification.',
      resources: [
        { title: 'AWS Certification Portal', url: 'https://aws.amazon.com/certification', isFree: true },
      ],
      actionChecklist: [
        'Pass AWS Certified Cloud Practitioner examination with 800+ score',
        'Add verified digital credential badge to professional profile',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — Containerization & Microservices Infrastructure',
    focusSummary: 'Containerize multi-tier architectures, manage bridge networks, volumes, and multi-stage builds with Docker.',
    coreSubject: {
      title: 'Containerization Mechanics, cgroups & Linux Namespaces',
      description: 'Kernel namespaces (PID, net, mnt), cgroups resource limits, copy-on-write storage drivers, and container security isolation.',
      resources: [
        { title: 'Docker Deep Dive (Nigel Poulton)', url: 'https://nigelpoulton.com', isFree: false },
        { title: 'Linux Containers Infrastructure', url: 'https://linuxcontainers.org', isFree: true },
      ],
      actionChecklist: [
        'Understand isolation provided by Linux namespaces and control groups (cgroups)',
        'Analyze image layers, cache busting, and container runtime interfaces (CRI)',
        'Audit rootless container execution and least-privilege Docker daemons',
      ],
    },
    skill: {
      title: 'Docker Multi-Container Systems & Docker Compose',
      description: 'Write optimized Dockerfiles, manage bridge networks, volumes, environment configurations, and Docker Compose services.',
      resources: [
        { title: 'Docker Official Getting Started Hub', url: 'https://docs.docker.com', isFree: true },
      ],
      actionChecklist: [
        'Optimize multi-stage Dockerfiles reducing production image footprints by 80%',
        'Configure Docker Compose orchestrating web, API, database, and Redis cache containers',
        'Implement healthcheck directives and restart policies for resilient local development',
      ],
    },
    project: {
      title: 'Containerized Microservices Architecture with Redis & PostgreSQL',
      description: 'Build a containerized multi-service e-commerce or booking platform with automated database migrations and caching.',
      resources: [
        { title: 'Docker Hub Registry Guides', url: 'https://hub.docker.com', isFree: true },
      ],
      actionChecklist: [
        'Orchestrate 4 microservices with isolated internal Docker bridge networks',
        'Persist database volumes and configure automated container startup order',
        'Push tagged images to Docker Hub and GitHub Container Registry (GHCR)',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Docker Certified Associate / NPTEL Cloud Infrastructure',
      description: 'Validate containerization knowledge through recognized certification.',
      resources: [
        { title: 'Docker Training Portal', url: 'https://training.docker.com', isFree: true },
      ],
      actionChecklist: [
        'Pass Docker Certified Associate or Swayam Cloud Infrastructure examination',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Infrastructure as Code (IaC) with Terraform',
    focusSummary: 'Automate entire cloud environments declaratively with Terraform modules, state locking, and GitOps.',
    coreSubject: {
      title: 'Infrastructure as Code Paradigms & Declarative State Management',
      description: 'Imperative vs declarative configuration, Terraform state management, state locking, drift detection, and modular architecture.',
      resources: [
        { title: 'HashiCorp Terraform Documentation', url: 'https://developer.hashicorp.com/terraform', isFree: true },
        { title: 'Terraform Up & Running (Yevgeniy Brikman)', url: 'https://www.terraformupandrunning.com', isFree: false },
      ],
      actionChecklist: [
        'Master the Terraform workflow: terraform init, plan, apply, destroy',
        'Understand remote state storage with Amazon S3 and DynamoDB state locking',
        'Design reusable, parameterized Terraform modules with strict input validation',
      ],
    },
    skill: {
      title: 'Terraform HCL, Remote State & Modular Cloud Infrastructure',
      description: 'Write HashiCorp Configuration Language (HCL), manage outputs, variables, work spaces, and provision cloud VPCs and clusters.',
      resources: [
        { title: 'Terraform Registry Modules', url: 'https://registry.terraform.io', isFree: true },
      ],
      actionChecklist: [
        'Provision AWS VPC, subnets, and route tables entirely using Terraform',
        'Configure remote backend with encrypted S3 bucket and state lock DynamoDB table',
        'Implement terraform workspace to support separated dev, staging, and prod environments',
      ],
    },
    project: {
      title: 'Fully Automated Multi-Environment (Dev/Prod) AWS VPC with Terraform',
      description: 'Build an end-to-end reusable Terraform module repository that deploys a production-grade AWS infrastructure in one command.',
      resources: [
        { title: 'GitHub Actions for Terraform', url: 'https://github.com/hashicorp/setup-terraform', isFree: true },
      ],
      actionChecklist: [
        'Structure modular Terraform repository (vpc, security, compute, database modules)',
        'Automate terraform fmt, validate, and tflint checks in GitHub Actions',
        'Demonstrate zero-drift infrastructure provisioning and safe teardown',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'HashiCorp Certified: Terraform Associate (003)',
      description: 'Earn the official industry-recognized Terraform Associate credential.',
      resources: [
        { title: 'HashiCorp Certification Portal', url: 'https://www.hashicorp.com/certification/terraform-associate', isFree: true },
      ],
      actionChecklist: [
        'Pass HashiCorp Certified Terraform Associate (003) examination',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Container Orchestration with Kubernetes',
    focusSummary: 'Master Pods, Deployments, Services, Ingress Controllers, ConfigMaps, and Helm package management.',
    coreSubject: {
      title: 'Distributed Container Orchestration & Kubernetes Cluster Architecture',
      description: 'Control plane components (API Server, etcd, Scheduler, Controller Manager), Worker nodes (kubelet, kube-proxy, containerd).',
      resources: [
        { title: 'Kubernetes Official Documentation', url: 'https://kubernetes.io/docs', isFree: true },
        { title: 'Kubernetes The Hard Way (Kelsey Hightower)', url: 'https://github.com/kelseyhightower/kubernetes-the-hard-way', isFree: true },
      ],
      actionChecklist: [
        'Understand control plane election, etcd consensus, and pod scheduling algorithms',
        'Compare ClusterIP, NodePort, LoadBalancer, and Ingress routing mechanics',
        'Analyze RollingUpdate deployment strategies and horizontal pod autoscaling (HPA)',
      ],
    },
    skill: {
      title: 'Kubectl, Helm Package Management & Cluster Operations',
      description: 'Write Kubernetes YAML manifests (Deployments, Services, Ingress, Secrets), author Helm charts, and manage namespaces.',
      resources: [
        { title: 'Helm Package Manager Docs', url: 'https://helm.sh/docs', isFree: true },
      ],
      actionChecklist: [
        'Deploy microservices using kubectl with resource limits (requests/limits) and probes',
        'Package applications into versioned Helm charts with values.yaml templating',
        'Configure NGINX Ingress Controller with automatic TLS certificates via cert-manager',
      ],
    },
    project: {
      title: 'Production Kubernetes Cluster Deployment on EKS with Helm Charts',
      description: 'Provision an Amazon EKS cluster with Terraform, deploy microservices via Helm, and configure Horizontal Pod Autoscalers.',
      resources: [
        { title: 'AWS EKS User Guide', url: 'https://docs.aws.amazon.com/eks', isFree: true },
      ],
      actionChecklist: [
        'Deploy production-ready EKS cluster with managed node groups using Terraform',
        'Deploy 3 microservices via custom Helm chart with ConfigMaps and Secrets',
        'Demonstrate automated horizontal pod autoscaling under simulated HTTP traffic load',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Certified Kubernetes Application Developer (CKAD) Candidate',
      description: 'Validate production Kubernetes application deployment skills through hands-on practice.',
      resources: [
        { title: 'Linux Foundation Training: CKAD', url: 'https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad', isFree: true },
      ],
      actionChecklist: [
        'Solve 20 timed CKAD practice scenarios on killer.sh simulator',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — CI/CD Automation & Observability Engineering',
    focusSummary: 'Build zero-downtime deployment pipelines using GitHub Actions, ArgoCD, Prometheus, and Grafana.',
    coreSubject: {
      title: 'Site Reliability Engineering (SRE), Observability & SLO/SLA Design',
      description: 'The four golden signals (Latency, Traffic, Errors, Saturation), SLI/SLO/SLA metrics, distributed tracing, and Prometheus querying (PromQL).',
      resources: [
        { title: 'Google SRE Book (Free)', url: 'https://sre.google/sre-book/table-of-contents', isFree: true },
        { title: 'Prometheus Official Documentation', url: 'https://prometheus.io/docs', isFree: true },
      ],
      actionChecklist: [
        'Formulate error budgets, Service Level Objectives (SLOs), and alert thresholds',
        'Write PromQL queries calculating 95th and 99th percentile HTTP latencies',
        'Understand distributed tracing architectures with OpenTelemetry and Jaeger',
      ],
    },
    skill: {
      title: 'GitHub Actions CI/CD Pipelines, Prometheus & Grafana Monitoring',
      description: 'Continuous Integration workflows, GitOps with ArgoCD, Prometheus metrics scrapers, and alerting dashboards in Grafana.',
      resources: [
        { title: 'Grafana Labs Tutorials', url: 'https://grafana.com/tutorials', isFree: true },
        { title: 'ArgoCD GitOps Documentation', url: 'https://argo-cd.readthedocs.io', isFree: true },
      ],
      actionChecklist: [
        'Build complete GitHub Actions CI pipeline building, testing, and pushing container images',
        'Deploy ArgoCD to automatically synchronize Kubernetes manifests from Git to cluster',
        'Build real-time Grafana dashboard visualizing cluster CPU, memory, and error rates',
      ],
    },
    project: {
      title: 'GitOps Automated Pipeline with Blue-Green Deployments & Alerting',
      description: 'End-to-end GitOps delivery pipeline with automated testing, ArgoCD blue-green deployments, and Slack alerting on failures.',
      resources: [
        { title: 'Argo Rollouts Documentation', url: 'https://argoproj.github.io/argo-rollouts', isFree: true },
      ],
      actionChecklist: [
        'Configure Argo Rollouts executing automated canary deployments with analysis metrics',
        'Automatically rollback failed deployments when error rates exceed 1%',
        'Send automated Slack notifications on pipeline deployment status and alerts',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'AWS Certified Solutions Architect – Associate (SAA-C03)',
      description: 'Pass the premier industry cloud architecture certification.',
      resources: [
        { title: 'AWS SAA-C03 Exam Guide', url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate', isFree: true },
      ],
      actionChecklist: [
        'Pass AWS Certified Solutions Architect – Associate (SAA-C03) examination',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — Multi-Region Cloud Resilience & Cloud Internship',
    focusSummary: 'Architect disaster recovery strategies (Active-Active), cloud cost FinOps, and complete cloud internship.',
    coreSubject: {
      title: 'Cloud Disaster Recovery, Latency Routing & Multi-Region Strategies',
      description: 'RTO (Recovery Time Objective), RPO (Recovery Point Objective), Route 53 latency routing, DynamoDB global tables, and multi-region failover.',
      resources: [
        { title: 'AWS Disaster Recovery Whitepaper', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws', isFree: true },
      ],
      actionChecklist: [
        'Compare Backup & Restore, Pilot Light, Warm Standby, and Multi-Site Active/Active DR',
        'Analyze cross-region replication strategies for databases and object storage',
        'Implement AWS Cost Allocation Tags and FinOps budget alerting thresholds',
      ],
    },
    skill: {
      title: 'Cloud Governance, AWS Well-Architected Reviews & FinOps Cost Auditing',
      description: 'Audit cloud architectures against Security, Reliability, Performance, Cost, and Sustainability pillars of Well-Architected Framework.',
      resources: [
        { title: 'FinOps Foundation Framework', url: 'https://www.finops.org/framework', isFree: true },
      ],
      actionChecklist: [
        'Conduct AWS Well-Architected Tool review on enterprise infrastructure',
        'Identify idle cloud resources and implement automated nighttime shutdowns with Lambda',
        'Configure AWS Organizations SCPs (Service Control Policies) restricting unapproved regions',
      ],
    },
    project: {
      title: 'Pre-Capstone: Multi-Region Serverless Event-Driven Cloud Platform',
      description: 'Architect a serverless event-driven architecture utilizing AWS Lambda, EventBridge, DynamoDB Global Tables, and CloudFront CDN.',
      resources: [
        { title: 'Serverless Framework Documentation', url: 'https://www.serverless.com', isFree: true },
      ],
      actionChecklist: [
        'Deploy serverless API across two distinct AWS regions with global Route 53 health routing',
        'Replicate database updates across continents in <1 second with DynamoDB Global Tables',
        'Benchmark global edge response latencies from 10 international locations',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Enterprise Cloud Engineering Summer Internship',
      description: 'Complete an 8-12 week supervised industry internship in cloud architecture or DevOps engineering.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks industry cloud/DevOps internship with evaluated sign-off',
        'Document production infrastructure contributions in formal internship dossier',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Enterprise Hybrid Cloud Capstone & Career Launch',
    focusSummary: 'Deliver a mission-critical fault-tolerant enterprise cloud solution and step into cloud architect roles.',
    coreSubject: {
      title: 'Cloud Security Posture Management (CSPM), Zero Trust & Enterprise Governance',
      description: 'AWS IAM Identity Center, SSO integration, AWS Transit Gateway, AWS WAF rules, guardrails, and compliance audits.',
      resources: [
        { title: 'AWS Security Best Practices', url: 'https://aws.amazon.com/security/security-learning', isFree: true },
      ],
      actionChecklist: [
        'Design hub-and-spoke multi-VPC enterprise network with AWS Transit Gateway',
        'Enforce central egress inspection through AWS Network Firewall',
        'Implement automated compliance remediations using AWS Config and EventBridge',
      ],
    },
    skill: {
      title: 'Service Mesh (Istio), Chaos Engineering (Gremlin/Litmus) & Production Auditing',
      description: 'Inject simulated network failures, latency spikes, and pod terminations to validate cluster resilience and self-healing.',
      resources: [
        { title: 'LitmusChaos Open Source', url: 'https://litmuschaos.io', isFree: true },
      ],
      actionChecklist: [
        'Deploy Istio service mesh for mutual TLS (mTLS) encryption between pods',
        'Execute automated Chaos Engineering experiments verifying 99.99% availability under node failures',
        'Produce definitive architecture diagram, runbook, and disaster recovery SLA documentation',
      ],
    },
    project: {
      title: 'Major Capstone: Fault-Tolerant Hybrid Enterprise Cloud with Zero-Downtime DR',
      description: 'Definitive cloud architecture capstone featuring multi-region Kubernetes, automated GitOps, Prometheus observability, and chaos verification.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Deliver complete multi-cloud infrastructure automated through Terraform and GitHub Actions',
        'Demonstrate live automated failover during simulated regional outage with zero data loss',
        'Present architecture defense to enterprise engineering panel and recruiters',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Campus Cloud Placement Drives & AICTE National Career Launch',
      description: 'Participate in placement drives for Cloud Architect, DevOps Engineer, and SRE roles.',
      resources: [
        { title: 'AICTE National Placement Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Clear enterprise Cloud Architect / DevOps technical interview rounds',
        'Secure full-time role in cloud engineering enterprise',
      ],
    },
  },
};

// ==========================================
// 6. UI/UX & PRODUCT DESIGN CURRICULUM
// ==========================================
export const UI_UX_CURRICULUM: CurriculumMap = {
  1: {
    theme: 'Semester 1 — Visual Design Fundamentals, Typography & Color Theory',
    focusSummary: 'Master visual hierarchy, grid systems, typography scales, optical alignments, and color psychology.',
    coreSubject: {
      title: 'Visual Hierarchy, Gestalt Principles & Color Theory in Digital Interfaces',
      description: 'Figure-ground, proximity, similarity, continuation, closure, 8pt grid systems, typographic scale, and accessible contrast ratios (WCAG).',
      resources: [
        { title: 'Interaction Design Foundation (IxDF): Visual Design', url: 'https://www.interaction-design.org', isFree: true },
        { title: 'Refactoring UI (Adam Wathan & Steve Schoger)', url: 'https://www.refactoringui.com', isFree: false },
      ],
      actionChecklist: [
        'Apply Gestalt principles to guide user eye flow across digital screens',
        'Establish mathematical typographic scales using modular scale formulas',
        'Construct 60-30-10 color palettes with verified WCAG 2.1 AA/AAA contrast ratios',
      ],
    },
    skill: {
      title: 'Figma Fundamentals, Vector Editing & Layout Grids',
      description: 'Figma interface mastery, vector networks, pen tool bezier curves, responsive constraints, frames, and styling properties.',
      resources: [
        { title: 'Figma for Beginners (Official YouTube Course)', url: 'https://www.youtube.com/@Figma', isFree: true },
      ],
      actionChecklist: [
        'Master Figma pen tool curves by completing vector tracing challenges',
        'Set up 4pt and 8pt responsive layout grid systems for mobile and desktop',
        'Design 10 cohesive UI card and navigation components adhering to optical alignments',
      ],
    },
    project: {
      title: 'Visual Redesign of an Indian Public Service Interface (IRCTC / Passport Seva)',
      description: 'Analyze user friction in an existing high-traffic public service platform and deliver an accessible, visually elevated redesign.',
      resources: [
        { title: 'Indian Official Government Portals', url: 'https://www.india.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Identify 10 cognitive frictions and contrast failures in the existing interface',
        'Produce high-fidelity mobile and desktop visual redesigns in Figma',
        'Publish before-after visual comparison showcase with design rationale',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Interaction Design Foundation Visual Design Certificate',
      description: 'Complete accredited visual design coursework on IxDF.',
      resources: [
        { title: 'IxDF Certification Portal', url: 'https://www.interaction-design.org', isFree: true },
      ],
      actionChecklist: [
        'Complete IxDF Visual Design curriculum with 85%+ course grade',
      ],
    },
  },
  2: {
    theme: 'Semester 2 — User-Centered Design & Human-Computer Interaction (HCI)',
    focusSummary: 'Understand cognitive loads, mental models, affordances, Hick’s Law, Fitts’s Law, and accessibility.',
    coreSubject: {
      title: 'Human-Computer Interaction (HCI) & Cognitive Psychology in Design',
      description: 'Norman’s 7 stages of action, Gulf of Execution/Evaluation, mental models vs conceptual models, Hick-Hyman Law, and Fitts’s Law.',
      resources: [
        { title: 'The Design of Everyday Things (Don Norman)', url: 'https://jnd.org', isFree: false },
        { title: 'NPTEL: Human-Computer Interaction', url: 'https://nptel.ac.in', isFree: true },
      ],
      actionChecklist: [
        'Evaluate interfaces against Nielsen Norman Group’s 10 Usability Heuristics',
        'Minimize cognitive load using chunking and progressive disclosure',
        'Calculate touch target accessibility according to Fitts’s Law (minimum 44x44px)',
      ],
    },
    skill: {
      title: 'Accessibility Standards (WCAG 2.1 AA) & Heuristic Evaluation',
      description: 'Audit digital interfaces for screen readers, keyboard navigation, color blindness simulations (Stark plugin), and aria roles.',
      resources: [
        { title: 'W3C Web Accessibility Initiative (WAI)', url: 'https://www.w3.org/WAI', isFree: true },
      ],
      actionChecklist: [
        'Conduct comprehensive heuristic evaluation reporting 20+ usability violations',
        'Test Figma mockups with Stark plugin for protanopia, deuteranopia, and tritanopia',
        'Document keyboard focus order and screen reader announcements for complex widgets',
      ],
    },
    project: {
      title: 'Complete Accessibility Audit & Redesign Case Study for an Educational App',
      description: 'Perform a rigorous WCAG 2.1 AA audit of a student learning platform and deliver an inclusive, fully accessible interface redesign.',
      resources: [
        { title: 'A11y Project Checklist', url: 'https://www.a11yproject.com', isFree: true },
      ],
      actionChecklist: [
        'Identify color contrast and focus trapping barriers in existing screens',
        'Redesign application flows ensuring complete compliance with WCAG 2.1 AA standards',
        'Publish interactive Figma showcase demonstrating high-contrast mode and screen-reader paths',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Google UX Design Professional Certificate — Foundational Badges',
      description: 'Enroll in and clear the initial courses of the Google UX Design Professional Certificate.',
      resources: [
        { title: 'Coursera Google UX Design Track', url: 'https://www.coursera.org/professional-certificates/google-ux-design', isFree: true },
      ],
      actionChecklist: [
        'Complete Courses 1 & 2 of the Google UX Design Specialization',
      ],
    },
  },
  3: {
    theme: 'Semester 3 — User Research Methodologies & Information Architecture',
    focusSummary: 'Conduct quantitative and qualitative user interviews, build empathy maps, personas, and user journey maps.',
    coreSubject: {
      title: 'Qualitative & Quantitative User Research Methodologies',
      description: 'Generative vs evaluative research, semi-structured user interviews, survey design, bias elimination, empathy mapping, and user personas.',
      resources: [
        { title: 'Nielsen Norman Group Research Articles', url: 'https://www.nngroup.com/articles', isFree: true },
        { title: 'Just Enough Research (Erika Hall)', url: 'https://abookapart.com', isFree: false },
      ],
      actionChecklist: [
        'Draft unbiased user interview scripts with open-ended exploratory questions',
        'Synthesize raw qualitative interview recordings into Affinity Diagrams',
        'Construct data-backed primary and secondary User Personas with genuine pain points',
      ],
    },
    skill: {
      title: 'User Interviewing, Affinity Mapping & Information Architecture (IA)',
      description: 'Card sorting (open/closed), tree testing, sitemaps, user flow diagrams, and task flow optimization in FigJam.',
      resources: [
        { title: 'FigJam Tutorials & Templates', url: 'https://www.figma.com/figjam', isFree: true },
      ],
      actionChecklist: [
        'Conduct 5 real-world user interviews for a targeted problem domain',
        'Run open card sorting session on Optimal Workshop to design intuitive navigation hierarchy',
        'Build end-to-end user flow diagrams covering happy paths and edge case failure states',
      ],
    },
    project: {
      title: 'Deep User Research & Journey Mapping Case Study: Rural Citizen Scheme Access',
      description: 'Conduct primary user research discovering how students and citizens discover government schemes, and map their emotional journey.',
      resources: [
        { title: 'myScheme.gov.in Discovery Portal', url: 'https://www.myscheme.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Interview 5 students/citizens on scheme discovery and document eligibility barriers',
        'Map comprehensive Customer Journey Map with pain points, thoughts, and opportunity areas',
        'Produce definitive User Research Report with quantified findings and design recommendations',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'NPTEL Human-Computer Interaction Accredited Exam',
      description: 'Appear for the official proctored NPTEL/Swayam examination in HCI.',
      resources: [
        { title: 'Swayam National Portal', url: 'https://swayam.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Complete all weekly HCI coursework assignments and pass proctored exam with Elite badge',
      ],
    },
  },
  4: {
    theme: 'Semester 4 — Wireframing, Figma Auto-Layout & Component Design Systems',
    focusSummary: 'Create low-to-high fidelity wireframes, build tokenized component systems in Figma with auto-layout.',
    coreSubject: {
      title: 'Design System Architecture, Atomic Design & Design Tokens',
      description: 'Brad Frost Atomic Design (Atoms, Molecules, Organisms, Templates, Pages), design tokens (colors, spacing, elevation), and governance.',
      resources: [
        { title: 'Atomic Design by Brad Frost (Free Online)', url: 'https://atomicdesign.bradfrost.com', isFree: true },
        { title: 'Material Design 3 Guidelines (Google)', url: 'https://m3.material.io', isFree: true },
      ],
      actionChecklist: [
        'Deconstruct complex digital products into atomic modular components',
        'Define systematic semantic design tokens (color-surface-primary, spacing-md)',
        'Structure design system documentation ensuring consistency across product teams',
      ],
    },
    skill: {
      title: 'Advanced Figma: Auto-Layout 5.0, Component Variants & Variables',
      description: 'Master nested auto-layout, min/max widths, component properties (boolean, text, instance swap), interactive variants, and Figma variables.',
      resources: [
        { title: 'Figma Auto-Layout Playground', url: 'https://www.figma.com/community/file/784448091130032851', isFree: true },
      ],
      actionChecklist: [
        'Build fully fluid auto-layout components responding to screen resizing without layout breaks',
        'Create component variants with hover, active, focused, disabled, and loading states',
        'Leverage Figma Variables for multi-mode switching (Light Mode, Dark Mode, High Contrast)',
      ],
    },
    project: {
      title: 'Scalable Multi-Brand Design System with 50+ Accessible Components in Figma',
      description: 'Architect a production-grade UI design system in Figma featuring comprehensive components, design tokens, and documentation.',
      resources: [
        { title: 'Figma Community Design Systems Showcase', url: 'https://www.figma.com/community', isFree: true },
      ],
      actionChecklist: [
        'Publish 50+ modular components: buttons, inputs, modals, toasts, tables, and navbars',
        'Include full interactive component property definitions and auto-layout responsiveness',
        'Publish library to Figma Community with usage guidelines and token specs',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Figma Certified Creator Badge / Coursera Advanced UI Design',
      description: 'Earn advanced UI and Figma design credentials.',
      resources: [
        { title: 'Coursera UI/UX Specialization', url: 'https://www.coursera.org', isFree: true },
      ],
      actionChecklist: [
        'Earn verified advanced UI design certification badge',
      ],
    },
  },
  5: {
    theme: 'Semester 5 — Interactive Prototyping & Usability Testing',
    focusSummary: 'Create complex stateful prototypes, conduct moderated and unmoderated usability tests, and iterate.',
    coreSubject: {
      title: 'Usability Testing Protocols, SUS Scoring & Task Success Metrics',
      description: 'Moderated vs unmoderated testing, think-aloud protocol, System Usability Scale (SUS) benchmarking, task completion rates, and time-on-task.',
      resources: [
        { title: 'MeasuringU: Usability Measurement Guide (Jeff Sauro)', url: 'https://measuringu.com', isFree: true },
      ],
      actionChecklist: [
        'Write realistic usability testing task scenarios without leading instructions',
        'Calculate System Usability Scale (SUS) scores across user test cohorts',
        'Quantify task completion rates and analyze friction drop-off points',
      ],
    },
    skill: {
      title: 'Advanced Prototyping (Figma Variables / ProtoPie) & Usability Testing',
      description: 'Variables, conditional logic, expressions, realistic input typing in prototypes, and running remote tests on Maze or Lookback.',
      resources: [
        { title: 'ProtoPie Official Tutorials', url: 'https://www.protopie.io/learn', isFree: true },
        { title: 'Maze User Testing Platform', url: 'https://maze.co', isFree: true },
      ],
      actionChecklist: [
        'Build high-fidelity prototypes using Figma conditional logic (if-then statements)',
        'Set up unmoderated remote usability test on Maze with 10+ target participants',
        'Produce heatmap and click-path analysis identifying interface navigation dead-ends',
      ],
    },
    project: {
      title: 'FinTech Banking Mobile App Prototype with Full User Testing Video Reports',
      description: 'Design and prototype an intuitive financial transfers and investment app, run 5 moderated usability sessions, and iterate based on feedback.',
      resources: [
        { title: 'Loom Video Recording Tool for Tests', url: 'https://www.loom.com', isFree: true },
      ],
      actionChecklist: [
        'Build interactive prototype with working PIN authentication, transfer sliders, and history',
        'Conduct 5 recorded think-aloud usability testing sessions with real target users',
        'Document iterative UI enhancements that raised user task completion rate from 60% to 95%',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Interaction Design Foundation Usability Testing Certification',
      description: 'Complete accredited usability testing and research certification on IxDF.',
      resources: [
        { title: 'IxDF Usability Testing Course', url: 'https://www.interaction-design.org', isFree: true },
      ],
      actionChecklist: [
        'Pass IxDF Usability Testing course examination with distinction',
      ],
    },
  },
  6: {
    theme: 'Semester 6 — Micro-Interactions, Motion Design & Developer Handoff',
    focusSummary: 'Design delightful micro-interactions with Lottie, understand HTML/CSS constraints, and prepare handoff specs.',
    coreSubject: {
      title: 'Design-to-Code Feasibility, CSS Layout Principles & Motion Design',
      description: 'Disney 12 animation principles applied to UI (easing, anticipation, squash), CSS Box Model, Flexbox/Grid constraints, and developer handoff.',
      resources: [
        { title: 'Material Design Motion Choreography', url: 'https://m3.material.io/styles/motion', isFree: true },
      ],
      actionChecklist: [
        'Understand cubic bezier curves, spring physics, and natural easing timings (200-400ms)',
        'Learn how developers implement designs using CSS Grid, Flexbox, and Tailwind classes',
        'Provide comprehensive developer handoff specifications (spacing, tokens, responsive breakpoints)',
      ],
    },
    skill: {
      title: 'Lottie Animations, Framer Web Prototyping & Figma Developer Mode',
      description: 'Export Lottie JSON animations, build production-ready interactive websites in Framer, and annotate components in Figma Dev Mode.',
      resources: [
        { title: 'LottieFiles Platform & Tutorials', url: 'https://lottiefiles.com', isFree: true },
        { title: 'Framer Academy Tutorials', url: 'https://www.framer.com/academy', isFree: true },
      ],
      actionChecklist: [
        'Create custom animated checkmarks, loaders, and success micro-interactions in Lottie',
        'Build an interactive responsive portfolio website directly in Framer with scroll animations',
        'Generate design specs with CSS properties and asset exports in Figma Dev Mode',
      ],
    },
    project: {
      title: 'Interactive Portfolio Website Built in Framer with Custom Micro-Interactions',
      description: 'Design and publish a live personal portfolio website featuring smooth scroll choreography, micro-interactions, and detailed case studies.',
      resources: [
        { title: 'Framer Free Publishing Tier', url: 'https://www.framer.com', isFree: true },
      ],
      actionChecklist: [
        'Design responsive layouts for mobile, tablet, and desktop viewports in Framer',
        'Implement interactive project hover animations and custom cursor effects',
        'Deploy live on custom domain with 100 Google Lighthouse performance score',
      ],
    },
    careerMilestone: {
      category: 'certification',
      title: 'Google UX Design Professional Certificate — Complete Credential',
      description: 'Complete all 7 courses of the official Google UX Design Professional Certificate on Coursera.',
      resources: [
        { title: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', isFree: true },
      ],
      actionChecklist: [
        'Complete all capstone projects and earn verified Google UX Professional Certificate',
      ],
    },
  },
  7: {
    theme: 'Semester 7 — Growth Design, Conversion Optimization & Design Internship',
    focusSummary: 'Apply A/B testing methodologies, onboarding funnel optimization, and complete product design internship.',
    coreSubject: {
      title: 'Conversion Rate Optimization (CRO), Growth Loops & Product Metrics',
      description: 'Activation funnels, user retention cohorts, A/B hypothesis framing, north star metrics, and viral growth loops.',
      resources: [
        { title: 'Reforge Product Growth Insights', url: 'https://www.reforge.com', isFree: true },
      ],
      actionChecklist: [
        'Formulate quantitative A/B testing hypotheses with expected lift and sample sizes',
        'Analyze onboarding drop-off funnels using Pirate Metrics (AARRR)',
        'Design retention triggers and gamified reward loops driving weekly active engagement',
      ],
    },
    skill: {
      title: 'Product Analytics for Designers (Mixpanel/GA) & Design Critiques',
      description: 'Analyze telemetry funnels, identify drop-off screens, and facilitate cross-functional design critiques with engineers and PMs.',
      resources: [
        { title: 'Mixpanel Analytics Academy', url: 'https://mixpanel.com', isFree: true },
      ],
      actionChecklist: [
        'Interpret user interaction heatmaps and session recordings to uncover UX friction',
        'Present and defend design decisions using data-driven arguments in mock design critiques',
        'Write detailed Product Requirements Document (PRD) design annexes',
      ],
    },
    project: {
      title: 'Pre-Capstone: SaaS B2B Analytics Dashboard with High-Conversion Onboarding',
      description: 'Design a complex enterprise B2B analytics platform with an onboarding flow optimized to convert free-trial users into paying teams.',
      resources: [
        { title: 'SaaS Pages Design Inspiration Hub', url: 'https://saaspages.xyz', isFree: true },
      ],
      actionChecklist: [
        'Design complex data visualization dashboards with customizable widgets and filters',
        'Craft frictionless multi-step onboarding wizard reducing time-to-first-value to <3 minutes',
        'Document complete design case study articulating metrics, research, and visual solutions',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'AICTE / Top Design Studio Summer Product Design Internship',
      description: 'Complete an 8-12 week supervised product design internship at a technology company or recognized design studio.',
      resources: [
        { title: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Complete 8-12 weeks product design internship with signed supervisor evaluation',
        'Incorporate real-world production shipped designs into professional portfolio',
      ],
    },
  },
  8: {
    theme: 'Semester 8 — Comprehensive Product Portfolio & Career Launch',
    focusSummary: 'Finalize a multi-platform case study deck, defend design decisions, and secure product designer roles.',
    coreSubject: {
      title: 'Design Leadership, Cross-Functional Collaboration & Design ROI',
      description: 'Design leadership, cross-functional engineering handoff, calculating design ROI, and ethical product design (avoiding dark patterns).',
      resources: [
        { title: 'Deceptive Patterns (Harry Brignull)', url: 'https://www.deceptive.design', isFree: true },
      ],
      actionChecklist: [
        'Audit digital products ensuring elimination of deceptive dark design patterns',
        'Demonstrate business ROI of UX investments in customer support and conversion savings',
        'Prepare master storytelling presentation deck defending end-to-end design decisions',
      ],
    },
    skill: {
      title: 'Case Study Storytelling, Portfolio Presentation & Stakeholder Defense',
      description: 'Structure compelling case studies (Context, Problem, Research, Iterations, Final Solution, Impact), and present to hiring managers.',
      resources: [
        { title: 'Cofolios: Top Tech Design Intern Portfolios', url: 'https://www.cofolios.com', isFree: true },
      ],
      actionChecklist: [
        'Publish 3 in-depth case studies with clear before/after metrics and high-res video prototypes',
        'Conduct 5 mock whiteboard design challenge interviews under 45-minute constraints',
        'Prepare clean interactive slide deck for senior product design interview presentations',
      ],
    },
    project: {
      title: 'Major Capstone: End-to-End Zero-to-One Product Design System & Published Case Study',
      description: 'Deliver a complete zero-to-one product design lifecycle: user research, architecture, tokenized design system, and verified testing.',
      resources: [
        { title: 'AICTE National Student Project Scheme', url: 'https://www.aicte-india.org', isFree: true },
      ],
      actionChecklist: [
        'Deliver definitive end-to-end multi-platform application design (Mobile & Web)',
        'Publish interactive case study with live prototype links and video demonstrations',
        'Present project to academic evaluation jury and visiting design recruiters',
      ],
    },
    careerMilestone: {
      category: 'internship',
      title: 'Design Placement Drives & AICTE National Creative Career Launch',
      description: 'Participate in campus placement drives and design agency interviews for Product Designer and UI/UX roles.',
      resources: [
        { title: 'National Career Service Portal', url: 'https://www.ncs.gov.in', isFree: true },
      ],
      actionChecklist: [
        'Clear product design portfolio reviews and live whiteboard design challenges',
        'Secure full-time role as UI/UX or Product Designer in top product organization',
      ],
    },
  },
};

import {
  SOFTWARE_ENG_CURRICULUM,
  DATA_SCIENCE_CURRICULUM,
  MOBILE_APP_CURRICULUM,
  generateDynamicCurriculum,
} from './careerCurriculumsSpecialized';

export {
  SOFTWARE_ENG_CURRICULUM,
  DATA_SCIENCE_CURRICULUM,
  MOBILE_APP_CURRICULUM,
  generateDynamicCurriculum,
};

/**
 * Resolves a fully tailored, domain-accurate 4-milestone semester blueprint
 * for any career track (Civil Services, ML/AI, Cybersecurity, Design, Cloud,
 * Mobile, Data Science, Software Eng, Full Stack, or custom).
 */
export function getSemesterBlueprint(
  semesterNum: number,
  goal: string,
  tree: { requiredSkills: string[]; coreSubjects: string[] }
): SemesterBlueprint {
  const sem = Math.min(Math.max(1, semesterNum || 1), 8);
  const lower = (goal || '').toLowerCase().trim();

  // 1. Civil Services / UPSC Aspirant
  if (
    lower.includes('civil') ||
    lower.includes('upsc') ||
    lower.includes('ias') ||
    lower.includes('ips') ||
    lower.includes('gov') ||
    lower.includes('policy')
  ) {
    return CIVIL_SERVICES_CURRICULUM[sem];
  }

  // 2. Cybersecurity & Ethical Hacking
  if (
    lower.includes('cyber') ||
    lower.includes('security') ||
    lower.includes('hack') ||
    lower.includes('forensic') ||
    lower.includes('soc')
  ) {
    return CYBERSECURITY_CURRICULUM[sem];
  }

  // 3. Machine Learning / AI
  if (
    lower.includes('machine learning') ||
    lower.includes('ai & ml') ||
    lower.includes('ai / llm') ||
    lower.includes('deep learning') ||
    lower.includes('artificial intelligence') ||
    lower === 'machine learning engineer'
  ) {
    return ML_AI_CURRICULUM[sem];
  }

  // 4. Cloud Architect & DevOps
  if (
    lower.includes('cloud') ||
    lower.includes('devops') ||
    lower.includes('sre') ||
    lower.includes('aws') ||
    lower.includes('azure') ||
    lower.includes('kubernetes')
  ) {
    return CLOUD_DEVOPS_CURRICULUM[sem];
  }

  // 5. UI/UX & Product Design
  if (
    lower.includes('design') ||
    lower.includes('ui') ||
    lower.includes('ux') ||
    lower.includes('product designer') ||
    lower.includes('figma')
  ) {
    return UI_UX_CURRICULUM[sem];
  }

  // 6. Mobile App Developer
  if (
    lower.includes('mobile') ||
    lower.includes('flutter') ||
    lower.includes('android') ||
    lower.includes('ios') ||
    lower.includes('react native')
  ) {
    return MOBILE_APP_CURRICULUM[sem];
  }

  // 7. Data Scientist
  if (lower.includes('data scientist') || lower.includes('data science')) {
    return DATA_SCIENCE_CURRICULUM[sem];
  }

  // 8. Software Engineer (Core Systems / Algorithms)
  if (
    lower === 'software engineer' ||
    lower.includes('core systems') ||
    lower.includes('systems engineer') ||
    lower.includes('algorithms')
  ) {
    return SOFTWARE_ENG_CURRICULUM[sem];
  }

  // 9. Full Stack / Web Development / Frontend / Backend
  if (
    lower.includes('full stack') ||
    lower.includes('fullstack') ||
    lower.includes('web') ||
    lower.includes('frontend') ||
    lower.includes('backend')
  ) {
    return FULL_STACK_CURRICULUM[sem];
  }

  // 10. Custom or specialized goal (e.g. Robotics, Agriculture, FinTech, Blockchain, Renewable Energy, etc.)
  const dynamicCurriculum = generateDynamicCurriculum(goal, tree);
  return dynamicCurriculum[sem];
}

