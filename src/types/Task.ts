export interface Task {
  id: string;
  type: string;
  attributes: TaskAttributes;
  relationships: TaskRelationships;
}

export interface TaskAttributes {
  title: string;
  estimated_hours: number;
  due_date: string;
  status: string;
  skill_names: string[];
  priority_score: number;
}

interface TaskRelationships {
  skills: {
    data: SkillData[];
  };
}

interface SkillData {
  id: string;
  type: string;
}

export interface TaskResponse {
  data: Task[];
} 