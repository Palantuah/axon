# Axon Design System

## Brand Essence
Axon bridges the gap between information complexity and clarity through rigorous research and unbiased analysis. Our design system reflects this mission through precise, considered, and elegant interactions.

## Visual Language

### Color System
```css
/* Core Colors */
--black: #000000;
--white: #FFFFFF;
--glass-bg: rgba(255, 255, 255, 0.02);
--glass-border: rgba(255, 255, 255, 0.1);

/* Accent Colors */
--violet-glow: rgba(139, 92, 246, 0.3);  /* violet-500/30 */
--blue-glow: rgba(59, 130, 246, 0.2);    /* blue-500/20 */
--emerald-glow: rgba(16, 185, 129, 0.2); /* emerald-500/20 */

/* Monochromatic Scale */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #E5E5E5;
--gray-300: #D4D4D4;
--gray-400: #A3A3A3;
--gray-500: #737373;
--gray-600: #525252;
--gray-700: #404040;
--gray-800: #262626;
--gray-900: #171717;
```

### Typography
```css
/* Font Family */
font-family: 'Inter var', sans-serif;

/* Type Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
```

### Background Effects
#### Glow Effect
```jsx
const Glow = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Primary glow */}
    <div className="absolute -top-[40vh] left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] 
                    bg-gradient-to-b from-violet-500/30 to-transparent 
                    blur-[100px] opacity-30" />
    {/* Secondary glows */}
    <div className="absolute top-0 right-0 w-[50vw] h-[50vh] 
                    bg-gradient-to-b from-blue-500/20 to-transparent 
                    blur-[100px] opacity-20 transform rotate-45" />
    <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] 
                    bg-gradient-to-t from-emerald-500/20 to-transparent 
                    blur-[100px] opacity-20 transform -rotate-45" />
    {/* Grain overlay */}
    <div className="absolute inset-0 bg-[url('/noise.png')] 
                    opacity-20 mix-blend-overlay" />
  </div>
)
```

### Glass Effect Guidelines
- Use subtle background blur: `backdrop-filter: blur(8px)`
- Light border effect: `border: 1px solid var(--glass-border)`
- Semi-transparent backgrounds: `background: var(--glass-bg)`
- Subtle shadow: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
- Hover states: `bg-white/5 hover:bg-white/10`

### Motion Design Principles

#### Transitions
```javascript
// Base Transition
const baseTransition = {
  duration: 0.3,
  ease: [0.32, 0.72, 0, 1]
}

// Stagger Children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Fade Up Animation
const fadeUpVariants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: baseTransition
  }
}

// Subtle Scale Animation
const scaleVariants = {
  hover: {
    scale: 1.02,
    transition: baseTransition
  }
}
```

#### Motion Guidelines
- Use subtle movements that enhance understanding
- Maintain consistent timing across similar interactions
- Implement stagger effects for grouped elements
- Ensure animations feel natural and weighted
- Use motion to guide attention and create hierarchy

### Component Patterns

#### Search Input with Icon
```jsx
<div className="relative flex-1">
  <input
    type="text"
    className="w-full pl-6 pr-12 py-4 rounded-xl bg-glass-bg 
              border border-glass-border backdrop-blur-md
              text-white placeholder:text-gray-500 
              focus:outline-none focus:ring-2 focus:ring-violet-500/20
              transition-all duration-300"
  />
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="absolute right-3 top-1/2 -translate-y-1/2 
              p-2 rounded-lg bg-white/5 border border-white/10
              hover:bg-white/10 transition-colors duration-200"
  >
    <MagnifyingGlassIcon className="w-5 h-5 text-white" />
  </motion.button>
</div>
```

#### Cards
```jsx
<motion.div
  variants={fadeUpVariants}
  whileHover={scaleVariants.hover}
  className="relative rounded-lg p-6 overflow-hidden"
  style={{
    background: 'var(--glass-bg)',
    borderColor: 'var(--glass-border)',
    backdropFilter: 'blur(8px)'
  }}
>
  {/* Card Content */}
</motion.div>
```

#### Buttons
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="px-4 py-2 rounded-md bg-black text-white"
>
  {/* Button Content */}
</motion.button>
```

### Icon Guidelines
- Use Radix UI Icons exclusively for consistency
- Maintain consistent icon sizes within context
- Standard sizes:
  - Navigation: 24px
  - Interface elements: 20px
  - Inline with text: 16px
- Use subtle motion on hover states
- Prefer monochromatic icons with hover effects over colored icons

### Layout Principles
- Use generous whitespace
- Maintain consistent spacing rhythm
- Standard spacing scale:
  ```css
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  ```

### Best Practices
1. Maintain visual hierarchy through typography and spacing
2. Use motion purposefully to enhance user understanding
3. Implement glass effects selectively to create depth
4. Keep interface elements minimal and focused
5. Ensure high contrast for accessibility
6. Use Radix UI components as foundational building blocks

### Anti-patterns
- Avoid using colors outside the monochromatic palette
- Don't overuse glass effects
- Avoid complex animations that might disorient users
- Don't use icons from multiple icon sets
- Avoid cluttered layouts that compromise clarity

## Voice & Tone
- Clear and precise language
- Technical without being overwhelming
- Confident but approachable
- Focus on accuracy and clarity
- Avoid emotional or biased language

## Implementation Notes
- Use ShadcnUI as the component foundation
- Implement Framer Motion for all animations
- Utilize CSS variables for consistent theming
- Maintain responsive design principles
- Ensure accessibility compliance