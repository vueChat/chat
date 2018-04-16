
//  请求token 

let qiniu = function () {
	this.v = 1.0;
}
qiniu.prototype.getQiniuToken = function( url, callback ) {
	var $xmlhttp;
	var $upTokenUrl;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        $xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        $xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
	// $xmlhttp = xmlhttp();
	$xmlhttp.onreadystatechange = function() {
		if ($xmlhttp.readyState == 4) {
			if($xmlhttp.status == 200){
					callback($xmlhttp.responseText);
			} else {
				callback($xmlhttp.responseText);
					// alert('get uptoken other than 200 code was returned')
			}
		}
	}
	$upTokenUrl = url;
	$xmlhttp.open('GET', $upTokenUrl, true);
	$xmlhttp.send();
};

qiniu.prototype.Qiniu_upload = function( option, callback ) {
	var option = option || {
		key: '',
		tokenurl: '',
		f: '',
		QiniuUrl: '',
	};
	this.getQiniuToken(option.tokenurl, function (token) {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', option.QiniuUrl, true);

		var formData, startDate;
		formData = new FormData();
		if (option.key !== null && option.key !== undefined) formData.append('key', option.key);
		formData.append('token', token);
		formData.append('file', option.f);
		var taking;
		// xhr.upload.addEventListener("progress", function(evt) {
		// 	if (evt.lengthComputable) {
		// 		var nowDate = new Date().getTime();
		// 		taking = nowDate - startDate;
		// 		var x = (evt.loaded) / 1024;
		// 		var y = taking / 1000;
		// 		// var uploadSpeed = (x / y);
		// 		// var formatSpeed;
		// 		// if (uploadSpeed > 1024) {
		// 		//     formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
		// 		//     // $('#formatSpeed').html(formatSpeed);
		// 		// } else {
		// 		//     formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
		// 		//     // $('#formatSpeed').html(formatSpeed);
		// 		// }
		// 		// var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		// 		// progressbar.progressbar("value", percentComplete);
		// 		// console && console.log(percentComplete, ",", formatSpeed);
		// 	}
		// }, false);
		xhr.onreadystatechange = function(response) {
			if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
					var blkRet = JSON.parse(xhr.responseText);
					typeof callback == 'function' && callback(blkRet); 
					return false;
			} else if (xhr.status != 200 && xhr.responseText) {
					var blkRet = JSON.parse(xhr.responseText);
					typeof callback == 'function' && callback(blkRet); 
					return false;
					// console.log(blkRet);
			}
		};
		// startDate = new Date().getTime();
		// $("#progressbar").show();
		xhr.send(formData);
	})
};

const qiniuUpload = new qiniu();

export default qiniuUpload;