export class Language {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  code: string; // e.g., 'en', 'fr', 'es'
  name: string; // e.g., 'English', 'French', 'Spanish'
  nativeName?: string; // e.g., 'English', 'Français', 'Español'
  isActive: boolean;
  isDefault: boolean;
  metadata?: {
    flag?: string; // Flag emoji or URL
    direction?: "ltr" | "rtl"; // Text direction
    region?: string; // e.g., 'US', 'FR', 'ES'
    currency?: string; // e.g., 'USD', 'EUR'
    dateFormat?: string; // e.g., 'MM/DD/YYYY', 'DD/MM/YYYY'
  };

  constructor(data: Partial<Language> = {}) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.code = data.code || "";
    this.name = data.name || "";
    this.nativeName = data.nativeName;
    this.isActive = data.isActive ?? true;
    this.isDefault = data.isDefault ?? false;
    this.metadata = data.metadata;
  }

  get displayName(): string {
    return this.nativeName || this.name;
  }

  get isRTL(): boolean {
    return this.metadata?.direction === "rtl";
  }
}
