# Portfolio Gallery

UI components for rendering a mixed-media portfolio gallery.

## Components

### `Portfolio`

High-level component that renders a columns-based responsive grid (via `PortfolioAlbum`) and a
modal viewer (via `PortfolioViewer`). It is fully client-side (`'use client'`) because it manages
the open index internally.

**Props**

- `items: MediaItem[]`

**Mixed media behavior**

- **Images** (`mediaType` starts with `image/`):
  - rendered as real previews
  - aspect ratio is preserved using `mediaWidth` / `mediaHeight`
- **Videos** (`video/*`): placeholder tile in the grid (16:9)
- **Audio** (`audio/*`): placeholder tile in the grid (1:1)
- **PDF** (`application/pdf`): placeholder tile in the grid (1:1)
- **Unknown**: placeholder tile in the grid (1:1)

**Data requirements**

For best layout quality, provide dimensions for images:

- `mediaWidth: number`
- `mediaHeight: number`

These fields are stored in the database (`portfolio_items.media_width/media_height`) and should be sent during item creation (MVP: compute on the client after file selection).

### `PortfolioAlbum`

Pure grid component powered by `react-photo-album` (Columns layout). Use this if you want a
controlled viewer or custom open behavior.

**Props**

- `items: MediaItem[]`
- `spacing?: number` (defaults to 6)
- `onOpen?: (index: number) => void`

### `PortfolioViewer`

Controlled modal viewer with next/prev navigation and keyboard support.

**Import:** `@/components/ui/portfolio-viewer` (not exported from the barrel). It uses React hooks,
so it must only be used from Client Components.

**Props**

- `items: MediaItem[]`
- `openIndex: number | null` — `null` means closed
- `onChangeIndex: (index: number) => void`
- `onClose: () => void`
- `borderRadius?: number`

**Keyboard**

- `ArrowLeft` / `ArrowRight`: previous / next item
- `Escape`: close

## Example

```tsx
'use client'

import { Portfolio, type MediaItem } from '@/components/ui'

const items: MediaItem[] = [
    {
        id: 'image-1',
        title: 'Demo image',
        mediaUrl: '/playground/pictures/athabasca-river-sunset.jpg',
        mediaType: 'image/jpeg',
        mediaWidth: 1787,
        mediaHeight: 1080,
    },
    {
        id: 'video-1',
        title: 'Video item',
        mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        mediaType: 'video/mp4',
    },
]

export function PortfolioExample() {
    return <Portfolio items={items} />
}
```
