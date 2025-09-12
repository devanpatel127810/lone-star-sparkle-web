const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export interface SimpleReview {
  author_name: string;
  rating: number;
  text: string;
}

export interface LocationReviews {
  location: string;
  reviews: SimpleReview[];
}

// Simple function to get reviews for one location
export async function getLocationReviews(locationName: string, city: string): Promise<LocationReviews | null> {
  try {
    // Step 1: Search for the place
    const searchQuery = `${locationName} ${city}`;
    
    // Use CORS proxy for both development and production
    const baseUrl = 'https://api.allorigins.win/raw?url=';
    
    const searchUrl = `${baseUrl}${encodeURIComponent(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${API_KEY}`)}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    console.log(`Search query: ${searchQuery}`);
    console.log(`Search response status: ${searchData.status}`);
    console.log(`Search response:`, searchData);
    
    if (searchData.status !== 'OK' || !searchData.results.length) {
      console.warn(`No place found for: ${searchQuery}`);
      console.warn(`API Status: ${searchData.status}, Results: ${searchData.results?.length || 0}`);
      return null;
    }
    
    const placeId = searchData.results[0].place_id;
    
    // Step 2: Get place details with reviews
    const detailsUrl = `${baseUrl}${encodeURIComponent(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${API_KEY}`)}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();
    
    console.log(`Place details response status: ${detailsData.status}`);
    console.log(`Place details response:`, detailsData);
    
    if (detailsData.status !== 'OK' || !detailsData.result?.reviews) {
      console.warn(`No reviews found for: ${searchQuery}`);
      console.warn(`Details API Status: ${detailsData.status}, Reviews: ${detailsData.result?.reviews?.length || 0}`);
      return null;
    }
    
    // Get top 2 five-star reviews
    const fiveStarReviews = detailsData.result.reviews
      .filter((review: any) => review.rating === 5)
      .slice(0, 2)
      .map((review: any) => ({
        author_name: review.author_name,
        rating: review.rating,
        text: review.text
      }));
    
    return {
      location: city,
      reviews: fiveStarReviews
    };
    
  } catch (error) {
    console.error(`Error fetching reviews for ${city}:`, error);
    return null;
  }
}

// Get reviews for all three locations
export async function getAllLocationReviews(): Promise<LocationReviews[]> {
  const locations = [
    { name: 'Lone Star Wash & Dry', city: 'Lewisville, TX' },
    { name: 'Lone Star Wash & Dry', city: 'Farmers Branch, TX' },
    { name: 'Lone Star Wash & Dry', city: 'Hurst, TX' }
  ];
  
  const results = await Promise.allSettled(
    locations.map(loc => getLocationReviews(loc.name, loc.city))
  );
  
  // Filter out failed requests and return successful ones
  return results
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => (result as PromiseFulfilledResult<LocationReviews>).value);
}
