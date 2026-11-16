import { db, ProfileRecord } from '../db/store';
import { getSemesterBlueprint, SemesterBlueprint } from './careerCurriculums';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'core_subject' | 'skill' | 'project' | 'certification' | 'internship';
  status: 'pending' | 'in_progress' | 'completed';
  recommendedResources: { title: string; url: string; isFree: boolean }[];
  targetCompletionMonth: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours?: number;
  actionChecklist?: string[];
}

export interface SemesterPlan {
  semesterNumber: number;
  theme: string;
  focusSummary?: string;
  milestones: Milestone[];
}

export interface SkillGapItem {
  targetSkill: string;
  currentProficiency: 'missing' | 'beginner' | 'intermediate' | 'advanced';
  recommendedMilestoneId: string;
  resolvedInSemester?: number;
}

export interface Roadmap {
  id: string;
  userId: string;
  targetGoal: string;
  course: string;
  generatedDate: string;
  lastUpdated: string;
  semesters: SemesterPlan[];
  skillGapAnalysis: SkillGapItem[];
  overallProgressPercentage: number;
}

export const CAREER_SKILL_TREES: Record<string, { requiredSkills: string[]; coreSubjects: string[] }> = {
  'Software Engineer': {
    requiredSkills: ['Data Structures & Algorithms', 'Git', 'System Design', 'SQL', 'TypeScript', 'Docker'],
    coreSubjects: ['Operating Systems', 'Computer Networks', 'Database Management Systems'],
  },
  'Full Stack Engineer': {
    requiredSkills: ['JavaScript / TypeScript', 'React', 'Node.js', 'REST APIs', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    coreSubjects: ['Web Technologies', 'Software Engineering', 'Cloud Fundamentals'],
  },
  'Frontend Developer': {
    requiredSkills: ['JavaScript / TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Web Performance', 'State Management'],
    coreSubjects: ['Web Architecture', 'UI/UX Engineering', 'Human-Computer Interaction'],
  },
  'Backend Engineer': {
    requiredSkills: ['Node.js / Go / Java', 'REST & GraphQL APIs', 'PostgreSQL / MongoDB', 'Redis & Caching', 'Docker & Microservices'],
    coreSubjects: ['Distributed Systems', 'Database Systems', 'System Design'],
  },
  'Mobile App Developer': {
    requiredSkills: ['Flutter / React Native', 'iOS & Android SDKs', 'REST APIs', 'State Management', 'Mobile UI Design'],
    coreSubjects: ['Mobile Computing', 'Software Architecture', 'Network Protocols'],
  },
  'Embedded Systems Engineer': {
    requiredSkills: ['C / C++', 'Microcontrollers (ARM / ESP32)', 'RTOS', 'I2C / SPI Protocols', 'PCB Debugging'],
    coreSubjects: ['Embedded Systems', 'Digital Electronics', 'Computer Architecture'],
  },
  'Game Developer': {
    requiredSkills: ['C# / C++', 'Unity / Unreal Engine', '3D Math & Physics', 'Shader Programming', 'Game Optimization'],
    coreSubjects: ['Computer Graphics', 'Game Engine Architecture', 'Physics Simulation'],
  },
  'Data Scientist': {
    requiredSkills: ['Python', 'Pandas & NumPy', 'Machine Learning', 'SQL', 'Data Visualization', 'Deep Learning'],
    coreSubjects: ['Probability & Statistics', 'Linear Algebra', 'Data Mining'],
  },
  'Machine Learning Engineer': {
    requiredSkills: ['Python', 'PyTorch / TensorFlow', 'MLOps & Model Deployment', 'Feature Engineering', 'Docker / Kubernetes'],
    coreSubjects: ['Applied Machine Learning', 'Neural Networks', 'Distributed Computing'],
  },
  'Data Analyst': {
    requiredSkills: ['SQL', 'Excel & PowerBI / Tableau', 'Python for Analysis', 'Statistical Modeling', 'Business Metrics'],
    coreSubjects: ['Business Analytics', 'Data Warehousing', 'Applied Statistics'],
  },
  'AI / LLM Solutions Architect': {
    requiredSkills: ['Prompt Engineering & LangChain', 'Vector Databases', 'Fine-Tuning LLMs', 'Python', 'API Integration'],
    coreSubjects: ['Natural Language Processing', 'Generative AI Architecture', 'Information Retrieval'],
  },
  'Cloud Architect': {
    requiredSkills: ['Linux', 'Networking', 'AWS / Azure', 'Terraform', 'Kubernetes', 'CI/CD Pipelines'],
    coreSubjects: ['Distributed Systems', 'Cloud Computing Architecture', 'Network Security'],
  },
  'DevOps & SRE Engineer': {
    requiredSkills: ['CI/CD Pipelines (GitHub Actions)', 'Docker & Kubernetes', 'Terraform', 'Prometheus & Grafana', 'Linux & Bash'],
    coreSubjects: ['Reliability Engineering', 'Cloud Infrastructure', 'Systems Administration'],
  },
  'Cybersecurity Analyst': {
    requiredSkills: ['Network Security', 'Penetration Testing & BurpSuite', 'SIEM & SOC Tools', 'Linux Administration', 'Cryptography'],
    coreSubjects: ['Information Security', 'Network Protocols & Cryptography', 'Ethical Hacking'],
  },
  'Blockchain Developer': {
    requiredSkills: ['Solidity', 'Smart Contracts & Hardhat', 'Ethers.js / Web3.js', 'EVM Architecture', 'DeFi Protocols'],
    coreSubjects: ['Cryptography', 'Distributed Ledger Systems', 'Consensus Mechanisms'],
  },
  'UI/UX & Product Designer': {
    requiredSkills: ['Figma / Design Systems', 'User Research & Wireframing', 'Prototyping & Usability Testing', 'Interaction Design'],
    coreSubjects: ['Human-Computer Interaction', 'Cognitive Psychology in Design', 'Information Design'],
  },
  'Technical Product Manager': {
    requiredSkills: ['Product Roadmap Planning', 'Agile & Scrum', 'User Analytics (Mixpanel/GA)', 'SQL for Product', 'PRD Writing'],
    coreSubjects: ['Software Product Strategy', 'Business Administration', 'Software Lifecycle'],
  },
  'Agricultural Specialist': {
    requiredSkills: ['Precision Agriculture & IoT', 'Soil & Crop Health Analytics', 'Hydroponics & Modern Farming', 'Agri-Supply Logistics'],
    coreSubjects: ['Agronomy & Plant Physiology', 'Agricultural Economics', 'Smart Irrigation & Sensors'],
  },
  'Civil Services / UPSC Aspirant': {
    requiredSkills: ['Policy Formulation & Analysis', 'Constitutional Law', 'Current Affairs Synthesis', 'Analytical Writing', 'Ethics Case Studies'],
    coreSubjects: ['Indian Polity & Constitution', 'Macroeconomics & Social Development', 'Modern Indian History'],
  },
  'FinTech & Banking Analyst': {
    requiredSkills: ['Financial Modeling', 'SQL & Python for Finance', 'Payment Gateways & Protocols', 'Risk & Fraud Analytics'],
    coreSubjects: ['Banking Systems', 'Financial Accounting', 'Quantitative Finance'],
  },
  'Biomedical Informatics Specialist': {
    requiredSkills: ['Biomedical Data Analysis', 'Python / R for Bioinformatics', 'Health Informatics Standards (HL7/FHIR)', 'Clinical Systems'],
    coreSubjects: ['Biochemistry & Molecular Biology', 'Health Informatics Systems', 'Biostatistics'],
  },
  'Renewable Energy Engineer': {
    requiredSkills: ['Solar & Wind System Design', 'Energy Storage & Battery Tech', 'AutoCAD & Simulation', 'Grid Integration'],
    coreSubjects: ['Power Systems', 'Renewable Energy Technologies', 'Thermal & Electrical Sciences'],
  },
};

export function getSkillTreeForGoal(goal: string): { requiredSkills: string[]; coreSubjects: string[] } {
  if (CAREER_SKILL_TREES[goal]) {
    return CAREER_SKILL_TREES[goal];
  }

  const lowerGoal = (goal || '').toLowerCase().trim();

  // Partial or case-insensitive match with preset keys
  for (const [key, tree] of Object.entries(CAREER_SKILL_TREES)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey === lowerGoal || lowerGoal.includes(lowerKey) || lowerKey.includes(lowerGoal)) {
      return tree;
    }
  }

  // Keyword-based heuristic matching for custom entered careers
  if (lowerGoal.includes('robot') || lowerGoal.includes('iot') || lowerGoal.includes('hardware') || lowerGoal.includes('mechatron')) {
    return {
      requiredSkills: ['C / C++', 'Microcontrollers (Arduino/ESP32)', 'ROS (Robot Operating System)', 'Circuit Design', 'Sensor Integration'],
      coreSubjects: ['Control Systems', 'Embedded Systems', 'Mechatronics & Robotics'],
    };
  }
  if (lowerGoal.includes('security') || lowerGoal.includes('hack') || lowerGoal.includes('cyber') || lowerGoal.includes('forensic')) {
    return {
      requiredSkills: ['Network Security', 'Penetration Testing & BurpSuite', 'Linux Administration', 'Cryptography', 'SIEM & SOC Tools'],
      coreSubjects: ['Information Security', 'Network Protocols & Cryptography', 'Ethical Hacking'],
    };
  }
  if (lowerGoal.includes('ai') || lowerGoal.includes('ml') || lowerGoal.includes('deep learning') || lowerGoal.includes('quantum')) {
    return {
      requiredSkills: ['Python', 'Mathematical Modeling', 'Machine Learning Algorithms', 'Data Analysis', 'Simulation Tools'],
      coreSubjects: ['Linear Algebra & Probability', 'Algorithms & Complexity', 'Scientific Computing'],
    };
  }
  if (lowerGoal.includes('design') || lowerGoal.includes('ui') || lowerGoal.includes('ux') || lowerGoal.includes('creative')) {
    return {
      requiredSkills: ['Figma / Design Systems', 'User Research & Wireframing', 'Prototyping & Usability Testing', 'Interaction Design'],
      coreSubjects: ['Human-Computer Interaction', 'Visual Communication', 'Information Architecture'],
    };
  }
  if (lowerGoal.includes('game') || lowerGoal.includes('unity') || lowerGoal.includes('unreal') || lowerGoal.includes('3d')) {
    return {
      requiredSkills: ['C# / C++', 'Unity / Unreal Engine', '3D Math & Physics', 'Shader Programming', 'Game Optimization'],
      coreSubjects: ['Computer Graphics', 'Game Engine Architecture', 'Physics Simulation'],
    };
  }
  if (lowerGoal.includes('agri') || lowerGoal.includes('farm') || lowerGoal.includes('kisan')) {
    return {
      requiredSkills: ['Precision Agriculture & IoT', 'Soil & Crop Health Analytics', 'Modern Farming Systems', 'Agri-Supply Logistics'],
      coreSubjects: ['Agronomy & Plant Physiology', 'Agricultural Economics', 'Smart Irrigation & Sensors'],
    };
  }
  if (lowerGoal.includes('upsc') || lowerGoal.includes('civil') || lowerGoal.includes('gov') || lowerGoal.includes('policy')) {
    return {
      requiredSkills: ['Policy Formulation & Analysis', 'Constitutional Law', 'Current Affairs Synthesis', 'Analytical Writing'],
      coreSubjects: ['Indian Polity & Constitution', 'Social Development', 'Governance & Ethics'],
    };
  }
  if (lowerGoal.includes('financ') || lowerGoal.includes('bank') || lowerGoal.includes('invest') || lowerGoal.includes('trade')) {
    return {
      requiredSkills: ['Financial Modeling', 'SQL & Python for Finance', 'Risk & Fraud Analytics', 'Market Analytics'],
      coreSubjects: ['Banking Systems', 'Financial Accounting', 'Corporate Finance'],
    };
  }

  // Dynamic intelligent default for custom user-entered careers
  const cleanGoal = goal ? goal.trim() : 'Software Engineering';
  return {
    requiredSkills: [
      `${cleanGoal} Core Foundations`,
      'Domain Tooling & Technologies',
      'Hands-on Practical Implementation',
      'Portfolio Capstone Project',
      'Professional Standards & Certification',
    ],
    coreSubjects: [
      `${cleanGoal} Fundamentals`,
      'System Architecture & Analysis',
      'Applied Industry Best Practices',
    ],
  };
}




