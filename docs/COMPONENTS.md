# Component Documentation

This document provides detailed information about the UI components used in the Apify Web Interface.

## 🧩 Component Library

The application uses a combination of [Radix UI](https://www.radix-ui.com/) primitives and custom components built with Tailwind CSS.

## 📁 Component Structure

```
components/
├── ui/                      # Base UI components
│   ├── button.tsx          # Button component
│   ├── data-modal.tsx      # Results display modal
│   ├── dialog.tsx          # Dialog primitives
│   ├── dropdown-menu.tsx   # Dropdown menu
│   ├── input.tsx           # Input component
│   ├── loading-spinner.tsx # Loading spinner
│   ├── sonner.tsx          # Toast notifications
│   ├── table.tsx           # Table component
│   └── theme-switcher.tsx  # Theme toggle
└── theme-provider.tsx      # Theme context provider
```

## 🎨 Core Components

### Button

A versatile button component with multiple variants and sizes.

**Location**: `components/ui/button.tsx`

**Props:**

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

**Usage:**

```tsx
import { Button } from "@/components/ui/button";

// Basic usage
<Button onClick={handleClick}>Click me</Button>

// With variants
<Button variant="outline" size="sm">Small Outline</Button>
<Button variant="destructive">Delete</Button>

// Loading state
<Button disabled={loading}>
  {loading ? "Loading..." : "Submit"}
</Button>
```

**Variants:**

- `default` - Primary blue button
- `destructive` - Red button for dangerous actions
- `outline` - Outlined button
- `secondary` - Secondary gray button
- `ghost` - Transparent button
- `link` - Text link style

---

### Input

A styled input component with proper focus states.

**Location**: `components/ui/input.tsx`

**Props:**

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

**Usage:**

```tsx
import { Input } from "@/components/ui/input";

<Input
  placeholder="Enter API key"
  value={apiKey}
  onChange={(e) => setApiKey(e.target.value)}
  type="password"
/>;
```

**Features:**

- Consistent styling across the app
- Focus ring for accessibility
- Proper padding and borders
- Dark mode support

---

### Dialog

Modal dialog component built on Radix UI primitives.

**Location**: `components/ui/dialog.tsx`

**Components:**

- `Dialog` - Root dialog component
- `DialogTrigger` - Button to open dialog
- `DialogContent` - Main dialog content
- `DialogHeader` - Dialog header section
- `DialogTitle` - Dialog title
- `DialogDescription` - Dialog description
- `DialogFooter` - Dialog footer section

**Usage:**

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here.</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>;
```

---

### DataModal

A specialized modal for displaying dataset results in a table format.

**Location**: `components/ui/data-modal.tsx`

**Props:**

```typescript
interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>[];
  title?: string;
}
```

**Usage:**

```tsx
import { DataModal } from "@/components/ui/data-modal";

<DataModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  data={resultsData}
  title="Scraped Results"
/>;
```

**Features:**

- Automatically generates table headers from data keys
- Handles different data types (objects, arrays, primitives)
- Responsive table with horizontal scrolling
- Hover tooltips for long content
- Row numbering
- Truncated text with full content on hover

---

### Table

A comprehensive table component for displaying structured data.

**Location**: `components/ui/table.tsx`

**Components:**

- `Table` - Root table wrapper
- `TableHeader` - Table header section
- `TableBody` - Table body section
- `TableFooter` - Table footer section
- `TableRow` - Table row
- `TableHead` - Header cell
- `TableCell` - Data cell
- `TableCaption` - Table caption

**Usage:**

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>
          <Button size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>;
```

---

### Theme Switcher

A toggle component for switching between light and dark themes.

**Location**: `components/ui/theme-switcher.tsx`

**Usage:**

```tsx
import { ModeToggle } from "@/components/ui/theme-switcher";

<ModeToggle />;
```

**Features:**

- Sun/moon icons
- Smooth transition animations
- Saves preference to localStorage
- Respects system theme preference

---

### Loading Spinner

A simple loading spinner component.

**Location**: `components/ui/loading-spinner.tsx`

**Props:**

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

**Usage:**

```tsx
import { LoadingSpinner } from "@/components/ui/loading-spinner";

<LoadingSpinner size="md" />;
```

---

### Dropdown Menu

A dropdown menu component built on Radix UI.

**Location**: `components/ui/dropdown-menu.tsx`

**Components:**

- `DropdownMenu` - Root menu component
- `DropdownMenuTrigger` - Button to open menu
- `DropdownMenuContent` - Menu content wrapper
- `DropdownMenuItem` - Individual menu item
- `DropdownMenuSeparator` - Visual separator
- `DropdownMenuLabel` - Menu section label

**Usage:**

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

## 🎨 Styling System

### Tailwind CSS

The components use Tailwind CSS for styling with a custom design system:

**Colors:**

- Primary: Blue (`bg-blue-600`, `text-blue-600`)
- Secondary: Gray (`bg-gray-100`, `text-gray-600`)
- Success: Green (`bg-green-100`, `text-green-800`)
- Error: Red (`bg-red-100`, `text-red-800`)
- Warning: Yellow (`bg-yellow-100`, `text-yellow-800`)

**Spacing:**

- Small: `p-2`, `m-2`, `gap-2`
- Medium: `p-4`, `m-4`, `gap-4`
- Large: `p-6`, `m-6`, `gap-6`

**Typography:**

- Headings: `text-lg font-semibold`, `text-xl font-bold`
- Body: `text-sm`, `text-base`
- Captions: `text-xs text-gray-500`

### CSS Variables

The theme system uses CSS variables defined in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme variables */
}
```

## 🔧 Component Development

### Creating New Components

1. **Create the component file:**

   ```bash
   # For UI components
   touch components/ui/new-component.tsx

   # For feature components
   touch components/new-feature-component.tsx
   ```

2. **Basic component template:**

   ```tsx
   import React from "react";
   import { cn } from "@/lib/utils";

   interface NewComponentProps {
     className?: string;
     children?: React.ReactNode;
   }

   export function NewComponent({
     className,
     children,
     ...props
   }: NewComponentProps) {
     return (
       <div className={cn("base-styles", className)} {...props}>
         {children}
       </div>
     );
   }
   ```

3. **Add to index (if needed):**
   ```tsx
   // components/ui/index.ts
   export { NewComponent } from "./new-component";
   ```

### Component Guidelines

**Naming Convention:**

- Use PascalCase for component names
- Use kebab-case for file names
- Export as named exports

**Props Interface:**

- Always define TypeScript interfaces for props
- Extend HTML element props when applicable
- Use optional props with default values

**Styling:**

- Use Tailwind CSS classes
- Support className prop for customization
- Use the `cn()` utility for conditional classes

**Accessibility:**

- Include proper ARIA attributes
- Support keyboard navigation
- Provide semantic HTML structure

### Testing Components

**Example test file:**

```tsx
// components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="outline">Outline Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-input");
  });
});
```

## 📚 Component Reference

### Class Utilities

**cn() function** (from `lib/utils.ts`):

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage:**

```tsx
// Combine conditional classes
<div
  className={cn(
    "base-class",
    isActive && "active-class",
    variant === "primary" && "primary-class",
    className
  )}
/>
```

### Variant Utilities

**cva() function** (Class Variance Authority):

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

This component system provides a solid foundation for building consistent, accessible, and maintainable UI components across the application.
