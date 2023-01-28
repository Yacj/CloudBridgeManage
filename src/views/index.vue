<route>
{
name: 'dashboard',
meta: {
title: "控制台"
}
}
</route>

<template>
    <div>
        <page-main title="面板数据">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-3 data-card">
                <div
                    v-for="(item,index) in totalList" :key="index+1"
                    class="data-card-item rounded-md p-3 cursor-pointer transition ease-in-out  hover:scale-[1.03]"
                    :class="getCardBg(index)"
                >
                    <div class="card-item-title text-white font-semibold text-base">
                        {{ item.Name }}
                    </div>
                    <div class="card-item-count text-white text-3xl my-5">
                        <count-to :start-val="0" :end-val="item.Value" :duration="500"/>
                    </div>
                    <ul class="flex items-center text-white space-x-3">
                        <li v-for="(data,dataIndex) in item.Rows" :key="dataIndex+1">
                            {{ data.Name }}：{{ data.Value }}
                        </li>
                    </ul>
                </div>
            </div>
        </page-main>
        <div class="data-chart grid grid-cols-1 lg-sm:mb-3 lg:grid-cols-2 gap-1 ">
            <page-main>
                <template #title>
                    <div class="lg:flex-center lg:justify-between">
                        <div>
                            机构用户占比
                        </div>
                        <div class="lg:mt-0 mt-3">
                            <el-radio-group
                                v-model="agencyUserData.Dt"
                                @change="getPanelAgencyUser"
                            >
                                <el-radio-button v-for="item in radioList" :key="item.id" :label="item.id">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </template>
                <div class="chart-item ">
                    <base-chart :options="agencyUserData.chart"/>
                </div>
            </page-main>
            <page-main>
                <template #title>
                    <div class="lg:flex-center lg:justify-between">
                        <div>
                            学科实训占比
                        </div>
                        <div class="lg:mt-0 mt-3">
                            <el-radio-group
                                v-model="trainSubjectData.Dt"
                                @change="getPanelSubjectData"
                            >
                                <el-radio-button v-for="item in radioList" :key="item.id" :label="item.id">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </template>
                <div class="chart-item">
                    <base-chart :options="trainSubjectData.chart"/>
                </div>
            </page-main>
            <page-main>
                <template #title>
                    <div class="lg:flex-center lg:justify-between">
                        <div>
                            成果作品
                        </div>
                        <div class="lg:mt-0 mt-3">
                            <el-radio-group
                                v-model="trainWorksData.Dt"
                                @change="getPanelTrainWorks"
                            >
                                <el-radio-button v-for="item in radioList" :key="item.id" :label="item.id">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </template>
                <div class="chart-item">
                    <base-chart :options="trainWorksData.chart"/>
                </div>
            </page-main>
            <page-main>
                <template #title>
                    <div class="lg:flex-center lg:justify-between">
                        <div>
                            实习报告
                        </div>
                        <div class="lg:mt-0 mt-3">
                            <el-radio-group
                                v-model="trainReportData.Dt"
                                @change="getPanelTrainReport"
                            >
                                <el-radio-button :label="0">
                                    全部
                                </el-radio-button>
                                <el-radio-button :label="1">
                                    半年
                                </el-radio-button>
                                <el-radio-button :label="2">
                                    一年
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </template>
                <div class="chart-item">
                    <base-chart :options="trainReportData.chart"/>
                </div>
            </page-main>
            <page-main class="lg:col-span-2">
                <template #title>
                    <div class="lg:flex-center lg:justify-between">
                        <div>
                            访问量
                        </div>
                        <div class="lg:mt-0 mt-3">
                            <el-radio-group
                                v-model="logListData.Dt"
                                @change="getPanelLogList"
                            >
                                <el-radio-button :label="0">
                                    所有
                                </el-radio-button>
                                <el-radio-button :label="1">
                                    本年
                                </el-radio-button>
                                <el-radio-button :label="2">
                                    本月
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                    </div>
                </template>
                <div class="lg:flex lg:flex-wrap">
                    <div class="lg:w-2/3 lg:h-80 h-100 w-full">
                        <base-chart :options="logListData.chart"/>
                    </div>
                    <div class="lg:w-1/3 w-full">
                        <span class="text-xl font-bold">学校机构访问量排名</span>
                        <ul class="mt-5">
                            <li
                                v-for="(item,index) in logListData.list" :key="index+1"
                                class="flex items-center justify-between space-x-3 mb-3"
                            >
                                <div class="flex-center">
                                    <span
                                        class="text-base rounded-full bg-blue-400 w-5 h-5 text-white flex-center font-medium mr-3"
                                    >{{ index + 1 }}</span>
                                    {{ item.SchoolName }}
                                </div>
                                <div>
                                    {{ item.Count }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </page-main>
        </div>
    </div>
</template>

<script setup>
import CountTo from '@/components/CountTo/CountTo.vue'
import BaseChart from '@/components/BaseChart/BaseChart.vue'
import { panelService } from '@/router/modules/panel'
import { nextTick, onMounted } from 'vue'

const totalList = ref([])
const radioList = ref([
    {
        label: '全部',
        id: 0
    },
    {
        label: '近一周',
        id: 1
    },
    {
        label: '近一月',
        id: 2
    },
    {
        label: '近一年',
        id: 3
    }
])
const getCardBg = index => {
    return {
        'bg-blue-400': index === 0,
        'bg-yellow-400': index === 1,
        'bg-blue-300': index === 2,
        'bg-red-400': index === 3,
        'bg-purple-500': index === 4
    }
}
const agencyUserData = ref({
    Dt: 0,
    chart: {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '5%',
            left: 'center',
            textStyle: {
                fontSize: 16// 字体大小
            }
        },
        color: ['#33577B', '#399BFF', '#BFD5EC'],
        series: [
            {
                name: '机构用户占比',
                type: 'pie',
                radius: ['50%', '80%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: []
            }
        ]
    }
})
const trainSubjectData = ref({
    Dt: 0,
    chart: {
        title: {
            text: '',
            show: false
        },
        tooltip: {
            trigger: 'item'
        },
        radar: {
            radius: 100,
            center: ['50%', '55%'],
            indicator: []
        },
        series: [{
            name: '学科实训占比',
            type: 'radar',
            areaStyle: {},
            data: []
        }]
    }
})
const trainWorksData = ref({
    Dt: 0,
    chart: {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            show: false
        },
        grid: {
            left: '3%',
            right: '4%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                name: '成果作品',
                type: 'bar',
                data: []
            }
        ]
    }
})
const trainReportData = ref({
    Dt: 0,
    chart: {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    }
})
const logListData = ref({
    Dt: 0,
    chart: {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    },
    list: []
})

