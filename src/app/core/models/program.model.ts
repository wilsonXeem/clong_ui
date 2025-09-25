export interface Program {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  targetAmount?: number;
  currentAmount: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProgramRequest {
  title: string;
  description: string;
  imageUrl?: string;
  targetAmount?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}

export interface ProgramResponse {
  success: boolean;
  message: string;
  data: Program;
}

export interface ProgramsListResponse {
  success: boolean;
  data: {
    programs: Program[];
  };
}