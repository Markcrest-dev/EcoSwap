# 🌱 EcoSwap

A community platform for sharing and finding free used items, promoting reuse over waste.

## Features

- 📝 Post items you want to give away
- 🔍 Browse and search available items
- 🏷️ Filter by categories (Clothing, Electronics, Furniture, etc.)
- 📍 Location-based sharing
- 📱 Responsive design for mobile and desktop

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment

### Option 1: Netlify (Easiest)
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `build` folder to deploy

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Navigation and search
│   ├── ItemForm.js        # Form to add new items
│   ├── ItemList.js        # List of items
│   └── ItemCard.js        # Individual item display
├── App.js                 # Main application component
├── index.js              # Application entry point
└── styles.css            # Global styles
```

## Technologies Used

- React 18
- CSS3 with CSS Variables
- Local Storage for data persistence
- Responsive design

## Environmental Impact

EcoSwap promotes:
- ♻️ Circular economy principles
- 🗑️ Waste reduction
- 🤝 Community sharing
- 🌍 Environmental consciousness

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your community!

## Future Enhancements

- 🗺️ Map integration for item locations
- 👤 User profiles and ratings
- 💬 In-app messaging
- 📊 Environmental impact statistics
- 🔔 Notifications for new items
- 🏪 Integration with local recycling centers
