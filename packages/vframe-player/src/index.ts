export type VFramePlayerOptions = {
  dom?: HTMLElement;
  imgArr?: string[];
  fps?: number;
  loop?: number;
  yoyo?: boolean;
  preload?: boolean;
  autoplay?: boolean;
  onPlay?: () => void;
  onPaused?: () => void;
  onEnd?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onLoad?: () => void;
  onOptionsChange?: (options: VFramePlayerOptions) => void;
  onComplete?: () => void;
  onCompleteOne?: () => void;
  onCompleteHalf?: () => void;
  onFrameEnter?: (frame: number) => void;
};

export default class VFramePlayer {
  private loaded = false;
  private loading = false;

  private imgs: HTMLImageElement[] = [];
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private maxImgWidth = 0;
  private maxImgHeight = 0;

  private currentFrame = 0;
  private lastFrameTime = 0;
  private frameInterval = 0;
  private isPaused = true;
  private isEnd = false;
  private pausedTime = 0;
  private isYoYo = false;
  private loopCount = 1;
  public loop = 1;

  private startFrame = 0;
  private endFrame = 0;

  public get frameCount() {
    return this.imgs.length;
  }

  constructor(public options: VFramePlayerOptions) {
    this.options.onOptionsChange?.(this.options);
    if (options.autoplay) {
      this.play();
    }
    if (options.preload) {
      this.preload();
    }
  }

  private async preload() {
    if (this.loaded || this.loading) {
      return;
    }
    try {
      this.loading = true;
      await this.loadImgs();
      await this.createCanvas();
      this.frameInterval = 1000 / (this.options.fps || 30);
      this.loop = this.options.loop ?? 1;
      this.goto(0);
      this.loaded = true;
      this.options.onLoad?.();
    } finally {
      this.loading = false;
    }
  }

  private async loadImgs() {
    this.imgs = await Promise.all(
      this.options.imgArr?.map(async (imgUrl) => {
        return await new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = imgUrl;
          img.onload = () => resolve(img);
        });
      }) || []
    );
    const widths = this.imgs.map((img) => img.width);
    const heights = this.imgs.map((img) => img.height);
    this.maxImgWidth = Math.max(Number.NEGATIVE_INFINITY, ...widths);
    this.maxImgHeight = Math.max(Number.NEGATIVE_INFINITY, ...heights);
    this.endFrame = this.frameCount - 1;
  }

  private async createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.maxImgWidth;
    canvas.height = this.maxImgHeight;

    if (this.options.dom) {
      const { width, height } = this.options.dom.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      Object.assign(canvas.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${width}px`,
        height: `${height}px`,
      });
      this.options.dom.appendChild(canvas);
    }

    this.ctx = canvas.getContext('2d')!;
    this.canvas = canvas;
  }

  private renderFrame(frame: number) {
    if (frame < this.startFrame || frame > this.endFrame) {
      return;
    }

    const img = this.imgs[frame];
    const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height);

    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      img,
      (this.canvas.width - imgWidth) / 2,
      (this.canvas.height - imgHeight) / 2,
      imgWidth,
      imgHeight
    );

    this.currentFrame = frame;
    this.lastFrameTime = Date.now();
  }

  private async renderNextFrame() {
    if (this.isPaused) {
      return;
    }

    if (this.lastFrameTime && Date.now() - this.lastFrameTime < this.frameInterval) {
      requestAnimationFrame(() => this.renderNextFrame());
      return;
    }

    if (this.currentFrame < this.startFrame) {
      this.currentFrame = this.startFrame;
    } else if (this.currentFrame > this.endFrame) {
      this.currentFrame = this.endFrame;
    }

    this.options.onFrameEnter?.(this.currentFrame);
    this.renderFrame(this.currentFrame);
    if (this.currentFrame === this.endFrame) {
      if (!this.options.yoyo) {
        this.options.onCompleteOne?.();
      } else {
        this.options.onCompleteHalf?.();
      }

      if (this.options.yoyo) {
        this.isYoYo = true;
      } else if (this.loop <= 0 || this.loopCount < this.loop) {
        this.currentFrame = -1;
        this.loopCount += 1;
      } else {
        this.end();
        return;
      }
    }

    if (this.currentFrame === this.startFrame && this.isYoYo) {
      this.options.onCompleteOne?.();
      this.isYoYo = false;
      if (this.loop <= 0 || this.loopCount < this.loop) {
        this.loopCount += 1;
      } else {
        this.end();
        return;
      }
    }

    this.currentFrame += this.isYoYo ? -1 : 1;
    requestAnimationFrame(() => this.renderNextFrame());
  }

  private setPaused(isPaused: boolean) {
    this.isPaused = isPaused;
    this.options.onPlayStateChange?.(!isPaused);
  }

  private end() {
    this.setPaused(true);
    this.isEnd = true;
    this.options.onEnd?.();
    this.options.onComplete?.();
  }

  public play(start?: number, end?: number) {
    if (!this.loaded) {
      this.preload().then(() => this.play());
    } else {
      if (start !== undefined || end !== undefined) {
        this.startFrame = Math.max(0, Math.min(this.frameCount - 1, start ?? 0));
        this.endFrame = Math.min(this.frameCount - 1, Math.max(0, end ?? this.frameCount - 1));
        this.currentFrame = this.startFrame;
      }

      if (this.isEnd) {
        this.currentFrame = this.startFrame;
        this.isEnd = false;
        this.loopCount = 1;
      }

      if (this.pausedTime && this.lastFrameTime) {
        this.lastFrameTime += Date.now() - this.pausedTime;
        this.pausedTime = 0;
      }

      this.setPaused(false);
      this.options.onPlay?.();
      this.renderNextFrame();
    }
  }

  public goto(frame: number) {
    if (frame < this.startFrame || frame > this.endFrame) {
      return;
    }
    this.renderFrame(frame);
  }

  public pause() {
    this.setPaused(true);
    this.options.onPaused?.();
  }

  public set<K extends keyof VFramePlayerOptions>(key: K, value: VFramePlayerOptions[K]) {
    this.options[key] = value;
    this.options.onOptionsChange?.(this.options);

    if (key === 'loop') {
      this.loop = (value as number) ?? 1;
    }
  }
}
