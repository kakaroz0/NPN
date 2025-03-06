module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cars',
      handler: 'car.find',
      config: {
        auth: {
          required: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/cars/all',
      handler: 'car.findAll',
      config: {
        auth: {
          required: false,
        },
      },
    },
    {
      method: 'GET',
      path: '/cars/user/:userId',
      handler: 'car.findByUserId',
      config: {
        auth: {
          required: true,
        },
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/cars/:id',
      handler: 'car.findOne',
      config: {
        auth: {
          required: true,
        },
      },
    },
    // เพิ่ม route ใหม่สำหรับ updateCheckpoint
    {
      method: 'POST',
      path: '/cars/:id/checkpoint',
      handler: 'car.updateCheckpoint',
      config: {
        auth: {
          required: true,
        },
      },
    },
  ],
};