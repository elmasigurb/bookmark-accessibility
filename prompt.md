# BOOKMARK — Book Discovery Website

## Project Overview

Create a responsive, visually appealing book discovery website called **BOOKMARK**, inspired by platforms such as Goodreads.

**Tagline:** Your next favourite read starts here.

The website allows users to discover books, search by title or author, view detailed book information, save books to a reading list and sign up for a reading club.

The goal is to create a modern, editorial-style website with a strong emphasis on typography, book cover imagery and an intuitive user experience.

## Design System

Use the existing Module 3 style guide as the visual foundation.

Reference image: `references/module3-style-guide.png`

### Colours
- Primary: `#44020E` — Deep burgundy
- Secondary: `#FFEFF0` — Soft blush pink
- Background: `#FFFFFF` — White

### Typography
- Headings: DM Serif Display
- Body text: Inter
- Labels and emphasized text: Inter Bold

### Design Details
- Border radius: 14px
- Burgundy primary buttons with white text
- Soft pink cards and containers
- White content areas
- Spacious layouts and consistent padding
- Clean, minimal icons
- Responsive layouts for desktop, tablet and mobile

The design should feel like a contemporary independent bookstore or literary magazine rather than a traditional online store.

## Data

Create a JSON file containing at least eight books.

Include the following books:

1. The Midnight Library — Matt Haig
2. Normal People — Sally Rooney
3. The Seven Husbands of Evelyn Hugo — Taylor Jenkins Reid
4. The Silent Patient — Alex Michaelides
5. A Little Life — Hanya Yanagihara
6. The Song of Achilles — Madeline Miller
7. It Ends with Us — Colleen Hoover
8. The Housemaid — Freida McFadden

Each book should include:
- Unique ID
- Title
- Author
- Genre
- Publication year
- Cover image
- Short description
- Detailed description

Use accurate book information and appropriate cover images.

## Page Structure

The website must include:

- A header with the BOOKMARK logo
- A skip link to the main content
- Navigation linking to all three main sections
- A main content area
- A footer
- Exactly one h1
- A logical heading hierarchy without skipped heading levels

## Section 1 — Discover Books

Create a searchable collection of books.

Requirements:

- A search field visibly labelled "Search"
- Search functionality filtering books by title or author
- A responsive grid of book cards
- Each card must display the book cover, title and author
- Each result must have a heading
- Each result must have an icon-only save button
- Save buttons must have accessible names such as "Save The Midnight Library"
- Display the number of matching search results
- Announce changes to the result count to assistive technologies

Users should be able to open a book's details by selecting its result.

## Section 2 — Book Details

Create a details dialog that opens when a book is selected.

Display:
- Book cover
- Title
- Author
- Genre
- Publication year
- Detailed description

Requirements:

- Keyboard focus moves into the dialog when opened
- The dialog can be closed using Escape
- Include a visible "Close" button
- When closed, keyboard focus returns to the result that opened the dialog

## Section 3 — Join the Reading Club

Create a sign-up form for a fictional BOOKMARK reading club.

The form must contain:

- Name
- Email
- Favourite genre (select or radio buttons)
- Consent checkbox
- Submit button

Requirements:

- Validate required fields
- Display text-based validation errors next to the relevant fields
- Only show validation errors after the user has attempted to interact with or submit the form
- Display a success message after valid submission

The form is a demonstration and does not require a backend or actual email subscription service.

## Main User Task

The primary task for testing is:

**Search for The Midnight Library, open its details, close the dialog, save the book and sign up for the reading club.**

## Technical Requirements

- Use HTML, CSS and JavaScript
- Store book information in a JSON file
- Load and display book data dynamically
- Use semantic HTML
- Make the website responsive
- Follow the accessibility decisions documented in `spec.md`
- Keep the implementation understandable and maintainable

## Project Constraints

The website will be implemented twice:

- Project A: Without a custom accessibility skill
- Project B: With a custom accessibility skill

Both implementations must use this exact prompt, the same design reference and the same accessibility specification.

The purpose is to compare the accessibility outcomes of the two implementations.

Do not modify this prompt between builds.