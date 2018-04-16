const insertAtCursor = function (myField, myValue) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
		sel.select();
	}
	//MOZILLA/NETSCAPE support 
	else if (myField.selectionStart || myField.selectionStart == '0') {
		let startPos = myField.selectionStart;
		let endPos = myField.selectionEnd;
		// save scrollTop before insert www.keleyi.com
		let restoreTop = myField.scrollTop;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
		if (restoreTop > 0) {
			myField.scrollTop = restoreTop;
		}
		myField.focus();
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
	} else {
		myField.value += myValue;
		myField.focus();
	}
}
export default insertAtCursor;