export class RoadmapService {
  /**
   * Retrieves an existing roadmap or generates a rich, complete semester plan.
   */
  public static async getOrGenerateRoadmap(userId: string): Promise<Roadmap> {
    const profile = await db.findProfileByUserId(userId);
    if (!profile) {
      const err: any = new Error('User profile required to generate a roadmap.');
      err.status = 404;
      throw err;
    }

    const existing = await db.getRoadmap(userId);
    if (existing) {
      // Re-evaluate skill gap incrementally without overwriting completed milestones
      const synced = this.syncRoadmapWithProfile(existing, profile);
      await db.saveRoadmap(userId, synced);
      return synced;
    }

    // Generate fresh roadmap
    const roadmap = this.generateFreshRoadmap(profile);
    await db.saveRoadmap(userId, roadmap);
    return roadmap;
  }

  /**
   * Explicitly regenerates or re-aligns the roadmap when a user changes career goal or current semester.
   */
  public static async regenerateRoadmap(
    userId: string,
    options?: { targetGoal?: string; currentSemester?: number; forceRegenerate?: boolean }
  ): Promise<Roadmap> {
    const profile = await db.findProfileByUserId(userId);
    if (!profile) {
      const err: any = new Error('User profile required to regenerate a roadmap.');
      err.status = 404;
      throw err;
    }

    if (options?.targetGoal && options.targetGoal !== profile.targetCareerGoal) {
      profile.targetCareerGoal = options.targetGoal;
      await db.upsertProfile(profile);
    }

    if (options?.currentSemester && options.currentSemester !== profile.currentSemester) {
      profile.currentSemester = options.currentSemester;
      await db.upsertProfile(profile);
    }

    const existing = await db.getRoadmap(userId);
    const existingStatusMap = new Map<string, 'pending' | 'in_progress' | 'completed'>();
    if (existing && !options?.forceRegenerate) {
      for (const sem of existing.semesters || []) {
        for (const m of sem.milestones || []) {
          if (m.status !== 'pending') {
            existingStatusMap.set(m.id, m.status);
            existingStatusMap.set(m.title.toLowerCase().trim(), m.status);
          }
        }
      }
    }

    const fresh = this.generateFreshRoadmap(profile);

    const goalChanged = Boolean(existing && existing.targetGoal !== profile.targetCareerGoal);

    // Re-apply completed statuses if present (only matching titles if goal changed)
    if (existingStatusMap.size > 0) {
      for (const sem of fresh.semesters) {
        for (const m of sem.milestones) {
          const byTitle = existingStatusMap.get(m.title.toLowerCase().trim());
          const byId = existingStatusMap.get(m.id);
          if (byTitle) {
            m.status = byTitle;
          } else if (!goalChanged && byId) {
            m.status = byId;
          }
        }
      }
      fresh.overallProgressPercentage = this.calculateProgress(fresh);
    }

    await db.saveRoadmap(userId, fresh);
    return fresh;
  }

