# JSON Diff Tool

A beautiful, responsive JSON diff tool built with React and TailwindCSS that allows you to compare two JSON objects and visualize the differences with elegant styling and syntax highlighting.

![JSON Diff Tool](https://github.com/user-attachments/assets/6dcd6f97-9786-4cef-b5af-1253207f85df)

## Features

- 🔍 **Visual JSON Comparison** - Side-by-side comparison of JSON objects
- 🎨 **Beautiful UI** - Clean, modern interface with TailwindCSS styling
- 🌈 **Syntax Highlighting** - Color-coded JSON with proper formatting
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- ⚡ **Real-time Diff** - Instant comparison as you type
- 🎯 **Clear Visual Indicators** - Easy-to-understand diff markers
- 📋 **Example Data** - Load sample data to test the tool
- 🚀 **Fast & Lightweight** - Built with modern React and Vite

## Live Demo

Visit the live application: [https://aliahmadcse.github.io/json-pro/](https://aliahmadcse.github.io/json-pro/)

## Screenshot

### JSON Diff in Action
![JSON Diff Example](https://github.com/user-attachments/assets/4a7c58e4-9cb5-4ef6-b516-480901e34cda)

## Usage

1. **Visit the app** - Open the live demo or run locally
2. **Paste JSON data** - Enter your original JSON in the left panel
3. **Paste modified JSON** - Enter your modified JSON in the right panel
4. **View differences** - The tool automatically highlights changes, additions, and deletions
5. **Use example data** - Click "Load Example" to see the tool in action

## Color Legend

- 🔴 **Red highlighting** - Removed or original values
- 🟢 **Green highlighting** - Added or new values  
- 🟡 **Yellow highlighting** - Modified objects

## Technology Stack

- **Frontend**: React 18+ with functional components and hooks
- **Styling**: TailwindCSS with custom design system
- **Build Tool**: Vite for fast development and building
- **Diff Engine**: jsondiffpatch for accurate JSON comparison
- **Fonts**: Google Fonts (Inter + Fira Code)
- **Deployment**: GitHub Pages with GitHub Actions

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/aliahmadcse/json-pro.git
   cd json-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

The application is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch.

### Manual Deployment

1. Build the project: `npm run build`
2. The built files will be in the `dist` directory
3. Deploy the `dist` directory to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [jsondiffpatch](https://github.com/benjamine/jsondiffpatch) - JSON diffing library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://react.dev/) - JavaScript library for building user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
