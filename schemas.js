const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(1).required(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().allow('', null)
    })
  }).required()
});
