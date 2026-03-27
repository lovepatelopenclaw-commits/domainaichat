import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    let extractedText = '';

    if (file.type === 'application/pdf') {
      // Extract text from PDF
      const buffer = Buffer.from(await file.arrayBuffer());
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } catch {
        return NextResponse.json(
          { error: 'Failed to parse PDF. Please try a different file.' },
          { status: 422 }
        );
      }
    } else if (file.type.startsWith('image/')) {
      extractedText = '[Image uploaded - content will be analyzed by Vyarah AI]';
    } else if (file.type === 'text/plain') {
      extractedText = await file.text();
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, image, or text file.' },
        { status: 400 }
      );
    }

    // Truncate if too long
    if (extractedText.length > 8000) {
      extractedText = extractedText.substring(0, 8000) + '\n\n[Content truncated due to length]';
    }

    return NextResponse.json({
      text: extractedText,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to process upload' }, { status: 500 });
  }
}
