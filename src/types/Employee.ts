import { Skill } from './Skill';
import { Availability } from './Availability';

export interface Employee {
  id: string;
  type: string;
  attributes: EmployeeAttributes;
  relationships: EmployeeRelationships;
}

export interface EmployeeAttributes {
  name: string;
  daily_hours: number;
  skill_names: string[];
  total_assignments: number;
}

export interface EmployeeRelationships {
  skills: {
    data: RelationshipData[];
  };
  availabilities: {
    data: RelationshipData[];
  };
}

interface RelationshipData {
  id: string;
  type: string;
}

export interface EmployeeDetail {
  data: {
    id: string;
    type: string;
    attributes: EmployeeAttributes;
    relationships: {
      skills: {
        data: SkillRelation[];
      };
      availabilities: {
        data: AvailabilityRelation[];
      };
    };
  };
  included: (Skill | Availability)[];
}

interface SkillRelation {
  id: string;
  type: string;
}

interface AvailabilityRelation {
  id: string;
  type: string;
}

interface Skill {
  id: string;
  type: string;
  attributes: {
    name: string;
    employee_count: number;
    task_count: number;
  };
}

interface Availability {
  id: string;
  type: string;
  attributes: {
    date: string;
    available_hours: string;
    day_of_week: string;
  };
  relationships: {
    employee: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}
