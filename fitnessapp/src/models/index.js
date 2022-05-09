// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Empty, FoodItems, ExercisesStorage, User, DailyFoodItems, CalDays, Cals, Exercises, Week, Day } = initSchema(schema);

export {
  Empty,
  FoodItems,
  ExercisesStorage,
  User,
  DailyFoodItems,
  CalDays,
  Cals,
  Exercises,
  Week,
  Day
};