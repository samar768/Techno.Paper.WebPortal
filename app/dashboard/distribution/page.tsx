"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Truck, MapPin, Clock } from "lucide-react"

interface Delivery {
  id: string
  destination: string
  driver: string
  rolls: number
  status: string
  scheduledTime: string
  estimatedArrival: string
}

export default function DistributionPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newDelivery, setNewDelivery] = useState({
    destination: "",
    driver: "",
    rolls: "",
    scheduledTime: "",
    estimatedArrival: "",
  })
  const { toast } = useToast()

  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "DEL-001",
      destination: "Warehouse B",
      driver: "John Smith",
      rolls: 15,
      status: "Scheduled",
      scheduledTime: "09:00 AM",
      estimatedArrival: "11:30 AM",
    },
    {
      id: "DEL-002",
      destination: "Client Factory A",
      driver: "Sarah Johnson",
      rolls: 8,
      status: "In Transit",
      scheduledTime: "08:30 AM",
      estimatedArrival: "10:45 AM",
    },
    {
      id: "DEL-003",
      destination: "Distribution Center",
      driver: "Mike Wilson",
      rolls: 22,
      status: "Delivered",
      scheduledTime: "07:00 AM",
      estimatedArrival: "09:15 AM",
    },
  ])

  const validateDelivery = (): string[] => {
    const errors: string[] = []
    if (!newDelivery.destination.trim()) errors.push("Destination is required")
    if (!newDelivery.driver.trim()) errors.push("Driver is required")
    if (!newDelivery.rolls.trim() || Number.parseInt(newDelivery.rolls) <= 0)
      errors.push("Number of rolls must be greater than 0")
    return errors
  }

  const handleCreateDelivery = () => {
    const errors = validateDelivery()
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join("\n"),
        variant: "destructive",
      })
      return
    }

    const deliveryId = `DEL-${String(deliveries.length + 1).padStart(3, "0")}`
    const delivery: Delivery = {
      id: deliveryId,
      destination: newDelivery.destination,
      driver: newDelivery.driver,
      rolls: Number.parseInt(newDelivery.rolls),
      status: "Scheduled",
      scheduledTime: newDelivery.scheduledTime,
      estimatedArrival: newDelivery.estimatedArrival,
    }

    setDeliveries((prev) => [...prev, delivery])
    setNewDelivery({
      destination: "",
      driver: "",
      rolls: "",
      scheduledTime: "",
      estimatedArrival: "",
    })
    setIsCreateModalOpen(false)

    toast({
      title: "Delivery created successfully",
      description: `${deliveryId} has been scheduled for ${newDelivery.destination}.`,
      className: "bg-green-600 text-white border-green-700",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Scheduled</Badge>
      case "In Transit":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">In Transit</Badge>
      case "Delivered":
        return <Badge className="bg-green-600 hover:bg-green-700">Delivered</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Clock className="h-4 w-4" />
      case "In Transit":
        return <Truck className="h-4 w-4" />
      case "Delivered":
        return <MapPin className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Distribution Tracker</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Delivery
        </Button>
      </div>

      {/* Delivery Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {deliveries.map((delivery) => (
          <Card key={delivery.id} className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{delivery.id}</CardTitle>
                {getStatusBadge(delivery.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{delivery.destination}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">{delivery.driver}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  {getStatusIcon(delivery.status)}
                  <span className="text-sm">{delivery.rolls} rolls</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Scheduled:</span>
                  <span className="text-gray-300">{delivery.scheduledTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ETA:</span>
                  <span className="text-gray-300">{delivery.estimatedArrival}</span>
                </div>
              </div>

              <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delivery History */}
      <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "DEL-004", destination: "Factory C", status: "Delivered", time: "2 hours ago" },
              { id: "DEL-005", destination: "Warehouse D", status: "Delivered", time: "4 hours ago" },
              { id: "DEL-006", destination: "Client B", status: "Delivered", time: "6 hours ago" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-white">{item.id}</div>
                  <div className="text-xs text-gray-400">{item.destination}</div>
                </div>
                <div className="text-right space-y-1">
                  <Badge className="bg-green-600 hover:bg-green-700">{item.status}</Badge>
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Delivery Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent
          className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 border-purple-800 text-white max-w-2xl backdrop-blur-sm"
          overlayClassName="backdrop-blur-sm bg-black/20"
        >
          <DialogHeader>
            <DialogTitle className="text-white">Create New Delivery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-gray-300">
                  Destination <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="destination"
                  value={newDelivery.destination}
                  onChange={(e) => setNewDelivery((prev) => ({ ...prev, destination: e.target.value }))}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                  placeholder="Enter destination"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driver" className="text-gray-300">
                  Driver <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={newDelivery.driver}
                  onValueChange={(value) => setNewDelivery((prev) => ({ ...prev, driver: value }))}
                >
                  <SelectTrigger className="bg-purple-950/80 border-purple-700 text-white focus:ring-2 focus:ring-purple-500 [&>svg]:text-white">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="John Smith" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      John Smith
                    </SelectItem>
                    <SelectItem value="Sarah Johnson" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      Sarah Johnson
                    </SelectItem>
                    <SelectItem value="Mike Wilson" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      Mike Wilson
                    </SelectItem>
                    <SelectItem value="Emma Davis" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      Emma Davis
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rolls" className="text-gray-300">
                  Number of Rolls <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="rolls"
                  type="number"
                  value={newDelivery.rolls}
                  onChange={(e) => setNewDelivery((prev) => ({ ...prev, rolls: e.target.value }))}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                  placeholder="Enter number of rolls"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime" className="text-gray-300">
                  Scheduled Time
                </Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={newDelivery.scheduledTime}
                  onChange={(e) => setNewDelivery((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                  className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedArrival" className="text-gray-300">
                Estimated Arrival
              </Label>
              <Input
                id="estimatedArrival"
                type="time"
                value={newDelivery.estimatedArrival}
                onChange={(e) => setNewDelivery((prev) => ({ ...prev, estimatedArrival: e.target.value }))}
                className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-400 bg-gray-800"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateDelivery} className="bg-purple-600 hover:bg-purple-700">
                Create Delivery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
