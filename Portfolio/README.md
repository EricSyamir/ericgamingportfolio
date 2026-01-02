# Muhammad Eric Syamir - Personal Portfolio Website

A modern, responsive portfolio website showcasing skills, projects, education, and achievements.

## 🚀 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in effects on scroll for engaging user experience
- **Interactive Project Previews**: Hover-activated video previews for each project
- **Modern UI**: Clean design with blue accents and professional color palette
- **Semantic HTML5**: Well-structured, accessible markup
- **Mobile-First**: Optimized for all screen sizes

## 📁 File Structure

```
Portfolio/
├── index.html          # Main HTML structure
├── styles.css          # Stylesheet with responsive design
├── script.js           # JavaScript for animations and interactions
├── videos/            # Folder for project preview videos (create this)
│   ├── drone-project.mp4
│   ├── dashcam-project.mp4
│   ├── attendance-project.mp4
│   ├── scraper-project.mp4
│   ├── hereaid-project.mp4
│   ├── dustbin-project.mp4
│   ├── anime-helper-project.mp4
│   └── fullstack-project.mp4
└── README.md          # This file
```

## 🎬 Adding Project Videos

1. Create a `videos` folder in your project directory
2. Add your project preview videos with the following names:
   - `drone-project.mp4`
   - `dashcam-project.mp4`
   - `attendance-project.mp4`
   - `scraper-project.mp4`
   - `hereaid-project.mp4`
   - `dustbin-project.mp4`
   - `anime-helper-project.mp4`
   - `fullstack-project.mp4`

**Video Recommendations:**
- Duration: 5-10 seconds
- Format: MP4 (H.264 codec)
- Resolution: 1280x720 or 1920x1080
- File size: Keep under 5MB for fast loading

## 🔗 Customization Guide

### 1. Update Contact Information

In `index.html`, replace the placeholder links:

```html
<!-- Line 38-40: Email and Phone -->
<a href="mailto:your.email@example.com">Email: your.email@example.com</a>
<a href="tel:+60123456789">Phone: +60123456789</a>

<!-- Line 43-45: Social Links -->
<a href="YOUR_LINKEDIN_URL" target="_blank">LinkedIn</a>
<a href="YOUR_GITHUB_URL" target="_blank">GitHub</a>
<a href="YOUR_PORTFOLIO_URL" target="_blank">Portfolio</a>
```

### 2. Update Project URLs

Each project has a button linking to the project page. Update the `href` attributes:

```html
<!-- Example: Line 235 -->
<a href="YOUR_PROJECT_URL" class="project-btn">View Project</a>
```

Replace all 8 project URLs (`#project-url-1` through `#project-url-8`) with your actual project links.

### 3. Update Contact Me Button

In the Contact Section (around line 458):

```html
<a href="YOUR_CONTACT_PAGE_URL" class="contact-btn">Contact Me</a>
```

### 4. Customize Colors (Optional)

In `styles.css`, modify the color variables (lines 12-18):

```css
:root {
    --color-primary: #2563eb;        /* Main blue color */
    --color-primary-dark: #1e40af;   /* Darker blue for hover */
    --color-secondary: #60a5fa;      /* Light blue accent */
    /* ... other colors ... */
}
```

## 🌐 Deployment

### Option 1: GitHub Pages
1. Create a GitHub repository
2. Push your files
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://username.github.io/repository-name`

### Option 2: Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop your portfolio folder
3. Your site will be deployed instantly

### Option 3: XAMPP (Local Testing)
1. Copy the Portfolio folder to `C:\xampp\htdocs\`
2. Start Apache in XAMPP Control Panel
3. Visit `http://localhost/Portfolio/` in your browser

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Features

- **Color Palette**: White (#ffffff), Light Gray (#f3f4f6), Blue (#2563eb)
- **Typography**: Segoe UI font family for clean readability
- **Animations**: CSS transitions with 0.3s timing
- **Responsive Breakpoints**: 768px (tablet), 480px (mobile)

## 📝 Sections Overview

1. **Header**: Fixed navigation with smooth scroll links
2. **Hero**: Name, role, and scholarship information
3. **Professional Summary**: Brief introduction
4. **Education**: UTP degree details
5. **Skills**: 9 categorized skill cards
6. **Experience**: 5 leadership and development roles
7. **Awards**: 4 major achievements
8. **Projects**: 8 projects with video previews
9. **Certifications**: 3 professional certificates
10. **Contact**: Call-to-action button

## 🐛 Troubleshooting

**Videos not playing?**
- Ensure videos are in the `videos` folder
- Check that filenames match exactly
- Verify video format is MP4 (H.264)

**Mobile menu not working?**
- Check that `script.js` is loaded
- Clear browser cache
- Test in different browsers

**Animations not triggering?**
- Scroll slowly to trigger intersection observer
- Check browser console for JavaScript errors

## 📄 License

This portfolio template is free to use and customize for personal purposes.

---

**Built with ❤️ by Muhammad Eric Syamir**

For questions or support, contact via the portfolio contact page.

