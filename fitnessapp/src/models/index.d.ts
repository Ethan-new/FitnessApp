import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class DailyFoodItems {
  readonly name?: string;
  readonly weight?: string;
  readonly calCount?: string;
  constructor(init: ModelInit<DailyFoodItems>);
}

export declare class CalDays {
  readonly Date?: string;
  readonly currCals?: string;
  readonly foodItems?: (DailyFoodItems | null)[];
  readonly goalCals?: string;
  constructor(init: ModelInit<CalDays>);
}

export declare class Cals {
  readonly currTargetCals?: string;
  readonly allDays?: (CalDays | null)[];
  constructor(init: ModelInit<Cals>);
}

export declare class Exercises {
  readonly name?: string;
  readonly videolink?: string;
  readonly numberOfReps?: string;
  readonly sets?: string;
  constructor(init: ModelInit<Exercises>);
}

export declare class Week {
  readonly weekStartDate?: string;
  readonly exercisesDays?: (CalDays | null)[];
  constructor(init: ModelInit<Week>);
}

export declare class Day {
  readonly Date?: string;
  readonly startTime?: string;
  readonly endTime?: string;
  readonly exercises?: (Exercises | null)[];
  constructor(init: ModelInit<Day>);
}

type EmptyMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FoodItemsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ExercisesStorageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Empty {
  readonly id: string;
  readonly asd?: string;
  readonly asds?: string;
  readonly asdasd?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Empty, EmptyMetaData>);
  static copyOf(source: Empty, mutator: (draft: MutableModel<Empty, EmptyMetaData>) => MutableModel<Empty, EmptyMetaData> | void): Empty;
}

export declare class FoodItems {
  readonly id: string;
  readonly name?: string;
  readonly calperpound?: string;
  readonly extraInfo?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<FoodItems, FoodItemsMetaData>);
  static copyOf(source: FoodItems, mutator: (draft: MutableModel<FoodItems, FoodItemsMetaData>) => MutableModel<FoodItems, FoodItemsMetaData> | void): FoodItems;
}

export declare class ExercisesStorage {
  readonly id: string;
  readonly name?: string;
  readonly numberOfReps?: string;
  readonly videolink?: string;
  readonly sets?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<ExercisesStorage, ExercisesStorageMetaData>);
  static copyOf(source: ExercisesStorage, mutator: (draft: MutableModel<ExercisesStorage, ExercisesStorageMetaData>) => MutableModel<ExercisesStorage, ExercisesStorageMetaData> | void): ExercisesStorage;
}

export declare class User {
  readonly id: string;
  readonly height?: number;
  readonly weight?: number;
  readonly gender?: string;
  readonly TrainingDayList?: (Week | null)[];
  readonly numberOfPreferedExercises?: number;
  readonly username?: string;
  readonly CalCount?: Cals;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}