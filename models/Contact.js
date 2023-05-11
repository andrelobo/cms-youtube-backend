const mongoose = require("mongoose");
const Joi = require("joi");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
  address: {
    type: String,
    required: [true, "address is required."],
  },
  email: {
    type: String,
    required: [true, "email is required."],
  },
  phone: {
    type: Number,
    required: [true, "phone number is required."],
  },
  cpf: {
    type: Number,
    required: [true, "cpf number is required."],
  },
  sus: {
    type: Number,
    required: [true, "cpf number is required."],
  },
  vacinas: {
    type: String,
    required: [true, "Preencha com as vacinas tomadas ou sem vacina."],
  },
  comorbidades: {
     type: String,
    required: [true, "Preencha co as comorbidades"],
  },
  bolsa_familia: {
     type: String,
    required: [true, "Tem bolsa familia ?"],
  },
  peso: {
     type: String,
    required: [true, "Tem bolsa familia ?"],
  },
  altura: {
     type: String,
    required: [true, "Tem bolsa familia ?"],
  },
  data_nascimento: {
    type: Date,
    required: [true, "Data de nascimento"],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});


/* 
Data de nascimento
CPF *
Sus*
Vacinas*
Comorbidades 
Bolsa família
Peso
Altura */

const Contact = new mongoose.model("Contact", ContactSchema);

const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().required(),
    data_nascimento: Joi.date().required(),
    cpf: Joi.number().required(),
    sus: Joi.number().required(),
    vacinas: Joi.string().required(),
    comorbidades: Joi.string().required(),
    bolsa_familia: Joi.number().required(),
    peso: Joi.number().required(),
    altura: Joi.number().required()
  });

  return schema.validate(data);
};

module.exports = {
  validateContact,
  Contact,
};
