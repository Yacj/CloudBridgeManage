<template>
    <page-header title="授权修改"/>
    <page-main title="基本信息">
        <el-form ref="form" :model="editForm" :rules="rules" class="grid gap-2 grid-cols-1 w-2/5 mt-3">
            <el-form-item label="机构名称" prop="SchoolName">
                <el-input v-model="editForm.SchoolName" disabled/>
            </el-form-item>
            <el-form-item label="授权时间" prop="Time">
                <el-date-picker
                    v-model="editForm.Time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item label="授权状态" prop="Status">
                <el-select v-model="editForm.Status" placeholder="请选择">
                    <el-option label="试用" value="NotPurchase"/>
                    <el-option label="正式" value="Purchase"/>
                </el-select>
            </el-form-item>
        </el-form>
    </page-main>
    <page-main title="资源信息">
        <el-tabs v-model="tabModel">
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
    </page-main>
    <fixed-action-bar>
        <base-button type="success" @click="onSubmit">确认修改</base-button>
    </fixed-action-bar>
</template>

<script setup>
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { errorMsg, successMsg } from '@/utils/message'
import { empowerService } from '@/api/modules/empower'

const form = ref(null)
const route = useRoute()
const { SchoolID } = route.query
const editForm = ref({
    SchoolName: '',
    Time: [],
    Status: '',
    Rows: []
})
const rules = {
    SchoolName: [
        {
            required: true,
            message: '请输入机构名称',
            trigger: 'blur'
        }
    ],
    Time: [
        {
            required: true,
            message: '请选择授权时间',
            trigger: 'blur'
        }
    ],
    Status: [
        {
            required: true,
            message: '请选择授权状态',
            trigger: 'blur'
        }
    ]
}
const resourcesList = ref([])
const tabModel = ref('')
const getEditData = () => {
    empowerService.get_details({ SchoolID }).then(val => {
        const { info, res } = val.Data
        editForm.value.SchoolName = info.SchoolName
        editForm.value.Time = [info.StartTime, info.EndTime]
        editForm.value.Status = info.Status === '正式用户' ? 'Purchase' : 'NotPurchase'
        res.map(item => {
            item.checkedCities = []
            item.Rows.map(data => {
                if (data.IsSelect) {
                    item.checkedCities.push(data.ID)
                }
            })
            item.checkAll = item.checkedCities.length === item.Rows.length
            item.isIndeterminate = item.checkedCities.length > 0 && item.checkedCities.length < item.Rows.length
            if (item.checkedCities.length > 0) {
                editForm.value.Rows.push({
                    TermID: item.ID,
                    SubjectID: item.checkedCities
                })
            }
        })
        tabModel.value = res[0].ID
        resourcesList.value = res
    })
}
const onSubmit = () => {
    console.log(editForm.value)
    form.value.validate(valid => {
        if (valid) {
            const { Time, Status, Rows } = editForm.value
            const params = {
                SchoolID,
                StartTime: Time[0],
                EndTime: Time[1],
                Status,
                Rows
            }
            if (Rows.length === 0) {
                return errorMsg('资源信息不能为空！')
            }
            empowerService.post_update(params).then(val => {
                console.log(val)
                successMsg('修改成功！')
            })
        }
    })
}
const handleCheckAllChange = (event, index, rows, id) => {
    resourcesList.value[index].checkedCities = event
        ? rows.map(item => item.ID)
        : []
    resourcesList.value[index].isIndeterminate = false
    if (event) {
        addRows(id, rows)
    } else {
        addRows(id, [])
    }
}
const handleCheckedCitiesChange = (event, index, rows, id) => {
    const checkedCount = event.length
    resourcesList.value[index].checkAll = checkedCount === rows.length
    resourcesList.value[index].isIndeterminate =
        checkedCount > 0 && checkedCount < rows.length
    addRows(id, rows.filter(item => event.includes(item.ID)))
}

const addRows = (id, rows) => {
    const arr = editForm.value.Rows
    const index = arr.findIndex(item => item.ID === id)
    const SubjectID = rows.map(item => item.ID)
    if (index === -1) {
        arr.push({
            TermID: id,
            SubjectID
        })
    } else {
        if (rows.length === 0) {
            arr.splice(index, 1)
        } else {
            arr[index].SubjectID = SubjectID
        }
    }
}
getEditData()
</script>

<style scoped>

</style>
