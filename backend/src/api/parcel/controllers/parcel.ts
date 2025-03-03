module.exports = {
  async find(ctx) {
    // ดึง userId จาก JWT token
    const userId = ctx.state.user?.id;
    const { trackingId } = ctx.query; // ดึง trackingId จาก query string

    // ตรวจสอบว่า trackingId ถูกส่งมาหรือไม่
    if (!trackingId) {
      return ctx.badRequest('Tracking ID is required');
    }

    try {
      // ถ้ามี trackingId ให้ค้นหาจาก userId และ trackingId
      const parcels = await strapi.entityService.findMany('api::parcel.parcel', {
        filters: {
          user: userId, // ฟิลเตอร์ตาม userId
          trackingId: trackingId, // ฟิลเตอร์ตาม trackingId
        },
        populate: '*', // ดึงข้อมูลทั้งหมดที่เกี่ยวข้อง
      });

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
};
