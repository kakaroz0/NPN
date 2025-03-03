module.exports = {
  async find(ctx) {
    const userId = ctx.state.user.id;  // ดึง userId จาก JWT token
    const { trackingId } = ctx.query;  // ดึง trackingId จาก query string

    // ตรวจสอบว่า trackingId ถูกส่งมาไหม
    if (!trackingId) {
      return ctx.badRequest('Tracking ID is required');
    }

    // ดึงข้อมูลพัสดุที่ตรงกับ userId และ trackingId
    const parcels = await strapi.services.parcel.find({
      user: userId,
      trackingId: trackingId
    });

    if (!parcels || parcels.length === 0) {
      return ctx.notFound('No parcel found');
    }

    return parcels;
  },
};
