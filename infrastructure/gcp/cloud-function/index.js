// /package-tracking-project/infrastructure/gcp/cloud-function/index.js

exports.processCheckpoint = (message, context) => {
    const data = Buffer.from(message.data, "base64").toString();
    console.log("Checkpoint received:", data);
    // อัปเดตข้อมูลในระบบตามที่ต้องการ
  };
  