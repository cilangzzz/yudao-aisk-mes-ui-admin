<script lang="ts" setup>
import type { MesTraceApi } from '#/api/mes/trace';

import { ref } from 'vue';

import { Card, Descriptions, DescriptionsItem, Tag, Loading, Link } from 'tdesign-vue-next';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { getPartTrace } from '#/api/mes/trace';

import { usePartTraceFormSchema } from '../data';

const loading = ref(false);
const traceResult = ref<MesTraceApi.PartTraceResult | null>(null);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 100,
  },
  layout: 'inline',
  schema: usePartTraceFormSchema(),
  showDefaultActions: false,
});

/** 查询追溯 */
async function handleQuery() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();
  loading.value = true;

  try {
    const result = await getPartTrace(values.partSn);
    traceResult.value = result;
    if (!result) {
      message.warning('未找到相关追溯数据');
    }
  } catch (error) {
    message.error('查询失败');
  } finally {
    loading.value = false;
  }
}

/** 重置 */
function handleReset() {
  formApi.resetForm();
  traceResult.value = null;
}

/** 跳转到VIN追溯 */
function goToVinTrace(vin: string) {
  // 触发事件，由父组件处理跳转
  emit('vin-trace', vin);
}

const emit = defineEmits(['vin-trace']);

/** 暴露方法 */
defineExpose({
  handleQuery,
  handleReset,
});
</script>

<template>
  <div class="part-trace">
    <!-- 搜索区域 -->
    <Card title="关键件反向追溯" class="mb-4">
      <Form class="flex items-end gap-2">
        <template #default>
          <t-button theme="primary" @click="handleQuery">查询</t-button>
          <t-button variant="outline" @click="handleReset">重置</t-button>
        </template>
      </Form>
    </Card>

    <!-- 结果区域 -->
    <Loading :loading="loading">
      <template v-if="traceResult">
        <!-- 零部件信息 -->
        <Card title="零部件信息" class="mb-4">
          <Descriptions :column="3" border>
            <DescriptionsItem label="零部件编码">{{ traceResult.partCode }}</DescriptionsItem>
            <DescriptionsItem label="零部件名称">{{ traceResult.partName }}</DescriptionsItem>
            <DescriptionsItem label="序列号">{{ traceResult.partSn }}</DescriptionsItem>
            <DescriptionsItem label="供应商编码">{{ traceResult.supplierCode }}</DescriptionsItem>
            <DescriptionsItem label="供应商名称">{{ traceResult.supplierName }}</DescriptionsItem>
          </Descriptions>
        </Card>

        <!-- 绑定信息 -->
        <Card title="绑定信息" class="mb-4">
          <Descriptions :column="3" border>
            <DescriptionsItem label="绑定车辆VIN">
              <Link theme="primary" hover="color" @click="goToVinTrace(traceResult.bindVin)">
                {{ traceResult.bindVin }}
              </Link>
            </DescriptionsItem>
            <DescriptionsItem label="工单编号">{{ traceResult.workOrderNo }}</DescriptionsItem>
            <DescriptionsItem label="绑定时间">{{ traceResult.bindTime }}</DescriptionsItem>
            <DescriptionsItem label="绑定工位">{{ traceResult.workstationName }}</DescriptionsItem>
            <DescriptionsItem label="操作员">{{ traceResult.operatorName }}</DescriptionsItem>
          </Descriptions>
        </Card>

        <!-- 提示信息 -->
        <Card>
          <div class="p-4 bg-blue-50 rounded">
            <div class="text-blue-600 font-medium mb-2">追溯提示</div>
            <div class="text-gray-600">
              该零部件已绑定至车辆 <Tag theme="primary" variant="light">{{ traceResult.bindVin }}</Tag>，
              点击上方VIN码可查看该车辆的完整生产履历。
            </div>
          </div>
        </Card>
      </template>

      <template v-else>
        <Card>
          <div class="text-center text-gray-400 py-16">
            请输入零件序列号进行反向追溯查询
          </div>
        </Card>
      </template>
    </Loading>
  </div>
</template>

<style scoped>
.part-trace :deep(.t-card) {
  margin-bottom: 16px;
}
</style>