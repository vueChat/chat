<template>
<transition name="modal">
	<div class="modal-mask">
      	<div class="modal-wrapper">
        	<div class="modal-container">
          			<div class="modal-header">
            			<slot name="header">
              				
            			</slot>
          			</div>
          		<div class="modal-body">
	            	<slot name="body">
	              		没有数据！
	            	</slot>
          		</div>
	          	<div class="modal-footer">
              		<button class="modal-default-button" @click="$emit('close')">取消</button>
	          	</div>
        	</div>
      	</div>
    </div>
</transition>
</template>
<style lang="less" scoped>
@media screen and (max-width: 500px) {

.modal-mask {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  height: 100%;
  //display: table-cell;
  vertical-align: middle;
}

.modal-container {

  width: 100%;
  height: 100%;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header{
  text-align: center;
  font-size: 18px;
  padding: 10px;

}
.modal-footer {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  position: absolute;
  bottom: 20px;
  top: 20px;
  width: 100%;
}

.modal-default-button {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
}
@media screen and (min-width: 500px) {
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  margin-top: 20px;
  //display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 500px;
  width: 100%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header{
  text-align: center;
  font-size: 18px;
}
.modal-footer {
  text-align: right;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
}

</style>