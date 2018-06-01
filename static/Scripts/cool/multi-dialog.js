Vue.component('cool-multi-dialog', {
    template: '<div><template v-for="dialog in dialogs">\
            <cool-dialog :name="dialog.name" :visible.sync="dialog.visible" :fullscreen.sync="dialog.fullscreen" :width="dialog.width" :iframe-height="dialog.iframeHeight" :title="dialog.title" :src="dialog.src"></cool-dialog>\
        </template></div>',
    props: {
        dialogs: Array
    },
})