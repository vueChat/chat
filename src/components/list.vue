<script>
import Vue from 'vue';
import { mapState } from 'vuex';

import directives from '../common/directives'
directives(Vue);


export default {
    data  () {
        return {
            mousedownShow: false,
            mousedowInfo: {id: 1, index: 1}
        }
    },
    methods: {
        selectSession (id, type, name, img) {
            this.$emit('mainShow');
            let data = {id: id, type: type, name: name, img: img};
            this.$store.dispatch('selectSession', data);
        },
        mousedown (i, index, e)  {
            if ( e.which == 3 ) {
                this.mousedownShow = true;
                console.log(e);
                this.$nextTick( () => {
                    this.$refs.recentContactsDel.style.top = e.pageY + 2 + 'px';
                    this.$refs.recentContactsDel.style.left = e.pageX + 2 + 'px';
                })
                this.mousedowInfo.id = i.id;
                this.mousedowInfo.index = index;
            };
            // console.log(i);
            // console.log(index);
            // console.log(event);
        },
        removeZjlxr ()  {
            // console.log(this.mousedowInfo.id);
            this.$store.dispatch('delSession', this.mousedowInfo.index);
        }
    },
    computed: mapState({
        currentId: (state) => {
            return state.currentSession.id
        },
        // sessions: (state) => {
        //     let result = state.sessions.filter(session => session.user.name.includes(state.filterKey));
        //     return result;
        // },
        sessions: (state) => {
            return state.sessions

        },
        searchFriend: (state) => {
            if ( state.filterKey == "" ) {return [];};
            let result = [];
            for (var i in state.friends) {
                if (state.friends[i].list) {
                    result = result.concat(state.friends[i].list.filter(friend => friend.username.includes(state.filterKey)))
                };
            }
            return result;
        },
        searchGroup: (state) => {
            if ( state.filterKey == "" ) {return [];};
            let group = state.group.filter(group => group.groupname.includes(state.filterKey));
            console.log(group);
            return group;
        },
        indexTab: (state) => state.indexTab,
        friends: (state)=> state.friends,
        group: (state)=> state.group,
        filterKey: (state) => state.filterKey
    }),
    created () {
        document.addEventListener('click', (e)=> {
            if (this.mousedownShow) {
                this.mousedownShow = !this.mousedownShow;
            };
        })
    }
};
Vue.directive('oncontextmenu', {
    bind: function (el) {
        el.oncontextmenu = function () {
            return false;
        }
    }
})
</script>

<template>
<div class="list">
    <div class="rcDel" v-if="mousedownShow" ref ="recentContactsDel">
        <ul>
            <li @click="removeZjlxr()">移除该会话</li>
        </ul>
    </div>
    <!-- 搜索 -->
    <div class="search"  v-if="filterKey">
         <ul  class="list-item">
            <li v-for="item in searchFriend" :class="{ active: item.id === currentId }" @click="selectSession(item.id, 'message', item.username, item.avatar)">
                <img class="avatar"  width="40" height="40" :alt="item.username" :src="'' + item.avatar">
                <p class="name">{{item.username}}</p>
            </li>
            <li v-for="g in searchGroup" @click="selectSession(g.id, 'groupMessage', g.groupname, g.avatar)">
                 <img class="avatar"  width="40" height="40" :alt="g.groupname" :src="'' + g.avatar">
                <p class="name">{{g.groupname}}</p>
            </li>
        </ul>
    </div>
<!-- 最近联系人 -->
    <div v-if = "1 == indexTab" id="zjlxr-box">

        <ul id="zjlxr" v-oncontextmenu ="sessions"  class="list-item">
            <li v-if="sessions.length <=0 " style="text-align: center;">还没有最近联系人！</li>
            <li v-for="(item, index) in sessions"
            :class="{ active: item.id === currentId }" @click="selectSession(item.id, item.type, item.user.name, item.user.img)"  @mousedown.3 ="mousedown(item, index, $event)">
                <img class="avatar"  width="40" height="40" :alt="item.user.name" :src="item.user.img">
                <p class="name">{{item.user.name}}</p>
                <span class="message-num" v-if="item.messageNum" >{{ item.messageNum }}</span>
            </li>
        </ul>
    </div>
    <!-- 好友列表 -->
    <div v-if = "2 == indexTab" class="friend-list-box">
        <ul class="friend-list list-item">
            <li v-for="item in friends" class="">
                <p>{{ item.groupname }}</p>
                <ul>
                    <li v-for="list in item.list"  @click="selectSession(list.id, 'message', list.username, '' + list.avatar)" :class="{ active: list.id === currentId }">
                        <img :src="'' + list.avatar" alt="" width="40" height="40">
                        <p class="name">{{ list.username }}</p>
                    </li>
                </ul>
                <!-- <img class="avatar"  width="30" height="30" >
                <p class="name">{{'测试'}}</p> -->
            </li>
        </ul>
    </div>
    <!-- 群 -->
    <div v-if = "3 == indexTab"  class="group-list-box">
         <ul class="group-list list-item">
            <li v-for="item in group" class="" @click="selectSession(item.id, 'groupMessage', item.groupname, '' + item.avatar)">
                <img class="avatar" :src="'' + item.avatar"   width="40" height="40" >
                <p class="name">{{ item.groupname }}</p>
            </li>
        </ul>
    </div>
