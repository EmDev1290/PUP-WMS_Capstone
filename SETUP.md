# PUP WMS Capstone - Production Build Setup

This project has been configured for production using Tailwind CSS CLI and npm. The CDN-based approach has been replaced with a proper build system.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **Tailwind CSS** - CSS framework (dev dependency)
- **PostCSS** - CSS processor (dev dependency)
- **Autoprefixer** - Browser compatibility (dev dependency)
- **Lucide** - Icon library (runtime dependency)

### 2. Development Workflow

To develop locally with live CSS recompilation:

```bash
npm run dev
```

This watches `src/input.css` and rebuilds `dist/styles.css` whenever you make changes.

### 3. Production Build

To create an optimized production build:

```bash
npm run build
```

This:
- Compiles Tailwind CSS with minification
- Bundles Lucide icons
- Optimizes all assets for production

### 4. Start Local Server

To run a local PHP development server:

```bash
npm start
```

Or manually:

```bash
php -S localhost:8000
```

Then visit: **http://localhost:8000/demo.html**

## Project Structure

```
PUP-WMS_Capstone/
├── dist/                    # Production build output
│   ├── styles.css          # Compiled Tailwind CSS (minified)
│   └── lucide/             # Bundled Lucide icons
├── src/
│   └── input.css           # Source Tailwind CSS config
├── demo.html               # Main application (updated)
├── api.php                 # Backend API
├── db_connect.php          # Database connection
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── build.js                # Build script
└── .gitignore              # Git ignore rules
```

## What Changed

### Before (CDN-based)
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/lucide@latest"></script>
```

### After (Production)
```html
<link rel="stylesheet" href="./dist/styles.css">
<script src="./dist/lucide/lucide.js"></script>
```

## Benefits

✅ **No CDN warnings** - Everything is local  
✅ **Smaller CSS** - Only includes used classes (tree-shaking)  
✅ **Faster load times** - Pre-compiled and minified  
✅ **Better caching** - Static assets can be cached indefinitely  
✅ **Offline support** - Works without internet  
✅ **Development experience** - Live recompilation with `npm run dev`  

## Adding New Dependencies

If you need additional packages:

```bash
npm install package-name
```

For dev-only packages:

```bash
npm install --save-dev package-name
```

## Troubleshooting

### `dist/styles.css` not found
Run `npm run build` to generate the CSS file.

### Icons not showing
Make sure `npm run build` completed successfully and `dist/lucide/lucide.js` exists.

### Changes to CSS not reflecting
If using development mode, ensure `npm run dev` is running in a terminal.

## Notes

- The `src/input.css` contains all Tailwind directives and custom styles
- Custom colors like `pup-maroon` are defined in `tailwind.config.js`
- The build process automatically adds browser prefixes via Autoprefixer
- All production CSS is minified for optimal file size
