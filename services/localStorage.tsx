// src/services/localStorage.ts

interface User {
    id: string;
    username: string;
    email: string;
    password: string; // In real app, never store plain passwords
  }
  
  interface Comment {
    id: string;
    movieId: string;
    userId: string;
    content: string;
    username: string;
    createdAt: string;
    reactions: {
      userId: string;
      type: 'like' | 'love' | 'laugh';
    }[];
  }
  
  export const localStorageService = {
    // User Management
    registerUser: (username: string, email: string, password: string): User => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password // In real app, hash the password
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return newUser;
    },
  
    loginUser: (email: string, password: string): User | null => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: User) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      return user;
    },
  
    getCurrentUser: (): User | null => {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    },
  
    logout: () => {
      localStorage.removeItem('currentUser');
    },
  
    // Comments
    getComments: (movieId: string): Comment[] => {
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');
      return comments.filter((comment: Comment) => comment.movieId === movieId);
    },
  
    addComment: (movieId: string, content: string): Comment => {
      const currentUser = localStorageService.getCurrentUser();
      if (!currentUser) throw new Error('User not logged in');
  
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');
      const newComment = {
        id: Date.now().toString(),
        movieId,
        userId: currentUser.id,
        username: currentUser.username,
        content,
        createdAt: new Date().toISOString(),
        reactions: []
      };
      comments.push(newComment);
      localStorage.setItem('comments', JSON.stringify(comments));
      return newComment;
    },
  
    // Reactions
    addReaction: (commentId: string, reactionType: 'like' | 'love' | 'laugh'): void => {
      const currentUser = localStorageService.getCurrentUser();
      if (!currentUser) throw new Error('User not logged in');
  
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');
      const commentIndex = comments.findIndex((c: Comment) => c.id === commentId);
      
      if (commentIndex !== -1) {
        // Remove existing reaction from this user if any
        comments[commentIndex].reactions = comments[commentIndex].reactions.filter(
          (r: any) => r.userId !== currentUser.id
        );
        
        // Add new reaction
        comments[commentIndex].reactions.push({
          userId: currentUser.id,
          type: reactionType
        });
        
        localStorage.setItem('comments', JSON.stringify(comments));
      }
    },
  
    // Movie Likes
    toggleMovieLike: (movieId: string): boolean => {
      const currentUser = localStorageService.getCurrentUser();
      if (!currentUser) throw new Error('User not logged in');
  
      const likes = JSON.parse(localStorage.getItem('movieLikes') || '[]');
      const existingLikeIndex = likes.findIndex(
        (like: any) => like.movieId === movieId && like.userId === currentUser.id
      );
  
      if (existingLikeIndex !== -1) {
        // Unlike
        likes.splice(existingLikeIndex, 1);
        localStorage.setItem('movieLikes', JSON.stringify(likes));
        return false;
      } else {
        // Like
        likes.push({
          userId: currentUser.id,
          movieId,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('movieLikes', JSON.stringify(likes));
        return true;
      }
    },
  
    isMovieLiked: (movieId: string): boolean => {
      const currentUser = localStorageService.getCurrentUser();
      if (!currentUser) return false;
  
      const likes = JSON.parse(localStorage.getItem('movieLikes') || '[]');
      return likes.some(
        (like: any) => like.movieId === movieId && like.userId === currentUser.id
      );
    }
  };