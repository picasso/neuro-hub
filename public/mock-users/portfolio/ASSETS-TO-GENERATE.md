# Portfolio assets (60 files)

Status: JPEGs (quality 60) are in this directory (`mock-portfolio-ai-*.jpg`). Use this file to **regenerate** or replace assets.

Copy finished PNGs from the Cursor assets folder into this directory, then convert to JPEG q60:

`/Users/picasso/.cursor/projects/Users-picasso-Desktop-PSD-Coding-cursor-neuro-hub/assets/`

Target paths in repo: `public/mock-users/portfolio/<filename>`

URLs in `MOCK-USERS.md` use: `http://localhost:3000/mock-users/portfolio/<filename>`

## Naming

| Prefix | Count | Files |
| --- | --- | --- |
| `mock-portfolio-ai-art-` | 10 | `01`–`10` |
| `mock-portfolio-ai-avatar-` | 10 | `01`–`10` |
| `mock-portfolio-ai-edit-` | 10 | `01`–`10` |
| `mock-portfolio-ai-agent-` | 10 | `01`–`10` |
| `mock-portfolio-ai-mobile-` | 10 | `01`–`10` |
| `mock-portfolio-ai-video-` | 10 | `01`–`10` |

## Prompt hints (synthetic, no text, no logos, no real brands)

Use these as starting points; vary composition so each file is distinct.

### AI art (`mock-portfolio-ai-art-NN.jpg`)

- Cinematic sci-fi city, dusk, neon reflections, wide shot
- Fantasy forest, bioluminescent plants, painterly
- Abstract organic shapes, bold gradient background, editorial illustration
- Character silhouette hero pose, stylized armor, painterly
- Cozy solarpunk village, warm light, detailed environment
- Underwater ruins, rays of light, surreal atmosphere
- Desert nomad camp, twin moons, epic scale
- Steampunk airship dock, brass and copper tones
- Minimal geometric poster art, limited palette
- Dreamlike cloud architecture, soft pastels

### AI avatar (`mock-portfolio-ai-avatar-NN.jpg`)

- 3D stylized avatar bust, studio lighting, neutral backdrop
- VTuber-style character head, soft rim light
- RPG character portrait frame, fantasy race, no readable runes
- Cartoon mascot head, friendly, brand-free shapes
- Cybernetic humanoid portrait, subtle glow, clean background
- Low-poly character portrait, pastel materials
- Hand-painted portrait, semi-realistic, fantasy clothing
- Chibi character bust, big expressive eyes
- Realistic digital double bust, casual outfit, neutral gray
- Alien explorer portrait, whimsical, colorful

### AI image editing (`mock-portfolio-ai-edit-NN.jpg`)

- Single frame: product on marble, soft shadow, commercial look
- Fashion portrait retouch: smooth skin, natural texture preserved
- Before/after implied in one image: split scene restored vs damaged photo aesthetic (no text labels)
- Food photo color grade: warm appetizing tones
- Real estate window pull: balanced interior and exterior exposure
- Jewelry macro: crisp reflections, clean background
- Landscape sky replacement: dramatic clouds, natural horizon
- Old photo restoration style: cleaner details, same pose
- Background removal style: subject isolated on flat color
- Poster composite: athlete mid-action, dynamic light streaks, no logos

### AI agents (`mock-portfolio-ai-agent-NN.jpg`)

- Clean dashboard UI mock: inbox, tasks, metrics cards, placeholder rectangles not readable text
- Workflow diagram style: nodes and edges, abstract icons only
- Chat support console UI: message bubbles as gray blocks
- Analytics screen: charts as generic shapes, no labels
- Agent orchestration map: multiple service tiles, abstract
- RAG pipeline schematic: documents to embeddings blocks, abstract
- Automation timeline UI: steps as numbered circles without words
- CRM-style panel: columns of cards, lorem-free gray blocks
- Monitoring dashboard: status lights and graphs, abstract
- Voice agent settings UI: sliders and toggles, generic

### AI mobile (`mock-portfolio-ai-mobile-NN.jpg`)

- Mobile fitness app UI on phone mockup, dark mode, abstract icons
- Banking app home screen mockup, minimal, no bank names
- Chat app UI, colorful bubbles without letters
- E-commerce product grid on phone, generic items
- Meditation app UI, soft gradients, simple glyphs
- Ride-hailing map UI stylized, no street names
- Social feed UI, image cards as colored rectangles
- Onboarding screens collage, three phones
- Settings screen iOS-like, generic toggles
- Widget home screen aesthetic, abstract widgets

### AI video (`mock-portfolio-ai-video-NN.jpg`)

- Film still style: cyber alley, anamorphic flare, no readable signs
- Product spin frame: bottle on turntable, seamless backdrop
- Music video still: abstract laser lights, silhouette dancer
- Corporate explainer frame: 3D isometric city, soft depth of field
- Nature B-roll frame: slow-motion leaves, golden hour
- Sci-fi hologram table scene, characters as silhouettes
- Motion graphics still: flowing ribbons, gradient background
- Documentary interview frame: blurred background bokeh
- Title sequence still: metallic 3D letters as abstract shapes only (no words)
- Drone landscape frame: coastline, cinematic grade

## Copy command (after generation)

```bash
ASSETS="$HOME/.cursor/projects/Users-picasso-Desktop-PSD-Coding-cursor-neuro-hub/assets"
DEST="/Users/picasso/Desktop/__PSD/Coding/cursor/neuro-hub/public/mock-users/portfolio"
cp -f "$ASSETS"/mock-portfolio-ai-*.png "$DEST/"
for f in "$DEST"/mock-portfolio-ai-*.png; do
  [ -f "$f" ] || continue
  sips -s format jpeg -s formatOptions 60 "$f" --out "${f%.png}.jpg" >/dev/null
  rm -f "$f"
done
```
