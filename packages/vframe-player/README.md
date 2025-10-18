# @leexiaohui/vframe-player

基于 Canvas 的轻量级序列帧图片播放器。以最小 API 提供帧率控制、循环/往返播放、播放区间、预加载与事件钩子，适合产品动效、分镜浏览、3D/AR 截帧预览等场景。

- 纯 TypeScript，零依赖，支持 Tree-shaking
- Canvas 居中缩放，适配不同尺寸图片
- 循环播放（`loop`），支持无限循环与次数控制
- 往返播放（`yoyo`），前进到尾帧再倒序回到首帧
- 帧率控制（`fps`），按时间间隔驱动渲染
- 区间播放（`play(start, end)`），快速设置开始/结束帧
- 预加载（`preload`），加载完成后回调通知
- 完整事件回调：开始、暂停、完成、半程完成、单次完成、进入每帧…

## 安装

```bash
# 任选其一
pnpm add @leexiaohui/vframe-player
npm i @leexiaohui/vframe-player
yarn add @leexiaohui/vframe-player
```

## 快速开始（原生）

```html
<div id="player" style="width:320px;height:504px;position:relative"></div>
<script type="module">
  import VFramePlayer from '@leexiaohui/vframe-player';

  const player = new VFramePlayer({
    dom: document.getElementById('player'), // 必填：容器，用于挂载 Canvas
    imgArr: Array.from({ length: 151 }).map(
      (_, i) => `https://vmllab-js.github.io/vFramePlayer/image/${i}.jpg`
    ),
    preload: true, // 预加载图片
    fps: 60, // 帧率
    loop: 0, // 0 表示无限循环
    yoyo: false,
    autoplay: true,
    onPlayStateChange: (isPlaying) => {
      console.log('playing:', isPlaying);
    },
    onLoad: () => console.log('images loaded'),
    onComplete: () => console.log('全部播放完成'),
    onCompleteOne: () => console.log('完成一次循环'),
    onFrameEnter: (frame) => console.log('进入帧:', frame),
  });

  // 控制示例
  // player.pause();
  // player.play(10, 40);     // 只播放第 10 到 40 帧（含）
  // player.goto(100);        // 跳转到第 100 帧（0 基）
  // player.set('loop', 3);   // 设置循环次数为 3 次
</script>
```

## 在 Vue 中使用（简版）

```vue
<template>
  <div ref="refPlayer" style="width:320px;height:504px;position:relative" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import VFramePlayer from '@leexiaohui/vframe-player';

const refPlayer = ref<HTMLDivElement>();
let instance: VFramePlayer | undefined;

onMounted(() => {
  instance = new VFramePlayer({
    dom: refPlayer.value,
    imgArr: Array.from({ length: 151 }).map(
      (_, i) => `https://vmllab-js.github.io/vFramePlayer/image/${i}.jpg`
    ),
    preload: true,
    fps: 60,
    loop: 1,
  });
});
</script>
```

更完整的交互示例请参考仓库内 `src/index.example.vue`。

## API 参考

### 构造函数

- `new VFramePlayer(options: VFramePlayerOptions)`

### VFramePlayerOptions

- `dom?: HTMLElement`
  - 播放器容器。传入后会在容器内挂载一个绝对定位的 Canvas。
  - 强烈建议传入；未传入时 Canvas 不会自动插入文档，画面不可见。
- `imgArr?: string[]`
  - 图片列表（按顺序播放）。建议统一尺寸以避免缩放导致的抖动。
- `fps?: number`
  - 帧率，默认 30。按时间间隔驱动渲染，受浏览器与设备性能影响。
- `loop?: number`
  - 循环次数；`0` 表示无限循环。默认 `1`。
- `yoyo?: boolean`
  - 往返播放。到达尾帧后按倒序返回首帧，算一次完整循环。
- `preload?: boolean`
  - 是否在构造时预加载全部图片并创建 Canvas。若未预加载，首次 `play()` 会自动预加载。
- `autoplay?: boolean`
  - 是否在构造后立即开始播放。
- 事件回调（均可选）：
  - `onPlay?: () => void` — 开始播放
  - `onPaused?: () => void` — 暂停播放
  - `onEnd?: () => void` — 到达最后一次循环的终点
  - `onPlayStateChange?: (isPlaying: boolean) => void` — 播放状态变化
  - `onLoad?: () => void` — 预加载完成（图片与 Canvas 就绪）
  - `onOptionsChange?: (options) => void` — 选项被修改
  - `onComplete?: () => void` — 播放全部完成
  - `onCompleteOne?: () => void` — 完成一次完整循环
  - `onCompleteHalf?: () => void` — 在 `yoyo` 模式下到达尾帧的半程完成
  - `onFrameEnter?: (frame: number) => void` — 进入某一帧（0 基）

### 方法

- `play(start?: number, end?: number): void`
  - 开始播放；可传入区间（含起止帧）。若尚未预加载，会先预加载再播放。
- `pause(): void`
  - 暂停播放，并触发 `onPaused`。
- `goto(frame: number): void`
  - 跳转并渲染到指定帧（0 基）。必须位于当前播放区间内。
- `set<K extends keyof VFramePlayerOptions>(key: K, value: VFramePlayerOptions[K]): void`
  - 动态更新选项，并触发 `onOptionsChange`。注意：当前版本中 `loop` 会即时生效；其他如 `fps` 等在已加载后不保证即时生效，建议在需要时重新创建实例。

### 属性

- `frameCount: number`
  - 总帧数（即 `imgArr.length`）。

## 行为细节

- 帧索引为 **0 基**；UI 场景可自行转换为 1 基展示。
- `play(start, end)` 的区间是 **闭区间**，即包含 `start` 与 `end`。
- `yoyo` 模式下，尾帧触发 `onCompleteHalf`，回到首帧再触发 `onCompleteOne`。
- 循环完成最终会触发 `onEnd` 与 `onComplete`。无限循环（`loop=0`）则不会触发结束。
- Canvas 会根据容器尺寸进行居中缩放，采用 `min(widthScale, heightScale)` 缩放比，避免裁切。

## 性能与实践建议

- 图片尺寸尽量一致，减少缩放带来的视觉跳变。
- 开启 `preload`，可避免播放开始时的网络抖动。
- 容器（`dom`）需设置固定尺寸；Canvas 将覆盖容器并绝对定位。
- 跨域图片可正常绘制，但若需要导出像素（如 `toDataURL`），请确保源站开启 CORS。

## 兼容性

- 依赖 `Canvas` 与 `requestAnimationFrame`，适配现代浏览器。Node 环境不支持直接渲染。

## 开发与构建

- 构建：`rollup -c` 输出 `dist/index.mjs` 与 `dist/index.cjs`，类型定义 `dist/index.d.ts`。
- 包信息：`sideEffects=false`，适配 Tree-shaking。

## 示例资源

- 示例帧图集来源：`https://vmllab-js.github.io/vFramePlayer/image/{index}.jpg`

## 常见问题（FAQ）

- 修改 `fps` 不生效？当前版本在已加载后不保证即时生效，建议重建实例。
- 画面模糊？确保容器尺寸与期望显示尺寸一致；图片与容器比例差异过大时会发生缩放插值。
- 跳转帧无效？请检查是否超出当前播放区间（`startFrame~endFrame`）。

## 变更日志与反馈

- 问题反馈与需求建议：<https://github.com/leexiaohui1997/npm-projects/issues>
- 变更记录：按照仓库 Releases/Changesets 发布。

## License

MIT © 橙续缘
