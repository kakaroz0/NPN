"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:1337"); // URL ของ Strapi

export function useTracking(trackingId: string) {
  const [parcel, setParcel] = useState(null);

  useEffect(() => {
    if (!trackingId) return;

    // ส่ง trackingId ไปที่ Server เพื่อขออัปเดตสถานะพัสดุ
    socket.emit("track_parcel", trackingId);

    // รับข้อมูลพัสดุเมื่อเซิร์ฟเวอร์ส่งข้อมูลมา
    socket.on("parcel_update", (data) => {
      if (data.trackingId === trackingId) { 
        setParcel(data);
      }
    });

    return () => {
      socket.off("parcel_update");
    };
  }, [trackingId]);

  return parcel;
}
