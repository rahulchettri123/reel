interface User {
  id: string;
  username: string;
  profilePicture?: string;
}

export const authAPI = {
  isLoggedIn: () => true,
  getCurrentUser: () => ({ 
    id: '1', 
    username: 'mockuser',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
  } as User),
  login: async (username: string, password: string): Promise<User> => {
    return { id: '1', username: 'mockuser', profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg' };
  },
  logout: async (): Promise<void> => {},
  register: async (username: string, password: string, email: string): Promise<User> => {
    return { id: '1', username, profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg' };
  }
}; 