# ReelCritic API Reference

This document provides a comprehensive reference for the ReelCritic API services, including all available methods, their parameters, and return types.

## API Base URL

All API requests are made to the JSON Server running at:

```
http://localhost:3001
```

## API Services

The application uses several API services to interact with different data entities:

1. `userAPI` - User management
2. `movieAPI` - Movie information
3. `reviewAPI` - Review management
4. `commentAPI` - Comment management
5. `popularCriticAPI` - Popular critics management
6. `authAPI` - Authentication (simulated for local development)

## User API (`userAPI`)

### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getAll()` | Get all users | None | `Promise<User[]>` |
| `getById(id)` | Get a user by ID | `id: string` | `Promise<User>` |
| `getUserById(id)` | Alias for `getById` | `id: string` | `Promise<User>` |
| `update(id, userData)` | Update a user | `id: string, userData: Partial<User>` | `Promise<User>` |
| `updateUser(id, userData)` | Alias for `update` | `id: string, userData: Partial<User>` | `Promise<User>` |
| `toggleFollow(userId)` | Follow/unfollow a user | `userId: string` | `Promise<User>` |

### User Interface

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
  isFollowing: boolean;
  memberSince: string;
  favoriteGenres: string[];
  favoriteDirectors: string[];
  favoriteMovieIds: string[];
  points: number;
  reviewCount: number;
  role: string;
}
```

## Movie API (`movieAPI`)

### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getAll()` | Get all movies | None | `Promise<Movie[]>` |
| `getById(id)` | Get a movie by ID | `id: string` | `Promise<Movie>` |
| `getMovieById(id)` | Alias for `getById` | `id: string` | `Promise<Movie>` |

### Movie Interface

```typescript
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: string;
  director: string;
  rating: number;
  genres: string[];
  runtime: number;
  plot: string;
  cast: string[];
  releaseDate: string;
}
```

## Review API (`reviewAPI`)

### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getAll()` | Get all reviews | None | `Promise<Review[]>` |
| `getById(id)` | Get a review by ID | `id: string` | `Promise<Review>` |
| `getByUserId(userId)` | Get reviews by user ID | `userId: string` | `Promise<Review[]>` |
| `getReviewsByUserId(userId)` | Alias for `getByUserId` | `userId: string` | `Promise<Review[]>` |
| `getByMovieId(movieId)` | Get reviews by movie ID | `movieId: string` | `Promise<Review[]>` |
| `getReviewsByMovieId(movieId)` | Alias for `getByMovieId` | `movieId: string \| number` | `Promise<Review[]>` |
| `createReview(reviewData)` | Create a new review | `reviewData: Omit<Review, 'id'>` | `Promise<Review>` |
| `updateReview(id, reviewData)` | Update a review | `id: string, reviewData: Partial<Review>` | `Promise<Review>` |
| `toggleLike(reviewId)` | Like/unlike a review | `reviewId: string` | `Promise<Review>` |

### Review Interface

```typescript
interface Review {
  id: string;
  userId: string;
  movieId: string;
  content: string;
  rating: number;
  mediaUrl: string | null;
  mediaType: string | null;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  isLiked: boolean;
}
```

## Comment API (`commentAPI`)

### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getAll()` | Get all comments | None | `Promise<Comment[]>` |
| `getById(id)` | Get a comment by ID | `id: string` | `Promise<Comment>` |
| `getByReviewId(reviewId)` | Get comments by review ID | `reviewId: string` | `Promise<Comment[]>` |
| `add(comment)` | Add a comment to a review | `comment: Omit<Comment, 'id'>` | `Promise<Comment>` |

### Comment Interface

```typescript
interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}
```

## Popular Critic API (`popularCriticAPI`)

### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getAll()` | Get all popular critics | None | `Promise<PopularCritic[]>` |
| `getAllWithDetails()` | Get popular critics with user details | None | `Promise<User[]>` |

### PopularCritic Interface

```typescript
interface PopularCritic {
  id: string;
  points: number;
  rank: number;
}
```

## Authentication API (`authAPI`)

### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `isLoggedIn()` | Check if a user is logged in | None | `boolean` |
| `login(email, password)` | Log in a user | `email: string, password: string` | `Promise<User>` |
| `logout()` | Log out the current user | None | `void` |
| `getCurrentUser()` | Get the current logged-in user | None | `User \| null` |

## Utility Functions

### `fetchMostPopularMovies()`

Fetches the most popular movies sorted by rating.

**Return Type:** `Promise<Array<{ id: string, primaryTitle: string, primaryImage: string, averageRating: number, releaseDate: string, url: string }>>`

### `fetchAutocompleteMovies(query)`

Fetches movie suggestions based on a search query.

**Parameters:** `query: string`

**Return Type:** `Promise<Array<{ id: string, title: string, type: string, year: string, poster: string, averageRating: number }>>`

## Common Issues and Solutions

### Missing API Functions

If you encounter errors like `TypeError: someAPI.someFunction is not a function`, it's likely that the function name in your component doesn't match the function name in the API service. There are two ways to fix this:

1. **Add an alias in the API service** (preferred):
   ```typescript
   // Add an alias for the function
   someFunction: async (params) => {
     return existingFunction(params);
   }
   ```

2. **Update the component to use the correct function name**:
   ```typescript
   // Change from
   const result = await someAPI.someFunction(params);
   // To
   const result = await someAPI.correctFunctionName(params);
   ```

### API Response Format Issues

If you encounter errors like `TypeError: response.data.sort is not a function`, it's likely that the response data is not in the expected format. Make sure to:

1. Check that the JSON server is running
2. Verify the API endpoint URL is correct
3. Add validation to check if the response data is in the expected format:
   ```typescript
   if (!response.data || !Array.isArray(response.data)) {
     console.error('Invalid response format:', response.data);
     return [];
   }
   ```

### Network Errors

If you encounter network errors when trying to access the API:

1. Ensure the JSON server is running with `npm run server`
2. Check that the port 3001 is not being used by another application
3. Verify that the `API_BASE_URL` in `src/services/api.ts` is set to `http://localhost:3001`

## Best Practices

1. **Always handle errors** in API calls using try/catch blocks
2. **Add loading states** to components that make API calls
3. **Validate response data** before using it
4. **Use TypeScript interfaces** to ensure type safety
5. **Add aliases for function names** to maintain backward compatibility 