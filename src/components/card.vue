<script>
import { mapState } from 'vuex';

export default {
    computed: mapState({
        user: ({ user }) => user,
        filterKey: ({ filterKey }) => filterKey,
        online: (state) => {
            return state.events.onlineMan
        }
    }),
    methods: {
        onKeyup (e) {
            this.$store.dispatch('search', e.target.value);
        }
    }
};
</script>

<template>
<div class="card">
        <div class="online-man"><i class="iconfont-chat">&#xe601;</i><span class="online">{{online}}人</span></div>
        <input class="search" type="text" placeholder="搜索" @input="onKeyup">
</div>
</template>

<style scoped lang="less">

@media screen and (max-width: 500px) {
    .card{
        padding: 0 15px;
        margin: 10px 0px;
        display: box;
        display: -webkit-box;
        i {
            color: #000;
            font-size: 26px;
            display: inline-block;
            margin-top: 0px;
            padding-top: 0;
            height: 23px;
            padding: 5px;
            float: left;
        }
        .online{
            padding: 5px;
            display: inline-block;
        }
    }
    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
    }

        .search {
            padding:0 10px;
            -webkit-box-flex: 1;
            -moz-box-flex: 1;
            box-flex: 1;
            display: block;
            font-size: 12px;
            color: #000;
            height: 30px;
            width: 100%;
            line-height: 30px;
            border: solid 1px #3a3a3a;
            border-radius: 4px;
            outline: none;
            /*background-color: #26292E;*/
        }

}
@media screen and (min-width: 500px) {

.card {
    padding: 12px;
    i {
        color: #ffffff;
        font-size: 26px;
        display: inline-block;
        margin-top: 0px;
        padding-top: 0;
        height: 23px;
        padding: 5px;
        float: left;
    }
    .online{
            padding: 5px;
            display: inline-block;
        }
    footer {
        margin-top: 10px;
    }

    .avatar, .name {
        vertical-align: middle;
    }
    .avatar {
        border-radius: 2px;
    }
    .name {
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
    }
    .search {

        padding: 0 10px;
        font-size: 12px;
        color: #000;
        height: 30px;
        width: 150px;
        line-height: 30px;
        border: solid 1px #3a3a3a;
        border-radius: 4px;
        outline: none;
        /*background-color: #26292E;*/
    }
}
}

</style>