import Neuron from "./neuron.js";

// Create a simple network of neurons
const neuronA = new Neuron([], 2.0, 4.0);
const neuronB = new Neuron([neuronA], 1.3, 2.0);
const neuronC = new Neuron([neuronA], 2.1, 2.5);

// Expose neurons for visualization
export const neurons = [
  { neuron: neuronA, label: "A", x: 400, y: 150 },
  { neuron: neuronB, label: "B", x: 250, y: 350 },
  { neuron: neuronC, label: "C", x: 550, y: 350 },
];

// Edges: source fires → sends charge to target
export const edges = [
  { from: 1, to: 0 }, // B → A
  { from: 2, to: 0 }, // C → A
];

// Simulate the network (infinite)
setInterval(() => {
  neuronB.integrate(0.5); // B receives a small charge
  neuronC.integrate(0.3); // C receives a smaller charge
}, 100);
