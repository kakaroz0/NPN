module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/cars', // เส้นทางสำหรับดึงข้อมูล car ทั้งหมด
        handler: 'car.find',
        config: {
          auth: {
            required: true, // ต้องมีการล็อกอินเพื่อใช้งาน
          },
        },
      },
      {
        method: 'GET',
        path: '/cars/all', // เส้นทางสำหรับดึงข้อมูล car ทั้งหมด (แบบไม่ต้องล็อกอิน)
        handler: 'car.findAll',
        config: {
          auth: {
            required: false, // ไม่ต้องล็อกอิน
          },
        },
      },
      {
        method: 'GET',
        path: '/cars/user/:userId', // เส้นทางสำหรับดึงข้อมูล car ของผู้ใช้โดยใช้ userId
        handler: 'car.findByUserId',
        config: {
          auth: {
            required: true, // ต้องมีการล็อกอิน
          },
          policies: [], // สามารถเพิ่ม policies ได้ถ้าต้องการ
          middlewares: [], // สามารถเพิ่ม middlewares ได้ถ้าต้องการ
        },
      },
      {
        method: 'GET',
        path: '/cars/:id', // เส้นทางสำหรับดึงข้อมูลรถโดยใช้ id
        handler: 'car.findOne',
        config: {
          auth: {
            required: true, // ต้องล็อกอินก่อนใช้งาน
          },
        },
      }
      
    ],
  };