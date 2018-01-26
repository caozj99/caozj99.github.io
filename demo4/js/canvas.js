window.onload=function(){
  var oCanvas=document.getElementById("canvas1");
  var box=document.getElementById("container");
  var musicButn=document.getElementById("music_butn");
  var oMusic=document.getElementById("music_a");
  var ctx=oCanvas.getContext("2d");
  var a=30;
  var disX=0;
  var disY=0;
  var w=box.offsetWidth;
  var h=box.offsetHeight;
  var offsetleft=(document.documentElement.clientWidth-w)/2;
  var offsettop=(document.documentElement.clientHeight-h)/2;
  var oImg=new Image();
  var opacity_arr=[];
  var percentage=0.3;
  var len=box.getElementsByClassName("section").length;
  var num=0;
  var h2=box.offsetHeight;
  var can_img=null;
  var offButn=true;
  var offButn2=true;
  var timeout=null;
  var hastouch = "ontouchstart" in window?true:false,//判断是否为移动设备
    tapstart = hastouch?"touchstart":"mousedown",
    tapmove = hastouch?"touchmove":"mousemove",
    tapend = hastouch?"touchend":"mouseup";
  oCanvas.width=w;
  oCanvas.height=h;
  if(num==0){
    oCanvas.style.display="none";
    //document.getElementById("hander").style.opacity=0;
  }
   //插入图片
    function tumo(num){
      can_img=box.getElementsByClassName("section")[num].getElementsByTagName("img")[1];
      oImg.src=can_img.src;
      oImg.onload=function(){
        ctx.drawImage(oImg, 0, 0, w, h);
      }
    }
      document.addEventListener(tapmove , function(e){
          e.preventDefault();
      })
    oCanvas.addEventListener(tapstart , function(e){
        e.preventDefault();
        e.stopPropagation();
        clearTimeout(timeout) 
        can_img.style.display="none";
        document.getElementById("hander").style.display="none";
        x1 = hastouch?e.targetTouches[0].pageX-offsetleft:e.clientX-offsetleft;
        y1 = hastouch?e.targetTouches[0].pageY-offsettop:e.clientY-offsettop;
        
    　　//鼠标第一次点下的时候擦除一个圆形区域，同时记录第一个坐标点
        ctx.save()
        ctx.beginPath()
        ctx.arc(x1,y1,a,0,2*Math.PI);
        ctx.clip()
        ctx.clearRect(0,0,oCanvas.width,oCanvas.height);
        ctx.restore();
        
        oCanvas.addEventListener(tapmove , tapmoveHandler);
        oCanvas.addEventListener(tapend , function(){ 
          timeout = setTimeout(function(){
            var imageData = ctx.getImageData(0, 0, w, h);
            var dd = 0;
            for(var x=0;x<imageData.width;x+=1){  
                for(var y=0;y<imageData.height;y+=1){  
                    var i = (y*imageData.width + x)*4;  
                    if(imageData.data[i+3] > 0){  
                        dd++  
                    }  
                }  
            }  
            if(dd/(imageData.width*imageData.height)<(1-percentage)){  
                ctx.clearRect(0, 0, w, h);
                oCanvas.style.display="none"; 
            } 
          },200)
           oCanvas.removeEventListener(tapmove , tapmoveHandler);
        });
    　　//鼠标移动时触发该事件
        function tapmoveHandler(e){
            e.preventDefault();
            e.stopPropagation();
            x2 = hastouch?e.targetTouches[0].pageX-offsetleft:e.clientX-offsetleft;
            y2 = hastouch?e.targetTouches[0].pageY-offsettop:e.clientY-offsettop;
            
    　　　　//获取两个点之间的剪辑区域四个端点
            var asin = a*Math.sin(Math.atan((y2-y1)/(x2-x1)));
            var acos = a*Math.cos(Math.atan((y2-y1)/(x2-x1)))
            var x3 = x1+asin;
            var y3 = y1-acos;
            var x4 = x1-asin;
            var y4 = y1+acos;
            var x5 = x2+asin;
            var y5 = y2-acos;
            var x6 = x2-asin;
            var y6 = y2+acos;
    　　　　//保证线条的连贯，所以在矩形一端画圆
            ctx.save()
            ctx.beginPath()
            ctx.arc(x2,y2,a,0,2*Math.PI);
            ctx.clip()
            ctx.clearRect(0,0,oCanvas.width,oCanvas.height);
            ctx.restore();
    　　　　//清除矩形剪辑区域里的像素
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(x3,y3);
            ctx.lineTo(x5,y5);
            ctx.lineTo(x6,y6);
            ctx.lineTo(x4,y4);
            ctx.closePath();
            ctx.clip()
            ctx.clearRect(0,0,oCanvas.width,oCanvas.height);
            ctx.restore();
    　　　　//记录最后坐标
            x1 = x2;
            y1 = y2;
        }
    })
    ////
    musicButn.onclick=function(){
      if(offButn2){
        offButn2=!offButn2;
        this.className="cur";
        oMusic.src="";
      }else{
        offButn2=!offButn2;
        this.className="";
        oMusic.src="music/music.mp3";
      }
    }

    ///
    $("#container").swipeDown(function(){
      if(num>0){
            num--;
            this.style.top=-num*h2+"px";
        }
    })
    $("#container").swipeUp(function(){
        if(num<len-1){
            num++;
        }
        $(this).animate({
          "top": -num*h2,
          },
          300, function() {
            document.getElementById("hander").style.opacity=1;
            if(offButn){
              if(num!=len-1){
                oCanvas.style.display="block";
                tumo(num);
                oCanvas.style.top=num*h2+"px"; 
              }else{
                offButn=false;
              }
            }
        });  
    })
}