<script lang="ts" setup>
import type { MesOperationApi } from '#/api/mes/operation';

import { computed, ref, watch } from 'vue';

import {
  Button,
  Card,
  Input,
  Progress,
  Steps,
  StepItem,
  Tag,
} from 'tdesign-vue-next';

import { message } from '#/adapter/tdesign';
import { startOperation } from '#/api/mes/operation';
import { getSimpleWorkstationList } from '#/api/mes/config/workstation';
import { useVbenModal } from '@vben/common-ui';

import CompleteForm from './complete-form.vue';

const props = defineProps<{
  scanResult: MesOperationApi.ScanResult | null;
}>();

const emit = defineEmits<{
  refresh: [];
  operationComplete: [];
}>();

const [CompleteModal, completeModalApi] = useVbenModal({
  connectedComponent: CompleteForm,
  destroyOnClose: true,
});

const currentVin = ref<string>('');
const currentWorkOrderId = ref<number>(0);
const operations = ref<MesOperationApi.OperationProgress[]>([]);
const workstationId = ref<number>();

// 当前选中的工序
const selectedOperation = ref<MesOperationApi.OperationProgress | null>(null);

// 进度百分比
const progressPercent = computed(() => {
  if (!operations.value.length) return 0;
  const completed = operations.value.filter((op) => op.completed).length;
  return Math.round((completed / operations.value.length) * 100);
});

// 可开始的工序
const availableOperations = computed(() => {
  return operations.value.filter((op) => !op.completed);
});

// 是否已扫码（有扫描结果）
const hasScanned = computed(() => {
  return props.scanResult && (props.scanResult.vinInfo || props.scanResult.workOrderInfo);
});

// 是否是工单模式（需要手动输入VIN）
const isWorkOrderMode = computed(() => {
  return props.scanResult?.workOrderInfo && !props.scanResult?.vinInfo;
});

// 监听扫描结果
watch(
  () => props.scanResult,
  async (result) => {
    if (result?.vinInfo) {
      // 扫描VIN码
      currentVin.value = result.vin!;
      currentWorkOrderId.value = result.workOrderId!;
      operations.value = result.vinInfo.operations || [];
      selectedOperation.value = null;
    } else if (result?.workOrderInfo) {
      // 扫描工单码
      currentVin.value = '';
      currentWorkOrderId.value = result.workOrderInfo.id;
      operations.value = result.workOrderInfo.operations || [];
      selectedOperation.value = null;
    }
  },
  { immediate: true },
);

// 选择工序
function selectOperation(op: MesOperationApi.OperationProgress) {
  if (!op.completed) {
    selectedOperation.value = op;
  }
}

// 开始作业
async function handleStart() {
  if (!selectedOperation.value) {
    message.warning('请先选择工序');
    return;
  }
  if (!workstationId.value) {
    message.warning('请先选择工位');
    return;
  }
  if (!currentVin.value.trim()) {
    message.warning('请先输入VIN码');
    return;
  }
  // VIN格式校验（简单校验：长度17位，字母数字）
  const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
  if (!vinPattern.test(currentVin.value.trim())) {
    message.warning('VIN码格式不正确，应为17位字母数字');
    return;
  }
  const hideLoading = message.loading({
    content: '正在开始作业...',
    duration: 0,
  });
  try {
    await startOperation({
      workOrderId: currentWorkOrderId.value,
      vin: currentVin.value.trim(),
      operationId: selectedOperation.value.operationId,
      workstationId: workstationId.value,
    });
    message.success('作业已开始');
    emit('refresh');
  } finally {
    message.close(hideLoading);
  }
}

// 完成作业
function handleComplete(op: MesOperationApi.OperationProgress) {
  if (op.recordId) {
    completeModalApi.setData({
      recordId: op.recordId,
      vin: currentVin.value,
      workOrderId: currentWorkOrderId.value,
    }).open();
  }
}

// 加载工位列表
async function loadWorkstations() {
  const list = await getSimpleWorkstationList();
  if (list.length > 0 && list[0]?.id) {
    workstationId.value = list[0].id;
  }
}

loadWorkstations();
</script>

<template>
  <Card title="作业操作" class="mb-4">
    <template v-if="operations.length > 0">
      <!-- 进度条 -->
      <div class="mb-4">
        <div class="mb-2 text-sm text-gray-600">
          生产进度: {{ progressPercent }}%
        </div>
        <Progress :percentage="progressPercent" />
      </div>

      <!-- 工序时间线 -->
      <div class="mb-4">
        <div class="mb-2 text-sm font-medium">工序列表</div>
        <Steps layout="vertical" :current="operations.filter(op => op.completed).length">
          <StepItem
            v-for="op in operations"
            :key="op.operationId"
            :title="op.operationName"
            :status="op.completed ? 'finish' : 'process'"
          >
            <template #extra>
              <div class="flex items-center gap-2">
                <Tag v-if="op.completed" theme="success" variant="light">
                  已完成
                </Tag>
                <Tag v-else-if="op.recordId" theme="warning" variant="light">
                  进行中
                </Tag>
                <Button
                  v-if="op.recordId && !op.completed"
                  size="small"
                  theme="primary"
                  variant="outline"
                  @click="handleComplete(op)"
                >
                  完成
                </Button>
              </div>
            </template>
          </StepItem>
        </Steps>
      </div>

      <!-- 开始作业区域 -->
      <div v-if="availableOperations.length > 0" class="border-t pt-4">
        <div class="mb-2 text-sm font-medium">开始新作业</div>
        <!-- VIN输入（工单模式需要手动输入） -->
        <div v-if="isWorkOrderMode" class="mb-3">
          <div class="mb-1 text-sm text-gray-500">VIN码</div>
          <Input
            v-model="currentVin"
            placeholder="请输入或扫描VIN码（17位）"
            clearable
          />
        </div>
        <!-- 工序选择 -->
        <div class="flex flex-wrap gap-2 mb-2">
          <Button
            v-for="op in availableOperations"
            :key="op.operationId"
            :theme="selectedOperation?.operationId === op.operationId ? 'primary' : 'default'"
            size="small"
            @click="selectOperation(op)"
          >
            {{ op.operationName }}
          </Button>
        </div>
        <Button
          theme="success"
          :disabled="!selectedOperation || (isWorkOrderMode && !currentVin.trim())"
          @click="handleStart"
        >
          开始作业
        </Button>
      </div>
    </template>
    <template v-else>
      <div class="text-center py-8">
        <template v-if="hasScanned">
          <div class="mb-2 text-gray-600">
            <span v-if="scanResult?.workOrderInfo">
              工单: {{ scanResult.workOrderInfo.orderNo }}
            </span>
            <span v-else-if="scanResult?.vin">
              VIN: {{ scanResult.vin }}
            </span>
          </div>
          <div class="text-gray-400">暂无工序信息</div>
        </template>
        <template v-else>
          <div class="text-gray-400">请先扫描VIN码或工单号</div>
        </template>
      </div>
    </template>
    <CompleteModal @success="emit('operationComplete')" />
  </Card>
</template>