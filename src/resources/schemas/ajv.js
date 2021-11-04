import Ajv from 'ajv';

export default async (schema, toValidate) => {
  const res = {
    isValid: true,
    message: 'success',
    data: {},
    errors: null,
  };

  try {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const response = await validate(toValidate);
    res.data = response;
    return res;
  } catch (error) {
    res.isValid = false;
    res.message = error.message;
    res.errors = error.errors;
    return res;
  }
};
