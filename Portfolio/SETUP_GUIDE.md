# 🚀 Quick Setup Guide

## Step 1: View Your Portfolio (Right Now!)

Since you're using XAMPP, your portfolio is already accessible:

**Open in your browser:**
```
http://localhost/Portfolio/
```

Or simply double-click `index.html` to open it directly.

---

## Step 2: Add Your Project Videos (Optional)

1. Go to the `videos` folder
2. Add your MP4 video files with these exact names:
   - `drone-project.mp4`
   - `dashcam-project.mp4`
   - `attendance-project.mp4`
   - `scraper-project.mp4`
   - `hereaid-project.mp4`
   - `dustbin-project.mp4`
   - `anime-helper-project.mp4`
   - `fullstack-project.mp4`

**Don't have videos yet?** No problem! The site will show "Preview Unavailable" placeholders.

---

## Step 3: Customize Your Links

Open `index.html` and find these sections to update:

### 🔗 Personal Contact Info (Around Line 38-45)

Replace:
```html
<a href="mailto:your.email@example.com">Email: [Your Email]</a>
<a href="tel:+60123456789">Phone: [Your Number]</a>
```

With your actual email and phone:
```html
<a href="mailto:eric@example.com">Email: eric@example.com</a>
<a href="tel:+60123456789">Phone: +60 12-345 6789</a>
```

### 🌐 Social Links (Around Line 43-45)

Replace:
```html
<a href="#" target="_blank">LinkedIn</a>
<a href="#" target="_blank">GitHub</a>
<a href="#" target="_blank">Portfolio</a>
```

With your URLs:
```html
<a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a>
<a href="https://github.com/yourusername" target="_blank">GitHub</a>
<a href="https://yourwebsite.com" target="_blank">Portfolio</a>
```

### 📂 Project URLs (Lines 235, 251, 267, 283, 299, 315, 331, 347)

Search for `#project-url-1` through `#project-url-8` and replace with your actual project links:

```html
<!-- Before -->
<a href="#project-url-1" class="project-btn">View Project</a>

<!-- After -->
<a href="https://github.com/yourusername/drone-project" class="project-btn">View Project</a>
```

### 📧 Contact Button (Around Line 458)

Replace:
```html
<a href="#your-contact-page-url" class="contact-btn">Contact Me</a>
```

With your contact page:
```html
<a href="https://yourcontactpage.com" class="contact-btn">Contact Me</a>
```

---

## Step 4: Test Responsiveness

1. Open your portfolio in Chrome
2. Press `F12` to open Developer Tools
3. Click the device icon (toggle device toolbar)
4. Test on different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

---

## Step 5: Customize Colors (Optional)

Want different colors? Edit `styles.css` lines 12-18:

```css
:root {
    --color-primary: #2563eb;        /* Change to your preferred color */
    --color-primary-dark: #1e40af;
    --color-secondary: #60a5fa;
}
```

**Color Palette Suggestions:**
- **Blue (Current)**: `#2563eb`
- **Green**: `#10b981`
- **Purple**: `#8b5cf6`
- **Orange**: `#f59e0b`
- **Red**: `#ef4444`

---

## 🎯 Testing Checklist

- [ ] Portfolio opens at `http://localhost/Portfolio/`
- [ ] All sections are visible (scroll through entire page)
- [ ] Navigation menu works
- [ ] Mobile menu (hamburger) opens on small screens
- [ ] Smooth scroll to sections works
- [ ] Fade-in animations trigger on scroll
- [ ] Videos play on hover (if added)
- [ ] All links work (or are ready to be updated)
- [ ] Contact button works (or ready to be updated)
- [ ] Site is responsive on mobile

---

## 🌐 Ready to Go Live?

### Option 1: GitHub Pages (Free & Easy)
```bash
# In Git Bash or Terminal
git init
git add .
git commit -m "Initial portfolio commit"
git remote add origin https://github.com/yourusername/portfolio.git
git push -u origin main
```
Then enable GitHub Pages in repository settings.

### Option 2: Netlify (Drag & Drop)
1. Go to [netlify.com](https://netlify.com)
2. Sign up free
3. Drag your Portfolio folder
4. Done! Get instant URL

### Option 3: Custom Domain
Point your domain to your hosting and upload these files via FTP.

---

## 📞 Need Help?

- **Videos not working?** Check the `videos/README.md` file
- **Links not working?** Make sure to remove the `#` and add full URLs
- **Styling issues?** Clear your browser cache (Ctrl + Shift + Delete)

---

## ✨ What You've Built

✅ Fully responsive portfolio website  
✅ 10 complete sections  
✅ Interactive project showcases with video previews  
✅ Smooth animations and modern design  
✅ Mobile-optimized navigation  
✅ Professional color scheme  
✅ Semantic HTML5 structure  
✅ Clean, maintainable code  

**Your portfolio is production-ready!** 🎉

Just update the links and you're good to deploy.

---

**Last Updated**: October 2025  
**Built with**: HTML5, CSS3, Vanilla JavaScript

# Portfolio Website Feature Updates

## 🌓 Dark Mode Toggle
- Added a theme toggle button in the top-right corner
- Supports light and dark modes
- Remembers user's theme preference using `localStorage`
- Smooth color transitions between modes
- Comprehensive dark mode styling for all sections

### Dark Mode Features
- Preserves readability and design integrity
- Reduces eye strain in low-light environments
- Instant toggle with no page reload

## 🖼️ Profile Picture
- Added a circular profile picture in the hero section
- Hover animation with slight scale effect
- Responsive design that works on all screen sizes

### Profile Picture Customization
1. Replace `profile-picture.jpg` with your photo
2. Recommended size: Square image (1:1 ratio)
3. Suggested dimensions: 800x800 pixels

## 🏆 Enhanced Awards Section
- Added images for each award/achievement
- Hover effects with image zoom and card elevation
- Responsive grid layout
- Anime.js animations for dynamic entry

### Award Image Guidelines
- Use high-quality, professional images
- Recommended image size: 600x400 pixels
- Supported formats: JPG, PNG
- Place images in `awards/` directory:
  - `oh-my-code.jpg`
  - `proton-dx.jpg`
  - `hacking-weekend.jpg`
  - `yutp-scholarship.jpg`

## 🎬 Anime.js Animations
Integrated Anime.js for advanced, smooth animations:

### Animated Sections
- Profile Picture: Fade and slide in
- Awards Cards: Staggered entry with translation
- Skills Cards: Hover scale effects
- Project Cards: Wave-like entry animation
- Experience Timeline: Slide-in animation

## 🔧 Customization Tips
1. Modify color schemes in `styles.css`
2. Adjust animation parameters in `script.js`
3. Replace placeholder images with your own

## 📱 Responsive Design
- All new features work seamlessly on:
  - Desktop
  - Tablet
  - Mobile devices

## 🚀 Performance
- Lazy-loaded animations
- Minimal performance impact
- Smooth 60fps animations

---

**Enjoy your enhanced portfolio!** 🎉
