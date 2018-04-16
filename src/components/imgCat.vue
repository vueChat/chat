<script>
import Vue from 'vue';

export default {
  data () {
    return {

    }
  },
  created () {
    this.$nextTick( () => {

      let clientWidth = document.body.clientWidth;
      let clientHeight = document.body.clientHeight;

      let imgWidth = this.$slots.body[0].elm.childNodes[0].width;
      let imgHeight = this.$slots.body[0].elm.childNodes[0].height;

      let clientScale = clientWidth/clientHeight;
      let imgScale = imgWidth/imgHeight;

      if ( imgWidth >  clientWidth || imgHeight > clientHeight  ) {
          if ( imgScale > clientScale ) {
              this.$slots.body[0].elm.childNodes[0].width = clientWidth;
              imgWidth = clientWidth;
              imgHeight = clientWidth/imgScale;
          } else {
              this.$slots.body[0].elm.childNodes[0].height = clientHeight;
              imgHeight = clientHeight;
              imgWidth = clientHeight * imgScale;
          }
      }
      this.$refs.imgCatBox.style.marginLeft = -imgWidth/2 + 'px'; 
      this.$refs.imgCatBox.style.marginTop = -imgHeight/2 + 'px'; 
    })
  }
}

</script>
<template>
<transition name="modal">
	<div class="modal-mask" @click ="$emit('close')">
    <div class="img-cat-box" ref="imgCatBox">
      	<slot name="body">
        		没有数据！
      	</slot>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
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
.img-cat-box {
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
}

.modal-wrapper {
  margin-top: 20px;
  //display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 400px;
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
</style>