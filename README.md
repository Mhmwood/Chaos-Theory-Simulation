
# The link  https://chaos-theory-simulation.netlify.app/

# Chaos Theory: An Interactive Double Pendulum Simulation

This project is an interactive web application that visualizes the chaotic motion of the double pendulum, a classic example of the butterfly effect. Built with Next.js and rendered on an HTML5 Canvas, this simulation allows you to explore how tiny changes in initial conditions can lead to vastly different outcomes.

## Key Features

- **Real-time Simulation**: Watch the mesmerizing and unpredictable paths of double pendulums unfold in real-time.
- **Multiple Independent Systems**: Add multiple pendulums to the canvas, each with its own unique starting conditions, and watch them evolve simultaneously.
- **Dynamic Controls**: A slide-out control panel allows you to modify the physics and appearance of each pendulum on the fly.
  - **Physics Parameters**: Adjust the length and mass of both pendulum arms.
  - **Appearance**: Use color pickers to customize the color of the pendulum and its trace line.
- **Sync Physics**: Instantly apply the physics parameters from one pendulum to all others for controlled experiments.
- **Interactive Canvas**: Zoom in and out to get a closer look at the intricate patterns or see the full scope of the chaos.
- **Responsive Design**: The application is fully responsive and works beautifully on both desktop and mobile devices.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Animation**: HTML5 Canvas API & `requestAnimationFrame`
- **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
