type Subscriber = (frame: string) => void;

const frames = ['▙', '▛', '▜', '▟'];

class LoadingAnimationController {
  private subscribers = new Set<Subscriber>();
  private frameIndex = 0;
  private lastUpdate = Date.now();
  private rafId: number | null = null;

  start() {
    const tick = () => {
      const now = Date.now();
      if (now - this.lastUpdate >= 400) {
        this.frameIndex = (this.frameIndex + 1) % frames.length;
        const current = frames[this.frameIndex];
        this.subscribers.forEach((sub) => sub(current));
        this.lastUpdate = now;
      }
      this.rafId = requestAnimationFrame(tick);
    };

    if (!this.rafId) {
      this.rafId = requestAnimationFrame(tick);
    }
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.add(subscriber);
    subscriber(this.getCurrentFrame());

    if (this.subscribers.size === 1) this.start();

    return () => {
      this.subscribers.delete(subscriber);
      if (this.subscribers.size === 0) this.stop();
    };
  }

  getCurrentFrame() {
    return frames[this.frameIndex];
  }
}

export const loadingController = new LoadingAnimationController();
