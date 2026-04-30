# Tennis Motion Analysis Tool

Professional tennis action analysis and coaching tool powered by AI models.

## Features

- **Video Upload**: Drag & drop or click to upload tennis action videos (MP4, MOV, MKV)
- **Multi-Model Analysis**: Compare results from 2-3 different AI models
- **Key Frame Extraction**: Automatically detect and extract key frames from videos
- **Pose Visualization**: Visualize pose keypoints and connections on key frames
- **Detailed Analysis**: Get scores, issues, and suggestions for each key frame
- **Training Tutorials**: Jump to Xiaohongshu for detailed training tutorials

## Model Architecture

The tool uses a combination of AI models:

1. **MediaPipe Pose**: Extracts 33 body keypoints for pose analysis
2. **SlowFast**: Recognizes tennis action types (forehand, backhand, serve, etc.)
3. **Custom Analysis Layer**: Provides professional coaching advice based on pose data

## Project Structure

```
tennis-analysis/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts    # API endpoint for video analysis
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── VideoUpload.tsx     # Video upload component
│   │   ├── AnalysisResults.tsx # Analysis results display
│   │   ├── PoseVisualization.tsx # Pose visualization canvas
│   │   └── TrainingTutorials.tsx # Training tutorial links
│   ├── lib/                    # Utility functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── public/                     # Static assets
├── temp/                        # Temporary files (not committed)
├── .env.local                   # Environment variables (not committed)
├── .env.example                 # Environment variables template
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm 10.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tennis-analysis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and fill in your API keys.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# API Keys (never commit .env.local to Git)
MEDIAPIPE_API_KEY=your_mediapipe_api_key_here
SLOWFAST_API_KEY=your_slowfast_api_key_here
MODEL_API_KEY=your_model_api_key_here

# Upload settings
MAX_FILE_SIZE=104857600 # 100MB in bytes
ALLOWED_FILE_TYPES=video/mp4,video/quicktime,video/x-matroska
```

**Important**: Never commit `.env.local` to Git. It's already added to `.gitignore`.

## Security Architecture

This project uses a **backend proxy** architecture to protect API keys:

1. **Frontend**: Calls `/api/analyze` endpoint (no API keys exposed)
2. **Backend**: Next.js API route handles model API calls with secret keys
3. **Keys Storage**: API keys stored in `.env.local` (server-side only)

This ensures that even if someone inspects the frontend code, they cannot extract your API keys.

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Vercel

Add the same environment variables from `.env.local` to your Vercel project settings.

## Next Steps

### Integrating Real Models

Currently, the project uses **mock data** for demonstration. To integrate real models:

1. **MediaPipe Pose**:
   - Install `@mediapipe/pose` package
   - Update `src/app/api/analyze/route.ts` to use real model

2. **SlowFast**:
   - Set up Python backend with PyTorch
   - Create API endpoint for SlowFast inference
   - Or use cloud API if available

3. **Key Frame Extraction**:
   - Use `ffmpeg` to extract frames from video
   - Implement smart key frame detection based on pose changes

### Improving Analysis

- Add more sophisticated analysis rules
- Train custom models on tennis dataset
- Add comparison with professional player poses

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
