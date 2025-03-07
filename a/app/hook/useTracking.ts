"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_PATHS } from "../config/api"; // ปรับ path ให้ถูกต้อง

// Type สำหรับข้อมูลพัสดุ
interface ParcelData {
  trackingId: string;
  status?: string;
  location?: string;
  [key: string]: any;
}

// สร้าง socket instance โดยใช้ API_PATHS
const socket: Socket = io(API_PATHS.PACKAGES.split('/api/packages')[0], {
  reconnection: true,
  transports: ["websocket"],
});

export function useTracking(trackingId: string) {
  const [parcel, setParcel] = useState<ParcelData | null>(null);

  useEffect(() => {
    if (!trackingId) return;

    socket.emit("track_parcel", trackingId);

    const handleParcelUpdate = (data: ParcelData) => {
      if (data.trackingId === trackingId) {
        setParcel(data);
      }
    };

    socket.on("parcel_update", handleParcelUpdate);

    return () => {
      socket.off("parcel_update", handleParcelUpdate);
    };
  }, [trackingId]);

  return parcel;
}
