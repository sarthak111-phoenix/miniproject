'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../lib/context/AuthContext';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Target,
  Sparkles,
  Edit3,
  Search,
  Plus,
  Tag,
  Trash2,
  Code,
} from 'lucide-react';

export const CAREER_GOAL_GROUPS = [
  {
    category: 'Software Engineering & Development',
    options: [
      { value: 'Full Stack Engineer', label: 'Full Stack Engineer (Web & Mobile Apps)' },
      { value: 'Software Engineer', label: 'Software Engineer (Algorithms & Systems)' },
      { value: 'Frontend Developer', label: 'Frontend Developer (React, Next.js, Modern UI/UX)' },
      { value: 'Backend Engineer', label: 'Backend Engineer (APIs, Microservices, Databases)' },
      { value: 'Mobile App Developer', label: 'Mobile App Developer (iOS, Android, Flutter)' },
      { value: 'Embedded Systems Engineer', label: 'Embedded Systems & IoT Engineer' },
      { value: 'Game Developer', label: 'Game Developer & Interactive 3D / AR / VR' },
    ],
  },
  {
    category: 'Data Science & Artificial Intelligence',
    options: [
      { value: 'Data Scientist', label: 'Data Scientist & AI Specialist' },
      { value: 'Machine Learning Engineer', label: 'Machine Learning & MLOps Engineer' },
      { value: 'Data Analyst', label: 'Data Analyst & Business Intelligence Specialist' },
      { value: 'AI / LLM Solutions Architect', label: 'AI & Generative AI Solutions Specialist' },
    ],
  },
  {
    category: 'Cloud, Infrastructure & Security',
    options: [
      { value: 'Cloud Architect', label: 'Cloud Architect (AWS, Azure, GCP)' },
      { value: 'DevOps & SRE Engineer', label: 'DevOps & Site Reliability Engineer' },
      { value: 'Cybersecurity Analyst', label: 'Cybersecurity Analyst & Ethical Hacker' },
      { value: 'Blockchain Developer', label: 'Blockchain & Web3 Developer' },
    ],
  },
  {
    category: 'Product, Design & Technical Management',
    options: [
      { value: 'UI/UX & Product Designer', label: 'UI/UX & Product Designer' },
      { value: 'Technical Product Manager', label: 'Technical Product Manager (PM)' },
    ],
  },
  {
    category: 'Specialized & Citizen Aspirations',
    options: [
      { value: 'Agricultural Specialist', label: 'Modern Farming & Agri-Entrepreneur' },
      { value: 'Civil Services / UPSC Aspirant', label: 'Civil Services (UPSC / State PSC Officer)' },
      { value: 'FinTech & Banking Analyst', label: 'Banking & Financial Technology (FinTech) Specialist' },
      { value: 'Biomedical Informatics Specialist', label: 'Healthcare & Biomedical Data Specialist' },
      { value: 'Renewable Energy Engineer', label: 'Renewable Energy & Sustainability Engineer' },
    ],
  },
];

export const ALL_PRESET_VALUES = CAREER_GOAL_GROUPS.flatMap((g) => g.options.map((o) => o.value));

export interface SkillCategoryGroup {
  category: string;
  skills: string[];
}

