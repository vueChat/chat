
<script>
import { mapState } from 'vuex'
export default {
    data: function () {
        return {
            selfInfo: false,
            setShow: false,
            sets: {
                voice: [
                    '开启声音',
                    '关闭声音'
                ],
                desktop: [
                    '开启桌面通知',
                    '关闭桌面通知'
                ]
            }
        };
    },
    computed: mapState({
        user: ({ user }) => user,
        filterKey: ({ filterKey }) => filterKey,
        indexTab: ({ indexTab }) => indexTab,
        userSet: ({ userSet }) => userSet,
    }),
    // name: 'menu',
    // data: function () {
    // },
	// vuex: {
 //        actions: actions,
 //        getters: {
 //            user: ({ user }) => user,
 //            filterKey: ({ filterKey }) => filterKey,
 //            indexTab: ({ indexTab }) => indexTab,
 //        },
 //    },
    methods: {
        selectTab: function (num) {
            this.$store.dispatch('selectTab', num);
        },
        showInfo: function (e) {
            if ( !this.selfInfo ) {
                this.selfInfo = !this.selfInfo;
                
            };
        },
        setUser (i) {
            let userSet = this.userSet;
            userSet[i] = userSet[i] == 0 ? 1 : 0;
            this.$store.dispatch('userSet', i, userSet[i]);
            localStorage.setItem('chat-set', JSON.stringify(userSet));
        }
    },
    created () {
        document.addEventListener('click', (e) => {
            if (  this.selfInfo ) {
                 this.selfInfo = !this.selfInfo;
             }
             if ( this.setShow ) {
                 this.setShow = !this.setShow;
             };
        })
    }
}

</script>
<template>
	<div class="menu">
		<ul>
			<li style="position: relative" class="header-img" @click.stop="showInfo()" ><img :src="user.img" width="40px" height="40px" alt="">
                <div class="selfInfo" ref="si" v-if="selfInfo">
                    <div>
                        <span>{{ user.name }}</span>
                    </div>
                    <div>
                        <!-- <span>职位：</span> -->
                    </div>
                </div>
            </li>
            <li :class="{actionColor:1 ==  indexTab}" @click="selectTab(1)" > <i class="iconfont-chat">&#xe62d;</i> </li>
            <li :class="{actionColor:2 ==  indexTab}" @click="selectTab(2)"><i class="iconfont-chat">&#xe600;</i></li>
			<li :class="{actionColor:3 ==  indexTab}" @click="selectTab(3)"><i class="iconfont-chat">&#xe682;</i></li>
		</ul>
        <div class="chat-set" title="设置">
            <i @click.stop="setShow = !setShow"><img src="../assets/liebiao.png" alt=""></i>
            <transition name="fade">
                <ul class="chat-set-list" v-if="setShow">
                    <li><a href="/chat/new_groupChat.php">新建群聊</a></li>
                    <li v-for="(set, index) in sets" @click.stop="setUser(index)">{{set[userSet[index]]}}</li>
                </ul>
             </transition>
        </div>
	</div>
</template>
<style scoped lang="less">
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
@media screen and (max-width: 500px) {
    .menu {
        .header-img, .chat-set{
            display: none;
        }
        ul li{
            width: 33%;
            height: 100%;
            line-height: 60px;
            text-align:center;
            float: left;
            i {
                width: 40px;
                height: 40px;
                font-size: 26px;
            }
        }
    }
    .actionColor { 
            i {
                color: #1dbe1a;
            }
        }
}
@media screen and (min-width: 500px) {
	.menu {
        position: relative;
        cursor:pointer; 
		width: 60px;
        height: 100%;
        li {
            text-align: center;
            padding: 10px;
            i {
                font-size: 26px;
            }
        }
        .actionColor { 
            background-color: rgba(228, 219, 219, 0.3);
            i {
                color: #1dbe1a;
            }

        }
        .selfInfo {
            position: absolute;
            width: 200px;
            height: 200px;
            top: 50px;
            left: 50px;
            z-index: 1000;
            color: #000;
            background-color: #fff;
        }
        .selfInfo > div {
            padding: 20px;
            text-align: left;
        }
        .selfInfo > div > span{
            font-size: 20px;
        }
        .chat-set {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 50px;
            .chat-set-list {
                position: absolute;
                text-align: left;
                left: 10px;
                bottom: 100%;
                width: 160px;
                color: #000;
                background-color: #fff;
                box-shadow: 0 6px 12px rgba(0,0,0,.175);
                border-radius: 5px;
                z-index: 99;
            }
        }
        .chat-set i{
            width: 100%;
            height: 50px;
            display: block;
            text-align: center;

        }
	}
}

</style>