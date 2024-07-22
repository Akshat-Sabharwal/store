export type TFile = {
  name: string;
  fileURL: string;
  blobURL: string;
  content: any;
  size: number;
};

export type TUser = {
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  files: File[];
} | null;
