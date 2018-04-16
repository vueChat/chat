import messageHandel from '../messageHandel';
import showMsgNotification from '../common/showMsgNotification';

// const selfLogin = 'SELF_LOGIN';

let voice = function() {
    var audio = document.createElement("audio");
    audio.src = '/omsIm/source/layui/css/modules/layim/voice/default.wav';
    audio.play();
};

const state = {
  complete: false,
  onlineMan: 0,
}

const getters = {
  complete: ( state, getters, rootState ) => state.complete
}

const mutations = {
	SELF_LOGIN (state, data) {
		for (let i in data) {
			state.onlineMan ++;
		}
		// 去除自己
		state.onlineMan --;
		state.complete = true;
	},
	LOGIN (state) {
		state.onlineMan ++;
	},
	SAYUID ( state, data) {
		console.log(data);
	},
	LOGOUT (state) {
		state.onlineMan --;
	}
}
const actions = {
	selfLogin: ({ state, commit }, data)=> {

		commit('SELF_LOGIN', data.data.client_list);
	},
	login: ({ state, commit }, data) => {
		commit('LOGIN');
		return false;
	},
	logout: ({ state, commit }, data) => {
		commit('LOGOUT');
	},
	ping: (data)=> {

	}, 
	say_uid: ({ state, commit, rootState }, data) => {
		// if ( data.sender_id == rootState.currentSession.id ) {
		// 	// rootState.
		// } else {
			
		// }
		let name, sessionId,sessionName,img, sessionImg;

		if ( data.mestype == 'message' ) {
			sessionName = data.accept_name;
			name = data.accept_name;
			img =  data.card_image,
			sessionImg = data.card_image,
			sessionId = data.sender_id;
		} else {
			img = data.card_image,
			sessionImg =  '/chat/images/ren.png',
			sessionName = data.group_name;
			name = data.accept_name;
			sessionId = data.session_no;
		}
		let saveData = {
			id: data.id,
			content: data.message_content,
			senderId: data.sender_id,
			dialogueId: sessionId,
			sessionName: sessionName,
			name: name,
			sessionImg: sessionImg,
			img: img,
			type: data.mestype

		};
		voice();
		showMsgNotification('聊天消息', data.message_content, sessionImg);
		commit('SEND_MESSAGE', saveData);
	},
	mesClose: (data)=> {

	},
	resSayUid: ({ state, commit, rootState }, data) => {
		let sessionImg, sessionName, name, img;
		if ( data.mestype == 'message' ) {
			sessionName = rootState.currentSession.name;
			sessionImg = rootState.currentSession.img;
			name = rootState.currentSession.name;
			img = rootState.currentSession.img;
		} else if ( data.mestype == 'groupMessage' ) {
			sessionName = data.group_name;
			sessionImg = '/chat/images/ren.png';
			name = rootState.currentSession.name;
			img = rootState.currentSession.img;
		}
		let sessionId = '';
		let saveData = {
			id: data.id,
			content: data.message_content,
			senderId: data.sender_id,
			dialogueId: rootState.currentSession.id,
			name: name,
			sessionName: sessionName,
			sessionImg: sessionImg,
			img: img,
			type: data.mestype

		};
		// voice();
		commit('SEND_MESSAGE', saveData);
	}
}
const events = {
	state,
	actions,
	mutations
}
export default events;