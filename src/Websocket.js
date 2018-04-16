
var ws = '';
let callbacks = {};

const act = {
	COME_MESSAGE: (e)=> {
		 let data = eval("(" + e.data + ")");
		 callbacks.comeMessage && callbacks.comeMessage(data);
	},
	SEND_MESSAGE: ( data ) => {
		let str = JSON.stringify(data);  
		ws.send(str);
	},
	OPEN: () => {
		// setTimeout(function () {
			callbacks.open && callbacks.open();
		// }, 500);
	},
	TEXT: () => {
		console.log(callbacks.text);
		callbacks.text();
	}
}


const websocket = {
	on: (name, callback)=> {
		callbacks[name] = callback;
	},
	sendMessage: (data) => {
		act.SEND_MESSAGE(data)
	},
	connect: () =>{
		ws = new WebSocket("ws://" + document.domain + ":7272");
		ws.onopen = act.OPEN;
		// 当有消息时根据消息类型显示不同信息
		ws.onmessage = act.COME_MESSAGE;
		ws.onclose = function() {
		    console.log("连接关闭，定时重连");
		};
		ws.onerror = function() {
		    console.log("出现错误");
		};
	} 

}

export default websocket;
