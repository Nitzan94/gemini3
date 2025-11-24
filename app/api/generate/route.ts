// ABOUTME: API route for Gemini image generation
// ABOUTME: Handles text-to-image and image editing requests

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY'] || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'gemini-2.0-flash-exp', aspectRatio = '1:1', imageSize = '1K', editImage, apiKey } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    const key = apiKey || process.env['GEMINI_API_KEY'];
    if (!key) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }

    const clientAI = new GoogleGenerativeAI(key);
    const generativeModel = clientAI.getGenerativeModel({
      model,
    });

    interface ContentPart {
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }

    const contents: ContentPart[] = [{ text: prompt }];

    if (editImage) {
      const base64Data = editImage.split(',')[1];
      contents.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data,
        },
      });
    }

    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: contents }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        ...(model === 'gemini-3-pro-image-preview' && {
          imageConfig: {
            aspectRatio,
            imageSize,
          },
        }),
      },
    });

    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    const parts = candidates[0].content.parts;
    let imageData = null;
    let textResponse = '';

    for (const part of parts) {
      if (part.text) {
        textResponse = part.text;
      }
      if (part.inlineData) {
        imageData = part.inlineData.data;
      }
    }

    if (!imageData) {
      return NextResponse.json({ error: 'No image in response' }, { status: 500 });
    }

    return NextResponse.json({
      image: `data:image/png;base64,${imageData}`,
      text: textResponse,
    });

  } catch (error: unknown) {
    console.error('Generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate image';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
