
# Arab Technical Academy - Online Learning Platform
![](https://6lj.github.io/Arab-Technical-Academy/aa.gif) 
A comprehensive online learning management system (LMS) built with Node.js, designed to provide quality technical education in Arabic. The platform offers course management, certificate generation, progress tracking, and an interactive learning experience.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login system with email verification
- **Course Management**: Complete CRUD operations for courses, sections, and content
- **Learning Interface**: Interactive video lessons, quizzes, and progress tracking
- **Certificate Generation**: Automated certificate creation with verification system
- **Admin Dashboard**: Full administrative control panel
- **Discussion Forums**: Course-based discussion system
- **Real-time Chat**: Messaging system for communication
- **File Upload**: Support for images and videos
- **Review System**: Course ratings and reviews
- **Progress Tracking**: Detailed learning progress monitoring

### Technical Features
- **Multi-language Support**: Arabic RTL interface with proper localization
- **Responsive Design**: Mobile-friendly responsive UI
- **File Management**: Cloud storage integration (ImgBB for images, Cloudinary for videos)
- **Database**: SQLite3 with comprehensive data modeling
- **Security**: Password hashing, session management, and admin protection
- **PDF Generation**: Server-side certificate generation using Puppeteer

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQLite3





## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcrypt** - Password hashing
- **express-session** - Session management
- **multer** - File upload handling

### Frontend
- **EJS** - Template engine
- **CSS3** - Styling
- **JavaScript (ES6)** - Client-side functionality

### External Services
- **Cloudinary** - Video hosting and processing
- **ImgBB** - Image hosting
- **Puppeteer** - PDF generation

## 📊 Database Schema

The application uses SQLite3 with the following main tables:

### Core Tables
- **users**: User accounts and profiles
- **courses**: Course information and metadata
- **sections**: Course sections (chapters)
- **contents**: Individual content items (videos, images, quizzes)
- **enrollments**: User course enrollments and progress

### Learning Features
- **user_progress**: Detailed content completion tracking
- **quizzes**: Quiz information and settings
- **quiz_questions**: Quiz questions and answers
- **user_quizzes**: Quiz attempts and results

### Social Features
- **reviews**: Course reviews and ratings
- **discussions**: Course discussion threads
- **discussion_replies**: Discussion responses
- **chat_messages**: Real-time chat messages
- **notifications**: User notifications

### Certification
- **certificates**: Generated certificates with verification




## 🎨 Features in Detail

### Course Management
- Create and manage courses with rich metadata
- Organize content into sections and subsections
- Support for multiple content types (video, image, quiz)
- Progress tracking and completion certificates

### Learning Experience
- Interactive video player with progress tracking
- Quiz system with multiple choice questions
- Certificate generation upon course completion
- Discussion forums for each course

### Certificate System
- Automated certificate generation using Puppeteer
- Unique verification IDs for each certificate
- PDF download and sharing capabilities
- Verification page for authenticity checking

### Admin Panel
- Complete course management interface
- User statistics and analytics
- Content upload and organization
- Quiz creation and management

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- Admin route protection
- File upload validation
- SQL injection prevention with parameterized queries

## 🌐 Deployment

### Production Considerations
1. **Environment Variables**: Move hardcoded API keys to environment variables
2. **Database**: Consider upgrading to PostgreSQL for production
3. **File Storage**: Configure proper cloud storage quotas
4. **SSL**: Enable HTTPS in production
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Backup**: Set up database backup procedures




## 📧 Contact

For questions or support, please contact me , X = m4ua 

---

**Built with ❤️ for technical community**
