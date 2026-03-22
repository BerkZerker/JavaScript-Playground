// A Spiking neuron modeled in javascript

export default class Neuron {
  constructor(connections, threshold, decay) {
    this.connections = connections;
    this.threshold = threshold;
    this.decay = decay;
    this.charge = 0.0;
    this.lastUpdate = Date.now();
    this.onFire = null;
    this.onCharge = null;
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
    this.updateDecay(); // apply decay before firing
    this.connections.forEach((neuron) => {
      neuron.integrate(1.0); // send a charge of 1.0 to connected neurons
    });
  }

  updateDecay() {
    const now = Date.now();
    const elapsed = (now - this.lastUpdate) / 1000;
    this.charge = Math.max(0, this.charge - (this.threshold / this.decay) * elapsed);
    this.lastUpdate = now;
  }
}
