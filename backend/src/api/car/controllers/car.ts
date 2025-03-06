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
        populate: '*',
      });

      if (!car) {
        return ctx.send({ message: 'Car not found' }, 404);
      }

      return car;
    } catch (error) {
      ctx.throw(500, 'Failed to fetch car');
    }
  },

  // เพิ่มฟังก์ชัน updateCheckpoint
  async updateCheckpoint(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state.user?.id;
    const userRole = ctx.state.user?.role?.name;
  
    try {
      // Check if user is authenticated
      if (!ctx.state.user) {
        ctx.throw(401, 'Authentication required');
      }
  
      // Validate ID
      if (!id || isNaN(id)) {
        ctx.throw(400, 'Valid Car ID is required');
      }
  
      const car = await strapi.entityService.findOne('api::car.car', id, {
        populate: '*',
      });
  
      if (!car) {
        return ctx.send({ message: 'Car not found' }, 404);
      }
  
      // Check authorization
      if (userRole !== 'admin' && (!car.user || car.user.id !== userId)) {
        ctx.throw(403, 'You are not allowed to update this car');
      }
  
      let updateData = {};
      if (!car.checkpoint1) {
        updateData = { checkpoint1: true };
      } else if (!car.checkpoint2) {
        updateData = { checkpoint2: true };
      } else if (!car.checkpoint3) {
        updateData = { checkpoint3: true };
      } else {
        ctx.throw(400, 'All checkpoints are already completed');
      }
  
      const updatedCar = await strapi.entityService.update('api::car.car', id, {
        data: updateData,
      });
  
      return updatedCar;
    } catch (error) {
      // Detailed error logging
      strapi.log.error('Error updating checkpoint:', {
        error: error.message,
        stack: error.stack,
        id,
        userId,
        userRole
      });
      // Return more specific error message
      ctx.throw(error.status || 500, error.message || 'Failed to update checkpoint');
    }
  }
}));