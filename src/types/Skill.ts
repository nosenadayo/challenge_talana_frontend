export interface Skill {
  id: string;
  type: string;
  attributes: SkillAttributes;
}

export interface SkillAttributes {
  name: string;
  employee_count: number;
  task_count: number;
} 