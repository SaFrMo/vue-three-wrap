<template>
    <div class="three-view">
        <canvas :width="cmpWidth" :height="cmpHeight" />
    </div>
</template>

<script>
import rect from 'fh-components/mixins/rect'

export default {
    mixins: [rect],
    props: {
        width: {
            type: Number,
            default: -1
        },
        height: {
            type: Number,
            default: -1
        }
    },
    computed: {
        cmpWidth() {
            if (this.width != -1) return this.width
            return this.clientRect ? this.clientRect.width : 0
        },
        cmpHeight() {
            if (this.height != -1) return this.height
            return this.clientRect ? this.clientRect.height : 0
        }
    }
}
</script>

<style lang="scss">
.three-view {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: black;
    font-size: 0;
}
</style>
