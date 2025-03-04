module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/parcels',
      handler: 'parcel.find',
      config: {
        auth: {
          required: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/parcels/all',
      handler: 'parcel.findAll',
      config: {
        auth: {
          required: true,
        },
      },
    },
  ],
};