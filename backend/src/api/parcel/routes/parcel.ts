module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/parcels',
      handler: 'parcel.find',
      config: {
      }
    },
  ],
};
