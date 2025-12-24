export type Sector = "farmer" | "eco-stoves" | "hybrid-vehicles" | "commercial"

export interface PendingApplication {
  id: string
  userName: string
  sector: Sector
  creditsRequested: number
  submittedDate: string
  documents: string[]
  status: "pending_review" | "under_ai_review" | "approved" | "rejected"
}