</div>
</template>

<style scoped lang="less" >

@media screen and (max-width: 500px) {
    .list {
        top: 50px;
        left: 0;
        position: absolute;
        width: 100%;
        bottom: 50px;
        .list-item {
            position: absolute;
            bottom: 57px;
            top: 0;
            width: 100%;
            overflow: auto;
        }

    }
    .search,.group-list-box, friend-list-box, #zjlxr-box{
        height: 100%;
    }
    #zjlxr li{
        border-bottom: 1px solid #ccc;

    }
    .list {
    .rcDel {
        position: fixed;
        width: 150px;
        box-shadow: 0 0 4px #ccc;
        background-color: #fff;
        z-index: 999;
        color: #000;
        li {
            padding-left: 15px;
        }
    }
    .search { 
        position: absolute;background-color: #fff;width: 100%;
        z-index: 1;
         &::-webkit-scrollbar{width:100px ;display: block;}
        &::-webkit-scrollbar{width:10px;height:10px}
        &::-webkit-scrollbar-track{background:rgba(0,0,0,0)}
        &::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::-webkit-scrollbar-corner{background:#82afff}
        &::-webkit-scrollbar-resizer{background:#ff0bee}
        &::scrollbar{width:100px ;display: block;}
        &::scrollbar{width:10px;height:10px}

        &::scrollbar-track{background:rgba(0,0,0,0)}
        &::scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::scrollbar-corner{background:#82afff}
        &::scrollbar-resizer{background:#ff0bee}
    }
    .group-list{
        .name {
            width: 135px;
            display: inline-block;
            margin: 0 0 0 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .friend-list, .group-list, #zjlxr {
        &::-webkit-scrollbar{width:100px ;display: block;}
        &::-webkit-scrollbar{width:10px;height:10px}
        &::-webkit-scrollbar-track{background:rgba(0,0,0,0)}
        &::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::-webkit-scrollbar-corner{background:#82afff}
        &::-webkit-scrollbar-resizer{background:#ff0bee}
        &::scrollbar{width:100px ;display: block;}
        &::scrollbar{width:10px;height:10px}

        &::scrollbar-track{background:rgba(0,0,0,0)}
        &::scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::scrollbar-corner{background:#82afff}
        &::scrollbar-resizer{background:#ff0bee}
    }
    li {
        padding: 12px 0 12px 8px;
        cursor: pointer;
        transition: background-color .1s;
        position: relative;
        &:hover {
            background-color: rgba(255, 255, 255, 0.03);
        }
        &.active {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .message-num {
            position: absolute;
            display: line-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            background-color: #d32f2f;
            color: #fff;
            text-align: center;
            right: 10px;
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
        font-size: 2.1rem;
        margin: 0 0 0 15px;
    }
}
}
@media screen and (min-width: 500px) {
.list {
    .rcDel {
        position: fixed;
        width: 150px;
        box-shadow: 0 0 4px #ccc;
        background-color: #fff;
        z-index: 999;
        color: #000;
        li {
            padding-left: 15px;
        }
    }
    .list-item {
            height: 510px;
            overflow: auto;
        }
    .search { 
        position: absolute;background-color: #2a5431;width: 220px;
        z-index: 1;
         &::-webkit-scrollbar{width:100px ;display: block;}
        &::-webkit-scrollbar{width:10px;height:10px}
        &::-webkit-scrollbar-track{background:rgba(0,0,0,0)}
        &::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::-webkit-scrollbar-corner{background:#82afff}
        &::-webkit-scrollbar-resizer{background:#ff0bee}
        &::scrollbar{width:100px ;display: block;}
        &::scrollbar{width:10px;height:10px}

        &::scrollbar-track{background:rgba(0,0,0,0)}
        &::scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::scrollbar-corner{background:#82afff}
        &::scrollbar-resizer{background:#ff0bee}
    }
    .group-list{
        .name {
            width: 135px;
            display: inline-block;
            margin: 0 0 0 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .friend-list, .group-list, #zjlxr {
        &::-webkit-scrollbar{width:100px ;display: block;}
        &::-webkit-scrollbar{width:10px;height:10px}
        &::-webkit-scrollbar-track{background:rgba(0,0,0,0)}
        &::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::-webkit-scrollbar-corner{background:#82afff}
        &::-webkit-scrollbar-resizer{background:#ff0bee}
        &::scrollbar{width:100px ;display: block;}
        &::scrollbar{width:10px;height:10px}

        &::scrollbar-track{background:rgba(0,0,0,0)}
        &::scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::scrollbar-corner{background:#82afff}
        &::scrollbar-resizer{background:#ff0bee}
    }
    li {
        padding: 12px 0 12px 8px;
        cursor: pointer;
        transition: background-color .1s;
        position: relative;
        &:hover {
            background-color: rgba(255, 255, 255, 0.03);
        }
        &.active {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .message-num {
            position: absolute;
            display: line-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            background-color: #d32f2f;
            color: #fff;
            text-align: center;
            right: 10px;
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
        font-size: 2.1rem;
        margin: 0 0 0 15px;
    }
}
}

</style>