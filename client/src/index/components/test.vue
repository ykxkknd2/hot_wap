<template>
    <div class="ykx">
        <a href="http://www.baidu.com" v-html="title"></a>
    </div>
</template>

<style>
    .ykx{
        border: 1px solid;
        width : 100px;
        height: 100px;
    }
</style>

<script>
    export default {
        name : 'test',
        props : ['item','keyword'],
        data : function(){
            return {
            }
        },
        methods : {
            pushHistory : function(){
            }
        },
        computed : {
            title: function(){
                return this.item.pidtitle.replace(this.keyword,'<span style="color:red">' + this.keyword + '</span>');
            }
        }
    }
</script>