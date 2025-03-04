module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/parcels',
      handler: 'parcel.find',
      config: {
        auth: {
          required: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/parcels/all',
      handler: 'parcel.findAll',
      config: {
        auth: {
          required: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/parcels/user/:userId', // กำหนดเส้นทางสำหรับดึงข้อมูลพัสดุจาก userId
      handler: 'parcel.findByUserId', // เรียกใช้เมธอด findByUserId
      config: {
        auth: {
          required: true, // เพิ่มการตรวจสอบการเข้าสู่ระบบสำหรับเส้นทางนี้
        },
        policies: [], // สามารถเพิ่ม policies ถ้าจำเป็น
        middlewares: [], // สามารถเพิ่ม middlewares ถ้าจำเป็น
      },
    },
  ],
};
