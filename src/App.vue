<template>
<div id="chat-app">
    <div title="按[esc]键最大化" class="chat-min" v-if="!chatMainShow" @click="chatMainShow = !chatMainShow">
        <i class="mesNum" v-if="mesNum > 0">
            {{mesNum > 99 ? '99+' : mesNum }}
        </i>
        <i><img src="./assets/liaotian.png" alt="" ></i>
    </div>
    <transition name="show">
        <div id="chat-main"  class="chat-main" ref="chatDrop" v-if="chatMainShow">
            <div v-if="!complete" class="mask">
                <div class="img">
                    <img src="./assets/loade.gif" alt="">
                </div>
            </div>
             <div class="term">
                <menuList></menuList>
            </div>

            <div class="sidebar">
                <card></card>
                <list @mainShow="mainShow = false"></list>
            </div>
            <div class="">
                
            </div>
            <div class="main" v-if="!mainShow">
                <div class="windowList" v-if="!iPhone">
                    <ul>
                        <li title="按[esc]键最小化 " @click.stop="chatMainShow = !chatMainShow">X</li>
                    </ul>
                </div>

                <message @mainShow="mainShow = true"></message>
                <TextAre></TextAre>
            </div>
              <!--  隐藏聊天 -->
            <div class="dialog-title" v-if="mainShow">
                <i class="backSession" @click.stop="chatMainShow = false"></i>
                <span class="text-left dialogue-title-name">聊天</span>
            </div>
        </div>
    </transition>
    
</div>

</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import vueR from 'vue-resource'

import Card from './components/card'
import menuList from './components/menuList'
import List from './components/list'
import TextAre from './components/text'
import Message from './components/message'

require('./assets/css/aliIcon.css');
// const Loadmore = require('vue-loadmore').default;
Vue.use(vueR);

export default {
    name: 'app',
    components: {Card, menuList, List, Message, TextAre},
    computed: mapState({
        complete: (state) => {
            return state.events.complete
        },
        mesNum: (state) => {
            let mesNum = 0;
            state.sessions.forEach(function (m) {
                mesNum += m.messageNum;
            });
            return mesNum;
        }
    }),
    data () {
        return {
            chatMainShow: false,
            iPhone: false,
            mainShow: false,
        }
    },
    mounted () {
        let isMobile = function(){
            let userAgentInfo = navigator.userAgent;
            let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
            let flag = false;
            for (let v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
            };
            return flag;
        }();
        if(isMobile){
            this.iPhone = true;
            this.mainShow = true;
        }
        document.onkeydown =  (e) => {
            if (e.keyCode == 27 ) {
                this.chatMainShow = !this.chatMainShow;
            };
        }
        // 请求人员信息
        this.$http.get('/static/omsIm/demo/json/json.js')
            .then((response) => {
                this.$store.dispatch('initData', response.data);
                // 请求消息数量
                this.$http.get('/static/omsIm/demo/json/jsonMessage.js?class=mesNum')
                    .then((response) => {
                        this.$store.dispatch('acceptMes', response.data.reverse());
                    })
                    .catch(function(response) {
                        console.log(response)
                    });
            })
            .catch(function(response) {
                console.log(response)
            });
        
    },
    methods: {
        transf () {

        }
    },
}

</script>

<style lang="less">
body, html {
    height: 100%;
    overflow: hidden;
}
body {
    margin: 0;
  font: 14px/1.4em 'Helvetica Neue', Helvetica, 'Microsoft Yahei', Arial, sans-serif;
  background-size: cover;
  font-smoothing: antialiased;
  width: 100%;
  height: 100%;
}
ul {
    margin: 0;
    padding: 0;
    li {
      list-style-type: none;
    }
}
img{
    vertical-align: middle;
}
</style>
<style lang="less" scoped>
@media screen and (max-width: 500px) {
    #chat-app{
        width: 100%;
        
    }
    #chat-main, .main{
        width: 100%;
        height: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999999;
        background-color:#fff;
    }
    .chat-min {
        position: fixed;
        z-index: 999999;
        bottom: 28px;
        right:28px;
    }
    .mesNum{
        position: absolute;
        text-align:center;
        line-height: 26px;
        top: -9px;right: -13px;
        background-color: #ca4646;
        color: #fff;
        border-radius: 13px;
        width:26px;
        height:26px;
    }
    .term{
        width: 100%;
        height: 60px;
        position: fixed;
        z-index: 999;
        cursor: pointer;
        background-color: #f9f9f9;
        bottom: 0;
        left: 0;
        border-top: 1px solid #ccc;
    }
    .sidebar{
        position: absolute;
        top: 46px;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .windowList{
        display: none;
    }
    .main{
        position:relative;
        top: 0;
        left: 0;
        z-index: 999;
        background-color: #efeff4;
    }
    .dialog-title {
        height: 45px;
        border-bottom: 1px solid #ccc;
        cursor: move;
        background-color: rgb(48, 48, 54);
        color: #fff;
        text-align: center;
        .dialogue-title-name {
            height: 100%;
            line-height: 45px;
            font-size: 20px;
            display: inline-block;
        }
        .backSession {
            position: absolute;
            top: 0;
            left: 10px;
            display: inline-block;
            width:32px;
            height:45px;
            line-height: 45px;
            background: url('assets/xyjt.png') center no-repeat;
        }
    }
    .mask {
        background-color: rgba(255,255,255,0.8);
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:999999;
        .img {
            position: relative;
            top:50%;
            margin-top:-16px;
            text-align:center;
            vertical-align:middle;
            width:32px;
            line-height:100%;
            height:100%;
            margin:auto;
        }
    }
}
@media screen and (min-width: 500px) {

.chat-min {
    cursor: pointer;
    position: fixed;
    z-index: 999999;
    bottom: 28px;
    right:28px;
}
.mesNum{
    position: absolute;
    text-align:center;
    line-height: 26px;
    top: -9px;right: -13px;
    background-color: #ca4646;
    color: #fff;
    border-radius: 13px;
    width:26px;
    height:26px;
}
.show-enter-active {
    transition: 0.8s;
    transform: scale(1,1);
    opacity: 1;
}
.show-enter, .show-leave-active{
    transition: 0.5s;
    opacity: 0;
    transform: scale(0.01,0.01);
    bottom: 29px; 
    right: 29px;
}

.windowList{
    height: 5px;
    ul {
        float: right;
        li {
            padding: 10px 15px;
            font-size: 20px;
            cursor: pointer;
        }
    }
}
#chat-main {
    width: 860px;
    height: 600px;
    position: fixed;
    z-index: 99999;
    top: 20px;
    left: 50%;
    margin-left: -430px;
    border-radius: 3px;
    .mask {
        background-color: rgba(255,255,255,0.8);
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:999999;
        .img {
            position: relative;
            top:50%;
            margin-top:-16px;
            text-align:center;
            vertical-align:middle;
            width:32px;
            line-height:100%;
            height:100%;
            margin:auto;
        }
    }
    .sidebar, .main, .term {
        height: 100%;
    }
    .term {
        float: left;
        color: #f4f4f4;
        background-color: #2e3238;
    }
    .sidebar {
        float: left;
        width: 220px;
        color: #f4f4f4;
        background-color:#38354a;
    }
    .main {
        border: 1px solid #ccc;
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
    .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    .message {
        height: ~'calc(100% - 160px)';
    }
    ul {
      margin: 0;
      padding: 0;
    }
}
}


</style>

