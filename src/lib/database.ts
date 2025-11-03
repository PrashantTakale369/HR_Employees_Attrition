// Simple in-memory database simulation
// In production, replace this with a real database (Firebase, Supabase, MongoDB, etc.)

export interface UserData {
  id: string;
  email: string;
  password: string; // In production, this should be hashed!
  name: string;
  role: "admin" | "hr_manager" | "hr_analyst";
  department: string;
  avatar?: string;
  createdAt: string;
}

// Initialize with empty array - no pre-registered users
let users: UserData[] = [];

// Database operations
export const userDatabase = {
  // Get all users
  getAll: (): UserData[] => {
    return users;
  },

  // Find user by email
  findByEmail: (email: string): UserData | undefined => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  // Find user by ID
  findById: (id: string): UserData | undefined => {
    return users.find(user => user.id === id);
  },

  // Create new user
  create: (userData: Omit<UserData, 'id' | 'createdAt'>): UserData => {
    const newUser: UserData = {
      ...userData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    // Save to localStorage for persistence
    localStorage.setItem('hr_users_db', JSON.stringify(users));
    return newUser;
  },

  // Update user
  update: (id: string, updates: Partial<UserData>): UserData | null => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('hr_users_db', JSON.stringify(users));
    return users[index];
  },

  // Delete user
  delete: (id: string): boolean => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return false;
    
    users.splice(index, 1);
    localStorage.setItem('hr_users_db', JSON.stringify(users));
    return true;
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  },

  // Initialize from localStorage
  init: () => {
    const stored = localStorage.getItem('hr_users_db');
    if (stored) {
      try {
        users = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load users from localStorage:', error);
        users = [];
      }
    }
  },

  // Clear all users (for testing)
  clear: () => {
    users = [];
    localStorage.removeItem('hr_users_db');
  }
};

// Initialize database on module load
userDatabase.init();
