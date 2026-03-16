import { User } from '../domain/User';
import UserModel from '../models/UserModel';

/**
 * Get a user by ID
 * @param id User ID
 * @returns {Promise<{user: User | null; message: string}>}
 */
export const getUserById = async (id: string): Promise<{ user: User | null; message: string }> => {
  const user = await UserModel.getUserById(id);
  if (user) {
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'User fetched successfully'
    };
  } else {
    return {
      user: null,
      message: 'User not found'
    };
  }
};

export const createUser = async (user: User): Promise<{ user: User; message: string }> => {
  // Save user to database using UserModel
  // knex-stringcase will automatically map camelCase to snake_case in DB
  const insertedUsers = await UserModel.addUser(user.id, user.firstName, user.lastName);
  const insertedUser = insertedUsers[0];
  return {
    user: {
      id: insertedUser.id,
      firstName: insertedUser.firstName,
      lastName: insertedUser.lastName,
    },
    message: 'User created successfully'
  };
};