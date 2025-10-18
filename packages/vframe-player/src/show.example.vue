<template>
  <div class="container">
    <div ref="playerRef" class="player"></div>
    <div class="panel">
      <div class="row">
        <el-button :icon="isPlaying ? VideoPause : VideoPlay" @click="handleToggle">
          <span>{{ isPlaying ? '暂停' : '播放' }}</span>
        </el-button>
      </div>

      <div v-if="maxFrame" class="row">
        <el-input-number v-model="frameValue" :min="1" :max="maxFrame" />
        <el-button @click="setFrame">跳转该帧</el-button>
      </div>

      <div class="row">
        <el-checkbox v-model="isTipOnComplete">播放完成提示</el-checkbox>
      </div>

      <div class="row">
        <el-checkbox v-model="isLoop">循环播放</el-checkbox>
        <el-checkbox v-model="isTipOnCompleteOne">播放完成一次提示</el-checkbox>
      </div>

      <div class="row">
        <el-checkbox :model-value="isYoYo" @change="handleYoYoChange">往返播放</el-checkbox>
        <el-checkbox v-model="isTipOnCompleteHalf">播放完成一半提示</el-checkbox>
      </div>

      <div class="row">
        <span>开始帧</span>
        <el-input-number v-model="startFrame" :min="1" :max="maxFrame" />
        <span>结束帧</span>
        <el-input-number v-model="endFrame" :min="1" :max="maxFrame" />
        <el-button @click="setRange">设置播放范围</el-button>
      </div>

      <div class="row">
        <span>循环次数</span>
        <el-input-number v-model="loopCount" :min="0" />
      </div>

      <div class="row">
        <span>帧率</span>
        <el-input-number v-model="fps" :min="1" :max="240" />
      </div>

      <div class="row">
        <el-checkbox v-model="isTipOnFrameEnter">进入帧提示</el-checkbox>
        <el-input-number v-model="tipFrame" :min="1" :max="maxFrame" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VideoPause, VideoPlay } from '@element-plus/icons-vue';
import { computed, onMounted, ref, watch } from 'vue';
import VFramePlayer from '.';

const instance = ref<VFramePlayer>();
const playerRef = ref<HTMLDivElement>();
const isPlaying = ref(false);
const handleToggle = () => {
  if (isPlaying.value) {
    instance.value?.pause();
  } else {
    instance.value?.play();
  }
};

const frameValue = ref(1);
const maxFrame = ref(1);
const setFrame = () => {
  instance.value?.goto(frameValue.value - 1);
};

const loopCount = ref(1);
const isLoop = computed({
  get: () => loopCount.value === 0,
  set: (val) => {
    loopCount.value = val ? 0 : 1;
  },
});
watch(loopCount, (val) => {
  instance.value?.set('loop', val);
});

const isYoYo = ref(false);
const handleYoYoChange = () => {
  instance.value?.set('yoyo', !isYoYo.value);
};

const startFrame = ref(1);
const endFrame = ref(1);
const setRange = () => {
  instance.value?.play(startFrame.value - 1, endFrame.value - 1);
};

const fps = ref(60);
watch(fps, (val) => {
  instance.value?.set('fps', val);
});

const isTipOnComplete = ref(false);
const isTipOnCompleteOne = ref(false);
const isTipOnCompleteHalf = ref(false);

const isTipOnFrameEnter = ref(false);
const tipFrame = ref(1);

onMounted(() => {
  instance.value = new VFramePlayer({
    dom: playerRef.value,
    preload: true,
    fps: fps.value,
    loop: loopCount.value,
    yoyo: isYoYo.value,
    imgArr: Array.from({ length: 151 }).map(
      (_, index) => `https://vmllab-js.github.io/vFramePlayer/image/${index}.jpg`
    ),
    onPlayStateChange: (state) => {
      isPlaying.value = state;
    },
    onLoad: () => {
      maxFrame.value = instance.value?.frameCount || 0;
      endFrame.value = instance.value?.frameCount || 0;
    },
    onOptionsChange: (options) => {
      loopCount.value = options.loop ?? 1;
      isYoYo.value = !!options.yoyo;
      fps.value = options.fps ?? fps.value;
    },
    onComplete: () => {
      if (isTipOnComplete.value) {
        ElMessage.success('播放完成');
      }
    },
    onCompleteOne: () => {
      if (isTipOnCompleteOne.value) {
        ElMessage.success('播放完成一次');
      }
    },
    onCompleteHalf: () => {
      if (isTipOnCompleteHalf.value) {
        ElMessage.success('播放完成一半');
      }
    },
    onFrameEnter: (frame) => {
      if (isTipOnFrameEnter.value && frame === tipFrame.value - 1) {
        ElMessage.success(`进入帧 ${frame + 1}`);
      }
    },
  });
});
</script>

<style scoped lang="scss">
.container {
  gap: 16px;
  display: flex;
}
.player {
  width: 320px;
  height: 504px;
  position: relative;
}
.panel {
  flex: 1;
  width: 0;
  gap: 16px;
  display: flex;
  flex-direction: column;
}
.row {
  gap: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
