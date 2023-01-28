import * as echarts from 'echarts/core'
import { RadarChart, BarChart,PieChart} from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    PieChart,
    RadarChart,
    CanvasRenderer
])
