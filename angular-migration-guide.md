# IBA Website Angular Migration Guide

This document outlines the structure, components, and functionality of the International Bible Academy (IBA) website for migration to Angular. This guide is designed to be comprehensive and detailed to facilitate the generation of Angular components and services.

## Project Overview

The International Bible Academy (IBA) website is a multilingual educational platform focused on Bible studies and spiritual growth. The website includes various sections such as home, about us, program information, video gallery, and contact details.

## Core Features

1. **Multilingual Support** - The website supports multiple languages including English, Tamil, Hindi, and Kannada
2. **Responsive Design** - All pages are mobile-responsive with Bootstrap
3. **Course Registration** - Users can register for Bible study programs
4. **Video Gallery** - Collection of educational videos
5. **Chat Assistant** - Interactive chatbot for user assistance
6. **Animation Effects** - AOS (Animate On Scroll) animations throughout the site

## Angular Architecture

### Project Structure

```
iba-angular/
├── src/
│   ├── app/
│   │   ├── core/                  # Core functionality (auth, guards, interceptors)
│   │   │   ├── services/          # Global services
│   │   │   ├── models/            # Data models/interfaces
│   │   │   └── guards/            # Route guards
│   │   ├── shared/                # Shared components, directives, pipes
│   │   │   ├── components/        # Reusable components
│   │   │   ├── directives/        # Custom directives
│   │   │   └── pipes/             # Custom pipes
│   │   ├── features/              # Feature modules
│   │   │   ├── home/              # Home page module
│   │   │   ├── about/             # About us module
│   │   │   ├── program/           # Program module
│   │   │   ├── videos/            # Videos module
│   │   │   └── contact/           # Contact module
│   │   ├── layouts/               # Layout components
│   │   │   ├── header/            # Header component
│   │   │   ├── footer/            # Footer component
│   │   │   └── chat-bot/          # Chat bot component
│   │   └── app-routing.module.ts  # Main routing module
│   ├── assets/                    # Static assets
│   │   ├── i18n/                  # Translation files
│   │   ├── images/                # Images
│   │   ├── fonts/                 # Fonts
│   │   ├── videos/                # Video files
│   │   └── styles/                # Global styles
│   ├── environments/              # Environment configurations
│   └── index.html                 # Main HTML file
└── angular.json                   # Angular configuration
```

## Components Breakdown

### Core Components

#### 1. Header Component

**Functionality:**
- Logo and site name display
- Navigation menu with responsive mobile toggle
- Language selection dropdown

**Data Requirements:**
- Current active route
- Available languages
- Current selected language

**Interactions:**
- Route navigation
- Language switching
- Mobile menu toggle

#### 2. Footer Component

**Functionality:**
- Copyright information
- Social media links
- Credits

**Data Requirements:**
- Social media URLs
- Current year for copyright

#### 3. Chat Bot Component

**Functionality:**
- Interactive chat interface
- Predefined responses
- Message history

**Data Requirements:**
- Chat messages array
- Bot responses based on user input

**Interactions:**
- Send message
- Receive automated response
- Toggle chat window visibility

### Feature Components

#### 1. Home Page

**Sections:**
- Hero Carousel with multiple slides
- Services/Features section
- Testimonials
- Statistics/Counters
- Learners Portal Cards
- Call to Action

**Components:**
- `HeroCarouselComponent` - Manages the sliding hero section
- `ServiceCardComponent` - Reusable card for services
- `TestimonialComponent` - Displays user testimonials
- `CounterComponent` - Animated statistics counters
- `PortalCardComponent` - Cards linking to learner portals
- `CtaComponent` - Call to action section

**Services:**
- `CarouselService` - Manages carousel state and transitions

#### 2. About Us Page

**Sections:**
- Hero section with video background
- Faith Statement
- Mission and Vision
- Timeline/History
- Team Members
- Gallery
- Contact Form
- Map with Regional Statistics

**Components:**
- `VideoHeroComponent` - Hero with video background
- `TimelineComponent` - Historical timeline with events
- `TeamMemberCardComponent` - Card for team member display
- `GalleryComponent` - Image gallery with lightbox
- `ContactFormComponent` - Form for user inquiries
- `MapComponent` - Interactive map with regional data

**Services:**
- `ContactService` - Handles form submission
- `GalleryService` - Manages gallery images and lightbox

#### 3. Program Page

**Sections:**
- Program Overview
- Course Listings
- Registration Modal
- Schedule
- Testimonials

**Components:**
- `CourseCardComponent` - Card displaying course information
- `RegistrationModalComponent` - Modal for course registration
- `ScheduleComponent` - Program schedule display
- `TestimonialComponent` - Reused from home page

**Services:**
- `CourseService` - Manages course data
- `RegistrationService` - Handles form submission and validation
- `SupabaseService` - Integration with Supabase for data storage

