<script lang="ts" setup>
import type { MesOperationApi } from '#/api/mes/operation';

import { ref } from 'vue';

import { Button, Card, Input, Tag } from 'tdesign-vue-next';

import { scanCode } from '#/api/mes/operation';

const emit = defineEmits<{
  scanned: [result: MesOperationApi.ScanResult];
}>();

const scanInput = ref('');
const loading = ref(false);
const lastScanResult = ref<MesOperationApi.ScanResult | null>(null);

async function handleScan() {
  if (!scanInput.value.trim()) {
    return;
  }
  loading.value = true;
  try {
    const result = await scanCode({ code: scanInput.value.trim() });
    lastScanResult.value = result;
    emit('scanned', result);
    scanInput.value = '';
  } finally {
    loading.value = false;
  }
}

function clearResult() {
  lastScanResult.value = null;
}

defineExpose({ clearResult });
</script>

<template>
  <Card title="扫码输入" class="mb-4">
    <div class="flex gap-2">
      <Input
        v-model="scanInput"
        placeholder="请扫描或输入VIN码/工单号/物料码"
        clearable
        @enter="handleScan"
      />
      <Button theme="primary" :loading="loading" @click="handleScan">
        扫码
      </Button>
    </div>
    <div v-if="lastScanResult" class="mt-4">
      <div class="flex items-center gap-2">
        <Tag :theme="lastScanResult.canStart ? 'success' : 'warning'" variant="light">
          {{ lastScanResult.scanTypeName }}
        </Tag>
        <span class="text-gray-600">{{ lastScanResult.message }}</span>
      </div>
      <div v-if="lastScanResult.vin" class="mt-2 text-sm">
        <span class="text-gray-500">VIN:</span> {{ lastScanResult.vin }}
      </div>
      <div v-if="lastScanResult.workOrderNo" class="mt-1 text-sm">
        <span class="text-gray-500">工单:</span> {{ lastScanResult.workOrderNo }}
      </div>
      <div v-if="lastScanResult.productName" class="mt-1 text-sm">
        <span class="text-gray-500">产品:</span> {{ lastScanResult.productName }}
      </div>
    </div>
  </Card>
</template>