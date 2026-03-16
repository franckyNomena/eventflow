import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

/**
 * Service User - Gère toute la logique métier liée aux utilisateurs
 * Architecture en couches : Controller → Service → Model
 */
export class UserService {
  
  /**
   * Créer un nouvel utilisateur
   */
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: 'user' | 'admin';
  }): Promise<IUser> {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: data.role || 'user',
    });

    return user;
  }

  /**
   * Trouver un utilisateur par email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Trouver un utilisateur par ID
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  /**
   * Vérifier le mot de passe
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Récupérer tous les utilisateurs (admin)
   */
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  /**
   * Mettre à jour le rôle d'un utilisateur
   */
  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<IUser | null> {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
  }
}

export default new UserService();
