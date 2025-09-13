# **App Name**: ChoreoGraph

## Core Features:

- Canvas Rendering: Use Canvas (2D) to render custom shapes and lines based on user-defined parameters.
- Draggable Controls: Implement draggable control points (circles) that the user can manipulate to change the visualization.
- Dynamic Pattern Update: Dynamically update the entire pattern in real-time as the control points are moved.
- Pattern Reset: Provide a Reset button to restore the visualization to its default layout.
- Pattern Randomization: Provide a Randomize button to generate a new pattern from scratch, powered by a noise generator tool.
- Parameter Input: Allow users to input numeric parameters or seed values to generate deterministic patterns.
- Save as Image: Implement a feature to export the current visualization as a PNG or JPEG image.

## Style Guidelines:

- The Color Anchor is controlled chaos. Use a dark color scheme to allow intricate fractal patterns to stand out, reminiscent of cosmic backgrounds. Primary color: Vibrant purple (#BE29EC) to represent energy and transformation.
- Background color: Dark grey (#262A2E), almost black, to provide contrast and depth.
- Accent color: Electric blue (#29A6EC) for interactive elements and highlights.
- Font: 'Space Grotesk', a sans-serif font with a modern tech-oriented appearance suitable for headlines and short blocks of text.
- Maximize canvas area for fractal display, with controls accessible via a minimal interface. Arrange controls logically, providing adequate spacing for comfortable manipulation. Reset and Randomize buttons should stand out distinctly.
- Implement smooth transitions with Framer Motion when nodes are moved, for a fluid user experience. Stagger element appearance/disappearance with subtle delays.
- Use clear, minimalist icons for controls. Icons should be high-contrast against the dark background.