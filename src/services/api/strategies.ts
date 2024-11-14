import axios from 'axios';
import { ApiResponse } from '../../types';

abstract class ApiStrategy {
    protected baseUrl = 'http://0.0.0.0:3000/api/v1';
  abstract execute(id?: string): Promise<any>;
}

export class ApiContext {
  private strategy: ApiStrategy;

  constructor(strategy: ApiStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: ApiStrategy) {
    this.strategy = strategy;
  }

  async executeStrategy(id?: string) {
    return await this.strategy.execute(id);
  }
}

export class AssignmentStrategy extends ApiStrategy {
  async execute(date?: string): Promise<ApiResponse> {
    const endpoint = date 
        ? `${this.baseUrl}/task_assignments/report?date=${date}`
        : `${this.baseUrl}/task_assignments/report`
      const response = await axios.get(endpoint)
    return response.data
  }
}

export class TaskStrategy extends ApiStrategy {
  async execute(): Promise<ApiResponse> {
    const response = await axios.get(`${this.baseUrl}/tasks`);
    return response.data;
  }

  async create(payload: any): Promise<ApiResponse> {
    const response = await axios.post(`${this.baseUrl}/tasks`, payload);
    return response.data;
  }
} 

export class EmployeeStrategy extends ApiStrategy {
    async execute(): Promise<ApiResponse> {
        const response = await axios.get(`${this.baseUrl}/employees`);
        return response.data;
    }

    async getById(id: string): Promise<ApiResponse> {
        const response = await axios.get(`${this.baseUrl}/employees/${id}`);
        return response.data;
    }
}