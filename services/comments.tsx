// src/services/comments.ts

export interface MovieComment {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    movieId: string;
    movieTitle: string;
    movieImage: string;
    comment: string;
    rating: number;
    timestamp: Date;
    likes: number;
  }
  
  // Mock data - in a real app, this would come from your backend
  const mockComments: MovieComment[] = [
    {
      id: "1",
      userId: "user1",
      userName: "John Doe",
      userAvatar: "/api/placeholder/40/40",
      movieId: "tt1375666",
      movieTitle: "Inception",
      movieImage: "https://via.placeholder.com/300",
      comment: "Mind-bending masterpiece! The visual effects are spectacular, and the plot keeps you guessing until the end. 🎬",
      rating: 5,
      timestamp: new Date("2024-02-20T10:30:00"),
      likes: 42
    },
    {
      id: "2",
      userId: "user2",
      userName: "Jane Smith",
      userAvatar: "/api/placeholder/40/40",
      movieId: "tt0468569",
      movieTitle: "The Dark Knight",
      movieImage: "https://via.placeholder.com/300",
      comment: "Heath Ledger's Joker is unforgettable. A perfect blend of action and drama! 🦇",
      rating: 5,
      timestamp: new Date("2024-02-19T15:45:00"),
      likes: 38
    }
  ];
  
  export const getRecentComments = async (): Promise<MovieComment[]> => {
    // In a real app, this would be an API call
    return mockComments;
  };
  
  export const addComment = async (comment: Omit<MovieComment, 'id' | 'timestamp' | 'likes'>): Promise<MovieComment> => {
    const newComment: MovieComment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      likes: 0
    };
    mockComments.unshift(newComment);
    return newComment;
  };