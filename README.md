# ReelCritic - Movie Critic Social Media Platform

ReelCritic is a social media platform for movie enthusiasts and critics to share reviews, follow popular critics, and discover new movies.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/reel-critic.git
   cd reel-critic
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server and JSON server:
   ```
   npm run dev:all
   ```

   This will start:
   - The React development server at http://localhost:5173
   - The JSON Server database at http://localhost:3001

## Features

- Browse trending movie reviews
- Follow popular movie critics
- View detailed movie information
- Write and share your own reviews
- Comment on other users' reviews
- Search for movies and users

## Project Structure

- `src/reel-critic/` - Main application components
- `src/services/` - API services and data handling
- `db.json` - JSON database with mock data

## Database Structure

See [README-DB-MIGRATION.md](./README-DB-MIGRATION.md) for detailed information about the database structure and API services.

## Common Issues and Troubleshooting

### Image Loading Errors

If you see errors like `Failed to load resource: net::ERR_NAME_NOT_RESOLVED` for placeholder images, this is likely because the placeholder service is not accessible. The application uses fallback images to handle this case.

### API Function Errors

If you encounter errors like:
- `TypeError: response.data.sort is not a function`
- `TypeError: someAPI.someFunction is not a function`

These are typically caused by:
1. The JSON server not running (start with `npm run server`)
2. Incorrect API endpoint URLs
3. Unexpected response format from the API

Make sure the JSON server is running on port 3001 and check the browser console for more detailed error messages.

### Network Errors

If you see network errors when trying to access the JSON server:
1. Ensure the server is running with `npm run server`
2. Check that the port 3001 is not being used by another application
3. Verify that the API_BASE_URL in `src/services/api.ts` is set to `http://localhost:3001`

### Infinite Redirects

If you experience infinite redirects or navigation issues:
1. Check the route configuration in `src/reel-critic/index.tsx`
2. Ensure that links in components use the correct format for HashRouter (without leading slashes)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# ReelCritic Database Structure

This document outlines the structure of the JSON database for the ReelCritic movie critic social media platform.

## Database Overview

The database is organized into separate JSON files to maintain clean separation of concerns and optimize data relationships:

1. **users.json** - Contains all user profiles and account information
2. **movies.json** - Contains movie details and metadata
3. **reviews.json** - Contains movie reviews linked to users and movies
4. **comments.json** - Contains comments on reviews
5. **popular_critics.json** - Contains a filtered list of top critics based on points

## Data Relationships

The database uses ID references to maintain relationships between entities:

- Reviews reference `userId` and `movieId`
- Comments reference `reviewId` and `userId`
- Popular critics reference user `id`
- Users have `favoriteMovieIds` that reference movie IDs

## File Structures

### users.json

Contains comprehensive user data including profile information, bio, followers, and favorites.

```json
{
  "users": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "password": "string (hashed)",
      "profilePicture": "string (URL)",
      "bio": "string",
      "followers": "number",
      "following": "number",
      "isFollowing": "boolean",
      "memberSince": "string (date)",
      "favoriteGenres": ["string"],
      "favoriteDirectors": ["string"],
      "favoriteMovieIds": ["string"],
      "points": "number",
      "reviewCount": "number",
      "role": "string"
    }
  ]
}
```

### movies.json

Contains movie details such as titles, genres, and metadata.

```json
{
  "movies": [
    {
      "id": "string",
      "title": "string",
      "posterUrl": "string (URL)",
      "year": "string",
      "director": "string",
      "rating": "number",
      "genres": ["string"],
      "runtime": "number",
      "plot": "string",
      "cast": ["string"],
      "releaseDate": "string (date)"
    }
  ]
}
```

### reviews.json

Stores movie reviews associated with users and movies.

```json
{
  "reviews": [
    {
      "id": "string",
      "userId": "string",
      "movieId": "string",
      "content": "string",
      "rating": "number",
      "mediaUrl": "string (URL) or null",
      "mediaType": "string or null",
      "likes": "number",
      "comments": "number",
      "shares": "number",
      "createdAt": "string (ISO date)",
      "isLiked": "boolean"
    }
  ]
}
```

### comments.json

Contains comments on reviews.

```json
{
  "comments": [
    {
      "id": "string",
      "reviewId": "string",
      "userId": "string",
      "content": "string",
      "createdAt": "string (ISO date)",
      "likes": "number",
      "isLiked": "boolean"
    }
  ]
}
```

### popular_critics.json

Contains a filtered list of users from users.json who qualify as popular critics based on their points (points > 100).

```json
{
  "popular_critics": [
    {
      "id": "string",
      "points": "number",
      "rank": "number"
    }
  ]
}
```

## Usage Guidelines

1. **Data Retrieval**: When retrieving data that spans multiple entities (e.g., a review with user and movie details), join the data from the respective files using the ID references.

2. **Popular Critics**: The popular_critics.json file should be dynamically derived from users.json, filtering users with points > 100. This file is used for the homepage's "Popular Critics" section.

3. **Data Consistency**: When updating user data, ensure that any changes to points are reflected in the popular_critics.json file if applicable.

4. **Relationships**: Maintain proper references by linking reviews to user IDs and movie IDs instead of embedding full user or movie data.

## Example: Retrieving a Review with User and Movie Details

```javascript
// Pseudo-code for retrieving a review with user and movie details
function getReviewWithDetails(reviewId) {
  // Get the review
  const review = reviews.find(r => r.id === reviewId);
  
  // Get the associated user
  const user = users.find(u => u.id === review.userId);
  
  // Get the associated movie
  const movie = movies.find(m => m.id === review.movieId);
  
  // Get comments for the review
  const reviewComments = comments.filter(c => c.reviewId === reviewId);
  
  // Return the combined data
  return {
    review,
    user: {
      id: user.id,
      username: user.username,
      profilePicture: user.profilePicture
    },
    movie: {
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
      year: movie.year
    },
    comments: reviewComments
  };
}
```
