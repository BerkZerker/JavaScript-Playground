// A Spiking neuron modeled in javascript

export default class Neuron {
  constructor(connections, threshold, decay) {
    // connections: neurons this neuron sends spikes TO
    this.connections = connections;
    // inputs: tracked automatically — who sends spikes to THIS neuron, with weights
    this.inputs = []; // [{neuron, weight}, ...]
    this.threshold = threshold;
    this.decay = decay;
    this.charge = 0.0;
    this.lastUpdate = Date.now();
    this.onFire = null;
    this.onCharge = null;
    this.learningRate = 0.05;

    // Register this neuron as an input on each connection target
    connections.forEach((target) => {
      target.inputs.push({ neuron: this, weight: 1.0 });
    });
  }

  integrate(charge) {
    this.updateDecay(); // apply decay before integrating new charge
    this.charge += charge;
    if (this.onCharge) this.onCharge(this.charge);
    if (this.charge >= this.threshold) {
      this.fire();
      this.charge = 0.0; // reset charge after firing
      if (this.onCharge) this.onCharge(0);
    }
  }

  fire() {
    if (this.onFire) this.onFire();
    this.train();
    this.connections.forEach((target) => {
      // Find our weight on the target
      const input = target.inputs.find((i) => i.neuron === this);
      const weight = input ? input.weight : 1.0;
      target.integrate(weight);
    });
  }

  train() {
    // Hebbian: strengthen inputs that recently fired (charge near 0 = just reset)
    this.inputs.forEach((input) => {
      const ratio = input.neuron.charge / input.neuron.threshold;
      if (ratio < 0.2) {
        // Input recently fired — it contributed to this spike
        input.weight += this.learningRate;
      }
    });
  }

  updateDecay() {
    const now = Date.now();
    const elapsed = (now - this.lastUpdate) / 1000;
    this.charge = Math.max(0, this.charge - (this.threshold / this.decay) * elapsed);
    this.lastUpdate = now;
  }
}
