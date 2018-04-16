<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import VueR from 'vue-resource';
import VueQArt from 'vue-qart'
Vue.use(VueR);
Vue.use(VueQArt);
Vue.component('messagesLog', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./modalMessage'], resolve)
});
// window.QRCode = QRCode;
// var QRCode = require('../assets/js/qrcode.js');
export default {
	data () {
		return {
			userInfo: {},
			showMessageLog: false,
			msg: '',
	        downloadButton: false,
	        qrcodeShow: false,
		} 
	},
    computed: mapState({
        user: ({ user }) => user,
        currentSession: ({currentSession}) => currentSession,
    }),
    components: {
    	VueQArt
    },
    methods: {
    },
    created () {
    	this.$http.get('/omsIm/demo/json/getList.php?class=userInfo&uid=' + this.currentSession.id)
    	.then(res=> {
    		this.userInfo = res.data;
    	})
    	.catch(res => {

    	})
    }
};
</script>

<template>

<!-- 手机 title -->
<div class="person-info">
<div class="qrcode-mask" v-if="qrcodeShow" @click="qrcodeShow = false">
	<div class="qrcode">
		<vue-q-art :config="{value: 'http://www.omso2o.com/oms_staff_details_qrcode.php?staffid=' + currentSession.id,imagePath: '/images/1.jpg',filter: false,size: 200}" :downloadButton="downloadButton"></vue-q-art>
		<span>扫一扫上面的二维码，加我好友</span>
	</div>
</div>
	<messagesLog :show="showMessageLog" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
	<div class="dialog-title" ref="chatDrop" v-chat-drop>
	    <i class="backSession" @click="$emit('close')"></i>
	    <!-- <i class="backSession" @click="clearSession()"></i> -->
	    <span class="text-left dialogue-title-name">{{ currentSession.name + '详情'}}</span>
	</div>
	<div class="person-info-body">
		<div class="person-info-img">
			<img :src="userInfo.card_image_middle" alt="">
		</div>
		<div class="person-info-text">
			<ul>
				<li><i class="iconfont-chat">&#xe625;</i><span>{{ userInfo.mobile_phone }}</span></li>
				<li><i class="iconfont-chat">&#xe63f;</i><span>{{ userInfo.tel ? userInfo.tel : '----' }}</span></li>
				<li><i class="iconfont-chat">&#xe62a;</i><span>{{ userInfo.tel_branch ? userInfo.tel_branch : '----' }}</span></li>
			</ul>
		</div>
		<div style='clear: both'></div>
		<div id ="qrcode" ref= 'qrcode'></div>
		<div class="chat-record">
			<ul>
				<li><span>聊天记录: </span><i class="iconfont-chat" @click="showMessageLog = true">&#xe6ce;</i></li>
				<li><span>我的二维码: </span><i class="iconfont-chat" @click="qrcodeShow = true">&#xe62b;</i></li>
				<li></li>
			</ul>
		</div>
		<div class="send-message-box">
			<span class="send-message" @click="$emit('close')">发消息</span>
		</div>
		<div>
			
		</div>
	</div>
</div>

</template>

<style scoped lang="less">



@media screen and (max-width: 500px) {
.qrcode-mask {
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
	z-index: 999;
	.qrcode {
		background-color: #fff;
		width: 220px;
		height: 240px;
		position: absolute;
		text-align: center;
		top: 50%;
		left: 50%;
		margin-top: -110px;
		margin-left: -120px;
	}
}
.person-info{
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 99999;
	background-color: #fff;
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
	        background: url('../assets/xyjt.png') center no-repeat;
	    }
	    .man-info {
	        position: absolute;
	        top: 0;
	        right: 10px;
	        display: inline-block;
	        width:32px;
	        height:45px;
	        line-height: 45px;
	        font-size: 26px;
	    }
	}
	.person-info-body {
		padding: 20px 10px;
		.chat-record {
			padding: 20px;
			li {
				padding: 10px;
			}
			span {
				font-size: 18px;
			}
			i {
				font-size: 26px;
				padding: 0  0  0 10px;
			}
		}
		.send-message-box {
			display: none;
		}
	}
	.person-info-img {
		width: 50%;
		float: left;
		text-align: center;
		img {
			width: 150px;
		}
	}
	.person-info-text {
		width: 50%;
		float: left;
		text-align: bottom;
		ul {
			margin-top: 40px;
			li {
				font-size: 18px;
				padding: 10px 5px;
				i{
					padding: 0 6px;
				}
			}
		}
	}
}
}
@media screen and (min-width: 500px) {
.qrcode-mask {
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.5);
	top: 0;
	left: 0;
	z-index: 999;
	.qrcode {
		background-color: #fff;
		width: 220px;
		height: 240px;
		position: absolute;
		text-align: center;
		top: 50%;
		left: 50%;
		padding: 10px;
		margin-top: -110px;
		margin-left: -120px;
	}
}
.person-info{
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 99999;
	background-color: #fff;
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
	        background: url('../assets/xyjt.png') center no-repeat;
	    }
	    .man-info {
	        position: absolute;
	        top: 0;
	        right: 10px;
	        display: inline-block;
	        width:32px;
	        height:45px;
	        line-height: 45px;
	        font-size: 26px;
	    }
	}
	.person-info-body {
		padding: 20px 50px;
		.chat-record {
			border-top: 1px solid #ccc;
			padding: 20px;
			li {
				padding: 10px;
			}
			span {
				font-size: 18px;
			}
			i {
				font-size: 26px;
				padding: 0  0  0 10px;
			}
		}
		.send-message-box {
			text-align: center;
			.send-message {
				cursor: pointer;
			    background-color: #79b575;
			    color: #fff;
			    padding: 3px 40px;
			    display: inline-block;
			    line-height: 30px;
			    text-align: center;
			    margin: 3px 32px;
			}
		}
	}
	.person-info-img {
		width: 50%;
		float: left;
		text-align: center;
		img {
			width: 150px;
		}
	}
	.person-info-text {
		width: 50%;
		float: left;
		text-align: bottom;
		ul {
			margin-top: 40px;
			li {
				font-size: 18px;
				padding: 10px 5px;
				i{
					padding: 0 6px;
				}
			}
		}
	}
}
}

</style>