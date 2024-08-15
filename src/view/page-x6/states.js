import { ref, reactive, computed } from 'vue';
import { DEFAULT_RANK_DIRECTION } from './utils/constants';

export const rankDirection = ref(DEFAULT_RANK_DIRECTION);
export const isVertical = computed({
  get() { return rankDirection.value === 'TB'; },
  set(v) {
    rankDirection.value = v ? RandDirections.TB : RandDirections.LR;
  }
});

/** 设计时or运行时 */
export const envMode = ref('designtime');// runtime
/** 设计时 - 能否编辑 */
export const editable = ref(false);

export const graphRef = ref(null);

export const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  currentNode: null,
  initialized: false,
})