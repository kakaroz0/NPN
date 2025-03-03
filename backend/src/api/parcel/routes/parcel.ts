// src/api/parcel/routes/parcel.js

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/parcels',
      handler: 'parcel.find',  // อ้างถึงฟังก์ชัน 'find' ใน controller
      config: {
        policies: [],
      },
    },
  ],
};
