export type CreateWorkspace = {
  sector: string;
  assetId?: string;
  workspaceName?: string;
};

export type AssignableWorkspace = {
  id: string;
  label: string;
  workspaceName: string;
  status: string;
  sector: string;
  assetId: string | null;
  assetIdentifier?: string | null;
  assetCount: number;
};
