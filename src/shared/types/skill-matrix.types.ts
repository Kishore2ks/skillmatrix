export type SkillCategory = 'Skill' | 'Knowledge' | 'Attitude';

export interface CompetencyItem {
  id: string;
  name: string;
  description: string;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  skills: CompetencyItem[];
  knowledge: CompetencyItem[];
  attitudes: CompetencyItem[];
  isExpanded?: boolean;
}

export interface SubDomain {
  id: string;
  name: string;
  description: string;
  competencies: Competency[];
  competenciesGenerated: boolean;
  isExpanded: boolean;
  isSelected: boolean;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  subDomains: SubDomain[];
  subDomainsGenerated: boolean;
  isExpanded: boolean;
  isSelected: boolean;
}

export interface IndustryData {
  industry: string;
  companySize: 'Startup' | 'Small' | 'Medium' | 'Enterprise';
  region: 'US' | 'Europe' | 'Asia' | 'Global';
  domains: Domain[];
}

export interface CompanyInfo {
  industry: string;
  companySize: 'Startup' | 'Small' | 'Medium' | 'Enterprise';
  region: 'US' | 'Europe' | 'Asia' | 'Global';
}

// Role Generation Types
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface RoleSkill {
  competencyId: string;
  competencyName: string;
  subDomainName: string;
  proficiency: ProficiencyLevel;
}

export interface Role {
  id: string;
  roleName: string;
  description?: string;
  primarySubDomain: string;
  assignedSkills: RoleSkill[];
  
  // Organization fields
  organization_unit_level_id?: number;
  organization_unit_id?: number;
  
  isExpanded?: boolean;
}

export interface SkillsBySubDomain {
  subDomainName: string;
  competencies: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export interface RoleGenerationRequest {
  domain: string;
  skillsBySubDomain: SkillsBySubDomain[];
}
