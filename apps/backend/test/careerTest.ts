import { getSkillTreeForGoal } from '../src/services/roadmapService';

console.log('--- TESTING CAREER SKILL RESOLUTION ---');
const robotics = getSkillTreeForGoal('Robotics Engineer');
console.log('Robotics Engineer:', robotics.requiredSkills);

const quantum = getSkillTreeForGoal('Quantum Computing Researcher');
console.log('Quantum Computing:', quantum.requiredSkills);

const cyber = getSkillTreeForGoal('Cybersecurity Analyst');
console.log('Cybersecurity Analyst:', cyber.requiredSkills);

const novel = getSkillTreeForGoal('Wildlife Conservation Technologist');
console.log('Novel Custom Goal:', novel.requiredSkills);

if (
  robotics.requiredSkills.length > 0 &&
  quantum.requiredSkills.length > 0 &&
  cyber.requiredSkills.length > 0 &&
  novel.requiredSkills.length > 0
) {
  console.log('✓ All career goal resolutions succeeded!');
} else {
  console.error('❌ Career goal resolution failed');
  process.exit(1);
}
