import ajv from './ajv';

export default async (toValidate) => {
  try {
    const schema = {
      $async: true,
      type: 'object',
      properties: {
        pos: {
          type: 'integer',
          minimum: 0,
          maximum: 5,
        },
      },
      additionalProperties: false,
      required: ['pos'],
    };
    return await ajv(schema, toValidate);
  } catch (error) {
    return { isValid: false };
  }
};
