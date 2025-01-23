import { NextResponse } from 'next/server';

// You'll need to implement your own storage solution
let currentStreamUrl = '';
let isStreamEnabled = false;

export async function POST(req: Request) {
  try {
    const { streamUrl, isEnabled } = await req.json();
    currentStreamUrl = streamUrl;
    isStreamEnabled = isEnabled;
    
    return NextResponse.json({ success: true, streamUrl, isEnabled });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stream settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    streamUrl: currentStreamUrl,
    isEnabled: isStreamEnabled 
  });
} 