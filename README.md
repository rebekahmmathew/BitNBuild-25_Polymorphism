# NourishNet - Tiffin Service Platform (MVP)

A simplified MVP platform for tiffin services in India, featuring a vendor dashboard and consumer mobile app with basic route optimization.

## 🚀 Features

### Vendor Dashboard (React.js)
- **Subscriber Management**: CRUD operations, search, pagination
- **Menu Management**: Create/publish dynamic daily/weekly menus
- **Analytics Dashboard**: Revenue tracking, subscription analytics, delivery performance
- **Staff Management**: Manage delivery staff and assign routes
- **Delivery Tracking**: Basic delivery tracking with Google Maps integration

### Consumer Mobile App (React Native)
- **Delivery Tracking**: Map view with delivery status
- **Subscription Management**: Flexible daily/weekly/monthly plans
- **Menu Browsing**: View and order from daily menus
- **Profile Management**: User preferences and delivery addresses

### Simplified Features
- **Local Storage**: JSON file-based data storage (no MongoDB)
- **Simple Authentication**: User ID-based authentication (no JWT)
- **Cash Payments**: Local payment handling (no Razorpay)
- **Google Maps**: Basic map integration for tracking

## 🛠 Tech Stack

### Backend
- **Node.js/Express** with TypeScript
- **Local JSON Storage** for data persistence
- **Simple Authentication** with user ID headers
- **Google Maps API** for basic mapping
- **Google Gemini AI** for route optimization (optional)

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Recharts** for analytics
- **Google Maps** integration

### Mobile App
- **React Native** with Expo
- **React Navigation** for navigation
- **React Native Maps** for tracking
- **Expo Location** for GPS

## 📁 Project Structure

```
nourishnet/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & error handling
│   │   ├── utils/          # Gemini AI utilities
│   │   └── index.ts        # Server entry point
│   └── package.json
├── dashboard/              # React vendor dashboard
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Dashboard pages
│   │   ├── store/          # Redux store
│   │   └── App.tsx
│   └── package.json
├── app/                    # React Native mobile app
│   ├── src/
│   │   ├── screens/        # App screens
│   │   ├── navigation/      # Navigation setup
│   │   ├── store/          # Redux store
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Google Maps API key (optional)
- Google Gemini API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nourishnet
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup (Optional)**

Create `.env` files in each directory for enhanced features:

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GEMINI_API_KEY=your-gemini-api-key
```

**Dashboard (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. **Start Development Servers**

```bash
# Start all services
npm run dev

# Or start individually
npm run backend:dev    # Backend API
npm run dashboard:dev  # Vendor Dashboard
npm run app:dev       # Mobile App
```

## 🎯 MVP Features

This simplified version includes:

- **No Database**: Uses local JSON file storage
- **No Authentication**: Simple user ID-based system
- **No Payments**: Cash-based payment simulation
- **Demo Data**: Pre-populated with sample data
- **Basic Maps**: Google Maps integration for tracking

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `POST /api/subscriptions/:id/pause` - Pause subscription
- `POST /api/subscriptions/:id/resume` - Resume subscription

### Menus
- `GET /api/menus` - Get menus (vendor)
- `POST /api/menus` - Create menu
- `PUT /api/menus/:id` - Update menu
- `POST /api/menus/:id/publish` - Publish menu
- `GET /api/menus/published` - Get published menus

### Deliveries
- `GET /api/deliveries` - Get deliveries
- `POST /api/deliveries` - Create delivery
- `POST /api/deliveries/:id/optimize` - Optimize route
- `PUT /api/deliveries/:id/status` - Update status
- `GET /api/deliveries/track/:subscriptionId` - Track delivery

### Analytics
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/subscriptions` - Subscription analytics
- `GET /api/analytics/deliveries` - Delivery analytics

## 🤖 AI Integration

### Route Optimization
The platform uses Google Gemini AI to optimize delivery routes:

```typescript
// Example usage
const optimizedRoute = await optimizeRouteWithAI({
  addresses: deliveryAddresses,
  trafficConditions: 'heavy',
  weatherConditions: 'rainy'
})
```

### Menu Recommendations
AI-powered menu suggestions based on customer preferences:

```typescript
const recommendations = await generateMenuRecommendations(
  currentMenuItems,
  customerPreferences
)
```

## 🗄️ Database Schema

### User Model
```typescript
interface IUser {
  uid: string
  email: string
  name: string
  role: 'vendor' | 'consumer'
  phone?: string
  address?: Address
  preferences?: Preferences
  isActive: boolean
}
```

### Subscription Model
```typescript
interface ISubscription {
  userId: ObjectId
  planType: 'daily' | 'weekly' | 'monthly'
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  price: number
  deliveryAddress: Address
  preferences: Preferences
  nextBillingDate: Date
}
```

### Delivery Model
```typescript
interface IDelivery {
  subscriptionId: ObjectId
  staffId?: ObjectId
  date: Date
  status: 'scheduled' | 'in_progress' | 'delivered' | 'failed'
  route: RouteInfo
  tracking: TrackingInfo
  payment: PaymentInfo
}
```

## 🔒 Security Features

- **Firebase JWT Authentication**
- **Joi Validation** for all inputs
- **Rate Limiting** (100 requests per 15 minutes)
- **HTTPS** enforcement in production
- **Input Sanitization**
- **CORS** configuration
- **Helmet** security headers

## 📱 Mobile App Features

### Real-time Tracking
- Live GPS tracking of delivery person
- Estimated arrival time (ETA)
- Push notifications for delivery updates
- Interactive map with route visualization

### Subscription Management
- Flexible plan selection
- Pause/resume functionality
- Payment integration with Razorpay
- Billing history and receipts

## 🚀 Deployment

### Backend (Heroku)
```bash
# Build and deploy
npm run backend:build
git subtree push --prefix backend heroku main
```

### Dashboard (Vercel)
```bash
# Deploy to Vercel
npm run dashboard:build
vercel --prod
```

### Mobile App (Expo EAS)
```bash
# Build for production
eas build --platform all
eas submit --platform all
```

## 📊 Analytics & Monitoring

- **Revenue Tracking**: Daily, weekly, monthly revenue analytics
- **Subscription Metrics**: Active, paused, cancelled subscriptions
- **Delivery Performance**: On-time delivery rates, average delivery time
- **Menu Analytics**: Popular items, customer preferences
- **Staff Performance**: Delivery statistics, ratings

## 🔧 Development

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing

### Database Indexes
```javascript
// Performance indexes
UserSchema.index({ uid: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
SubscriptionSchema.index({ userId: 1 })
SubscriptionSchema.index({ status: 1 })
DeliverySchema.index({ subscriptionId: 1 })
DeliverySchema.index({ status: 1 })
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Email: support@nourishnet.com
- Documentation: [docs.nourishnet.com](https://docs.nourishnet.com)
- Issues: [GitHub Issues](https://github.com/nourishnet/issues)

---

**NourishNet** - Revolutionizing tiffin services in India with AI-powered delivery optimization! 🚀