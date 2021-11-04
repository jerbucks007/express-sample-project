import ajv from './ajv';

export default async (toValidate) => {
  try {
    const schema = {
      $async: true,
      type: 'integer',
      maximum: 10,
      minimum: 1,
      additionalProperties: false,
    };
    return await ajv(schema, toValidate);
  } catch (error) {
    return { isValid: false };
  }
};