export const POPULAR_SKILLS_BY_CATEGORY: SkillCategoryGroup[] = [
  {
    category: 'Frontend & Web',
    skills: [
      'React',
      'JavaScript',
      'TypeScript',
      'Next.js',
      'HTML5 & CSS3',
      'Tailwind CSS',
      'Vue.js',
      'Angular',
      'Redux',
      'Web Performance',
      'Vite',
    ],
  },
  {
    category: 'Backend & APIs',
    skills: [
      'Node.js',
      'Express.js',
      'Python',
      'Django',
      'FastAPI',
      'Java',
      'Spring Boot',
      'Go (Golang)',
      'C# / .NET',
      'PHP',
      'REST APIs',
      'GraphQL',
      'Microservices',
    ],
  },
  {
    category: 'Databases & Storage',
    skills: [
      'SQL',
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'Redis',
      'Firebase',
      'Supabase',
      'Prisma ORM',
      'DynamoDB',
    ],
  },
  {
    category: 'Cloud & DevOps',
    skills: [
      'AWS',
      'Docker',
      'Kubernetes',
      'Google Cloud (GCP)',
      'Microsoft Azure',
      'Git & GitHub',
      'CI/CD Pipelines',
      'Linux & Bash',
      'Terraform',
      'Prometheus & Grafana',
    ],
  },
  {
    category: 'AI & Data Science',
    skills: [
      'Machine Learning',
      'Deep Learning',
      'PyTorch',
      'TensorFlow',
      'Data Science',
      'Data Analysis',
      'Pandas & NumPy',
      'Generative AI & LLMs',
      'Prompt Engineering',
      'Natural Language Processing (NLP)',
      'Computer Vision',
    ],
  },
  {
    category: 'Mobile Apps',
    skills: [
      'Flutter',
      'React Native',
      'Android SDK',
      'iOS Development',
      'Swift',
      'Kotlin',
      'Mobile UI Design',
    ],
  },
  {
    category: 'Security & Systems',
    skills: [
      'Cybersecurity',
      'Network Security',
      'Penetration Testing',
      'Ethical Hacking',
      'Cryptography',
      'C++',
      'C',
      'Rust',
      'Embedded Systems',
      'IoT & Arduino',
    ],
  },
  {
    category: 'Product & Design',
    skills: [
      'UI/UX Design',
      'Figma',
      'System Design',
      'Data Structures & Algorithms',
      'Agile & Scrum',
      'Product Management',
      'Power BI',
      'Tableau',
    ],
  },
];

export const ALL_PRESET_SKILLS: string[] = Array.from(
  new Set(POPULAR_SKILLS_BY_CATEGORY.flatMap((group) => group.skills))
);

interface ProfileOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: () => void;
}

