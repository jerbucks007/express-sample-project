import ajv from './ajv';

export default async (toValidate) => {
  const obj = {
    DRG: 'dragontigerMin|dragontigerMax',
    TGR: 'dragontigerMin|dragontigerMax',
    TIE: 'tieMin|tieMax',
    DRGSML: 'bigsmallMin|bigsmallMax',
    DRGBIG: 'bigsmallMin|bigsmallMax',
    TGRSML: 'bigsmallMin|bigsmallMax',
    TGRBIG: 'bigsmallMin|bigsmallMax',
    DRGBLK: 'suitcolorMin|suitcolorMax',
    DRGRED: 'suitcolorMin|suitcolorMax',
    TGRBLK: 'suitcolorMin|suitcolorMax',
    TGRRED: 'suitcolorMin|suitcolorMax',
  };

  // get the min and max per betting options
  const minMax = obj[toValidate.betType];
  if (!minMax) return { isValid: false, message: 'betting option not found' };

  // const [min, max] = minMax.split('|');
  // const minimum = tableLimit[min];
  // const maximum = tableLimit[max];

  try {
    const schema = {
      $async: true,
      type: 'object',
      properties: {
        betAmount: {
          type: 'number',
          // minimum,
          // maximum,
          // enum: [1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 2000000, 5000000],
        },
        pos: {
          type: 'integer',
          minimum: -1,
          maximum: 5,
        },
        betType: {
          type: 'string',
          enum: ['DRG', 'TGR', 'TIE', 'DRGSML', 'DRGBIG', 'DRGBLK', 'DRGRED', 'TGRSML', 'TGRBIG', 'TGRBLK', 'TGRRED'],
        },
        destination: {
          type: 'object',
          properties: {
            x: {
              type: 'number',
            },
            y: {
              type: 'number',
            },
          },
        },
        displayname: {
          type: 'string',
          maxLength: 30,
        },
        er: {
          type: 'number',
          minimum: 0,
        },
      },
      additionalProperties: false,
      required: ['betAmount', 'pos', 'destination', 'displayname', 'er'],
    };
    return await ajv(schema, toValidate);
  } catch (error) {
    return { isValid: false };
  }
};
