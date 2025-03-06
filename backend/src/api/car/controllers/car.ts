'use strict';

/**
 * car controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::car.car', ({ strapi }) => ({
  // ดึงข้อมูล car ทั้งหมด
  async find(ctx) {
    try {
      const cars = await strapi.entityService.findMany('api::car.car', {
        populate: '*',
      });
      return cars;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch cars');
    }
  },

  // ดึงข้อมูล car ทั้งหมด (แบบไม่ต้องล็อกอิน)
  async findAll(ctx) {
    try {
      const cars = await strapi.entityService.findMany('api::car.car', {
        populate: '*',
      });
      return cars;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch cars');
    }
  },

  // ดึงข้อมูล car ของผู้ใช้โดยใช้ userId
  async findByUserId(ctx) {
    const { userId } = ctx.params;

    if (!userId) {
      ctx.throw(400, 'User ID is required');
    }

    try {
      const cars = await strapi.entityService.findMany('api::car.car', {
        filters: { user: userId },
        populate: '*',
      });

      if (!cars || cars.length === 0) {
        return ctx.send({ message: 'No cars found for this user' }, 404);
      }

      return cars;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch cars for this user');
    }
  },

  // ดึงข้อมูล car รายการเดียว
  async findOne(ctx) {
    const { id } = ctx.params;

    if (!id) {
      ctx.throw(400, 'Car ID is required');
    }

    try {
      const car = await strapi.entityService.findOne('api::car.car', id, {
        populate: { carId: true }, // ใช้ carId ตาม response
      });

      if (!car) {
        return ctx.send({ message: 'Car not found' }, 404);
      }

      return car;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch car');
    }
  },

  // ฟังก์ชัน updateCheckpoint โดยไม่ต้อง login
  async updateCheckpoint(ctx) {
    const { id } = ctx.params;

    try {
      // Validate ID
      if (!id || isNaN(id)) {
        ctx.throw(400, 'Valid Car ID is required');
      }

      // ดึงข้อมูล car พร้อม parcels (ใช้ carId ตาม response)
      const car = await strapi.entityService.findOne('api::car.car', id, {
        populate: { carId: true }, // Populate carId ที่สัมพันธ์กับ car
      });

      if (!car) {
        return ctx.send({ message: 'Car not found' }, 404);
      }

      let updateCarData = {};
      const currentTime = new Date().toISOString(); // บันทึกเวลาในรูปแบบ ISO

      // อัปเดต checkpoint ใน car
      if (!car.checkpoint1) {
        updateCarData = { checkpoint1: true };
      } else if (!car.checkpoint2) {
        updateCarData = { checkpoint2: true };
      } else if (!car.checkpoint3) {
        updateCarData = { checkpoint3: true };
      } else {
        ctx.throw(400, 'All checkpoints are already completed');
      }

      // อัปเดต car
      const updatedCar = await strapi.entityService.update('api::car.car', id, {
        data: updateCarData,
      });

      // อัปเดต timestamp ใน parcels ที่สัมพันธ์กับ car (ใช้ carId)
      if (car.carId && car.carId.length > 0) {
        const parcelUpdates = car.carId.map(async (parcel) => {
          await strapi.entityService.update('api::parcel.parcel', parcel.id, {
            data: {
              timestamp: currentTime,
            },
          });
        });
        await Promise.all(parcelUpdates); // รอให้ทุก parcel อัปเดตเสร็จ
      }

      // ดึงข้อมูล car ล่าสุดพร้อม parcels ที่อัปเดตแล้ว
      const finalCar = await strapi.entityService.findOne('api::car.car', id, {
        populate: { carId: true },
      });

      return finalCar;
    } catch (error) {
      strapi.log.error('Error updating checkpoint:', {
        error: error.message,
        stack: error.stack,
        id,
      });
      ctx.throw(error.status || 500, error.message || 'Failed to update checkpoint');
    }
  },
}));