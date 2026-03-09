class AppAudioManager {
  private buffers = new Map<string, AudioBuffer>();
  private current?: {
    source: AudioBufferSourceNode;
    gain: GainNode;
  };
  private loading = new Set<string>();

  isLoaded(key: string) {
    return this.buffers.has(key);
  }

  isLoading(key: string) {
    return this.loading.has(key);
  }

  async load(
    key: string,
    url: string,
    ctx: AudioContext,
    onProgress?: (percentage: number) => void,
  ) {
    if (this.buffers.has(key)) {
      onProgress?.(100);
      return;
    }

    this.loading.add(key);

    try {
      const response = await fetch(url);

      // 1. Get the total file size from headers
      const contentLength = +(response.headers.get("Content-Length") ?? 0);
      const reader = response.body?.getReader();

      if (!reader) throw new Error("Failed to get reader");

      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      // 2. Read the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (contentLength && onProgress) {
          const pct = Math.round((receivedLength / contentLength) * 100);
          onProgress(pct);
        }
      }

      // 3. Combine chunks into a single ArrayBuffer
      const chunksAll = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
      }

      // 4. Decode the final buffer
      const buf = await ctx.decodeAudioData(chunksAll.buffer);
      this.buffers.set(key, buf);
    } catch (error) {
      console.error("Audio Load Error:", error);
    } finally {
      this.loading.delete(key);
    }
  }
  // async load(key: string, url: string, ctx: AudioContext) {
  //   if (this.buffers.has(key)) return;

  //   this.loading.add(key);

  //   try {
  //     const res = await fetch(url);
  //     const buf = await ctx.decodeAudioData(await res.arrayBuffer());
  //     this.buffers.set(key, buf);
  //   } finally {
  //     this.loading.delete(key);
  //   }
  // }

  playLoop(key: string, output: AudioNode, volume = 1) {
    this.stop();

    const ctx = output.context;

    const source = ctx.createBufferSource();
    source.buffer = this.buffers.get(key)!;
    source.loop = true;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(output); // ✅ NOT destination

    source.start();

    this.current = { source, gain };
  }

  setVolume(v: number) {
    if (!this.current) return;
    this.current.gain.gain.value = Math.max(0, Math.min(1, v));
  }

  setVolumeSmooth(v: number, time = 0.5) {
    if (!this.current) return;

    const gainNode = this.current.gain;
    const gainParam = gainNode.gain;
    const now = gainNode.context.currentTime;

    gainParam.cancelScheduledValues(now);
    gainParam.setValueAtTime(gainParam.value, now);
    gainParam.linearRampToValueAtTime(Math.max(0, Math.min(1, v)), now + time);
  }

  stop() {
    if (!this.current) return;
    this.current.source.stop();
    this.current.source.disconnect();
    this.current.gain.disconnect();
    this.current = undefined;
  }
}

export const appAudioManager = new AppAudioManager();
