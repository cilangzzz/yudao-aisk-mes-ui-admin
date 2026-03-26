<script lang="ts" setup>
import type { MesTraceApi } from '#/api/mes/trace';

import { ref, computed } from 'vue';

import { Card, Descriptions, DescriptionsItem, Tag, Timeline, TimelineItem, Tabs, TabPanel, Table, Loading } from 'tdesign-vue-next';

import { useVbenForm } from '#/adapter/form';
import { message } from '#/adapter/tdesign';
import { getVinTrace } from '#/api/mes/trace';

import { useVinTraceFormSchema, useOperationRecordColumns, useKeyPartColumns, useQualityRecordColumns, useDeviceDataColumns } from '../data';

const loading = ref(false);
const traceResult = ref<MesTraceApi.VinTraceResult | null>(null);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    labelWidth: 80,
  },
  layout: 'inline',
  schema: useVinTraceFormSchema(),
  showDefaultActions: false,
});

/** 格式化时长(秒)为 时分秒 */
function formatDuration(seconds: number): string {
  if (!seconds) return '-';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}时${m}分${s}秒`;
  }
  if (m > 0) {
    return `${m}分${s}秒`;
  }
  return `${s}秒`;
}

/** 时间线数据 */
const timelineItems = computed(() => {
  if (!traceResult.value) return [];

  const items: Array<{ label: string; time?: string; content: string; color?: string }> = [];

  // 添加工序作业记录到时间线
  traceResult.value.operationRecords?.forEach((record) => {
    items.push({
      label: record.operationName,
      time: record.startTime,
      content: `工位: ${record.workstationName}, 操作员: ${record.operatorName}, 结果: ${record.result}`,
      color: record.status === 1 ? 'success' : record.status === 2 ? 'danger' : 'warning',
    });
  });

  return items;
});

/** 查询追溯 */
async function handleQuery() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  const values = await formApi.getValues();
  loading.value = true;

  try {
    const result = await getVinTrace(values.vin);
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

/** 暴露方法 */
defineExpose({
  handleQuery,
  handleReset,
});
</script>

<template>
  <div class="vin-trace">
    <!-- 搜索区域 -->
    <Card title="VIN正向追溯" class="mb-4">
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
        <!-- 车辆信息 -->
        <Card title="车辆信息" class="mb-4">
          <Descriptions :column="3" border>
            <DescriptionsItem label="VIN码">{{ traceResult.vin }}</DescriptionsItem>
            <DescriptionsItem label="产品编码">{{ traceResult.vehicleInfo?.productCode }}</DescriptionsItem>
            <DescriptionsItem label="产品名称">{{ traceResult.vehicleInfo?.productName }}</DescriptionsItem>
            <DescriptionsItem label="颜色">{{ traceResult.vehicleInfo?.color }}</DescriptionsItem>
            <DescriptionsItem label="配置">{{ traceResult.vehicleInfo?.config }}</DescriptionsItem>
            <DescriptionsItem label="生产日期">{{ traceResult.vehicleInfo?.produceDate }}</DescriptionsItem>
          </Descriptions>
        </Card>

        <!-- 工单信息 -->
        <Card title="工单信息" class="mb-4">
          <Descriptions :column="3" border>
            <DescriptionsItem label="工单编号">{{ traceResult.workOrderInfo?.orderNo }}</DescriptionsItem>
            <DescriptionsItem label="产线">{{ traceResult.workOrderInfo?.lineName }}</DescriptionsItem>
            <DescriptionsItem label="状态">
              <Tag :theme="traceResult.workOrderInfo?.status === 2 ? 'success' : 'warning'" variant="light">
                {{ traceResult.workOrderInfo?.statusName }}
              </Tag>
            </DescriptionsItem>
            <DescriptionsItem label="计划数量">{{ traceResult.workOrderInfo?.planQty }}</DescriptionsItem>
            <DescriptionsItem label="实际数量">{{ traceResult.workOrderInfo?.actualQty }}</DescriptionsItem>
          </Descriptions>
        </Card>

        <!-- 详细数据Tab -->
        <Card>
          <Tabs>
            <TabPanel value="timeline" label="追溯时间线">
              <div class="p-4">
                <Timeline v-if="timelineItems.length > 0">
                  <TimelineItem
                    v-for="(item, index) in timelineItems"
                    :key="index"
                    :label="item.time"
                    :theme="item.color"
                  >
                    <div class="font-medium">{{ item.label }}</div>
                    <div class="text-gray-500 text-sm">{{ item.content }}</div>
                  </TimelineItem>
                </Timeline>
                <div v-else class="text-center text-gray-400 py-8">暂无追溯数据</div>
              </div>
            </TabPanel>

            <TabPanel value="operations" label="工序作业记录">
              <Table
                :data="traceResult.operationRecords || []"
                :columns="useOperationRecordColumns()"
                row-key="id"
                hover
                stripe
              />
            </TabPanel>

            <TabPanel value="keyParts" label="关键件绑定">
              <Table
                :data="traceResult.keyParts || []"
                :columns="useKeyPartColumns()"
                row-key="partSn"
                hover
                stripe
              />
            </TabPanel>

            <TabPanel value="quality" label="质量检验记录">
              <Table
                :data="traceResult.qualityRecords || []"
                :columns="useQualityRecordColumns()"
                row-key="checkTime"
                hover
                stripe
              />
            </TabPanel>

            <TabPanel value="device" label="设备采集数据">
              <Table
                :data="traceResult.deviceData || []"
                :columns="useDeviceDataColumns()"
                row-key="collectTime"
                hover
                stripe
              />
            </TabPanel>
          </Tabs>
        </Card>
      </template>

      <template v-else>
        <Card>
          <div class="text-center text-gray-400 py-16">
            请输入VIN码进行追溯查询
          </div>
        </Card>
      </template>
    </Loading>
  </div>
</template>

<style scoped>
.vin-trace :deep(.t-card) {
  margin-bottom: 16px;
}
</style>