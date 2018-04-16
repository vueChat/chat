<?php
define('ROOT', $_SERVER["DOCUMENT_ROOT"]);

require_once ROOT . '/config.inc.php';
require_once ROOT . '/newOms_customer_quotation/vendor/autoload.php';
require_once ROOT . '/newOms_customer_quotation/database/ORM.php';

use app\chatInit;
use app\oms_message_record;
use app\oms_hr;

if ( isset($_GET['class']) ) {
	// 查找自己的信息
	if ( $_GET['class'] == 'single' ) {
		// 自己的信息
		$staffidInfo = chatInit::getSelfInfo();	
		// token	
		$secret = 'oms';
		$token = md5(date('y-m-d h:i').$staffidInfo['staffid'].$_SESSION['oms_id'].$secret);
		die(json_encode([
			'code'=>0, 
			'msg'=>'', 
			'res'=>[
				'username'=> $staffidInfo['name'],
				'uid'=> $staffidInfo['staffid'],
				'headerImgUrl'=> $staffidInfo['card_image_smail'] ,
				'roomId'=> $_SESSION['oms_id'], 
				'token'=> $token,
			]
		]));
	}
	// 消息的数量
	if ( $_GET['class'] == 'mesNum' ) {
		// 单聊消息
		$MesNum = [];
		$mesIds = [];
		$data = [];
		// $singleMesNum = $Capsule::select('SELECT SUM(`mes_num`) as mesNum FROM `oms_chat_message_ist` WHERE `pid`="' . $_SESSION['staffid'].'"');

		$singleMesNum = $Capsule::table('oms_chat_message_ist')->where('pid', $_SESSION['staffid'])->select('mesIds')->get()->toArray();
		
		// 群聊消息
		$doubleMesNum = $Capsule::table('oms_groups_people')->where('staffid', $_SESSION['staffid'])->where('mes_state', 1)->select(['mesIds'])->get()->toArray();

		// $sumMes = $singleMesNum + $doubleMesNum;

		// $sql = "SELECT SUM(`mes_num`) as mesNum FROM `oms_groups_people` WHERE `mes_state`=1 AND  `staffid`=?";
		// echo $sql;
		// $doubleMesNum = $Capsule::select( $sql, [ $_SESSION['staffid'] ]);
		$allMesId = array_merge($doubleMesNum, $singleMesNum);
		foreach ($allMesId as $key => $value) {
			$mesIds[] = $value->mesIds;
		}
		if ( $mesIds ) {
			$strmesIds = implode(',', $mesIds);
			$data = $Capsule::select('SELECT  b.*,"friend" as type, c.`card_image_smail` as `chat_header_img` FROM `oms_string_message` b LEFT JOIN `oms_hr` as c on b.`sender_id` = c.`staffid`  WHERE b.`id` in ('.$strmesIds.')');
		}
		die(json_encode($data));
		# code...
	}
	// 分页
	if ( $_GET['class'] == 'page' ) {
		$id = $_GET['id'];
		$type = $_GET['type'];
		$p = (int)$_GET['p'] ? $_GET['p'] : 1;
		$pageSize = 10;
		$limit = $pageSize * ($p - 1);

		if ( !empty($id) ) {
			//$sql = "SELECT * FROM `oms_string_message` WHERE `delState` = 0 AND session_no="."'{$this->session_no}' ORDER BY create_time desc limit 0,".$this->pageload;
			if ( $type == 'friend' ) {
				
				$session_no = $id > $_SESSION['staffid'] ?  $_SESSION['staffid'].'-'.$id : $id.'-'. $_SESSION['staffid'];
				// $res = oms_message_record::select('*')->where(['session_no' => $session_no, 'delState' => 0])->orderBy('create_time', 'desc')->skip($limit)
	                           // ->take($pageSize)->get();
				// print_r($arrRes);
			} elseif ( $type == 'group' ) {
				$session_no = $id;
			}
			$res = $Capsule::select("SELECT a.`id`, a.`message_content`, a.`mesages_types`, a.`create_time`, a.`sender_name`, a.`sender_id`, b.`card_image_smail` , a.`delState`, a.`accept_name` FROM `oms_string_message` a LEFT JOIN `oms_hr` b ON a.`sender_id` = b.`staffid`  WHERE a.`dialog` = 1 AND  a.`session_no`= '".$session_no."' ORDER BY id desc limit {$limit}, {$pageSize}");
			if ( $res ) {
				$arrRes = $res;
				$newArrRes = [];
				// 查询头像
				// $ohterCard_image = oms_hr::select('card_image')->where(['staffid' => $arrRes[0]['sender_id']])->first();

				// $selfCard_image = oms_hr::select('card_image')->where(['staffid' => $arrRes[0]['accept_id']])->first();

				foreach ($arrRes as $key => $value) {
					// if ( $value['sender_id'] == $_SESSION['staffid']  ) {
					// 	$card_image = $selfCard_image->card_image;
					// } else {
					// 	$card_image = $value['card_image'];
					// }
					$createTime = date('Y-m-d H:i:s', $value->create_time);
					$newValue = [
						'username' => $value->sender_name,
						'id' => $value->sender_id,
						'avatar' => $value->card_image_smail,
						'timestamp' => $createTime,
						'content' => $value->message_content

					];
					$newArrRes[$key] = $newValue;
				}
				$data = [
					'code'=> 0
    				,'msg'=> ''
    				,'p'=> $p
    				,'statu'=> 1
    				,'data' => $newArrRes
				];
				die(json_encode($data));
			}
			die([
					'code'=> 0
    				,'msg'=> ''
    				,'statu'=> 0
    			]);
		}
	}
	// 群人数
	if ( $_GET['class'] == 'groupMembers' ) { 
		$groupMembers  = [];
		$res = [];
		if ( !empty($_GET['id']) ) {
			$groupMembers = $Capsule::select('SELECT a.`staffid` as `id`, b.`card_image_smail` as `avatar`, b.`name` as `username` FROM `oms_groups_people` a LEFT JOIN `oms_hr` b ON a.`staffid` = b.`staffid` WHERE a.`pid`="' . $_GET['id'].'"');
		}
		$res = [
			'code' => 0,
			'msg' => '',
			'data' => [
				'list' => $groupMembers
			]
		];
		die(json_encode($res));
	}
	//搜索好友
	if ( $_GET['class'] == 'searchFriend' ) {
		if ( $_GET['para'] != '' ) {
			die(chatInit::searchFriend($_GET['para']));
		}
	}
	// 通知消息 数量
	if ( $_GET['class'] == 'msgbox'  ) {

		die(json_encode(chatInit::msgbox()));
	}
	
	die(json_encode(['code'=>1, 'meg'=> '缺少参数']));
}
// post 传过来的数据
if ( !empty($_POST['class']) ) {
	if ( $_POST['class'] == 'addFriend' ) {
		if ( !empty( $_POST['staffid'] ) ) {
			$res = chatInit::addFriend($_POST['staffid'], $_POST['orgName']);
			die(json_encode($res));
		}
	}
	// 通知消息
	if ( $_POST['class'] == 'notice' ) {
		$res = chatInit::mesNotice($_SESSION['staffid']);
		die(json_encode($res));
	}
	// 好友申请 处理
	if ( $_POST['class'] == 'friendApply' ) {
		if ( $_POST['para'] == 'agree' ) {
			$data = chatInit::friendApply($_POST['uid'], $_POST['para']);
		} else if ( $_POST['para'] == 'refuse' ) {
			$data = chatInit::friendApply($_POST['uid'], $_POST['para']);
		}
		die(json_encode($data));
	}
	if ( $_POST['class'] == 'noticeRead' ) {
		die(chatInit::noticeRead());
	}
	if ( $_POST['class'] == 'delFriend' ) {
		if ( !empty($_POST['staffid']) ) {
			$staffid = intval($_POST['staffid']);
			$res = chatInit::delFriend($staffid);
			die(json_encode($res));
		}
	}
	die(json_encode(['code'=>1, 'meg'=> '缺少参数']));
}
// 所有好友

