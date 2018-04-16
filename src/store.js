/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import Websocket from './Websocket';
import { reverse } from './messageHandel';
import messageHandle from './messageHandel';
import  events from './modules/events';


Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
    state: {
        // 当前用户
        user: {},
        friends: [
            { 
                "groupname": "全员", 
                "id": 1,
                'list': []
            }, 
            { 
                "groupname" : "好友", 
                "id": 2,
                'list': [

                ]
            }
        ],
        group: [],
        // 会话列表
        sessions: [],
        // tab index
        indexTab: 1,
        // 当前选中的会话
        currentSession: {
            id: '',
            name: '',
            img: ''

        },
                // 当前选中的会话 类型
        currentSessionType: 'message',
        // 过滤出只包含这个key的会话
        filterKey: '',
        searchFriend: [],
        userSet: {
            voice: 0,
            desktop: 0
        },
        iPhone: false,
    },
    mutations: {
        INIT_DATA (state, initData) {
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
                state.iPhone = true;
            }
            state.user.id = initData.data.mine.id;
            state.user.name= initData.data.mine.username;
            state.user.img= initData.data.mine.avatar ? initData.data.mine.avatar : '/chat/images/niming.png';
            state.friends= initData.data.friend;
            state.group= initData.data.group;


            let data = localStorage.getItem('vue-chat-session');
            let userSet = localStorage.getItem('chat-set');
            if (data) {
                state.sessions = JSON.parse(data);
            }
            if ( userSet ) {
                // console.log(userSet);
                state.userSet = JSON.parse(userSet);
            };
        },
        // 收到消息
        SEND_MESSAGE ({sessions, currentSession, user, friends, currentSessionType }, data) {
            // console.log(data)
            let saveMessage = {};
            let session = sessions.find(item => parseInt(item.id) === parseInt(data.dialogueId) && item.type === data.type );
            
            data.content = reverse(data.content);
            if ( data.senderId == user.id  ) {
                saveMessage = {
                    id: data.id,
                    content: data.content,
                    date: new Date(),
                    self: true
                }
            } else {
                saveMessage = {
                    id: data.id,
                    name: data.name, 
                    img: data.img,
                    content: data.content,
                    date: new Date()
                }
            }
            // 会话列表里有
            if ( session ) {
                // 发送者 和 聊天人 不是同一人
                if ( data.dialogueId != currentSession.id ) {
                    session.messageNum++;
                };
                // 消息只能保存十条
                if ( session.messages.length > 20 ) {
                    session.messages.shift();
                };
                session.messages.push(saveMessage);
                // 消息置顶
                let index = 0;
                for (let i in sessions  ) {
                    if ( parseInt(sessions[i].id) === parseInt(data.dialogueId) && sessions[i].type === data.type ) {
                        index = i;
                        break;
                    }
                }
                if ( index != 0 ) {
                    sessions.unshift(sessions.splice(index, 1)[0]);
                }
                 // 会话列表里没有
            } else {
                session = {
                    id: data.dialogueId,
                    user: {   
                        name: data.sessionName, 
                        img: data.sessionImg
                    },
                    messageNum: 0,
                    type: data.type,
                    messages: []
                }
                if ( data.dialogueId != currentSession.id ) {
                    session.messageNum++;
                };
                session.messages.push(saveMessage);
                sessions.unshift(session);
            }
            // if ( session && session.messageNum != 0 ) {
            //     Websocket.sendMessage({"type":"mes_close", "to_uid":data.id,  "session_no": data.id, "message_type": data.type});
            // };

        },
        // 选择会话
        SELECT_SESSION (state, data) {

            let session = state.sessions.find(item => parseInt(item.id) === parseInt(data.id) && item.type == data.type);
            // 服务器端消除消息
            if ( session && session.messageNum != 0 ) {
                Websocket.sendMessage({"type":"mes_close", "to_uid":data.id,  "session_no": data.id, "message_type": data.type});
            };
            if ( session && session.messageNum != 0 ) {
                session.messageNum = 0;
            };
            state.currentSession.id = data.id;
            state.currentSession.name = data.name;
            state.currentSession.img = data.img;
            state.currentSessionType = data.type;
        } ,
        // 后台接受的未读消息
        // ACCEP_MES (state, data) {
        //     console.log(data);
        // },
        DELSESSION (state, index) {
            state.sessions.splice(index,1);
        },
        // 选择 tab
        SELECT_TAB (state, index) {
            state.indexTab = index;
        },
        // 搜索
        SET_FILTER_KEY (state, value) {
            // console.log(4333);
            state.filterKey = value;
        },
        USER_SET (state, key , value) {
            // state.userSet[key] = value;
            console.log(state.userSet);
        },
        CLEAR_SESSION (state) {
            state.currentSession.id = '';
            state.currentSession.name = '';
            state.currentSession.img = '';
        }
        // 加载完成
        // COMPLETE (state, tf) {
        //     state.complete = tf;
        // }
    },
    actions: {
        initData: ({ commit, dispatch }, initData) => { 
             Websocket.on('open', function () {
                Websocket.sendMessage({"type": 'login', oms_id: initData.data.mine.oms_id, uid: initData.data.mine.id, header_img_url: initData.data.mine.avatar, token: initData.data.mine.token, client_name: initData.data.mine.username, room_id: initData.data.mine.oms_id });
            });
            Websocket.on('comeMessage', function (data) {
                let type = data.type;
                dispatch(type, data);
            });
            Websocket.connect();
            commit('INIT_DATA', initData);

        },
        sendMessage: ({ commit, state }, data) => {
            let sendMessage = {};
            let content = '';
            data.dialogueId = state.currentSession.id;

            data.senderId = state.user.id;
            data.name = state.currentSession.name;
            data.img = state.currentSession.img;
            data.type = state.currentSessionType;
            data.content = messageHandle(data.content);

            // 转换内容 
            sendMessage = {type:"sayUid", to_uid: state.currentSession.id, groupId: 0, accept_name: state.currentSession.name, message_type: state.currentSessionType, mes_types: 'text', content: data.content  };
            if ( state.currentSessionType != 'message'  ) {
                sendMessage.session_no = state.currentSession.id;
            };
            Websocket.sendMessage(sendMessage);
        },
        // 后台发来的未读消息，
        acceptMes: ({ commit, state }, data) => {
            let saveData;
            let name, sessionId,sessionName,img, sessionImg;
            if ( data ) {
                data.forEach(function ( d ) {

                    // return;
                    if ( d.message_type == 'message' ) {
                        sessionName = d.sender_name;
                        name = d.sender_name;
                        img =  d.chat_header_img,
                        sessionImg = d.chat_header_img,
                        sessionId = d.sender_id;
                    } else {
                        img = d.chat_header_img,
                        sessionImg =  '/chat/images/ren.png',
                        sessionName = d.accept_name;
                        name = d.sender_name;
                        sessionId = d.session_no;
                    }
                    // state.sessions.forEach(function () {
                    //     console.log(33);
                    // });
                    // let session = state.sessions;
                    // 是否存在这个消息
                    let session = state.sessions.find(item => parseInt(item.id) === parseInt(sessionId) && item.type === d.message_type );
                    if ( session ) {
                        let sessionSave = session.messages.find(item=>parseInt(item.id) === parseInt(d.id));
                        if (sessionSave) {
                            return false;
                        }
                    }
                    saveData = {
                        id: d.id,
                        content: d.message_content,
                        senderId: d.sender_id,
                        dialogueId: sessionId,
                        name: name,
                        sessionName: sessionName,
                        sessionImg: sessionImg,
                        img: img,
                        type: d.message_type

                    };
                    commit('SEND_MESSAGE', saveData);
                    // console.log(saveData);
                });
            };
            // console.log(data);
            return false;

        },
        selectSession: ({ commit }, data) => {commit('SELECT_SESSION', data)},
        delSession: ({ commit }, index) => {
            commit('DELSESSION', index);
        },
        selectTab: ({ commit }, id) => commit('SELECT_TAB', id),
        search: ({ commit }, value) => commit('SET_FILTER_KEY', value),
        userSet: ({commit}, key, value) => commit('USER_SET', key, value),
        clearSession: ({commit}) => commit('CLEAR_SESSION')
    },
    modules: {
        events
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        localStorage.setItem('vue-chat-session', JSON.stringify(val));
    },
    {
        deep: true
    }
);


export default store;
