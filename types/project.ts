 interface Project {
    id: string;
    name: string;
    description?: string;
    steps: Step[];
    createdAt: Date;
    isPublished?: boolean;
  }
  
  export interface Step {
    id: string;
    imageUri: string;
    comment?: string;
    createdAt: Date;
  }
  
  export type PurchaseType = 'project_slot' | 'premium_features';

  export { Project };