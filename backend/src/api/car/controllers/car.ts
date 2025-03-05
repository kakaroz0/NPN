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
        populate: '*', // ดึงข้อมูลทั้งหมด (รวมถึง relations)
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
    const { userId } = ctx.params; // ดึง userId จากพารามิเตอร์

    if (!userId) {
      ctx.throw(400, 'User ID is required');
    }

    try {
      // ดึงข้อมูล car ที่เกี่ยวข้องกับ userId
      const cars = await strapi.entityService.findMany('api::car.car', {
        filters: {
          user: userId, // กรองข้อมูล car โดยใช้ userId
        },
        populate: '*', // ดึงข้อมูลทั้งหมด (รวมถึง relations)
      });

      if (!cars || cars.length === 0) {
        return ctx.send({ message: 'No cars found for this user' }, 404);
      }

      return cars;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch cars for this user');
    }
  },
  async findOne(ctx) {
    const { id } = ctx.params; // ดึง id จากพารามิเตอร์
  
    if (!id) {
      ctx.throw(400, 'Car ID is required');
    }
  
    try {
      // ดึงข้อมูล car ที่มี id ตรงกับที่ระบุ
      const car = await strapi.entityService.findOne('api::car.car', id, {
        populate: '*', // ดึงข้อมูลทั้งหมด (รวมถึง relations)
      });
  
      if (!car) {
        return ctx.send({ message: 'Car not found' }, 404);
      }
  
      return car;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch car');
    }
  },
}));