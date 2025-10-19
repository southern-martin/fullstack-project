export class Language {
  code: string; // Primary key - e.g., 'en', 'fr', 'es'
  createdAt?: Date;
  updatedAt?: Date;
  name: string; // e.g., 'English', 'French', 'Spanish'
  localName?: string; // e.g., 'English', 'Français', 'Español'
  flag?: string; // Flag emoji or URL
  status: string; // 'active' or 'inactive'
  isDefault: boolean;
  metadata?: {
    direction?: "ltr" | "rtl"; // Text direction
    region?: string; // e.g., 'US', 'FR', 'ES'
    currency?: string; // e.g., 'USD', 'EUR'
    dateFormat?: string; // e.g., 'MM/DD/YYYY', 'DD/MM/YYYY'
  };

  constructor(data: Partial<Language> = {}) {
    this.code = data.code || "";
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.name = data.name || "";
    this.localName = data.localName;
    this.flag = data.flag;
    this.status = data.status || "active";
    this.isDefault = data.isDefault ?? false;
    this.metadata = data.metadata;
  }

  get displayName(): string {
    return this.localName || this.name;
  }

  get isRTL(): boolean {
    return this.metadata?.direction === "rtl";
  }

  get isActive(): boolean {
    return this.status === "active";
  }
}
