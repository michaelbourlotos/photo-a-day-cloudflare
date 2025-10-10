// Cloudflare Pages Function for Photo Upload
// This handles POST /api/upload

export async function onRequest(context) {
  const { request, env } = context;
  
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Simple password authentication
  const expectedPassword = env.UPLOAD_PASSWORD;
  
  if (!expectedPassword) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
  
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    if (request.method === 'POST') {
      return await uploadPhoto(request, env, corsHeaders);
    } else {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

async function uploadPhoto(request, env, corsHeaders) {
  try {
    const formData = await request.formData();
    const title = formData.get('filetitle');
    const date = formData.get('filedate');
    const file = formData.get('file');
    
    if (!title || !date || !file) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(JSON.stringify({ error: 'Invalid file type. Only JPG, JPEG, and PNG are allowed.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file size (1MB limit)
    if (file.size > 1000000) {
      return new Response(JSON.stringify({ error: 'File too large. Maximum size is 1MB.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop().toLowerCase();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await env.R2_BUCKET.put(uniqueFilename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });
    
    // Get current photo count for ordering
    const countStmt = env.DB.prepare('SELECT COUNT(*) as count FROM photos');
    const countResult = await countStmt.first();
    const orderPhotos = countResult.count + 1;
    
    // Insert into database
    const insertStmt = env.DB.prepare(`
      INSERT INTO photos (datePhotos, fileFullNamePhotos, orderPhotos, titlePhotos)
      VALUES (?, ?, ?, ?)
    `);
    
    await insertStmt.bind(date, uniqueFilename, orderPhotos, title).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Photo uploaded successfully',
      filename: uniqueFilename
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload photo');
  }
}