export function ProfileOnboardingModal({ isOpen, onClose, onCompleted }: ProfileOnboardingModalProps) {
  const { user, profile, saveProfile } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [age, setAge] = useState<number>(profile?.age || 20);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'all'>(profile?.gender || 'female');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'All'>(
    profile?.category || 'OBC'
  );
  const [annualIncome, setAnnualIncome] = useState<number>(profile?.annualIncome || 350000);
  const [educationLevel, setEducationLevel] = useState<any>(profile?.educationLevel || 'Undergraduate');
  const [currentCourse, setCurrentCourse] = useState(profile?.currentCourse || 'B.Tech Information Technology');
  const [currentSemester, setCurrentSemester] = useState<number>(profile?.currentSemester || 4);
  const [cgpaOrPercentage, setCgpaOrPercentage] = useState<number>(profile?.cgpaOrPercentage || 84.5);
  const [occupation, setOccupation] = useState(profile?.occupation || (user?.role === 'farmer' ? 'farmer' : 'student'));

  const initialGoal = profile?.targetCareerGoal || 'Full Stack Engineer';
  const initialIsCustom = !ALL_PRESET_VALUES.includes(initialGoal);
  const [targetCareerGoal, setTargetCareerGoal] = useState(initialGoal);
  const [isCustomCareer, setIsCustomCareer] = useState(initialIsCustom);
  const [customCareerInput, setCustomCareerInput] = useState(initialIsCustom ? initialGoal : '');

  const initialSkillsList =
    profile?.skills && profile.skills.length > 0 ? profile.skills : ['React', 'JavaScript', 'Python', 'SQL'];
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkillsList);
  const [skillsInput, setSkillsInput] = useState(initialSkillsList.join(', '));
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('All');
  const [isRawTextMode, setIsRawTextMode] = useState(false);
  const [disability, setDisability] = useState(profile?.disability || false);

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile) {
      setFullName(profile.fullName || '');
      setAge(profile.age || 20);
      setGender(profile.gender || 'female');
      setState(profile.state || 'Maharashtra');
      setCategory(profile.category || 'OBC');
      setAnnualIncome(profile.annualIncome || 350000);
      setEducationLevel(profile.educationLevel || 'Undergraduate');
      setCurrentCourse(profile.currentCourse || 'B.Tech Information Technology');
      setCurrentSemester(profile.currentSemester || 4);
      setCgpaOrPercentage(profile.cgpaOrPercentage || 84.5);
      setOccupation(profile.occupation || (user?.role === 'farmer' ? 'farmer' : 'student'));

      const goal = profile.targetCareerGoal || 'Full Stack Engineer';
      const isCustom = !ALL_PRESET_VALUES.includes(goal);
      setTargetCareerGoal(goal);
      setIsCustomCareer(isCustom);
      setCustomCareerInput(isCustom ? goal : '');

      const incomingSkills =
        profile.skills && profile.skills.length > 0 ? profile.skills : ['React', 'JavaScript', 'Python', 'SQL'];
      setSelectedSkills(incomingSkills);
      setSkillsInput(incomingSkills.join(', '));
      setDisability(profile.disability || false);
    }
  }, [isOpen, profile, user]);

  const handleAddSkill = (skillToAdd: string) => {
    const raw = skillToAdd.trim();
    if (!raw) return;

    // Support comma-separated inputs if user typed or pasted multiple (e.g. "React, Docker, AWS")
    const candidates = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setSelectedSkills((prev) => {
      const next = [...prev];
      for (const item of candidates) {
        if (!next.some((existing) => existing.toLowerCase() === item.toLowerCase())) {
          next.push(item);
        }
      }
      setSkillsInput(next.join(', '));
      return next;
    });

    setSkillSearchQuery('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => {
      const next = prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase());
      setSkillsInput(next.join(', '));
      return next;
    });
  };

  const handleToggleSkill = (skill: string) => {
    const exists = selectedSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (exists) {
      handleRemoveSkill(skill);
    } else {
      handleAddSkill(skill);
    }
  };

  const handleClearAllSkills = () => {
    setSelectedSkills([]);
    setSkillsInput('');
  };

  const handleAddCustomSkill = (customSkill?: string | React.MouseEvent | unknown) => {
    const toAdd = typeof customSkill === 'string' && customSkill.trim() ? customSkill : skillSearchQuery;
    if (!toAdd.trim()) return;
    handleAddSkill(toAdd);
    setSkillSearchQuery('');
  };

  const handleRawTextChange = (value: string) => {
    setSkillsInput(value);
    const parsed = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setSelectedSkills(parsed);
  };

  const filteredSkills = useMemo(() => {
    const query = skillSearchQuery.trim().toLowerCase();

    // Pool by category
    let pool: string[] = [];
    if (activeSkillCategory === 'All') {
      pool = ALL_PRESET_SKILLS;
    } else {
      const group = POPULAR_SKILLS_BY_CATEGORY.find((g) => g.category === activeSkillCategory);
      pool = group ? group.skills : ALL_PRESET_SKILLS;
    }

    if (!query) {
      return pool;
    }

    const matches = pool.filter((s) => s.toLowerCase().includes(query));
    // If specific category yields no matches, search entire catalog as fallback
    if (matches.length === 0 && activeSkillCategory !== 'All') {
      return ALL_PRESET_SKILLS.filter((s) => s.toLowerCase().includes(query));
    }

    return matches;
  }, [activeSkillCategory, skillSearchQuery]);

  const isQueryAlreadySelected = useMemo(() => {
    const query = skillSearchQuery.trim().toLowerCase();
    if (!query) return false;
    return selectedSkills.some((s) => s.toLowerCase() === query);
  }, [skillSearchQuery, selectedSkills]);

  const doesQueryMatchAnyPreset = useMemo(() => {
    const query = skillSearchQuery.trim().toLowerCase();
    if (!query) return false;
    return ALL_PRESET_SKILLS.some((s) => s.toLowerCase() === query);
  }, [skillSearchQuery]);

  if (!isOpen) return null;

  async function handleFinish() {
    setLoading(true);
    setError(null);

    const finalCareerGoal = (isCustomCareer ? customCareerInput : targetCareerGoal).trim();
    if (!finalCareerGoal) {
      setError('Please specify your target career aspiration.');
      setLoading(false);
      return;
    }

    const effectiveSkillsInput = isRawTextMode ? skillsInput : selectedSkills.join(', ');
    const skills = effectiveSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const res = await saveProfile({
      fullName,
      age: Number(age),
      gender,
      state,
      category,
      annualIncome: Number(annualIncome),
      occupation,
      educationLevel,
      currentCourse,
      currentSemester: Number(currentSemester),
      cgpaOrPercentage: Number(cgpaOrPercentage),
      targetCareerGoal: finalCareerGoal,
      skills,
      disability,
    });

    setLoading(false);
    if (res.success) {
      onClose();
      if (onCompleted) onCompleted();
    } else {
      setError(res.error || 'Failed to save profile');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col p-6 sm:p-8 overflow-hidden rounded-2xl bg-white border border-[#E5DFD5] shadow-2xl text-[#1A1715]">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#948170] via-[#D5C3A5] to-[#948170]" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8780] hover:text-[#1A1715] transition-colors p-1.5 rounded-full hover:bg-[#F5F2EC] z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-4 shrink-0">
          <div className="flex items-center gap-2 text-[#948170] text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Saarthi Unified Profile Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1715]">Complete Your Profile</h2>
          <p className="text-xs sm:text-sm text-[#7E756C]">
            One profile powers both your personalized roadmap and 100% auditable Citizen Scheme eligibility.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-5 relative shrink-0">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#E5DFD5] -z-0" />
          {[
            { s: 1, label: 'Demographics', icon: User },
            { s: 2, label: 'Education & Income', icon: GraduationCap },
            { s: 3, label: 'Career & Skills', icon: Target },
          ].map(({ s, label, icon: Icon }) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setStep(s as any)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === s
                    ? 'bg-[#948170] text-white ring-4 ring-[#D5C3A5]/30 shadow-md'
                    : step > s
                    ? 'bg-[#D5C3A5] text-[#1A1715]'
                    : 'bg-[#FAF7F2] border border-[#E5DFD5] text-[#8E8780]'
                }`}
              >
                {step > s ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4" />}
              </button>
              <span className="text-[11px] font-medium text-[#7E756C] mt-1">{label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 mb-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl shrink-0">
            {error}
          </div>
        )}

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1 pr-1.5 -mr-1.5 space-y-4 my-1">
          {/* Step 1: Demographics */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Domicile State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="All">Other States / All India</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority Community</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education & Income */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Annual Family Income (₹)
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    placeholder="350000"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  >
                    <option value="Undergraduate">Undergraduate (B.Tech, B.Sc, B.Com)</option>
                    <option value="12th">Class 12th (HSC / Senior Secondary)</option>
                    <option value="10th">Class 10th (SSC / Matriculation)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                    <option value="Postgraduate">Postgraduate (M.Tech, M.Sc, MBA)</option>
                    <option value="None">None / Non-formal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                  Current Course / Discipline
                </label>
                <input
                  type="text"
                  value={currentCourse}
                  onChange={(e) => setCurrentCourse(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science / Agriculture"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Current Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#7E756C]">
                    Marks Percentage / CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={cgpaOrPercentage}
                    onChange={(e) => setCgpaOrPercentage(Number(e.target.value))}
                    placeholder="84.5"
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Skills */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Target Career / Aspiration */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#7E756C] flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#948170]" />
                    <span>Target Career / Aspiration</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const nextCustom = !isCustomCareer;
                      setIsCustomCareer(nextCustom);
                      if (nextCustom) {
                        setCustomCareerInput(ALL_PRESET_VALUES.includes(targetCareerGoal) ? '' : targetCareerGoal);
                      } else {
                        if (!ALL_PRESET_VALUES.includes(targetCareerGoal)) {
                          setTargetCareerGoal('Full Stack Engineer');
                        }
                      }
                    }}
                    className="text-[11px] font-medium text-[#948170] hover:text-[#7A6A5B] transition-colors underline decoration-dotted flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isCustomCareer ? 'Choose from presets' : 'Enter your own custom career'}</span>
                  </button>
                </div>

                {!isCustomCareer ? (
                  <div className="space-y-2">
                    <select
                      value={targetCareerGoal}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCareer(true);
                          setCustomCareerInput('');
                        } else {
                          setTargetCareerGoal(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] focus:bg-white transition-colors cursor-pointer"
                    >
                      {CAREER_GOAL_GROUPS.map((group) => (
                        <optgroup key={group.category} label={group.category} className="font-semibold text-[#6B5C4F]">
                          {group.options.map((opt) => (
                            <option key={opt.value} value={opt.value} className="font-normal text-[#1A1715]">
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <optgroup label="Custom Option" className="font-semibold text-[#948170]">
                        <option value="__custom__" className="font-medium text-[#948170]">
                          ✨ Enter Your Own Custom Career Goal...
                        </option>
                      </optgroup>
                    </select>
                    <div className="text-[11px] text-[#8E8780] flex items-center justify-between">
                      <span>
                        Selected Goal: <strong className="text-[#1A1715]">{targetCareerGoal}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCareer(true);
                          setCustomCareerInput('');
                        }}
                        className="text-[#948170] hover:underline font-medium"
                      >
                        Not listed? Type your own &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#D5C3A5]/80 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1A1715] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#948170]" />
                        Custom Career Goal
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCareer(false);
                          setTargetCareerGoal('Full Stack Engineer');
                        }}
                        className="text-[11px] text-[#948170] hover:underline font-medium"
                      >
                        &larr; Back to preset options
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={customCareerInput}
                        onChange={(e) => {
                          setCustomCareerInput(e.target.value);
                          setTargetCareerGoal(e.target.value);
                        }}
                        placeholder="e.g. Robotics Engineer, Quantum Computing Scientist, Aerospace Engineer..."
                        className="w-full px-3.5 py-2.5 bg-white border border-[#948170] rounded-xl text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none ring-2 ring-[#D5C3A5]/30 transition-colors shadow-xs"
                      />
                      {customCareerInput.trim() && (
                        <span className="absolute right-3 top-2.5 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300">
                          Custom Goal
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-[11px] font-medium text-[#7E756C] mb-1.5">
                        Popular Custom Aspirations (Click to select):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Robotics & Automation Engineer',
                          'Quantum Computing Researcher',
                          'Aerospace & Drone Specialist',
                          'Biotech & Bioinformatics Scientist',
                          'AR / VR & Metaverse Developer',
                          'Digital Forensic Investigator',
                          'CleanTech & Solar Energy Specialist',
                        ].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setCustomCareerInput(item);
                              setTargetCareerGoal(item);
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                              customCareerInput === item
                                ? 'bg-[#948170] text-white border-[#948170] shadow-xs font-semibold'
                                : 'bg-white text-[#6B5C4F] border-[#E5DFD5] hover:border-[#948170] hover:text-[#1A1715]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Interactive Skills Section */}
              <div className="space-y-3 p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DFD5]">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#7E756C] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#948170]" />
                    <span>Current Skills</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAE4DC] text-[#6B5C4F]">
                      {selectedSkills.length}
                    </span>
                  </label>

                  <div className="flex items-center gap-3">
                    {selectedSkills.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllSkills}
                        className="text-[11px] text-[#A0988F] hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Clear all selected skills"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear all</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsRawTextMode(!isRawTextMode)}
                      className="text-[11px] font-medium text-[#948170] hover:text-[#7A6A5B] transition-colors underline decoration-dotted flex items-center gap-1 cursor-pointer"
                    >
                      <Code className="w-3 h-3" />
                      <span>{isRawTextMode ? 'Visual chips mode' : 'Comma-separated mode'}</span>
                    </button>
                  </div>
                </div>

                {/* Current Active Skills Display */}
                {isRawTextMode ? (
                  <div>
                    <textarea
                      rows={3}
                      value={skillsInput}
                      onChange={(e) => handleRawTextChange(e.target.value)}
                      placeholder="e.g. React, JavaScript, Python, SQL, Docker, Machine Learning"
                      className="w-full px-3.5 py-2 bg-white border border-[#E5DFD5] rounded-xl text-sm text-[#1A1715] focus:outline-none focus:border-[#948170] transition-colors"
                    />
                    <p className="text-[11px] text-[#8E8780] mt-1">
                      Type or paste skills separated by commas. Automatically syncs with visual chips.
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-white border border-[#E5DFD5] rounded-xl min-h-[58px] max-h-32 overflow-y-auto flex flex-wrap gap-1.5 items-center">
                    {selectedSkills.length === 0 ? (
                      <div className="text-xs text-[#8E8780] italic flex items-center gap-1.5 py-1 px-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#948170]" />
                        <span>No skills selected yet. Click from the library below or search & type your own!</span>
                      </div>
                    ) : (
                      selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1715] text-[#FAF7F2] rounded-lg text-xs font-medium shadow-2xs group hover:bg-[#2A2420] transition-colors animate-fadeIn"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-[#D5C3A5] hover:text-red-300 transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
                            title={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                )}

                {/* Search & Custom Skill Input Bar */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8E8780]" />
                      <input
                        type="text"
                        value={skillSearchQuery}
                        onChange={(e) => setSkillSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        placeholder="Search 75+ skills or type custom skill and press Enter..."
                        className="w-full pl-8.5 pr-8 py-2 bg-white border border-[#E5DFD5] rounded-xl text-xs sm:text-sm text-[#1A1715] placeholder-[#A0988F] focus:outline-none focus:border-[#948170] focus:ring-1 focus:ring-[#948170]/30 transition-all"
                      />
                      {skillSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setSkillSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8E8780] hover:text-[#1A1715] p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!skillSearchQuery.trim()}
                      onClick={handleAddCustomSkill}
                      className="px-3.5 py-2 bg-[#948170] hover:bg-[#7E6D5D] disabled:opacity-40 disabled:hover:bg-[#948170] text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-all shadow-xs shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Notice if user typed a novel custom skill */}
                  {skillSearchQuery.trim() && !doesQueryMatchAnyPreset && !isQueryAlreadySelected && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200/90 text-[11px] text-amber-900 animate-fadeIn">
                      <span className="truncate">
                        &quot;{skillSearchQuery.trim()}&quot; is a custom skill. Click Add or press Enter to add!
                      </span>
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="text-amber-800 font-semibold hover:underline shrink-0 ml-2 cursor-pointer"
                      >
                        + Add now
                      </button>
                    </div>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="pt-0.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                    <button
                      type="button"
                      onClick={() => setActiveSkillCategory('All')}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                        activeSkillCategory === 'All'
                          ? 'bg-[#948170] text-white shadow-xs'
                          : 'bg-white text-[#6B5C4F] border border-[#E5DFD5] hover:border-[#948170]'
                      }`}
                    >
                      All ({ALL_PRESET_SKILLS.length})
                    </button>
                    {POPULAR_SKILLS_BY_CATEGORY.map((cat) => (
                      <button
                        key={cat.category}
                        type="button"
                        onClick={() => setActiveSkillCategory(cat.category)}
                        className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                          activeSkillCategory === cat.category
                            ? 'bg-[#948170] text-white shadow-xs'
                            : 'bg-white text-[#6B5C4F] border border-[#E5DFD5] hover:border-[#948170]'
                        }`}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Curated Skills Library (Click to Add / Toggle) */}
                <div className="pt-0.5">
                  <div className="flex items-center justify-between text-[11px] text-[#7E756C] mb-1.5">
                    <span>
                      Click skills to add or toggle ({filteredSkills.length} available):
                    </span>
                    {(skillSearchQuery || activeSkillCategory !== 'All') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSkillSearchQuery('');
                          setActiveSkillCategory('All');
                        }}
                        className="text-[#948170] hover:underline cursor-pointer"
                      >
                        Show all
                      </button>
                    )}
                  </div>

                  <div className="p-2.5 bg-white border border-[#E5DFD5] rounded-xl max-h-36 overflow-y-auto flex flex-wrap gap-1.5">
                    {filteredSkills.length === 0 ? (
                      <div className="w-full text-center py-3 text-xs text-[#8E8780]">
                        No matching skills found in this category.{' '}
                        <button
                          type="button"
                          onClick={handleAddCustomSkill}
                          className="text-[#948170] font-semibold underline hover:text-[#7A6A5B] cursor-pointer"
                        >
                          Add &quot;{skillSearchQuery}&quot; as custom skill &rarr;
                        </button>
                      </div>
                    ) : (
                      filteredSkills.map((skill) => {
                        const isSelected = selectedSkills.some(
                          (s) => s.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleToggleSkill(skill)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 group cursor-pointer ${
                              isSelected
                                ? 'bg-[#FAF3EA] text-[#6B5C4F] border-[#948170] font-semibold ring-1 ring-[#948170]/30 shadow-2xs'
                                : 'bg-white text-[#6B5C4F] border-[#E5DFD5] hover:border-[#948170] hover:text-[#1A1715] hover:bg-[#FAF7F2]'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3 h-3 text-[#948170]" />
                            ) : (
                              <Plus className="w-3 h-3 text-[#8E8780] group-hover:text-[#948170]" />
                            )}
                            <span>{skill}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Disability Certificate checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="disabilityCheck"
                  checked={disability}
                  onChange={(e) => setDisability(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5DFD5] text-[#948170] bg-[#FAF7F2] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="disabilityCheck" className="text-xs text-[#7E756C] cursor-pointer">
                  I hold a recognized Person with Disability (PwD) certificate (qualifies for affirmative Citizen Schemes)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Actions Pinned at Bottom */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5DFD5] shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-sm text-[#7E756C] hover:text-[#1A1715] flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 rounded-xl btn-luxury text-sm font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl btn-luxury text-sm font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#1A1715] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save & Match Schemes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
