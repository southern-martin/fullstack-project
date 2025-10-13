export class Role {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  isActive: boolean;
  permissions?: string[];
  metadata?: Record<string, any>;
  priority?: number;
  users?: any[];

  constructor(data: Partial<Role> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.name = data.name || "";
    this.description = data.description;
    this.isActive = data.isActive ?? true;
    this.permissions = data.permissions;
    this.metadata = data.metadata;
    this.priority = data.priority;
    this.users = data.users;
  }
}
