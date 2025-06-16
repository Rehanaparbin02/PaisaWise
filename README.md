# PaisaWise 💰

**Empower Your Finances, Master Your Future**

[![React Native](https://img.shields.io/badge/React%20Native-0.72+-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2049+-black.svg)](https://expo.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-92.2%25-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.8%25-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/Rehanaparbin02/PaisaWise)](https://github.com/Rehanaparbin02/PaisaWise)

A feature-rich, cross-platform financial management application built with React Native and Expo. PaisaWise provides users with powerful tools to track expenses, manage budgets, and achieve their financial goals through an intuitive and engaging interface.

---

## 🌟 Features

### 💳 Financial Management
- **Expense Tracking**: Comprehensive transaction logging with categories and tags
- **Budget Management**: Create, monitor, and adjust budgets with visual indicators
- **Financial Goals**: Set and track progress toward savings and investment targets
- **Analytics & Reports**: Detailed insights with charts and spending patterns

### 🎨 User Experience
- **Modular Components**: Reusable UI elements (`BudgetCard`, `PrettyPinkButton`, `MiniCards`)
- **Intuitive Navigation**: Seamless onboarding, profile management, and transaction flows
- **Responsive Design**: Optimized for various screen sizes and orientations
- **Dark/Light Mode**: Customizable themes for better user experience

### 🚀 Technical Excellence
- **Cross-Platform**: iOS, Android, and web support with minimal configuration
- **Data Persistence**: Local storage with AsyncStorage and cloud sync capabilities
- **Performance Optimized**: Efficient rendering and smooth animations
- **Extensible Architecture**: Easily customizable and scalable codebase

---

## 🛠️ Built With

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | Mobile Framework | 0.72+ |
| ![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white) | Development Platform | SDK 49+ |
| ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) | Primary Language | ES2022 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) | Type Safety | 4.9+ |
| ![Lodash](https://img.shields.io/badge/Lodash-3492FF?style=for-the-badge&logo=lodash&logoColor=white) | Utility Library | Latest |

</div>

---

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [💻 Usage](#-usage)
- [🧪 Testing](#-testing)
- [📱 Screenshots](#-screenshots)
- [🏗️ Architecture](#️-architecture)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Authors](#-authors)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.0 or higher
- **npm** or **yarn**: Latest stable version
- **Expo CLI**: Global installation required
- **Git**: For version control

```bash
# Check your installations
node --version
npm --version
expo --version
git --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rehanaparbin02/PaisaWise.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd PaisaWise
   ```

3. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Or using yarn
   yarn install
   ```

4. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

### Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```env
   # API Configuration
   API_BASE_URL=https://your-api-endpoint.com
   API_KEY=your-api-key-here

   # Database Configuration
   DATABASE_URL=your-database-url

   # Authentication
   AUTH_SECRET=your-auth-secret
   ```

---

## 💻 Usage

### Development Server

Start the development server:

```bash
# Using npm
npm start

# Using yarn
yarn start

# Using Expo CLI directly
expo start
```

### Platform-Specific Commands

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

### Building for Production

```bash
# Create production build
expo build:android
expo build:ios

# Or using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

---

## 🧪 Testing

PaisaWise uses Jest and React Native Testing Library for comprehensive testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- BudgetCard.test.js
```

### Test Structure

```
__tests__/
├── components/
│   ├── BudgetCard.test.js
│   ├── PrettyPinkButton.test.js
│   └── MiniCards.test.js
├── screens/
│   ├── Dashboard.test.js
│   └── Profile.test.js
└── utils/
    └── storage.test.js
```

---

## 📱 Screenshots

<div align="center">
  <h3>📊 Dashboard</h3>
  <img src="./assets/screenshots/dashboard.png" alt="Dashboard" width="250"/>
  
  <h3>💰 Budget Management</h3>
  <img src="./assets/screenshots/budget.png" alt="Budget" width="250"/>
  
  <h3>📈 Analytics</h3>
  <img src="./assets/screenshots/analytics.png" alt="Analytics" width="250"/>
</div>

---

## 🏗️ Architecture

### Project Structure

```
PaisaWise/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BudgetCard/
│   │   ├── PrettyPinkButton/
│   │   └── MiniCards/
│   ├── screens/             # Application screens
│   │   ├── Dashboard/
│   │   ├── Profile/
│   │   └── Transactions/
│   ├── navigation/          # Navigation configuration
│   ├── services/            # API and external services
│   ├── utils/               # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── constants/           # App constants
├── assets/                  # Images, fonts, icons
├── __tests__/              # Test files
└── docs/                   # Additional documentation
```

### Key Components

#### BudgetCard Component
```javascript
import { BudgetCard } from './src/components/BudgetCard';

<BudgetCard
  title="Monthly Budget"
  amount={2500}
  spent={1800}
  currency="USD"
  onPress={() => navigation.navigate('BudgetDetails')}
/>
```

#### PrettyPinkButton Component
```javascript
import { PrettyPinkButton } from './src/components/PrettyPinkButton';

<PrettyPinkButton
  title="Add Expense"
  onPress={handleAddExpense}
  disabled={false}
/>
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use Prettier for code formatting
- Run ESLint before committing

```bash
# Format code
npm run format

# Lint code
npm run lint
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Rehana Parbin** - *Initial work* - [@Rehanaparbin02](https://github.com/Rehanaparbin02)

See also the list of [contributors](https://github.com/Rehanaparbin02/PaisaWise/contributors) who participated in this project.

---

## 🙏 Acknowledgments

- **React Native Community** for the amazing framework
- **Expo Team** for simplifying mobile development
- **Design Inspiration** from leading fintech applications
- **Open Source Contributors** who make projects like this possible

---

## 🐛 Bug Reports & Feature Requests

- **Bug Reports**: [Create an Issue](https://github.com/Rehanaparbin02/PaisaWise/issues/new?template=bug_report.md)
- **Feature Requests**: [Request a Feature](https://github.com/Rehanaparbin02/PaisaWise/issues/new?template=feature_request.md)

---

## 📞 Support

Need help? Reach out to us:

- **Email**: support@paisawise.com
- **Documentation**: [Wiki](https://github.com/Rehanaparbin02/PaisaWise/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/Rehanaparbin02/PaisaWise/discussions)

---

<div align="center">
  <p>Made with ❤️ by the PaisaWise Team</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
