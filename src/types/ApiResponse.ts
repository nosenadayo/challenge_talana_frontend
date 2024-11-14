import { Employee } from './Employee';
import { Skill } from './Skill';

export interface ApiResponse {
  data: Employee[];
  included: Skill[];
} 