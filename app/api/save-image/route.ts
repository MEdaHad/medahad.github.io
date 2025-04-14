import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const imageData = data.imageData;
    
    if (!imageData) {
      return NextResponse.json(
        { success: false, message: 'No image data provided' },
        { status: 400 }
      );
    }
    
    // Base64 image processing
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Make sure the directory exists
    const imageDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(imageDir)) {
      await mkdir(imageDir, { recursive: true });
    }
    
    // Save to public folder
    const filePath = path.join(imageDir, 'profile.jpg');
    fs.writeFileSync(filePath, buffer);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image saved successfully',
      path: '/images/profile.jpg'
    });
  } catch (error: any) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save image' },
      { status: 500 }
    );
  }
} 