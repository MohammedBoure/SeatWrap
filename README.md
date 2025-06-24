# SeatWrap PhoneBook Application

## Overview
| **Creator** | **Preview** |
|-------------|-------------|
| [Anes Bouabda](https://github.com/anesbo)) | [Live Demo](https://seatwrap.onrender.com/) |

SeatWrap is a React-based phonebook application built with TypeScript and Vite. It allows users to manage contacts by adding, editing, deleting, searching, and filtering entries. The application uses IndexedDB for persistent data storage and supports light/dark theme toggling, data export/import, and infinite scrolling for contact display.

## Features
- **Add Contacts**: Add new contacts with name, phone, description, price, completion status, and date.
- **Edit/Delete Contacts**: Modify or remove existing contacts.
- **Search and Filter**: Search contacts by name, phone, description, or price, and filter by completion status or date.
- **Infinite Scroll**: Load more contacts as the user scrolls.
- **Theme Toggle**: Switch between light and dark themes, with preferences saved in localStorage.
- **Data Export/Import**: Export contacts as a JSON file and import from JSON.
- **Responsive Design**: Styled with Tailwind CSS and custom styles for a polished UI.

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Database**: IndexedDB (via `db.ts`)
- **Styling**: Tailwind CSS, custom CSS (`style.css`)
- **Dependencies**:
  - `react-datepicker` for date selection
  - `react-icons` for icons
  - ESLint for linting
  - Vite for build and development

## Directory Structure
```
SeatWrap/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.tsx           # Main application component
│   ├── db.ts            # IndexedDB logic for CRUD operations
│   ├── main.tsx         # Entry point for React app
│   ├── style.css        # Custom styles
│   ├── vite-env.d.ts    # Vite environment types
├── .gitignore           # Git ignore file
├── README.md            # Project documentation
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML entry point
├── package-lock.json    # Lock file for npm dependencies
├── package.json         # Project metadata and dependencies
├── tsconfig.app.json    # TypeScript configuration for app
├── tsconfig.json        # General TypeScript configuration
├── tsconfig.node.json   # TypeScript configuration for Node
└── vite.config.ts       # Vite configuration
```

## Installation
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SeatWrap
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

## Usage
- **Add a Contact**: Fill in the form in the "Add Contact" section and click "Add".
- **Edit a Contact**: Click "Edit" on a contact to open the edit panel, modify fields, and click "Save".
- **Delete a Contact**: Click "Delete" on a contact or in the edit panel.
- **Search and Filter**: Use the search input to find contacts by any field, filter by completion status using checkboxes, or select a date to filter by.
- **Toggle Theme**: Click the theme button in the sidebar to switch between light and dark modes.
- **Export/Import Data**: Use the sidebar to export contacts as JSON or import from a JSON file.

## Notes
- The application uses IndexedDB for local storage, so data persists in the browser.
- Ensure the JSON file for import follows the `Person` interface structure:
  ```typescript
  {
    id?: number;
    name: string;
    phone: string;
    description: string;
    price: string;
    date?: string;
    done?: boolean;
  }
  ```
- The date format is `DD/MM/YYYY`.

## Future Improvements
- Add sorting options for contacts (e.g., by name, date).
- Implement pagination as an alternative to infinite scroll.
- Add validation for phone numbers and other fields.
- Support for multiple languages.

## License
This project is licensed under the MIT License.