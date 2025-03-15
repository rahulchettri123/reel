# ReelCritic Database Migration

This document outlines the migration from mock data to a JSON database for the ReelCritic movie critic social media platform.

## Overview

We've migrated from using hardcoded mock data in TypeScript files to a proper JSON database structure with separate entities and relationships. This provides several benefits:

1. **Separation of Concerns**: Data is now separate from the application code
2. **Persistence**: Data changes (like following a critic) will persist between sessions
3. **API-like Interface**: The application now uses proper API calls to fetch and update data
4. **Realistic Development**: This better simulates a real-world application with a backend

## Database Structure

The database is organized into a single `db.json` file with the following entities:

1. **users**: Contains all user profiles and account information
2. **movies**: Contains movie details and metadata
3. **reviews**: Contains movie reviews linked to users and movies
4. **comments**: Contains comments on reviews
5. **popular_critics**: Contains a filtered list of top critics based on points

## Data Relationships

The database uses ID references to maintain relationships between entities:

- Reviews reference `userId` and `movieId`
- Comments reference `reviewId` and `userId`
- Popular critics reference user `id`
- Users have `favoriteMovieIds` that reference movie IDs

## API Services

We've created a set of API services in `src/services/api.ts` to interact with the database:

- `userAPI`: User management
- `movieAPI`: Movie information
- `reviewAPI`: Review management
- `commentAPI`: Comment management
- `popularCriticAPI`: Popular critics management
- `authAPI`: Authentication (simulated for local development)

## Changes Made

1. **Created db.json**: Combined all data into a single JSON database file
2. **Created API Services**: Added services to interact with the JSON database
3. **Updated Components**: Modified components to use the API services instead of mock data
4. **Added Loading States**: Added loading and error states to handle asynchronous data fetching
5. **Added Scripts**: Added npm scripts to run the JSON server

## How to Run

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server and JSON server:
   ```
   npm run dev:all
   ```

   This will start:
   - The React development server at http://localhost:5173
   - The JSON Server database at http://localhost:3001

3. You can access the JSON server directly to view the data:
   - http://localhost:3001/users
   - http://localhost:3001/movies
   - http://localhost:3001/reviews
   - http://localhost:3001/comments
   - http://localhost:3001/popular_critics

## Example API Usage

```typescript
// Fetch all popular critics with user details
const fetchPopularCritics = async () => {
  try {
    const critics = await popularCriticAPI.getAllWithDetails();
    console.log('Popular critics:', critics);
  } catch (error) {
    console.error('Error fetching critics:', error);
  }
};

// Follow/unfollow a critic
const toggleFollowCritic = async (criticId: string) => {
  try {
    await userAPI.toggleFollow(criticId);
    console.log('Successfully toggled follow status');
  } catch (error) {
    console.error('Error following critic:', error);
  }
};

// Get reviews by a specific user
const getUserReviews = async (userId: string) => {
  try {
    const reviews = await reviewAPI.getByUserId(userId);
    console.log(`Reviews by user ${userId}:`, reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
  }
};
```

## Future Improvements

1. **Real Authentication**: Replace the simulated authentication with a real JWT-based system
2. **Server-Side Filtering**: Implement more advanced filtering and pagination on the server side
3. **Real Database**: Replace JSON Server with a real database like MongoDB or PostgreSQL
4. **Image Uploads**: Add support for uploading images for user profiles and reviews
5. **Search Functionality**: Implement search across movies, users, and reviews 