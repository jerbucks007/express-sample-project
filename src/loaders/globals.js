import classes from '../resources/classes';
import configs from '../configs';

export default async () => {
  // This is to determine what house this server will be run!
  global.HOUSE = configs.main.getHouse();
  // Initialize the table controller 
  global.TABLECONTROLLER = new classes.tableController();

  global.CHECKDB = true;
};
