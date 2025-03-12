"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Moon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { RequestStatus } from "../components/request-status"

export default function SleepoverRequestPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [requests, setRequests] = useState<any[]>([])
  const [realRequests, setRealRequests] = useState<any[]>([])

  useEffect(() => {
    setRealRequests(requests)
  }, [requests])

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const guestName = formData.get("guestName") as string
    const guestId = formData.get("guestId") as string
    const roomNumber = formData.get("roomNumber") as string

    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: Date.now().toString(),
        guestName,
        guestId,
        roomNumber,
        fromDate: date ? format(date, "PPP") : format(new Date(), "PPP"),
        tillDate: endDate ? format(endDate, "PPP") : format(new Date(), "PPP"),
        status: "pending",
      }

      setRequests([...requests, newRequest])
      setLoading(false)

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()

      setDate(undefined)
      setEndDate(undefined)

      toast({
        title: "Sleepover request submitted",
        description: "Your request has been submitted and is pending approval.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Sleepover Requests</h1>
        <p className="text-white">Request permission for overnight guests.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Request a Sleepover</CardTitle>
                <CardDescription>Submit a request for an overnight guest stay.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmitRequest}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-black">
                  Guest Full Name
                </Label>
                <Input
                  id="guestName"
                  name="guestName"
                  placeholder="Enter guest's full name"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestId" className="text-black">
                  Guest ID Number
                </Label>
                <Input
                  id="guestId"
                  name="guestId"
                  placeholder="Enter guest's ID number"
                  required
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber" className="text-black">
                  Your Room Number
                </Label>
                <Input
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="Enter your room number"
                  required
                  className="bg-white"
                />
                <p className="text-xs text-black">
                  Enter your room number in any format (e.g., "305", "B12", "Room 7")
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-black">Date of Sleepover</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate" className="text-black">
                      From
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="fromDate"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tillDate" className="text-black">
                      Till
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="tillDate"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="rounded-md bg-muted p-3">
                <h4 className="mb-2 text-sm font-medium text-black">Sleepover Policy</h4>
                <ul className="text-xs text-black space-y-1">
                  <li>• Requests must be submitted before Friday at 15:00</li>
                  <li>• Maximum stay is 2 consecutive nights</li>
                  <li>• Guest must have valid ID</li>
                  <li>• You are responsible for your guest at all times</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <RequestStatus type="sleepover" requests={realRequests} />
      </div>
    </div>
  )
}

