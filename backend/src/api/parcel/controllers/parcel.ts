// src/api/parcel/controllers/parcel.js

module.exports = {
  async find(ctx) {
    try {
      const parcels = await strapi.query('api::parcel.parcel').findMany();
      return parcels;
    } catch (err) {
      return ctx.throw(500, err);
    }
  },
};
