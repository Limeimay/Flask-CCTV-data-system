Vue.component('cool-dialog', {
    template: '<el-dialog :visible.sync="visible" :fullscreen.sync="fullscreen" :width="fullscreen?\'\':width" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">\
    <div slot="title">\
        {{title}}\
        <el-button-group style="float: right">\
            <el-button :disabled="fullscreen" style="width:24px; padding:4px;" size="mini" icon="el-icon-d-caret" @click="collapsed"></el-button>\
            <el-button style="width:24px; padding:4px;" size="mini" icon="el-icon-tickets" type="primary" @click="maxmized"></el-button>\
            <el-button style="width:24px; padding:4px;" size="mini" icon="el-icon-close" type="danger" @click="closed"></el-button>\
        </el-button-group>\
    </div>\
    <div style="border:lightgray solid 1px; overflow: hidden">\
        <iframe ref="iframe" :src="src+\'?name=\'+name" style="width:100%; border:none;"></iframe>\
    </div>\
</el-dialog>',
    mounted: function () {
        var _this = this
        setInterval(function () {
            if (_this.$refs.iframe)
                _this.$refs.iframe.style.height = parseInt(_this.iframeHeight) + 'px'
        }, 100) //todo: use binding
    },
    props: {
        name: String,
        visible: Boolean,
        width: String,
        iframeHeight: String,
        fullscreen: Boolean,
        title: String,
        src: String,
    },
    methods: {
        collapsed: function () {
            if (this.$refs.iframe.parentNode.style.height === '0px') {
                this.$refs.iframe.parentNode.style.height = ''
            }
            else {
                this.$refs.iframe.parentNode.style.height = '0px'
            }
        },
        maxmized: function () {
            this.$emit('update:fullscreen', !this.fullscreen) //emit for sync
        },
        closed: function () {
            this.$emit('update:visible', !this.visible) //emit for sync
        }
    },
})