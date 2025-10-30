"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { QrCode } from "lucide-react"

export default function AddRollPage() {
  const [formData, setFormData] = useState({
    sku: "",
    weight: "",
    width: "",
    height: "",
    thickness: "",
    materialType: "",
    storageLocation: "",
    productionDate: "",
    qrBarcodeId: "",
    notes: "",
  })
  const { toast } = useToast()

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const validateForm = (): string[] => {
    const errors: string[] = []
    if (!formData.sku.trim()) errors.push("SKU is required")
    if (!formData.weight.trim() || Number.parseFloat(formData.weight) <= 0) errors.push("Weight must be greater than 0")
    if (!formData.materialType.trim()) errors.push("Material type is required")
    return errors
  }

  const handleSubmit = useCallback(() => {
    const errors = validateForm()
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join("\n"),
        variant: "destructive",
      })
      return
    }

    // Simulate successful submission
    console.log("Form submitted:", formData)

    toast({
      title: "Paper roll added successfully",
      description: `${formData.sku} has been added to inventory.`,
      className: "bg-green-600 text-white border-green-700",
    })

    // Reset form
    setFormData({
      sku: "",
      weight: "",
      width: "",
      height: "",
      thickness: "",
      materialType: "",
      storageLocation: "",
      productionDate: "",
      qrBarcodeId: "",
      notes: "",
    })
  }, [formData, toast])

  const generateQRCode = useCallback(() => {
    const randomId = `QR${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    handleInputChange("qrBarcodeId", randomId)

    toast({
      title: "QR Code generated",
      description: `Generated QR Code: ${randomId}`,
      className: "bg-blue-600 text-white border-blue-700",
    })
  }, [handleInputChange, toast])

  return (
    <div className="w-full max-w-none">
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-xl">Add New Paper Roll</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* SKU and Weight */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-gray-300">
                SKU <span className="text-red-400">*</span>
              </Label>
              <Input
                id="sku"
                placeholder="e.g., SKU-001"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-gray-300">
                Weight (kg) <span className="text-red-400">*</span>
              </Label>
              <Input
                id="weight"
                placeholder="e.g., 45.2"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-3">
            <Label className="text-gray-300">Dimensions (cm)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width" className="text-gray-400 text-sm">
                  Width
                </Label>
                <Input
                  id="width"
                  placeholder="120"
                  value={formData.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="text-gray-400 text-sm">
                  Height
                </Label>
                <Input
                  id="height"
                  placeholder="80"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thickness" className="text-gray-400 text-sm">
                  Thickness
                </Label>
                <Input
                  id="thickness"
                  placeholder="15"
                  value={formData.thickness}
                  onChange={(e) => handleInputChange("thickness", e.target.value)}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Material Type and Storage Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="materialType" className="text-gray-300">
                Material Type <span className="text-red-400">*</span>
              </Label>
              <Select value={formData.materialType} onValueChange={(value) => handleInputChange("materialType", value)}>
                <SelectTrigger className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="kraft-paper" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    Kraft Paper
                  </SelectItem>
                  <SelectItem value="newsprint" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    Newsprint
                  </SelectItem>
                  <SelectItem value="coated-paper" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    Coated Paper
                  </SelectItem>
                  <SelectItem value="cardboard" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    Cardboard
                  </SelectItem>
                  <SelectItem value="tissue-paper" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    Tissue Paper
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storageLocation" className="text-gray-300">
                Storage Location
              </Label>
              <Select
                value={formData.storageLocation}
                onValueChange={(value) => handleInputChange("storageLocation", value)}
              >
                <SelectTrigger className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-white">
                  <SelectItem value="a-01" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    A-01
                  </SelectItem>
                  <SelectItem value="a-02" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    A-02
                  </SelectItem>
                  <SelectItem value="a-12" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    A-12
                  </SelectItem>
                  <SelectItem value="b-06" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    B-06
                  </SelectItem>
                  <SelectItem value="c-15" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    C-15
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Production Date and QR/Barcode ID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productionDate" className="text-gray-300">
                Production Date
              </Label>
              <Input
                id="productionDate"
                type="date"
                value={formData.productionDate}
                onChange={(e) => handleInputChange("productionDate", e.target.value)}
                className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrBarcodeId" className="text-gray-300">
                QR/Barcode ID
              </Label>
              <div className="flex gap-2">
                <Input
                  id="qrBarcodeId"
                  placeholder="Auto-generated if empty"
                  value={formData.qrBarcodeId}
                  onChange={(e) => handleInputChange("qrBarcodeId", e.target.value)}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                />
                <Button
                  type="button"
                  onClick={generateQRCode}
                  className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-300">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this paper roll..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">
              Add Paper Roll
            </Button>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500 bg-transparent"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
