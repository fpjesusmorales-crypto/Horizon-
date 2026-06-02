"use client"

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { useState, useCallback } from "react"
import Link from "next/link"

interface WorkOrder {
  id: string
  customer_name: string
  address: string
  city: string
  latitude: number | null
  longitude: number | null
  status: string
  scheduled_time: string | null
  employee?: {
    first_name: string
    last_name: string
  } | null
}

interface JobsMapProps {
  jobs: WorkOrder[]
  center?: { lat: number; lng: number }
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const defaultCenter = {
  lat: 32.7157, // San Diego
  lng: -117.1611,
}

export function JobsMap({ jobs, center }: JobsMapProps) {
  const [selectedJob, setSelectedJob] = useState<WorkOrder | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const onMapClick = useCallback(() => {
    setSelectedJob(null)
  }, [])

  const getMarkerIcon = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f59e0b",
      assigned: "#3b82f6",
      in_progress: "#8b5cf6",
      completed: "#10b981",
      cancelled: "#ef4444",
    }
    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      fillColor: colors[status] || "#64748b",
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: "#ffffff",
      scale: 1.5,
      anchor: { x: 12, y: 24 } as google.maps.Point,
    }
  }

  if (loadError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        Error loading map. Please check your Google Maps API key.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        Loading map...
      </div>
    )
  }

  // Filter jobs with valid coordinates
  const mappableJobs = jobs.filter((j) => j.latitude && j.longitude)

  // Calculate center from jobs if not provided
  const mapCenter = center || (mappableJobs.length > 0 
    ? {
        lat: mappableJobs.reduce((sum, j) => sum + (j.latitude || 0), 0) / mappableJobs.length,
        lng: mappableJobs.reduce((sum, j) => sum + (j.longitude || 0), 0) / mappableJobs.length,
      }
    : defaultCenter
  )

  return (
    <div className="overflow-hidden rounded-2xl">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={11}
        onClick={onMapClick}
        options={{
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
          ],
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {mappableJobs.map((job) => (
          <Marker
            key={job.id}
            position={{ lat: job.latitude!, lng: job.longitude! }}
            icon={getMarkerIcon(job.status)}
            onClick={() => setSelectedJob(job)}
          />
        ))}

        {selectedJob && selectedJob.latitude && selectedJob.longitude && (
          <InfoWindow
            position={{ lat: selectedJob.latitude, lng: selectedJob.longitude }}
            onCloseClick={() => setSelectedJob(null)}
          >
            <div className="max-w-[200px] p-1">
              <p className="font-semibold text-slate-900">{selectedJob.customer_name}</p>
              <p className="text-sm text-slate-600">{selectedJob.address}</p>
              <p className="text-xs text-slate-500">{selectedJob.scheduled_time || "Flexible"}</p>
              {selectedJob.employee && (
                <p className="mt-1 text-xs text-teal-600">
                  {selectedJob.employee.first_name} {selectedJob.employee.last_name}
                </p>
              )}
              <Link
                href={`/ops/admin/work-orders/${selectedJob.id}`}
                className="mt-2 block text-xs font-medium text-teal-600 hover:text-teal-700"
              >
                View Details
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}