#### 4. Videos Page

**Sections:**
- Video Gallery
- Banner/CTA

**Components:**
- `VideoCardComponent` - Card displaying video with embed
- `BannerComponent` - Call to action banner

**Services:**
- `VideoService` - Manages video data and playback

#### 5. Contact Section

**Sections:**
- Contact Form
- Contact Information
- Map

**Components:**
- `ContactFormComponent` - Reused from about page
- `ContactInfoComponent` - Displays contact details
- `MapComponent` - Reused from about page

**Services:**
- `ContactService` - Reused from about page

### Shared Components

1. **LanguageSelectorComponent**
   - Dropdown for language selection
   - Used in header and modals

2. **ScrollTopComponent**
   - Button to scroll back to top
   - Appears when scrolled down

3. **PreloaderComponent**
   - Loading animation for page transitions

4. **AnimatedCounterComponent**
   - Animated number counter for statistics

## Services

### Core Services

1. **TranslationService**
   - Manages multilingual content
   - Loads appropriate language files
   - Provides translation functions

2. **ThemeService**
   - Manages site-wide styling
   - Handles light/dark mode if implemented

3. **AuthService**
   - Handles user authentication if needed
   - Manages user sessions

4. **ApiService**
   - Core service for API communication
   - Handles HTTP requests

### Feature Services

1. **CourseService**
   - Manages course data
   - Handles course filtering and sorting

2. **RegistrationService**
   - Processes course registrations
   - Validates form data
   - Communicates with backend

3. **ChatService**
   - Manages chatbot functionality
   - Processes user messages
   - Generates responses

4. **VideoService**
   - Manages video data
   - Handles video embedding

## Data Models

### User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language: string;
}
```

### Course

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: Date;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string[];
  instructor: string;
  imageUrl: string;
}
```

### Registration

```typescript
interface Registration {
  id: string;
  userId?: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  language: string;
  referral?: string;
  dateRegistered: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

### Video

```typescript
interface Video {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  category: string;
  language: string;
  publishDate: Date;
}
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}
```

## Form Implementations

### Contact Form

**Fields:**
- Name (required)
- Email (required, validated)
- Subject (required)
- Message (required)

**Validation:**
- All fields required
- Email format validation
- Minimum message length

### Course Registration Form

**Fields:**
- Name (required)
- Email (required, validated)
- Phone (required)
- Language preference (required)
- Referral source (optional)
- Consent checkbox (required)

**Validation:**
- All required fields must be filled
- Email format validation
- Phone number format validation
- Consent must be checked

## Routing Structure

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'program', component: ProgramComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
```

## Internationalization (i18n)

The application will use Angular's built-in i18n or ngx-translate for handling translations. Translation files will be stored in JSON format in the assets/i18n directory.

**Languages:**
- English (default)
- Tamil
- Hindi
- Kannada

**Implementation:**
- Translation pipe for template usage
- Translation service for programmatic usage
- Language selector component
- Language storage in localStorage

## Styling Approach

The application will use:
- SCSS for styling
- Bootstrap 5 for responsive grid and components
- Custom theme variables for consistent styling
- Component-specific styles encapsulated with Angular's view encapsulation

**Global Styles:**
- Typography definitions
- Color palette
- Spacing utilities
- Animation definitions

## Third-party Integrations

1. **Bootstrap** - UI framework
2. **AOS (Animate on Scroll)** - Scroll animations
3. **GLightbox** - Image/video lightbox
4. **Supabase** - Backend database (if continuing to use)
5. **Google Maps** - For map integration

## Performance Considerations

1. **Lazy Loading** - Feature modules will be lazy-loaded
2. **Image Optimization** - Images will be optimized and served in next-gen formats
3. **Code Splitting** - Bundle splitting for improved loading times
4. **SSR (Server-Side Rendering)** - Consider Angular Universal for SEO
5. **PWA** - Progressive Web App features for offline access

## Accessibility

1. **ARIA Attributes** - Proper ARIA roles and attributes
2. **Keyboard Navigation** - Full keyboard support
3. **Screen Reader Support** - Text alternatives for images
4. **Color Contrast** - WCAG 2.1 compliant color contrast
5. **Focus Management** - Visible focus indicators

## Migration Strategy

1. **Component Development** - Develop Angular components based on this guide
2. **State Management** - Implement services for data management
3. **Routing Setup** - Configure Angular routing
4. **Styling Migration** - Convert CSS to component-scoped SCSS
5. **Testing** - Implement unit and integration tests
6. **Deployment** - Configure build and deployment pipeline

## Additional Notes

- The chatbot functionality should be implemented as a standalone component that can be included on any page
- The multilingual support should be implemented early as it affects all components
- Consider implementing a state management solution (NgRx or similar) if the application grows in complexity
- Ensure all forms include proper error handling and user feedback
