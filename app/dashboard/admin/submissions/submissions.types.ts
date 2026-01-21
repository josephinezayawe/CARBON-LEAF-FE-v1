export interface Submission {
  id: string;
  workspaceId: string;
  userName: string;
  nid: string;
  contact?: string;
  location?: string;
  sector: string;
  assetId: string;
  status:
    | "PENDING_ANALYSIS"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "INSUFFICIENT_DATA";
  submissionDate: string;
  creditsAwarded: number | null;
  reviewResponse: string | null;
  uploadedImages?: string[];
  duplicateFlags?: any[];
  grossCredits?: number;
}
