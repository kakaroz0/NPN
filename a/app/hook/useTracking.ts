"use client";  // Add this line at the very top

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:1337"); // URL ของ Strapi

export function useTracking(trackingId: string) {
  const [parcel, setParcel] = useState(null);

  useEffect(() => {
    if (!trackingId) return;

    // Request parcel data
    socket.emit("track_parcel", trackingId);

    // Update parcel data when received from Strapi
    socket.on("parcel_update", (data) => {
      if (data.tracking_id === trackingId) {
        setParcel(data);
      }
    });

    return () => {
      socket.off("parcel_update");
    };
  }, [trackingId]);

  return parcel;
}
