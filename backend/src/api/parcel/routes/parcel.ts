module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/parcels',
      handler: 'parcel.find',
      config: {
        // หากต้องการให้ต้องมีการยืนยันตัวตน (JWT)
        auth: {
          required: true,
        },
      },
    },
  ],
};