// $allFriend = [];

// 自己的信息
$staffidInfo = chatInit::getSelfInfo();	

// 一个组织的全员信息
$allStaffidInfo = chatInit::getAllStaffid();
// 一个人的群
$groupInfo = chatInit::getGroupInfo();



// 我的好友

$sql = "SELECT a.*, b.`card_image_smail`,b.`name` FROM `oms_friend_list` a LEFT JOIN `oms_hr` b ON a.staffid = b.staffid WHERE  a.`state` = 2 AND a.`pid`=?";

$myFriend = $Capsule::select($sql, [$_SESSION['staffid']]);

if ( !empty($myFriend) ) {
	foreach ($myFriend as $key => $value) {
		$newValue = [];
		$newValue['username'] = $value->name;
		$newValue['id'] = $value->staffid;
		$newValue['avatar'] = $value->card_image_smail ?$value->card_image_smail : '/chat/images/niming.png';
		$newFriend[$key] = $newValue;
	}
}


// 所有成员
foreach ($allStaffidInfo as $key => $value) {
	$newValue = [];
	$newValue['username'] = $value['name'];
	$newValue['id'] = $value['staffid'];
	// $newValue['avatar'] = '/chat/images/niming.png';
	$newValue['avatar'] = $value['card_image_smail'] ? $value['card_image_smail'] : '/chat/images/niming.png';
	$newValue['status'] = 'offline';
	$allStaffidInfo[$key] = $newValue;
}

// 自己的群
foreach ($groupInfo as $key => $value) {
	$newValue = [];
	$newValue['groupname'] = $value['group_name'];
	$newValue['id'] = $value['pid'];
	$newValue['avatar'] = '/chat/images/ren.png';
	$groupInfo[$key] = $newValue;
}

echo json_encode([
	'code'=>0, 
	'msg'=>'', 
	'data'=> [
		'mine'=> [
			'username' => $staffidInfo['name'],
			'id' => $staffidInfo['staffid'], 
			'status' => 'online', 
			'sign' => '好好工作！', 
			'avatar' => $staffidInfo['card_image_smail'] 
		],
		'friend' => [ 
			[ 
				"groupname" => "组织全员", 
				"id"=> 1,
				// "online"=> 2,
				'list'=> $allStaffidInfo
			], 
			[ 
				"groupname" => "好友", 
				"id"=> 2,
				// "online"=> 2,
				'list'=> $newFriend
			], 
		],
		"group" => $groupInfo
	]
]);

 ?>