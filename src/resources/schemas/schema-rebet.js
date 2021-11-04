import ajv from './ajv';

export default async (toValidate, tableLimit) => {
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

  try {
    let response = null;
    let totalAmount = 0;

    const schema1 = {
      $async: true,
      type: 'object',
      properties: {
        bets: {
          type: 'array',
          maxItems: 11,
          minItems: 1,
        },
        totalAmount: {
          type: 'integer',
          minimum: 0,
          multipleOf: 1,
        },
        pos: {
          type: 'integer',
          minimum: -1,
          maximum: 5,
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
      required: ['bets', 'totalAmount', 'pos'],
    };
    response = await ajv(schema1, toValidate);

    if (response.isValid) {
      const codes = [];
      for (const bet of toValidate.bets) {
        // Check if betting option was duplicate
        const isDups = codes.some(code => code === bet.code);
        if (isDups && codes.length !== 0) {
          return { isValid: false, message: `[${bet.code}] Betting options was duplicated!` };
        }
        codes.push(bet.code);

        // Add the stake to compare after if no found error
        totalAmount += bet.stake;

        // get the min and max per betting options
        const minMax = obj[bet.code];
        if (!minMax) return { isValid: false, message: 'betting option not found!' };

        // const [min, max] = minMax.split('|');
        // const minimum = tableLimit[min];
        // const maximum = tableLimit[max];

        const schema = {
          $async: true,
          properties: {
            stake: {
              type: 'number',
              // minimum,
              // maximum,
            },
            winloss: {
              type: 'number',
              maximum: 0,
            },
            code: {
              type: 'string',
              enum: ['DRG', 'TGR', 'TIE', 'DRGSML', 'DRGBIG', 'DRGBLK', 'DRGRED', 'TGRSML', 'TGRBIG', 'TGRBLK', 'TGRRED'],
            },
            win: {
              type: 'boolean',
              enum: [false],
            },
          },
          additionalProperties: false,
          required: ['stake', 'winloss', 'code', 'win'],
        };
        response = await ajv(schema, bet);

        if (!response.isValid) break;
      }

      // When there's no error with bet check the total amount
      // If tally with the stake of all bets
      if (response.isValid) {
        if (totalAmount !== toValidate.totalAmount) return { isValid: false, message: 'total amount is not tally with all bet per betting option' };
      }
    }

    return response;
  } catch (error) {
    return { isValid: false };
  }
};
