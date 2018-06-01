Vue.component('cool-table', {
    template: '<div><el-button-group v-if="buttons.length" ref="buttonGroup" :class="buttonGroupClass" :style="buttonGroupStyle">\
        <el-button v-for="button in buttons" :type="button.type" :size="button.size ? button.size : buttonSize" :icon="button.icon" :native-type="button.nativeType" :loading="button.loading" :disabled="button.disabled" :plain="button.plain ? button.plain : buttonPlain" :autofocus="button.autofocus" :round="button.round ? button.round : buttonRound" :key="button.key">{{button.text}}</el-button>\
    </el-button-group>\
    <el-container ref="custom"><slot></slot></el-container>\
    <el-table ref="table" :class="tableClass" :style="tableStyle" :data="data" :size="size" :width="width" :height="height ? height : calcHeight" :max-height="maxHeight" :fit="fit" :stripe="stripe" :border="border" :row-key="rowKey" :context="context" :show-header="showHeader" :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod" :row-className="rowClassName" :row-style="rowStyle" :cell-class-name="cellClassName" :cell-style="cellStyle" :header-row-class-name="headerRowClassName" :header-row-style="headerRowStyle" :header-cell-class-name="headerCellClassName" :header-cell-style="headerCellStyle" :highlight-current-row="highlightCurrentRow" :current-row-key="currentRowKey" :empty-text="emptyText" :expand-row-keys="expandRowKeys" :default-expand-all="defaultExpandAll" :default-sort="defaultSort" :tooltip-effect="tooltipEffect" :span-method="spanMethod">\
        <el-table-column v-for="column in columns" :type="column.type" :label="column.label" :class-name="column.className" :label-class-name="column.labelClassName" :prop="column.prop" :width="column.width" :min-width="column.minWidth" :render-header="column.renderHeader" :sortable="column.sortable" :sort-method="column.sortMethod" :sort-by="column.sortBy" :resizable="column.resizable" :column-key="column.columnKey" :align="column.align" :header-align="column.headerAlign" :show-tooltip-when-overflow="column.showTooltipWhenOverflow" :show-overflow-tooltip="column.showOverflowTooltip" :fixed="column.fixed" :formatter="column.formatter" :selectable="selectable" :filter-method="column.filterMethod" :filters="column.filters" :filter-placement="column.filterPlacement" :filter-multiple="column.filterMultiple" :index="column.index" :key="column.columnKey"></el-table-column>\
        <slot name="columns"></slot>\
    </el-table>\
    <el-pagination ref="pagination" :class="paginationClass" :style="paginationStyle" :page-size="pageSize" :small="small" :total="total" :page-count="pageCount" :current-page="currentPage" :layout="layout" :page-sizes="pageSizes" :popper-class="popperClass" :prev-text="prevText" :next-text="nextText" :background="background"></el-pagination></div>',
    props: {
        //classes & styles
        buttonGroupStyle: String,
        buttonGroupClass: String,
        tableClass: String,
        tableStyle: String,
        paginationClass: String,
        paginationStyle: String,

        //table
        data: { type: Array, default: function () { return [] } },
        size: String,
        width: [String, Number],
        height: [String, Number],
        maxHeight: [String, Number],
        fit: { type: Boolean, default: true },
        stripe: Boolean,
        border: Boolean,
        rowKey: [String, Function],
        context: {},
        showHeader: { type: Boolean, default: true },
        showSummary: Boolean,
        sumText: String,
        summaryMethod: Function,
        rowClassName: [String, Function],
        rowStyle: [Object, Function],
        cellClassName: [String, Function],
        cellStyle: [Object, Function],
        headerRowClassName: [String, Function],
        headerRowStyle: [Object, Function],
        headerCellClassName: [String, Function],
        headerCellStyle: [Object, Function],
        highlightCurrentRow: Boolean,
        currentRowKey: [String, Number],
        emptyText: String,
        expandRowKeys: Array,
        defaultExpandAll: Boolean,
        defaultSort: Object,
        tooltipEffect: String,
        spanMethod: Function,

        //columns
        columns: { type: Array, default: function () { return [] } },

        //buttonGroup
        buttonSize: String,
        buttonPlain: Boolean,
        buttonRound: Boolean,

        //buttons
        buttons: { type: Array, default: function () { return [] } },

        //pagination
        pageSize: { type: Number, default: 10 },
        small: Boolean,
        total: Number,
        pageCount: Number,
        currentPage: { type: Number, default: 1 },
        layout: { default: 'prev, pager, next, jumper, ->, total' },
        pageSizes: { type: Array, default() { return [10, 20, 30, 40, 50, 100] } },
        popperClass: String,
        prevText: String,
        nextText: String,
        background: Boolean,
    },
    data: function () { return { calcHeight: undefined } },
    mounted: function () {
        setTimeout(this.registerEvents, 0)
        setInterval(this.autoHeight, 0)
    },
    methods: {
        redirectEvents: function (source, target, events, prefix) {
            events.forEach(function (event) {
                source.$on(event, function (args) {
                    args.data = source
                    target.$emit(prefix + event, args)
                })
            })
        },
        registerEvents: function () {
            var redirectEvents = this.redirectEvents

            var buttons = this.$refs.buttonGroup.$children
            var buttonEvents = ['click']
            buttons.forEach(function (button) {
                redirectEvents(button, this, buttonEvents, 'button-')
            })

            var table = this.$refs.table
            var tableEvents = ['select',
                'select-all',
                'selection-change',
                'cell-mouse-enter',
                'cell-mouse-leave',
                'cell-click',
                'row-click', 'row-dblclick',
                'header-click',
                'sort-change',
                'current-change']
            redirectEvents(table, this, tableEvents)
            var pagination = this.$refs.pagination
            var paginationEvents = ['size-change', 'current-change']
            redirectEvents(pagination, this, paginationEvents, 'pagination-')

        },
        getFullHeight: function (el) {
            return parseInt(getComputedStyle(el)['height']) +
                this.getOuterHeight(el)
        },
        getOuterHeight: function (el) {
            return parseInt(getComputedStyle(el)['margin-top']) +
                parseInt(getComputedStyle(el)['margin-bottom']) +
                parseInt(getComputedStyle(el)['padding-top']) +
                parseInt(getComputedStyle(el)['padding-bottom']) +
                parseInt(getComputedStyle(el)['border-top-width']) +
                parseInt(getComputedStyle(el)['border-bottom-width'])
        },
        autoHeight: function () {
            var el = this.$el
            var parent = el.parentNode
            var parentHeight = parent.clientHeight

            //todo: calc parent children height...
            var buttonGroupHeight = this.getFullHeight(this.$refs.buttonGroup.$el)
            var customHeight = this.getFullHeight(this.$refs.custom.$el)
            var paginationHeight = this.getFullHeight(this.$refs.pagination.$el)

            this.calcHeight = parentHeight - buttonGroupHeight - customHeight - paginationHeight - 1 
            //娓叉煋璁＄畻鐨勬椂鍊欏彲鑳戒細鍥涜垗浜斿叆瀵艰嚧杈规閲嶅彔锛�-1濂界湅鐐广€傘€傘€�
        },
        selectable: function (row, index) {
            if (row.selectable === undefined) return true
            return (row.selectable)
        }
    }
})