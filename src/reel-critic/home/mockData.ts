export const mockStories = [
  {
    id: '1',
    userId: '101',
    username: 'cinephile42',
    userProfilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    mediaType: 'image',
    createdAt: '2023-05-15T14:30:00Z',
    viewed: false
  },
  {
    id: '2',
    userId: '102',
    username: 'filmcritic',
    userProfilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    mediaType: 'image',
    createdAt: '2023-05-15T12:15:00Z',
    viewed: true
  },
  {
    id: '3',
    userId: '103',
    username: 'moviebuff',
    userProfilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
    mediaType: 'image',
    createdAt: '2023-05-15T10:45:00Z',
    viewed: false
  },
  {
    id: '4',
    userId: '104',
    username: 'directorfan',
    userProfilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1512070679279-8988d32161be',
    mediaType: 'image',
    createdAt: '2023-05-15T09:20:00Z',
    viewed: false
  },
  {
    id: '5',
    userId: '105',
    username: 'screenwriter',
    userProfilePicture: 'https://randomuser.me/api/portraits/women/28.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
    mediaType: 'image',
    createdAt: '2023-05-15T08:10:00Z',
    viewed: true
  },
  {
    id: '6',
    userId: '106',
    username: 'filmhistorian',
    userProfilePicture: 'https://randomuser.me/api/portraits/men/67.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b',
    mediaType: 'image',
    createdAt: '2023-05-15T07:30:00Z',
    viewed: false
  }
];

export const mockMovies = [
  {
    id: '1',
    title: 'Inception',
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    year: '2010',
    director: 'Christopher Nolan',
    rating: 8.8
  },
  {
    id: '2',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    year: '1994',
    director: 'Frank Darabont',
    rating: 9.3
  },
  {
    id: '3',
    title: 'Parasite',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    year: '2019',
    director: 'Bong Joon-ho',
    rating: 8.6
  },
  {
    id: '4',
    title: 'The Godfather',
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    year: '1972',
    director: 'Francis Ford Coppola',
    rating: 9.2
  },
  {
    id: '5',
    title: 'Pulp Fiction',
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    year: '1994',
    director: 'Quentin Tarantino',
    rating: 8.9
  }
];

export const mockPosts = [
  {
    id: '1',
    userId: '101',
    username: 'cinephile42',
    userProfilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
    content: "Just watched Inception again and I\'m still blown away by the visual effects and storytelling. The way Nolan plays with time and reality is masterful! What\'s your favorite scene?",
    mediaUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    mediaType: 'image',
    likes: 124,
    comments: 18,
    shares: 5,
    createdAt: '2023-05-15T14:30:00Z',
    isLiked: false,
    isFollowing: true,
    movie: mockMovies[0]
  },
  {
    id: '2',
    userId: '102',
    username: 'filmcritic',
    userProfilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: "The Shawshank Redemption remains one of the most powerful films about hope and resilience. \"Get busy living, or get busy dying.\" What quote from the film resonates with you the most?",
    mediaUrl: null,
    mediaType: null,
    likes: 89,
    comments: 32,
    shares: 12,
    createdAt: '2023-05-14T18:45:00Z',
    isLiked: true,
    isFollowing: false,
    movie: mockMovies[1]
  },
  {
    id: '3',
    userId: '103',
    username: 'moviebuff',
    userProfilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
    content: "Parasite deserved every Oscar it won! The social commentary is so layered and the cinematography is stunning. Bong Joon-ho is a genius at blending genres.",
    mediaUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
    mediaType: 'image',
    likes: 215,
    comments: 45,
    shares: 28,
    createdAt: '2023-05-13T09:20:00Z',
    isLiked: false,
    isFollowing: true,
    movie: mockMovies[2]
  },
  {
    id: '4',
    userId: '104',
    username: 'directorfan',
    userProfilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
    content: "The Godfather is the definition of a perfect film. The acting, direction, screenplay, and score all come together to create something truly timeless. Who\'s your favorite character?",
    mediaUrl: 'https://images.unsplash.com/photo-1512070679279-8988d32161be',
    mediaType: 'image',
    likes: 178,
    comments: 56,
    shares: 14,
    createdAt: '2023-05-12T16:30:00Z',
    isLiked: true,
    isFollowing: false,
    movie: mockMovies[3]
  },
  {
    id: '5',
    userId: '105',
    username: 'screenwriter',
    userProfilePicture: 'https://randomuser.me/api/portraits/women/28.jpg',
    content: "Pulp Fiction\'s non-linear storytelling was revolutionary when it came out. Tarantino\'s dialogue is unmatched! What\'s your favorite conversation from the film?",
    mediaUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
    mediaType: 'image',
    likes: 145,
    comments: 38,
    shares: 9,
    createdAt: '2023-05-11T11:15:00Z',
    isLiked: false,
    isFollowing: true,
    movie: mockMovies[4]
  }
];

