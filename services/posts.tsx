
// src/services/posts.ts

export interface Post {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    movieId: string;
    movieTitle: string;
    movieImage: string;
    content: string;
    rating: number;
    timestamp: Date;
    likes: number;
    genres: string[];
  }
  
  // Mock data
  const mockPosts: Post[] = [
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      userAvatar: "/api/placeholder/40/40",
      movieId: "tt1375666",
      movieTitle: "Inception",
      movieImage: "https://via.placeholder.com/300",
      content: "Just watched this masterpiece again! The visual effects are spectacular, and the plot keeps you guessing until the end. 🎬 What do you think about the ending? #Inception #MovieNight",
      rating: 5,
      timestamp: new Date("2024-02-20T10:30:00"),
      likes: 42,
      genres: ['Sci-Fi', 'Action', 'Thriller']
    },
    {
      id: "2",
      userId: "user2",
      userName: "Jane Smith",
      userAvatar: "/api/placeholder/40/40",
      movieId: "tt0468569",
      movieTitle: "The Dark Knight",
      movieImage: "https://via.placeholder.com/300",
      content: "Heath Ledger's performance as the Joker is absolutely incredible! A true masterpiece of superhero cinema. 🦇 #Batman #DarkKnight",
      rating: 5,
      timestamp: new Date("2024-02-19T15:45:00"),
      likes: 38,
      genres: ['Action', 'Drama', 'Crime']
    }
  ];
  
  export const getPosts = async (): Promise<Post[]> => {
    return mockPosts;
  };
  
  export const addPost = async (post: Omit<Post, 'id' | 'timestamp' | 'likes'>): Promise<Post> => {
    const newPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      likes: 0
    };
    mockPosts.unshift(newPost);
    return newPost;
  };