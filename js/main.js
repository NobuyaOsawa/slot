$(document).ready(function(){
  var member = ["向田","小瀧","高岡","遠藤","三浦","高橋","日野","麻尾","大澤"];
  var entrant = [];
  var flgStartSlot = true;
  var flgStopSlot = true;
  var speaker = $(".slot__speaker");
  var shutterTop = $(".slot__shutter--top");
  var shutterBottom = $(".slot__shutter--bottom");
  var count = 0;

  //デザインメンバー分の選択肢を表示
  for (var i = 0; i < member.length; i++){
    var choicesUnit = '<div class="member__choices"><div class="member__choices-name member__choices-name--selected">'+ member[i] +'</div><input type="checkbox" name="member" value="'+ member[i] +'" checked="checked"></div>'
    $(".member__choicesBox").append(choicesUnit);
  };

  //メンバー名選択時の動作
  $(".member__choices input").click(function(){
    if(!$(this).prop('checked')){
      $(this).prev().removeClass("member__choices-name--selected").addClass("member__choices-name--unselected");
    }else{
      $(this).prev().removeClass("member__choices-name--unselected").addClass("member__choices-name--selected");
    }
  });

  //スロット開始ボタン押下
  $(".startSlotBtn").on("click",function(){
    if(flgStartSlot){
      //フラグとボタンのラベルを変更
      flgStartSlot = false;
      $(this).text("ストップ");

      //選択されたメンバーを対象者リストに加える
      entrant = [];
      for(var i = 0; i < member.length; i++){
        var target = $(".member__choices:eq("+ i +") input");
        if(target.prop('checked')){
          entrant.push(target.val());
        };
      };

      //シャッターが開くアニメ
      $("body").jrumble({
        y: 3,
        x:0,
        rotation: 0,
        speed: 50
      }).trigger('startRumble');
      $(".soundShutter").get(0).play();
      $(".soundBgm").get(0).play();
      shutterTop.animate({marginTop: "-40px"}, 300, "easeOutElastic");
      shutterBottom.animate({marginTop: "80px"}, 300, "easeOutElastic", function(){
        $("body").trigger('stopRumble');
        //シャッターを非表示にし、スロットの名前を表示する
        shutterTop.css({display:"none"});
        shutterBottom.css({display:"none"});
        speaker.css({display:"block"});
      });

      //演出スロットアニメ開始
      var startPerformAnime = function (){
        slotAnime(200);
        performAnimeId = setTimeout(startPerformAnime,400);
      };
      startPerformAnime();

    //ストップボタン押下
    }else if (flgStopSlot) {
      flgStopSlot = false;
      clearTimeout(performAnimeId);
      function fadeout(){
        var media = $(".soundBgm").get(0);
        var vl = media.volume;
        if (vl > 0)
        {
          media.volume = Math.floor((vl-0.1)*10)/10;
          setTimeout(fadeout,100);
        };
      };
      fadeout();


      //スローなアニメ開始
      count = 0;
      var startSlowAnime = function (){
        slotAnime(400);
        slowAnimeId = setTimeout(startSlowAnime,800);
        if(count>5){
          clearTimeout(slowAnimeId);
          $(".soundRing").delay(500).queue(function(){
            $(this).get(0).play();
          });
          speaker.animate({marginTop: "12px"},2000,"easeOutElastic",function(){
            $(".soundCheer").get(0).play();
          });
        }
      };
      startSlowAnime();

    }
  });

  //スロットアニメーション本体
  function slotAnime(duration){
    var name = entrant[Math.round( Math.random()*entrant.length)];
    speaker.text(name);
    $(".soundClick").get(0).play();
    speaker.animate({marginTop: "80px"}, duration, function(){
      speaker.css({marginTop: "-80px"});
    });
    count ++;
  }

});
