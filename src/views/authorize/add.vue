<template>
    <page-header title="授权时间"/>
    <page-main>
        <el-steps :active="stepActive" finish-status="success" class="lt-md:mb-3 lg:mx-15 lg:my-10" simple>
            <el-step title="选择机构"/>
            <el-step title="授权时间"/>
            <el-step title="授权资源"/>
        </el-steps>
        <div v-show="stepActive === 0" class="flex-center  flex-col">
            <el-transfer
                v-model="addData.SchoolID"
                filterable
                :props="{
                    key: 'SchoolID',
                    label: 'SchoolName',
                }"
                :titles="['机构名称','已选机构']"
                :data="schoolList"
            />
            <base-button
                :block="true" size="large" class="w-1/5 mt-5" :disabled="addData.SchoolID.length === 0"
                @click="stepActive = 1"
            >
                下一步
            </base-button>
        </div>
        <div v-show="stepActive === 1" class="flex-center  flex-col">
            <div class="flex-center">
                <el-date-picker
                    v-model="defaultTime"
                    type="daterange"
                    start-placeholder="请选择开始时间"
                    end-placeholder="请选择结束时间"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    class="!w-1/5 mr-5"
                    @change="handleChangeTime"
                />
                <el-radio-group v-model="addData.Status">
                    <el-radio size="large" label="NotPurchase">试用</el-radio>
                    <el-radio size="large" label="Purchase">正式</el-radio>
                </el-radio-group>
            </div>
            <base-button
                :block="true" size="large" class="w-1/5 mt-5" :disabled="addData.Status === ''"
                @click="stepActive = 2"
            >
                下一步
            </base-button>
        </div>
        <div v-show="stepActive === 2" class="flex-center  flex-col">
            <div class="relative">
                <el-tabs v-model="tabModel" type="border-card">
                    <el-tab-pane
                        v-for="(item,index) in resourcesList" :key="item.ID" :label="item.Name"
                        :name="item.ID"
                    >
                        <div v-if="tabModel === item.ID">
                            <el-checkbox
                                v-model="item.checkAll" :indeterminate="item.isIndeterminate"
                                @change="handleCheckAllChange($event,index,item.Rows,item.ID)"
                            >
                                全选
                            </el-checkbox>
                            <el-checkbox-group
                                v-model="item.checkedCities"
                                class="grid grid-cols-5 gap-6 m-3"
                                @change="handleCheckedCitiesChange($event,index,item.Rows,item.ID)"
                            >
                                <el-checkbox v-for="data in item.Rows" :key="data.ID" :label="data.ID">
                                    {{ data.Name }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <base-button class="absolute top-[9px] right-[9px]" size="small" @click="handleSyncData">
                    一键同步
                </base-button>
            </div>
            <base-button
                :block="true"
                size="large"
                class="w-1/5 mt-5"
                :disabled="addData.Rows.length === 0 "
                @click="handleAddData"
            >
                提交新增
            </base-button>
        </div>
    </page-main>
</template>

<script setup>
import dayjs from 'dayjs'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { successMsg } from '@/utils/message'
import { useRouter } from 'vue-router'
import { empowerService } from '@/api/modules/empower'
const stepActive = ref(0)
const defaultTime = ref([dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')])
const addData = ref({
    SchoolID: [],
    Status: '',
    Rows: [],
    StartTime: defaultTime.value[0],
    EndTime: defaultTime.value[1]
})
const schoolList = ref([])
const tabModel = ref(0)
const resourcesList = ref([])
const router = useRouter()

const getAuthorizeAddData = () => {
    empowerService.get_School().then(res => {
        schoolList.value = res.Data
    })
    empowerService.get_ts().then(res => {
        res.Data.forEach(item => {
            item.checkAll = false
            item.isIndeterminate = false
            item.checkedCities = []
        })
        resourcesList.value = res.Data
        tabModel.value = res.Data[0].ID
    })

}

const handleCheckAllChange = (event, index, data, id) => {
    const list = resourcesList.value
    list[index].checkedCities = event ? data.map(item => item.ID) : []
    list[index].isIndeterminate = false
    if (event) {
        addRowsData(id, data)
    } else {
        addRowsData(id, [])
    }
}

const handleCheckedCitiesChange = (value, index, data, id) => {
    const checkedCount = value.length
    const list = resourcesList.value
    list[index].checkAll = checkedCount === data.length
    list[index].isIndeterminate = checkedCount > 0 && checkedCount < data.length
    addRowsData(id, data.filter(item => value.includes(item.ID)))
}

const addRowsData = (id, data) => {
    const arr = addData.value.Rows
    const index = arr.findIndex(item => item.TermID === id)
    const SubjectID = data.map(item => item.ID)
    if (index === -1) {
        arr.push({
            TermID: id,
            SubjectID
        })
    } else {
        if (data.length === 0) {
            arr.splice(index, 1)
        } else {
            arr[index].SubjectID = SubjectID
        }
    }
}

const handleChangeTime = value => {
    addData.value.StartTime = value[0]
    addData.value.EndTime = value[1]
}

const handleSyncData = () => {
    const data = JSON.parse(JSON.stringify(addData.value))
    delete data.Rows
    empowerService.post_Sync(data).then(res => {
        successMsg(res.Data)
    })
}

const handleAddData = () => {
    const data = addData.value
    empowerService.post_Add(data).then(res => {
        successMsg(res.Data)
        router.push('/authorize')
    })
}

getAuthorizeAddData()
</script>

<style scoped lang="scss">

</style>
