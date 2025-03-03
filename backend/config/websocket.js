// config/websocket.js
const io = require("socket.io")(strapi.server, {
    cors: { origin: "*" }, // อนุญาตให้เชื่อมต่อจากทุกแหล่ง
  });
  
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  
    // รับคำขอจาก Client ให้แสดงสถานะพัสดุ
    socket.on("track_parcel", async (tracking_id) => {
      const parcel = await strapi.services.parcel.findOne({ tracking_id });
      socket.emit("parcel_update", parcel); // ส่งข้อมูลพัสดุให้ Client
    });
  
    // รับข้อมูลพัสดุใหม่จาก IoT และ Broadcast ไปยัง Client ทุกคน
    socket.on("parcel_update", async (data) => {
      const updatedParcel = await strapi.services.parcel.update(
        { tracking_id: data.tracking_id },
        data
      );
      io.emit("parcel_update", updatedParcel); // ส่งข้อมูลไปยังทุก Client
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  
  strapi.io = io; // แนบ WebSocket server เข้ากับ Strapi
  