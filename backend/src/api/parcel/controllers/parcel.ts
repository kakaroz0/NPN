module.exports = {
  async find(ctx) {
    // ดึง userId และ role จาก JWT token
    const userId = ctx.state.user?.id;
    const userRole = ctx.state.user?.role?.name; // ตรวจสอบบทบาทของผู้ใช้

    const { trackingId } = ctx.query; // ดึง trackingId จาก query string

    // ตรวจสอบว่า trackingId ถูกส่งมาหรือไม่
    if (!trackingId) {
      return ctx.badRequest('Tracking ID is required');
    }

    try {
      let parcels;

      // ถ้าเป็น Admin ให้ค้นหาพัสดุทั้งหมดโดยไม่ต้องจำกัดด้วย userId
      if (userRole === 'admin') {
        parcels = await strapi.entityService.findMany('api::parcel.parcel', {
          filters: {
            trackingId: trackingId, // ฟิลเตอร์ตาม trackingId
          },
          populate: '*', // ดึงข้อมูลทั้งหมดที่เกี่ยวข้อง
        });
      } else {
        // ถ้าเป็น User ปกติ ให้ค้นหาพัสดุเฉพาะที่เกี่ยวข้องกับ userId
        parcels = await strapi.entityService.findMany('api::parcel.parcel', {
          filters: {
            user: userId, // ฟิลเตอร์ตาม userId
            trackingId: trackingId, // ฟิลเตอร์ตาม trackingId
          },
          populate: '*', // ดึงข้อมูลทั้งหมดที่เกี่ยวข้อง
        });
      }

      // ถ้าไม่พบข้อมูลพัสดุให้แสดงข้อผิดพลาด
      if (!parcels || parcels.length === 0) {
        return ctx.notFound('No parcel found');
      }

      // ส่งข้อมูลพัสดุกลับ
      return parcels;
    } catch (error) {
      // จัดการข้อผิดพลาด
      strapi.log.error('Error fetching parcel:', error);
      return ctx.internalServerError('Something went wrong.');
    }
  },

  async findAll(ctx) {
    try {
      // ดึงข้อมูลพัสดุทั้งหมด
      const parcels = await strapi.entityService.findMany('api::parcel.parcel', {
        populate: '*', // ดึงข้อมูลทั้งหมดที่เกี่ยวข้อง
      });

      // ส่งข้อมูลพัสดุกลับ
      return parcels;
    } catch (error) {
      // จัดการข้อผิดพลาด
      strapi.log.error('Error fetching all parcels:', error);
      return ctx.internalServerError('Something went wrong.');
    }
  },

  // เพิ่ม API ใหม่ สำหรับดึงข้อมูลพัสดุของผู้ใช้เฉพาะ
  async findByUserId(ctx) {
    const userId = ctx.params.userId; // ดึง userId จาก URL parameters

    if (!userId) {
      return ctx.badRequest('User ID is required');
    }

    try {
      // ค้นหาพัสดุที่เกี่ยวข้องกับ userId
      const parcels = await strapi.entityService.findMany('api::parcel.parcel', {
        filters: {
          user: userId, // ฟิลเตอร์ตาม userId
        },
        populate: '*', // ดึงข้อมูลทั้งหมดที่เกี่ยวข้อง
      });

      // ถ้าไม่พบข้อมูลพัสดุให้แสดงข้อผิดพลาด
      if (!parcels || parcels.length === 0) {
        return ctx.notFound('No parcels found for this user');
      }

      // ส่งข้อมูลพัสดุกลับ
      return parcels;
    } catch (error) {
      // จัดการข้อผิดพลาด
      strapi.log.error('Error fetching parcels for user:', error);
      return ctx.internalServerError('Something went wrong.');
    }
  },
  
};
