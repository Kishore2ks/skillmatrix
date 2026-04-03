export interface CareerPathUser {
  id: string;
  name: string;
  email: string;
  photo?: string;
  currentRole: Role;
  currentSkills: UserSkill[];
  targetRoles: Role[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  requiredSkills: RoleSkill[];
  businessUnit: string;
  level: number;
  category: 'technical' | 'management' | 'design' | 'data';
}

export interface RoleSkill {
  id: string;
  skillName: string;
  requiredLevel: number; // 1-4 (L1, L2, L3, L4)
  category: 'skill' | 'knowledge' | 'behavior';
}

export interface UserSkill {
  skillName: string;
  currentLevel: number; // 0-4
}

export interface SkillGap {
  skillName: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number;
  category: 'skill' | 'knowledge' | 'behavior';
  estimatedHours: {
    onlineLearning: number;
    expertCoaching: number;
    onTheJob: number;
    assignments: number;
  };
}

export interface TimeEstimate {
  onlineLearning: number;
  expertCoaching: number;
  onTheJob: number;
  assignments: number;
  total: number;
}

export interface PeerStatistics {
  roleId: string;
  targeted: number;    // Peers interested
  achieving: number;   // Peers acquiring
  achieved: number;    // Peers who have these skills
}

export interface Testimonial {
  id: string;
  userName: string;
  userPhoto?: string;
  rating?: number;
  comment: string;
  roleId: string;
  date: Date;
  achievement?: string;
}

export interface RoleMatchResult {
  role: Role;
  matchPercentage: number;
  skillGaps: SkillGap[];
  timeEstimate: TimeEstimate;
  peerStats: PeerStatistics;
  testimonials: Testimonial[];
}

export type RoleStatus = 'TARGETED' | 'ACHIEVING' | 'ACHIEVED' | 'CURRENT';
