"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Search, MoreHorizontal, Eye, Edit2, Trash2, CheckCircle } from "lucide-react"

interface Asset {
  id: string
  assetId: string
  name: string
  type: "Vehicle" | "Stove" | "Land" | "Building"
  sector: string
  owner: string
  location: string
  verificationStatus: "Verified" | "Unverified"
  isActive: boolean
  totalCreditsEarned: number
  totalFeeDeducted: number
  netCredits: number
  createdDate: string
}

const mockAssets: Asset[] = [
  {
    id: "1",
    assetId: "ASSET-001",
    name: "Jean's Farmland - Plot A",
    type: "Land",
    sector: "FARMER",
    owner: "Jean Ndayisaba",
    location: "Kigali, Gasabo",
    verificationStatus: "Verified",
    isActive: true,
    totalCreditsEarned: 1200,
    totalFeeDeducted: 120,
    netCredits: 1080,
    createdDate: "2025-01-15",
  },
  {
    id: "2",
    assetId: "ASSET-002",
    name: "Marie's Eco Stove",
    type: "Stove",
    sector: "ECO_FRIENDLY_STOVES",
    owner: "Marie Uwizeyimana",
    location: "Kigali, Kicukiro",
    verificationStatus: "Verified",
    isActive: true,
    totalCreditsEarned: 800,
    totalFeeDeducted: 80,
    netCredits: 720,
    createdDate: "2025-02-20",
  },
  {
    id: "3",
    assetId: "ASSET-003",
    name: "Paul's Hybrid Vehicle",
    type: "Vehicle",
    sector: "HYBRID_CAR_OWNER",
    owner: "Paul Habimana",
    location: "Huye, Nyarugenge",
    verificationStatus: "Unverified",
    isActive: true,
    totalCreditsEarned: 0,
    totalFeeDeducted: 0,
    netCredits: 0,
    createdDate: "2025-12-01",
  },
  {
    id: "4",
    assetId: "ASSET-004",
    name: "Sophie's Commercial Building",
    type: "Building",
    sector: "COMMERCIAL_BUILDING",
    owner: "Sophie Karangwa",
    location: "Kigali, Nyarugenge",
    verificationStatus: "Verified",
    isActive: true,
    totalCreditsEarned: 3200,
    totalFeeDeducted: 320,
    netCredits: 2880,
    createdDate: "2025-01-08",
  },
  {
    id: "5",
    assetId: "ASSET-005",
    name: "Emmanuel's Farmland - Plot B",
    type: "Land",
    sector: "FARMER",
    owner: "Emmanuel Kanyarwanda",
    location: "Muhanga, Rwamagana",
    verificationStatus: "Verified",
    isActive: false,
    totalCreditsEarned: 2100,
    totalFeeDeducted: 210,
    netCredits: 1890,
    createdDate: "2025-03-10",
  },
]

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [verifyConfirmOpen, setVerifyConfirmOpen] = useState(false)

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [editFormData, setEditFormData] = useState<Asset | null>(null)
  const [newAssetData, setNewAssetData] = useState({
    name: "",
    type: "Vehicle" as const,
    sector: "FARMER" as const,
    owner: "",
    location: "",
  })

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset)
    setDetailsModalOpen(true)
  }

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setEditFormData(asset)
    setEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (editFormData && selectedAsset) {
      setAssets(assets.map((a) => (a.id === selectedAsset.id ? editFormData : a)))
      setEditModalOpen(false)
      setEditFormData(null)
      setSelectedAsset(null)
    }
  }

  const handleVerifyAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setVerifyConfirmOpen(true)
  }

  const confirmVerifyAsset = () => {
    if (selectedAsset) {
      setAssets(
        assets.map((a) =>
          a.id === selectedAsset.id
            ? { ...a, verificationStatus: "Verified" as const }
            : a
        )
      )
      setVerifyConfirmOpen(false)
      setSelectedAsset(null)
    }
  }

  const handleDeleteAsset = (asset: Asset) => {
    setSelectedAsset(asset)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteAsset = () => {
    if (selectedAsset) {
      setAssets(assets.filter((a) => a.id !== selectedAsset.id))
      setDeleteConfirmOpen(false)
      setSelectedAsset(null)
    }
  }

  const handleAddNewAsset = () => {
    setNewAssetData({
      name: "",
      type: "Vehicle",
      sector: "FARMER",
      owner: "",
      location: "",
    })
    setAddModalOpen(true)
  }

  const confirmAddAsset = () => {
    const newAsset: Asset = {
      id: String(assets.length + 1),
      assetId: `ASSET-${String(assets.length + 1).padStart(3, "0")}`,
      name: newAssetData.name,
      type: newAssetData.type,
      sector: newAssetData.sector,
      owner: newAssetData.owner,
      location: newAssetData.location,
      verificationStatus: "Unverified",
      isActive: true,
      totalCreditsEarned: 0,
      totalFeeDeducted: 0,
      netCredits: 0,
      createdDate: new Date().toISOString().split("T")[0],
    }
    setAssets([...assets, newAsset])
    setAddModalOpen(false)
    setNewAssetData({
      name: "",
      type: "Vehicle",
      sector: "FARMER",
      owner: "",
      location: "",
    })
  }

  const types = ["all", "Vehicle", "Stove", "Land", "Building"]
  const sectors = [
    "all",
    "FARMER",
    "HYBRID_CAR_OWNER",
    "ECO_FRIENDLY_STOVES",
    "COMMERCIAL_BUILDING",
  ]
  const statuses = ["all", "Active", "Inactive"]

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.owner.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || asset.type === selectedType
    const matchesSector =
      selectedSector === "all" || asset.sector === selectedSector
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "Active" ? asset.isActive : !asset.isActive)

    return matchesSearch && matchesType && matchesSector && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Vehicle":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
      case "Stove":
        return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
      case "Land":
        return "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      case "Building":
        return "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getVerificationColor = (status: string) => {
    return status === "Verified"
      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
  }

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case "FARMER":
        return "Farmer"
      case "HYBRID_CAR_OWNER":
        return "Hybrid Car Owner"
      case "ECO_FRIENDLY_STOVES":
        return "Eco-Friendly Stoves"
      case "COMMERCIAL_BUILDING":
        return "Commercial Building"
      default:
        return sector
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Assets Management
        </h1>
        <p className="text-muted-foreground">
          View and manage all assets registered in the system
        </p>
      </div>

      {/* Assets Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assets</CardTitle>
              <CardDescription>
                {filteredAssets.length} assets displayed
              </CardDescription>
            </div>
            <Button
              onClick={handleAddNewAsset}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add New Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by asset name, ID, or owner..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector === "all" ? "All Sectors" : getSectorLabel(sector)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Status" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Credits Earned</TableHead>
                  <TableHead>Net Credits</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className="border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium text-sm">
                      {asset.assetId}
                    </TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(asset.type)}>
                        {asset.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {getSectorLabel(asset.sector)}
                    </TableCell>
                    <TableCell className="text-sm">{asset.owner}</TableCell>
                    <TableCell>
                      <Badge
                        className={getVerificationColor(asset.verificationStatus)}
                      >
                        {asset.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(asset.isActive)}>
                        {asset.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {asset.totalCreditsEarned.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {asset.netCredits.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(asset.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(asset)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAsset(asset)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Asset
                          </DropdownMenuItem>
                          {asset.verificationStatus === "Unverified" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-emerald-600"
                                onClick={() => handleVerifyAsset(asset)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify Asset
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteAsset(asset)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Asset
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Asset ID</p>
                  <p className="font-semibold">{selectedAsset.assetId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asset Name</p>
                  <p className="font-semibold">{selectedAsset.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold">{selectedAsset.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="font-semibold">
                    {getSectorLabel(selectedAsset.sector)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-semibold">{selectedAsset.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedAsset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedAsset.isActive)}>
                    {selectedAsset.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification</p>
                  <Badge
                    className={getVerificationColor(selectedAsset.verificationStatus)}
                  >
                    {selectedAsset.verificationStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Credits Earned
                  </p>
                  <p className="font-semibold">
                    {selectedAsset.totalCreditsEarned.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fee Deducted</p>
                  <p className="font-semibold">
                    {selectedAsset.totalFeeDeducted.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Credits</p>
                  <p className="font-semibold text-emerald-600">
                    {selectedAsset.netCredits.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">
                    {new Date(selectedAsset.createdDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDetailsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Asset Name</label>
                <Input
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  placeholder="Enter asset name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={editFormData.type}
                    onValueChange={(value) =>
                      setEditFormData({
                        ...editFormData,
                        type: value as Asset["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Stove">Stove</SelectItem>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Building">Building</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Sector</label>
                  <Select
                    value={editFormData.sector}
                    onValueChange={(value) =>
                      setEditFormData({
                        ...editFormData,
                        sector: value as Asset["sector"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FARMER">Farmer</SelectItem>
                      <SelectItem value="HYBRID_CAR_OWNER">
                        Hybrid Car Owner
                      </SelectItem>
                      <SelectItem value="ECO_FRIENDLY_STOVES">
                        Eco-Friendly Stoves
                      </SelectItem>
                      <SelectItem value="COMMERCIAL_BUILDING">
                        Commercial Building
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Owner</label>
                <Input
                  value={editFormData.owner}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, owner: e.target.value })
                  }
                  placeholder="Enter owner name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editFormData.location}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter location"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Asset Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Asset Name</label>
              <Input
                value={newAssetData.name}
                onChange={(e) =>
                  setNewAssetData({ ...newAssetData, name: e.target.value })
                }
                placeholder="Enter asset name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={newAssetData.type}
                  onValueChange={(value) =>
                    setNewAssetData({
                      ...newAssetData,
                      type: value as typeof newAssetData.type,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vehicle">Vehicle</SelectItem>
                    <SelectItem value="Stove">Stove</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Building">Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Sector</label>
                <Select
                  value={newAssetData.sector}
                  onValueChange={(value) =>
                    setNewAssetData({
                      ...newAssetData,
                      sector: value as typeof newAssetData.sector,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FARMER">Farmer</SelectItem>
                    <SelectItem value="HYBRID_CAR_OWNER">
                      Hybrid Car Owner
                    </SelectItem>
                    <SelectItem value="ECO_FRIENDLY_STOVES">
                      Eco-Friendly Stoves
                    </SelectItem>
                    <SelectItem value="COMMERCIAL_BUILDING">
                      Commercial Building
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Owner</label>
              <Input
                value={newAssetData.owner}
                onChange={(e) =>
                  setNewAssetData({ ...newAssetData, owner: e.target.value })
                }
                placeholder="Enter owner name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={newAssetData.location}
                onChange={(e) =>
                  setNewAssetData({
                    ...newAssetData,
                    location: e.target.value,
                  })
                }
                placeholder="Enter location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAddAsset}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {selectedAsset?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAsset}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verify Confirmation Dialog */}
      <AlertDialog open={verifyConfirmOpen} onOpenChange={setVerifyConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verify Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to verify{" "}
              <span className="font-semibold text-foreground">
                {selectedAsset?.name}
              </span>
              ? This will mark the asset as verified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmVerifyAsset}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Verify
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
