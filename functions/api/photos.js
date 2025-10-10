// Simplified Photos API function
export async function onRequest(context) {
  const { env } = context;
  
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get all photos ordered by date
    const stmt = env.DB.prepare('SELECT * FROM photos ORDER BY datePhotos DESC');
    const photos = await stmt.all();
    
    console.log('Photos query result:', photos);
    
    // Transform photos to include R2 URLs
    const photosWithUrls = photos.results.map(photo => ({
      id: photo.id,
      date: photo.datePhotos,
      title: photo.titlePhotos,
      order: photo.orderPhotos,
      url: `${env.R2_PUBLIC_URL}/${photo.fileFullNamePhotos}`,
      filename: photo.fileFullNamePhotos
    }));
    
    return new Response(JSON.stringify(photosWithUrls), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch photos',
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}