# Aroundin Project Documentation Map

This document provides a structured overview of the "Aroundin" hyperlocal marketplace application. It is designed to be parsed by an LLM to understand the project's full implementation, architecture, and user flows.

---

## 1. Project Overview

**Aroundin** is a unified, single-page web application built with React. It serves two primary roles: a **Customer**-facing discovery platform and a **Vendor**-facing business management dashboard. The application is designed as a high-fidelity, navigable prototype that uses static mock data for content and simulates dynamic interactions.

- **Core Concept**: A hyperlocal marketplace connecting local customers with small and medium-sized enterprises (SMEs).
- **Default Theme**: Dark mode.
- **Backend**: None. The application is entirely client-side and uses mock data from `constants.ts`.

---

## 2. Core Technologies

- **Frontend Framework**: React (v19) with TypeScript.
- **Styling**: Tailwind CSS for utility-first styling.
- **UI Animation**: `react-tsparticles` for the animated "node map" background.
- **External APIs**:
  - **Google Gemini API**: Used via `@google/genai` for a natural language search feature (`findNearbyPlaces`) that uses the `googleMaps` grounding tool.
  - **Google Maps**: Currently disabled (API key required). Functionality is simulated with static images and external links.
- **Geolocation**: Browser's native `navigator.geolocation` API.

---

## 3. File & Directory Structure

- `index.html`: Main HTML entry point. Includes `importmap` for dependencies and Tailwind CSS CDN.
- `index.tsx`: Mounts the React application to the DOM.
- `App.tsx`: The root component, handling routing, theme, and layout.
- `types.ts`: Centralized TypeScript type definitions (`Shop`, `Product`, `ChatMessage`, etc.).
- `constants.ts`: Contains all mock data for the application (`MOCK_SHOPS`, `SHOP_TEMPLATES`).
- `services/geminiService.ts`: Contains the function to interact with the Gemini API.
- `hooks/useGeolocation.ts`: A custom hook to fetch the user's current location.
- `components/`: Directory for all React components.
  - `common/`: Reusable components (`Icons`, `Footer`, `ChatModal`, `ParticlesBackground`).
  - `CustomerView.tsx`: The main view for the customer role.
  - `VendorView.tsx`: The main view for the vendor role.
  - `ShopPortfolio.tsx`: A detailed view of a single shop.

---

## 4. Component Architecture & Responsibilities

### 4.1. Root Component (`App.tsx`)

- **Role Management**: Determines whether to render `CustomerView` or `VendorView` based on the `?role=vendor` URL query parameter. Defaults to 'customer'.
- **Layout**: Renders the main application layout, including the `Header`, `Footer`, and `ParticlesBackground`.
- **Global State**: Manages the dark/light theme and the state of the navigation menu.
- **Navigation**:
  - The header logo links to `/` (reloads to customer view).
  - The footer "For Vendors" link to `/?role=vendor` (reloads to vendor view).
  - A dropdown menu in the header provides static links.

### 4.2. Customer-Facing Components

- **`CustomerView.tsx`**:
  - **Primary View**: The default landing page for customers.
  - **State**: Manages the currently selected shop (to show portfolio), search query, API responses, and active filters.
  - **Features**:
    - **Search Bar**: Captures user input for the Gemini API search.
    - **Shop Filtering**: Filters `MOCK_SHOPS` by category or "Recommended".
    - **Shop Grid**: Displays a list of `ShopCard` components. The first shop is featured in a larger card.
    - **Map Placeholder**: Shows a static map image.
- **`ShopPortfolio.tsx`**:
  - **Primary View**: A detailed page for a single shop, displayed when a user clicks "View Shop" or "Directions".
  - **State**: Manages the "Saved" status and the state of the chat modal.
  - **Features**:
    - **Shop Details**: Displays hero image, name, category, and full product list.
    - **Actions**: "Get Directions" (links to Google Maps externally), "Save", and "Chat with Seller".
    - **Product Tagging**: Allows users to "tag" a product, which adds it to the chat conversation.
- **`common/ChatModal.tsx`**:
  - **Functionality**: A modal providing a simulated chat experience between a customer and a seller.
  - **Features**: Displays conversation history, accepts user text input, and can display tagged product cards. Simulates seller replies.

### 4.3. Vendor-Facing Components

- **`VendorView.tsx`**:
  - **Onboarding Flow**: Implements a two-step prototype experience.
    1.  **`ShopCreator`**: Displays a grid of `TemplateCard` components from `SHOP_TEMPLATES`. The user selects a template to create a mock shop.
    2.  **`VendorDashboard`**: Once a shop is "created", this view is shown. It displays a dashboard with simulated business data (stats, sales chart, inventory, orders).
  - **State**: Manages which of the two steps is active and holds the data for the `createdShop`.
  - **Features**: A "Create New Shop" button allows the user to reset the flow and return to the template selection screen.

---

## 5. Key User Journeys

### 5.1. Customer Journey

1.  **Discovery**: User lands on `CustomerView`. They see a search bar, shop filters, and a grid of nearby shops.
2.  **Exploration**: User filters the shops or clicks on a `ShopCard` to view details.
3.  **Details**: User is taken to the `ShopPortfolio` page for the selected shop.
4.  **Interaction**:
    - They can click "Get Directions" to open an external Google Maps link.
    - They can click "Chat with Seller" to open the `ChatModal`.
5.  **Communication/Ordering**: Inside the chat, the user can ask questions or tag products from the portfolio page to indicate interest or place an order.

### 5.2. Vendor Journey (Prototype)

1.  **Onboarding**: User navigates to `/?role=vendor` and sees the `ShopCreator` screen with several business templates.
2.  **Creation**: User clicks "Create This Shop" on a template.
3.  **Dashboard**: The app transitions to the `VendorDashboard`, which is fully populated with mock data based on the chosen template.
4.  **Exploration**: The user can interact with the mock inventory and view simulated analytics.
5.  **Reset**: The user can click "Create New Shop" to return to the template selection screen.