export const mockComments = [
  {
    id: '1',
    userId: '201',
    username: 'filmfan1',
    content: "The hallway fight scene is definitely my favorite! The way they played with gravity was mind-blowing.",
    createdAt: '2023-05-15T15:10:00Z',
    likes: 12,
    isLiked: false
  },
  {
    id: '2',
    userId: '202',
    username: 'movielover',
    content: "I love the ending! The spinning top keeps me guessing every time.",
    createdAt: '2023-05-15T15:45:00Z',
    likes: 8,
    isLiked: true
  },
  {
    id: '3',
    userId: '203',
    username: 'cinemageek',
    content: "The scene where they\'re floating in the hotel is iconic. The practical effects were amazing!",
    createdAt: '2023-05-15T16:20:00Z',
    likes: 15,
    isLiked: false
  },
  {
    id: '4',
    userId: '204',
    username: 'filmscholar',
    content: "The character development in this film is so well done. Each person has their own motivations and arc.",
    createdAt: '2023-05-15T17:05:00Z',
    likes: 6,
    isLiked: false
  },
  {
    id: '5',
    userId: '205',
    username: 'directorwannabe',
    content: "Hans Zimmer\'s score elevates every scene. The \"Time\" track still gives me chills!",
    createdAt: '2023-05-15T17:40:00Z',
    likes: 19,
    isLiked: true
  }
];

// Add mock critics data for consistent user profiles
export const mockCritics = [
  {
    id: '101',
    username: 'cinephile42',
    profilePicture: 'https://randomuser.me/api/portraits/women/42.jpg',
    bio: 'Film enthusiast with a passion for sci-fi and psychological thrillers. Christopher Nolan fan.',
    followers: 1245,
    following: 342,
    isFollowing: false,
    memberSince: 'January 2022',
    favoriteGenres: ['Sci-Fi', 'Thriller', 'Drama'],
    favoriteDirectors: ['Christopher Nolan', 'Denis Villeneuve', 'David Fincher'],
    reviewCount: 87
  },
  {
    id: '102',
    username: 'filmcritic',
    profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Professional film critic with 10+ years of experience. I believe in the power of storytelling to change perspectives.',
    followers: 3421,
    following: 156,
    isFollowing: false,
    memberSince: 'March 2020',
    favoriteGenres: ['Drama', 'Crime', 'Documentary'],
    favoriteDirectors: ['Martin Scorsese', 'Francis Ford Coppola', 'Steven Spielberg'],
    reviewCount: 215
  },
  {
    id: '103',
    username: 'moviebuff',
    profilePicture: 'https://randomuser.me/api/portraits/women/22.jpg',
    bio: 'Cinephile who appreciates international cinema. Always looking for hidden gems and underrated masterpieces.',
    followers: 892,
    following: 437,
    isFollowing: false,
    memberSince: 'August 2021',
    favoriteGenres: ['Foreign', 'Independent', 'Animation'],
    favoriteDirectors: ['Bong Joon-ho', 'Hayao Miyazaki', 'Wong Kar-wai'],
    reviewCount: 64
  },
  {
    id: '104',
    username: 'directorfan',
    profilePicture: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Fascinated by the art of direction. I analyze films through the lens of directorial choices and vision.',
    followers: 1678,
    following: 213,
    isFollowing: false,
    memberSince: 'May 2021',
    favoriteGenres: ['Crime', 'Epic', 'Historical'],
    favoriteDirectors: ['Francis Ford Coppola', 'Quentin Tarantino', 'Stanley Kubrick'],
    reviewCount: 93
  },
  {
    id: '105',
    username: 'screenwriter',
    profilePicture: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'Aspiring screenwriter who loves analyzing dialogue and narrative structure in films.',
    followers: 1432,
    following: 321,
    isFollowing: false,
    memberSince: 'October 2020',
    favoriteGenres: ['Crime', 'Comedy', 'Drama'],
    favoriteDirectors: ['Quentin Tarantino', 'Aaron Sorkin', 'Greta Gerwig'],
    reviewCount: 76
  }
]; 