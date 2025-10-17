export class Role {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  description?: string;
  isActive: boolean;
  permissions?: string[];

  constructor(data: Partial<Role> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.name = data.name || "";
    this.description = data.description;
    this.isActive = data.isActive ?? true;
    this.permissions = data.permissions;
  }
}