onMounted(() => {
    getPanelData()
})

const getPanelData = () => {
    getPanelTotal()
    nextTick(() => {
        getPanelAgencyUser()
        getPanelSubjectData()
        getPanelTrainWorks()
        getPanelTrainReport()
        getPanelLogList()
    })
}

const getPanelTotal = () => {
    panelService.total().then(res => {
        totalList.value = res.Data
    })
}

const getPanelAgencyUser = () => {
    const data = agencyUserData.value
    panelService.agency_user({
        Dt: data.Dt
    }).then(res => {
        const data = []
        res.Data.map(item => {
            data.push({
                value: item.Value,
                name: item.Name
            })
        })
        agencyUserData.value.chart.series[0].data = data
    })
}
const getPanelSubjectData = () => {
    const data = trainSubjectData.value
    panelService.train_subject({
        Dt: data.Dt
    }).then(res => {
        const data = []
        const indicator = []
        res.Data.map(item => {
            data.push({
                value: item.Value,
                name: item.Name
            })
            indicator.push({
                name: item.Name
            })
        })
        trainSubjectData.value.chart.radar.indicator = indicator
        trainSubjectData.value.chart.series[0].data = data
    })
}
const getPanelTrainWorks = () => {
    const data = trainWorksData.value
    panelService.train_works({
        Dt: data.Dt
    }).then(res => {
        const data = []
        const yAxis = []
        res.Data.map(item => {
            data.push({
                value: item.Value,
                name: item.Name
            })
            yAxis.push(item.Name)
        })
        trainWorksData.value.chart.yAxis.data = yAxis
        trainWorksData.value.chart.series[0].data = data
    })
}
const getPanelTrainReport = () => {
    const data = trainReportData.value
    panelService.train_report({
        Dt: data.Dt
    }).then(res => {
        const data = []
        const xAxis = []
        res.Data.map(item => {
            data.push({
                value: item.Value,
                name: item.Name
            })
            xAxis.push(item.Name)
        })
        trainReportData.value.chart.xAxis.data = xAxis
        trainReportData.value.chart.series[0].data = data
    })
}
const getPanelLogList = () => {
    const data = logListData.value
    panelService.log_list({
        Dt: data.Dt
    }).then(res => {
        const data = []
        const xAxis = []
        res.Data.row.map(item => {
            data.push({
                value: item.Value,
                name: item.Name
            })
            xAxis.push(item.Name)
        })
        logListData.value.list = res.Data.rank
        logListData.value.chart.xAxis.data = xAxis
        logListData.value.chart.series[0].data = data
    })
}
</script>
<style lang="scss" scoped>
.chart-item {
    @apply h-80 w-full;
}
</style>
