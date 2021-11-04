import execPhp from 'exec-php';
import configs from '../../../configs';

export default async (params) =>
  new Promise((resolve, reject) => {
    execPhp(`${__dirname}/skillgames-rng.php`, configs.main.pathToPhp, (err, php) => {
      if (err) return reject(new Error('Failed to execute exec php'));
      php.onyx_give_card(params, (err1, result) => {
        if (err1) return reject(new Error('Failed to execute onyx_give_card'));
        return resolve(result);
      });
    });
  });