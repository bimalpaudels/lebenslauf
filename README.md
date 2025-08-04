# Lebenslauf - Professional CV Builder

A modern, lightweight CV builder that lets you create professional resumes in minutes using Markdown. No sign-up required, completely free and open source.

![Lebenslauf Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🎯 The Problem

Creating professional CVs are annoyingly time-consuming and boring. CV builders often:

- Require account creation and personal data
- Lock features behind paywalls
- Lack customization flexibility
- Store your data on their servers
- Have to write in a Word processor or LaTeX

Lebenslauf solves these problems by providing a **fast, free, and privacy-focused** CV building experience.

## ✨ Features

### 🚀 Core Features

- **No Sign-up Required** - Start building immediately, no account needed
- **Real-time Preview** - See changes instantly as you edit
- **Markdown Support** - Write your CV using simple Markdown syntax
- **PDF Export** - Download your CV as a high-quality PDF
- **Local Storage** - Your data stays on your device, not our servers
- **Multiple Templates** - Choose from ever growing list of templates

### 🎨 Design & Customization

- **Live Preview** - What you see is what you get
- **Customizable Styling** - Adjust fonts, colors, spacing, and layout
- **Page Format Options** - A4 and Letter page sizes
- **Theme Colors** - Personalize with your preferred color scheme
- **Typography Control** - Fine-tune font sizes, line heights, and spacing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bimalpaudels/lebenslauf.git
   cd lebenslauf
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.5
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Markdown**: Marked.js
- **Storage**: LocalForage
- **Package Manager**: pnpm

## 🔮 Future Features

### 🎨 More Templates

We're planning to add more professional templates:

- **Creative Portfolio** - For designers and artists
- **Academic CV** - For researchers and academics
- **Executive Summary** - For senior management positions
- **Student Resume** - For recent graduates
- **Freelancer Profile** - For independent contractors

### 🚀 Enhanced Features

- **Template Customization** - Modify existing templates
- **Import/Export** - Share CVs between devices
- **Multi-language Support** - International CV formats

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🎨 Adding New Templates

1. **Create template files** in `public/templates/[template-name]/`

   - `template.md` - Markdown content with YAML frontmatter
   - `template.css` - Styling for the template

2. **Update template loader** in `lib/template-loader.ts`

   ```typescript
   {
     id: "your-template",
     name: "Your Template Name",
     description: "Brief description of the template",
     markdownPath: "/templates/your-template/template.md",
     cssPath: "/templates/your-template/template.css",
   }
   ```

3. **Submit a pull request** with your new template

### 🐛 Bug Reports & Feature Requests

- **Bug Reports**: Use GitHub Issues with detailed reproduction steps
- **Feature Requests**: Open an issue with clear description and use cases
- **Questions**: Start a GitHub Discussion

### 💻 Development

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/bimalpaudels/lebenslauf/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/bimalpaudels/lebenslauf/discussions)
- **Star the Repository**: Show your support by starring the project

---

_Lebenslauf is designed to help you create professional CVs quickly and easily, without compromising your privacy or budget._
