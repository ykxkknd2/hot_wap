<template>
    <a class="ykx" @click="pushHistory" :href="item.title" :data-id="item.id">{{item.title}}</a>
</template>

<style>
    .ykx{
        border: 1px solid;
        width : 100px;
        height: 300px;
    }
</style>

<script>
    export default {
        name : 'test',
        props : ['item'],
        data : function(){
            return {
            }
        },
        methods : {
            pushHistory : function(){
//                debugger;
                history.replaceState({dataId:this.$el.getAttribute('data-id')},'');
//                window.open()
            }
        }
    }
</script>