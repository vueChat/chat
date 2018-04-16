import emojis from './common/emojis';
const handelMessage = function ( content ) {
	 content = content.replace(/\n/g, '&lbrg')
  .replace(/\t/g, ' ');
   //转义换行 
	return content;
}
export const reverse = function ( content ) {
  if ( !content ) {
    return ;
  };
  // console.log(content);return false;
	content = content.replace(/&lbrg/g, '<br>')
   //  转义换行
	.replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
      var alt = face.replace(/^face/g, '');
      return '<img alt="'+ alt +'" title="'+ alt +'" src="' + faces[alt] + '">';
    })
    .replace(/【(.*?)】/g, function ( f, v ) {
      let em = emojis.find(em => {
          return em.name == v;
      });
      let img = '<img width="20px"  src="/chatStatic/emoji/'+em.num+'@2x.png" alt="'+em.name+'" />'
    	return img;
    }).
    replace(/-(file|img)-\[(.*?)\]/g, function (f, i, z) {
      let m = '';
      let zArr = z.split('|');
      if ( z[1] ) {
        if ( i == 'img' ) {
            m = '<img style="max-width: 300px;" class="chat-img" src="'+zArr[1]+'" alt="'+zArr[0]+'" />';
        } else {
          m = '<div class="chat-file"><a title="'+zArr[0]+'" href="'+zArr[1]+'" download target="_blank"><i class="iconfont-chat">&#xe662;</i><p title="'+zArr[0]+'">'+zArr[0]+'</p></a></div>';
        }
      };
      return m;
    })
    return content;
}
export default handelMessage;