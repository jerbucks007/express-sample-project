import models from '../../../../models';
import general from '../../general';
import dbController from '../db-controller';

// This are the standard function that you can use on every models.
// Note: If you have other process for example in "save" you can remove it 
// and create your own "save" function below.
export const { save, find, update, bulkWrite, remove, increment, count }= dbController(models.centralpoint.userLivecasinos, 'userLivecasinos');