# ACK Mt. Kenya Guest House Website – Nyeri, Kenya

Welcome to the official repository of the **ACK Mt. Kenya Guest House Website**, a modern web application developed for a guest house located in **Nyeri Town, Kenya**. The website showcases accommodation options, frontend-only booking system, contact information, and more—built with performance and user experience in mind.

---

## 🌍 About ACK Mt. Kenya Guest House – Nyeri

The **ACK Mt. Kenya Guest House – Nyeri** is a serene, faith-based hospitality facility offering:

- Comfortable and affordable accommodation
- Modern amenities and excellent service
- A calm, secure environment ideal for travelers and organizations
- Strategic location in Nyeri with easy access to local attractions

---

## ✨ Website Features

- 🛏️ Detailed accommodation listings with real-time availability
- 📅 Frontend-only booking system with local storage
- 📸 Visual gallery of rooms and amenities
- 📍 Location information with interactive map
- 📱 Responsive design for mobile, tablet, and desktop
- ⚡ Fast-loading SPA with modern performance optimization
- 💬 WhatsApp integration for instant communication
- 💾 Local data persistence for booking management

---

## 🧰 Tech Stack

| Tool/Framework     | Purpose                             |
|--------------------|-------------------------------------|
| [React](https://react.dev/)        | Frontend UI library               |
| [TypeScript](https://www.typescriptlang.org/)   | Type-safe JavaScript development |
| [Vite](https://vitejs.dev/)        | Lightning-fast dev/build tooling |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)  | Frontend data persistence |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Beautiful icon library |

---

## 💾 Data Structure

The application uses local storage with the following data structures:

### Rooms Data
- `id` (string, unique identifier)
- `name` (text) - Room name
- `description` (text) - Room description
- `bed_only`, `bb`, `half_board`, `full_board` (number) - Pricing for different meal plans
- `capacity` (integer) - Maximum guests
- `amenities` (text array) - List of amenities
- `image_url` (text) - Room image URL
- `available` (boolean) - Availability status

### Bookings Data (stored in localStorage as 'ack_bookings')
- `id` (string, unique identifier)
- `roomType` (string) - Room ID
- `name`, `email`, `phone` (string) - Guest information
- `checkIn`, `checkOut` (string) - Dates in ISO format
- `number_of_guests` (integer)
- `specialRequests` (string, optional)
- `status` (enum: pending, confirmed, cancelled, completed)
- `totalAmount` (number)
- `mealPlan` (string) - Selected meal plan
- `createdAt` (string) - ISO timestamp

### Frontend Functions
- Room availability checking against existing bookings
- Automatic pricing calculation based on meal plans
- WhatsApp integration for booking confirmation

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Joseph9866/ACK_guest_house_website.git
cd ACK_guest_house_website
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BookingForm.tsx
│   ├── ContactForm.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── hooks/              # Custom React hooks
│   ├── useRooms.ts
│   ├── useBookings.ts
│   ├── usePayments.ts
│   └── useContacts.ts
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Rooms.tsx
│   ├── Gallery.tsx
│   ├── Booking.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── utils/              # Utility functions and types
│   ├── types.ts
│   ├── constants.ts
│   └── helpers.ts
└── App.tsx             # Main application component
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🌐 Deployment

The website can be deployed to various platforms:

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Vercel
1. Import project from GitHub
2. Set framework preset to Vite

---

## 📱 Features in Detail

### Booking System
- Real-time room availability checking against local storage
- Form validation and error handling
- WhatsApp integration for instant booking
- Local booking storage and management
- Multiple meal plan options with dynamic pricing

### Room Management
- Dynamic room listing with mock data
- Image galleries with lightbox
- Amenity filtering and display
- Pricing and capacity information

### Contact System
- Contact form with validation
- Multiple contact methods
- Interactive location map
- Business hours and information

---

## 💾 Data Management

- Local storage for booking persistence
- Input validation and sanitization
- Client-side availability checking
- Automatic data cleanup and management

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact

**ACK Mt. Kenya Guest House**
- Phone: +254 720 577 442
- Email: ackguesthsenyeri025@gmail.com
- Location: Nyeri, Kenya

**Developer**
- GitHub: [@Joseph9866](https://github.com/Joseph9866)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Images provided by [Pexels](https://pexels.com)
- Icons by [Lucide](https://lucide.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)
- Frontend-only architecture for simplicity and performance