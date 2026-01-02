# Deployment Guide for Portfolio Game

This is a static web application that can be hosted on various platforms. Here are the best options:

## 🚀 Free Hosting Options

### 1. **Netlify** (Recommended - Easiest)
**Best for**: Quick deployment with automatic HTTPS and custom domains

**Steps**:
1. Go to [netlify.com](https://www.netlify.com) and sign up (free)
2. Drag and drop your project folder to Netlify's dashboard
   - OR use Git integration:
     - Push your code to GitHub/GitLab/Bitbucket
     - Connect your repository to Netlify
     - Netlify will auto-deploy on every push
3. Your site will be live immediately with a `.netlify.app` URL
4. Optional: Add a custom domain in Site settings

**Pros**: 
- Free SSL/HTTPS
- Automatic deployments from Git
- Custom domain support
- CDN included

---

### 2. **Vercel** (Great for GitHub integration)
**Best for**: Developers using GitHub

**Steps**:
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects it's a static site
5. Click "Deploy" - done!

**Pros**:
- Free SSL/HTTPS
- Excellent GitHub integration
- Automatic deployments
- Fast global CDN

---

### 3. **GitHub Pages** (Free with GitHub)
**Best for**: If your code is already on GitHub

**Steps**:
1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Under "Source", select "Deploy from a branch"
4. Choose `main` (or `master`) branch and `/` (root) folder
5. Click "Save"
6. Your site will be at: `https://yourusername.github.io/repository-name`

**Pros**:
- Completely free
- Integrated with GitHub
- Custom domain support

**Note**: GitHub Pages serves from the repository root or `/docs` folder. If your `index.html` is in the root, you're good to go!

---

### 4. **Cloudflare Pages** (Free with great performance)
**Best for**: Fast global performance

**Steps**:
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign up (free)
3. Connect your Git repository OR upload files
4. Configure build settings (if needed)
5. Deploy!

**Pros**:
- Free SSL/HTTPS
- Excellent global performance
- Unlimited bandwidth
- Custom domains

---

## 📁 Self-Hosting Options

### Option A: Traditional Web Hosting (cPanel, etc.)
If you have a web hosting service:

1. Upload all files via FTP/SFTP or File Manager
2. Ensure `index.html` is in the root directory
3. Visit your domain - it should work!

### Option B: Using XAMPP (Local Development)
You're already using XAMPP! To make it accessible:

1. Keep files in `htdocs/portfolio2nd/`
2. Access via: `http://localhost/portfolio2nd/`

**To make it accessible on your network**:
- Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Access from other devices: `http://YOUR_IP/portfolio2nd/`

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All file paths are relative (no absolute paths like `C:/...`)
- [ ] `index.html` is in the root directory
- [ ] All assets (images, sprites, sounds) are in the project folder
- [ ] Test the game in a browser (not just localhost)
- [ ] Check browser console for any errors

### Important Files/Folders Needed:
```
portfolio2nd/
├── index.html          (Main file - must be in root)
├── src/                (JavaScript files)
├── public/             (Assets if any)
├── spritesheet.png     (Game sprites)
├── map.png             (Map image)
├── map.json            (Map data)
└── Portfolio/          (Other assets)
```

---

## 🌐 Custom Domain Setup

Most hosting services support custom domains:

1. **Netlify/Vercel**: 
   - Go to Domain settings
   - Add your domain
   - Update DNS records as instructed

2. **GitHub Pages**:
   - Add `CNAME` file in repository root with your domain
   - Update DNS A records to GitHub's IPs

---

## 📝 Quick Start (Netlify - Recommended)

**Fastest way to go live**:

1. **Option 1: Drag & Drop**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your `portfolio2nd` folder
   - Done! Copy the URL and share it

2. **Option 2: Git Integration** (Best for updates)
   ```bash
   # If using Git
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/portfolio-game.git
   git push -u origin main
   
   # Then connect to Netlify/Vercel
   ```

---

## 🚨 Common Issues

**Issue**: Assets not loading after deployment
- **Fix**: Ensure all paths are relative (start with `./` or no leading slash)
- Check browser console for 404 errors

**Issue**: Game doesn't work on mobile
- **Fix**: Ensure HTTPS is enabled (required for some browser features)
- Test on actual device, not just browser dev tools

**Issue**: Slow loading
- **Fix**: Optimize images, use CDN (Netlify/Vercel include this automatically)

---

## 💡 Recommendation

**For beginners**: Use **Netlify Drop** - just drag and drop your folder!

**For ongoing development**: Use **Vercel** or **Netlify** with Git integration for automatic deployments.

**For free with GitHub**: Use **GitHub Pages** if your code is already on GitHub.

All of these are free and will get you online in minutes! 🎉