  /**
   * Generates a preview roadmap in-memory for exploration without modifying user data.
   */
  public static getPreviewRoadmap(targetGoal = 'Full Stack Engineer', currentSemester = 1): Roadmap {
    const dummyProfile: ProfileRecord = {
      userId: 'preview-user',
      fullName: 'Aspiring Student',
      age: 20,
      gender: 'all',
      state: 'National',
      category: 'General',
      annualIncome: 300000,
      occupation: 'student',
      educationLevel: 'Undergraduate',
      currentCourse: 'B.Tech / Degree',
      currentSemester: currentSemester,
      skills: ['Programming Basics', 'Git'],
      targetCareerGoal: targetGoal,
      disability: false,
      updatedAt: new Date().toISOString(),
    };

    return this.generateFreshRoadmap(dummyProfile);
  }

  /**
   * Updates the progress status of a specific milestone and persists it.
   */
  public static async updateMilestoneStatus(
    userId: string,
    milestoneId: string,
    status: 'pending' | 'in_progress' | 'completed'
  ): Promise<Roadmap> {
    const roadmap = await db.getRoadmap(userId);
    if (!roadmap) {
      const err: any = new Error('No roadmap exists for this user.');
      err.status = 404;
      throw err;
    }

    let found = false;
    for (const sem of roadmap.semesters) {
      for (const m of sem.milestones) {
        if (m.id === milestoneId) {
          m.status = status;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      const err: any = new Error(`Milestone '${milestoneId}' not found in roadmap.`);
      err.status = 404;
      throw err;
    }

    roadmap.overallProgressPercentage = this.calculateProgress(roadmap);
    roadmap.lastUpdated = new Date().toISOString();

    await db.saveRoadmap(userId, roadmap);
    return roadmap;
  }

  /**
   * Adds a skill to the student profile and immediately re-evaluates skill gaps.
   */
  public static async addSkillToProfileAndSync(userId: string, skill: string): Promise<Roadmap> {
    const profile = await db.findProfileByUserId(userId);
    if (!profile) {
      const err: any = new Error('User profile not found.');
      err.status = 404;
      throw err;
    }

    const currentSkills = profile.skills || [];
    const exists = currentSkills.some((s) => s.toLowerCase() === skill.toLowerCase());
    if (!exists) {
      currentSkills.push(skill.trim());
      profile.skills = currentSkills;
      await db.upsertProfile(profile);
    }

    const roadmap = await this.getOrGenerateRoadmap(userId);
    return roadmap;
  }

  public static calculateProgress(roadmap: Roadmap): number {
    let total = 0;
    let completed = 0;
    for (const sem of roadmap.semesters || []) {
      for (const m of sem.milestones || []) {
        total++;
        if (m.status === 'completed') completed++;
      }
    }
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }

  /**
   * Generates a complete, structured roadmap from currentSem to Semester 8.
   * Guarantees NO empty semesters and provides 4 distinct, rich milestones per semester.
   */
  public static generateFreshRoadmap(profile: ProfileRecord): Roadmap {
    const goal = profile.targetCareerGoal || 'Full Stack Engineer';
    const careerTree = getSkillTreeForGoal(goal);
    const rawSem = profile.currentSemester && profile.currentSemester >= 1 && profile.currentSemester <= 8
      ? profile.currentSemester
      : 3;
    const currentSem = Math.min(Math.max(1, rawSem), 8);
    const maxSem = 8;

    const semesters: SemesterPlan[] = [];
    const skillGaps: SkillGapItem[] = [];

    // Analyze skill gaps against user's verified skills
    const userSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
    careerTree.requiredSkills.forEach((reqSkill, idx) => {
      const hasSkill = userSkillsLower.some((s) => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s));
      const proficiency: 'missing' | 'intermediate' = hasSkill ? 'intermediate' : 'missing';
      const resolvedSemester = Math.min(8, currentSem + Math.floor(idx / 2));
      skillGaps.push({
        targetSkill: reqSkill,
        currentProficiency: proficiency,
        recommendedMilestoneId: `ms-${currentSem}-${(idx % 4) + 1}`,
        resolvedInSemester: resolvedSemester,
      });
    });

    // Generate every semester from currentSem to maxSem (8)
    for (let s = currentSem; s <= maxSem; s++) {
      const blueprint = getSemesterBlueprint(s, goal, careerTree);
      const isCurrent = s === currentSem;

      const milestones: Milestone[] = [
        {
          id: `ms-${s}-1`,
          title: blueprint.coreSubject.title,
          description: blueprint.coreSubject.description,
          category: 'core_subject',
          status: isCurrent ? 'in_progress' : 'pending',
          recommendedResources: blueprint.coreSubject.resources,
          targetCompletionMonth: 2,
          difficulty: s <= 2 ? 'beginner' : s <= 5 ? 'intermediate' : 'advanced',
          estimatedHours: 40,
          actionChecklist: blueprint.coreSubject.actionChecklist || [
            'Complete core lecture modules and conceptual notes',
            'Solve mid-term theoretical and analytical problem sets',
            'Review verified NPTEL / Swayam study materials',
          ],
        },
        {
          id: `ms-${s}-2`,
          title: blueprint.skill.title,
          description: blueprint.skill.description,
          category: 'skill',
          status: 'pending',
          recommendedResources: blueprint.skill.resources,
          targetCompletionMonth: 3,
          difficulty: s <= 3 ? 'beginner' : s <= 6 ? 'intermediate' : 'advanced',
          estimatedHours: 50,
          actionChecklist: blueprint.skill.actionChecklist || [
            'Follow official documentation and hands-on tutorials',
            'Complete targeted laboratory practice exercises',
            'Commit modular code and documentation examples',
          ],
        },
        {
          id: `ms-${s}-3`,
          title: blueprint.project.title,
          description: blueprint.project.description,
          category: 'project',
          status: 'pending',
          recommendedResources: blueprint.project.resources,
          targetCompletionMonth: 4,
          difficulty: s <= 3 ? 'beginner' : s <= 6 ? 'intermediate' : 'advanced',
          estimatedHours: 60,
          actionChecklist: blueprint.project.actionChecklist || [
            'Architect domain system schema and architecture',
            'Build responsive, production-ready implementation',
            'Deploy live working demo or publish project repository',
          ],
        },
        {
          id: `ms-${s}-4`,
          title: blueprint.careerMilestone.title,
          description: blueprint.careerMilestone.description,
          category: blueprint.careerMilestone.category,
          status: 'pending',
          recommendedResources: blueprint.careerMilestone.resources,
          targetCompletionMonth: 4,
          difficulty: s <= 4 ? 'intermediate' : 'advanced',
          estimatedHours: 45,
          actionChecklist:
            blueprint.careerMilestone.actionChecklist ||
            (blueprint.careerMilestone.category === 'internship'
              ? [
                  'Register on the official AICTE Internship Portal',
                  'Submit structured resume and portfolio repository',
                  'Complete weekly industry supervisor check-ins',
                ]
              : [
                  'Register for accredited proctored examination on Swayam / Industry Portal',
                  'Complete domain practice milestones and mock tests',
                  'Earn and showcase verified credential badge on profile',
                ]),
        },
      ];

      semesters.push({
        semesterNumber: s,
        theme: blueprint.theme,
        focusSummary: blueprint.focusSummary,
        milestones,
      });
    }

    const roadmap: Roadmap = {
      id: `rdm-${Date.now()}`,
      userId: profile.userId,
      targetGoal: goal,
      course: profile.currentCourse || 'Degree Program',
      generatedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      semesters,
      skillGapAnalysis: skillGaps,
      overallProgressPercentage: 0,
    };

    roadmap.overallProgressPercentage = this.calculateProgress(roadmap);
    return roadmap;
  }

  /**
   * Progressively syncs existing roadmap with updated user profile.
   * Preserves all completed milestone states and repairs any previously empty semesters.
   */
  public static syncRoadmapWithProfile(existing: Roadmap, profile: ProfileRecord): Roadmap {
    const userSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
    const goal = profile.targetCareerGoal || existing.targetGoal;
    const goalChanged = existing.targetGoal !== goal;
    const careerTree = getSkillTreeForGoal(goal);
    const rawSem = profile.currentSemester || 3;
    const currentSem = Math.min(Math.max(1, rawSem), 8);

    // Save existing milestone completion status
    const statusMap = new Map<string, 'pending' | 'in_progress' | 'completed'>();
    for (const sem of existing.semesters || []) {
      for (const m of sem.milestones || []) {
        if (m.status !== 'pending') {
          statusMap.set(m.id, m.status);
          statusMap.set(m.title.toLowerCase().trim(), m.status);
        }
      }
    }

    // Check if existing roadmap has incomplete or empty semesters from legacy generator
    const hasEmptySemesters = !existing.semesters ||
      existing.semesters.length === 0 ||
      existing.semesters.some((s) => !s.milestones || s.milestones.length === 0);

    if (goalChanged || hasEmptySemesters) {
      // Regenerate clean complete curriculum
      const fresh = this.generateFreshRoadmap(profile);
      existing.targetGoal = goal;
      existing.semesters = fresh.semesters;
      existing.skillGapAnalysis = fresh.skillGapAnalysis;

      // Restore previously completed milestone states
      for (const sem of existing.semesters) {
        for (const m of sem.milestones) {
          const byId = statusMap.get(m.id);
          const byTitle = statusMap.get(m.title.toLowerCase().trim());
          if (byId) m.status = byId;
          else if (byTitle) m.status = byTitle;
        }
      }
    } else {
      // Goal unchanged: dynamically update skill gaps
      existing.targetGoal = goal;
      existing.skillGapAnalysis = careerTree.requiredSkills.map((skill, idx) => {
        const hasSkill = userSkillsLower.some((s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));
        return {
          targetSkill: skill,
          currentProficiency: hasSkill ? 'intermediate' : 'missing',
          recommendedMilestoneId: `ms-${currentSem}-${(idx % 4) + 1}`,
          resolvedInSemester: Math.min(8, currentSem + Math.floor(idx / 2)),
        };
      });
    }

    existing.overallProgressPercentage = this.calculateProgress(existing);
    existing.lastUpdated = new Date().toISOString();
    return existing;
  }
}
