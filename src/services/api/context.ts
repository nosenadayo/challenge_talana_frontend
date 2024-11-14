export interface ApiStrategy {
  execute(...args: any[]): Promise<any>;
  getById?(id: string): Promise<any>;
  create?(payload: any): Promise<any>;
  update?(id: string, payload: any): Promise<any>;
  delete?(id: string): Promise<any>;
}

export class ApiContext {
  constructor(private strategy: ApiStrategy) {}

  async executeStrategy(...args: any[]): Promise<any> {
    return this.strategy.execute(...args);
  }

  async getById(id: string): Promise<any> {
    if (!this.strategy.getById) {
      throw new Error('getById method not implemented');
    }
    return this.strategy.getById(id);
  }

  async create(payload: any): Promise<any> {
    if (!this.strategy.create) {
      throw new Error('create method not implemented');
    }
    return this.strategy.create(payload);
  }

  async update(id: string, payload: any): Promise<any> {
    if (!this.strategy.update) {
      throw new Error('update method not implemented');
    }
    return this.strategy.update(id, payload);
  }

  async delete(id: string): Promise<any> {
    if (!this.strategy.delete) {
      throw new Error('delete method not implemented');
    }
    return this.strategy.delete(id);
  }
} 