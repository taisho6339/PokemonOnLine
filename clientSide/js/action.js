/*---before start---*/

var func_id;

function connectionWaiting() {

    var func = function() {
        for (var i = 0; i < 3; i++) {
            $('.black>img')
                    .fadeTo(750, 0.25).fadeTo(750, 1);
        }
    };
    func_id = window.setInterval(func, 20);
}


function enterTrainer() {
    // clearInterval(func_id);
    $('#black1')
            .css('transition', '-webkit-transform 1s cubic-bezier(0,0,0.02,1)')
            .css('-webkit-transform', 'translateX(-100%)');

    setTimeout(function() {
        $('#black1')
                .css('display', 'none');
    }, 1000);

    $('#open1')
            .css('display', '-webkit-box');
}

function startAnimation() {

    $('#black2')
            .css('transition', '-webkit-transform 1s cubic-bezier(0,0,0.02,1)')
            .css('-webkit-transform', 'translateX(-100%)');

    setTimeout(function() {
        $('#black2')
                .css('display', 'none');
    }, 1000);

    $('#open2')
            .css('display', '-webkit-box');

    clearInterval(func_id);
    $('#normal')
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1)
            .fadeTo(200, 0.25).fadeTo(200, 1);

    setTimeout(function() {
        $('#plset1')
                .animate({'marginLeft': '-1000px', 'height': '0px'}, {duration: 1000});
        $('#plset2')
                .animate({'marginLeft': '1000px', 'height': '0px'}, {duration: 1000, complete: function() {
                $('#normal').css('display', 'none');
                $('#battle')
                        .css('display', 'block')
                        .fadeTo(0, 0)
                        .fadeTo(800, 1);
            }});
    }, 4000);

    $('#list').css('display', 'none');
    $('#cmd>ul').eq(3).css('display', 'block');
    $('.back').click(function() {
        $('#list').css('display', 'block');
        for (var count = 1; count < 5; count++) {
            $('#cmd>ul').eq(count).css('display', 'none');
        }
    });

}

function cancelAnimation() {
    clearInterval(func_id);
}

/*---battle start---*/
function bgmStart() {
    // Audioオブジェクト作成
    var audio = new Audio("");
    // Audioファイルのアドレス指定
    audio.src = "bgm.mp3";
    audio.play();
}

/*---warning---*/
function wait() {
    var wait = document.getElementById('w_wait');
    wait.style.display = 'block';
    // $('#w_wait').attr("src", "img/wait.png");

    /*
     $('#battle#img1>img')
     .hide();
     $('#battle#img2>img')
     .hide();
     $('#field').prepend('<img src="img/wait.png">');
     
     $('#wait>img')
     .show()
     .fadeTo(500, 0.25).fadeTo(500, 1)
     .fadeTo(500, 0.25).fadeTo(500, 1)
     .fadeTo(500, 0.25).fadeTo(500, 1)
     .fadeTo(500, 0.25).fadeTo(500, 1)
     .fadeTo(500, 0.25).fadeTo(500, 1);
     setTimeout(function() {
     $("#wait>img").hide();
     }, 4500);
     setTimeout(function() {
     $("#battle>img").show();
     }, 4500);
     setTimeout(function() {
     $("#battle>img").hide();
     }, 4500);
     */
}

function waitCancel() {
    var wait = document.getElementById('w_wait');
    wait.style.display = 'none';
    //$('#w_wait').attr("src", "");
}

function finishBattle(data) {
    $(function() {
        setTimeout(function() {
            $('#battle')
                    .fadeTo(800, 0);
        }, 0);
    });

    $(function() {
        setTimeout(function() {
            $('#battle')
                    .css('display', 'none');
        }, 1000);
    });

    $(function() {
        setTimeout(function() {
            $('#finish')
                    .css('display', 'block')
                    .fadeTo(0, 0)
                    .fadeTo(800, 1);
        }, 2000);
    });
    var player1 = document.getElementById('fimg1');
    var player2 = document.getElementById('fimg2');

    if (data.trainer1) {
        //負け表示
        player1.src = "img/lose1.png";
    }
    else {
        //勝ち表示
        player1.src = "img/win1.png";
        window.setInterval(function() {
            $('#fplset1')
                    .fadeTo(800, 0.5)
                    .fadeTo(800, 1)
                    .fadeTo(800, 0.5)
                    .fadeTo(800, 1)
                    .fadeTo(800, 0.5)
                    .fadeTo(800, 1);
        }, 2000);
    }

    if (data.trainer2) {
        //負け表示
        player2.src = "img/lose2.png";
    }
    else {
        //勝ち表示
        player2.src = "img/win2.png";
        window.setInterval(function() {
            $('#fplset2')
                    .fadeTo(800, 0.5)
                    .fadeTo(800, 1)
                    .fadeTo(800, 0.5)
                    .fadeTo(800, 1)
                    .fadeTo(800, 0.5)
                    .fadeTo(800, 1);
        }, 2000);
    }

}

/*---select--*/
function select() {
    $('#list>li').click(function() {
        var number = $('#list>li').index(this);
        number = number + 1;
        $('#list').css('display', 'none');
        $('#cmd>ul').eq(number).css('display', 'block');
    });
}

function selectreturn() {
    $('.back').click(function() {
        $('#list').css('display', 'block');
        for (var count = 1; count < 5; count++) {
            $('#cmd>ul').eq(count).css('display', 'none');
        }
    });
}

function selectSE() {
    // Audioオブジェクト作成
    var audio = new Audio("");
    // Audioファイルのアドレス指定
    audio.src = "se/select.wav";
    audio.play();
}

/*---HP---*/
var interval_id;

function meterAction(hp_damage, enemyNum) {
    var m = $('#pokemeter' + enemyNum);
    //m.html5jpMeterPolyfill();
    var val = parseFloat(m.attr('value'), 10);
    var min = parseFloat(m.attr('min'), 10);
    var ans = val - hp_damage * 10;

    interval_id = window.setInterval(function() {
        val--;
        if (val == ans || val == min) {
            m.attr('value', val);
            // m.html5jpMeterPolyfill();
            cancel();
        }
        m.attr('value', val);
        // m.html5jpMeterPolyfill();
    }, 20);
}

function cancel() {
    clearInterval(interval_id);
}

function setMeter(num, hp) {
    $(document).ready(function() {
        var m = $('#pokemeter' + num);
        //  m.html5jpMeterPolyfill();
        var val = parseFloat(m.attr('value'), 10);
        var max = parseFloat(m.attr('max'), 10);
        interval_id = window.setInterval(function() {
            val++;

            if (val == hp * 10) {
                cancel();
                m.attr('value', val);
                cancel();
                setTimeout(function() {
                }, 2000);
            }
            m.attr('value', val);
        }, 20);
    });
}

function initMeter(num) {

    var m = $('#pokemeter' + num);
    //m.html5jpMeterPolyfill();
    m.attr('value', 0);
    //m.html5jpMeterPolyfill();

}

/*---fight---*/
function tackle(user_num) {
    if (user_num == 1) {
        $('#img' + user_num + '>img')
                .animate({height: '150px'})
                .animate({marginLeft: '-10%'}, 400)
                .animate({marginLeft: '80%'}, 40)
                .animate({height: '120px'})
                .animate({marginLeft: '0px'}, 100);
    } else {
        $('#img' + user_num + '>img')
                .animate({height: '150px'})
                .animate({marginLeft: '10%'}, 400)
                .animate({marginLeft: '-80%'}, 40)
                .animate({height: '120px'})
                .animate({marginLeft: '0px'}, 100);
    }

    setTimeout(function() {
        // Audioオブジェクト作成
        var audio = new Audio("");
        // Audioファイルのアドレス指定
        audio.src = "se/attack.wav";
        audio.play();
        meterAction(3, ((user_num - 1) ^ 1) + 1);
    }, 1000);
}

function quickAttack(user_num) {
    if (user_num == 1) {
        $('#img' + user_num + '>img')
                .animate({marginLeft: '75%', marginTop: '10%'}, 10)
                .animate({marginLeft: '80%', marginTop: '0%'}, 10)
                .animate({marginLeft: '75%', marginTop: '-10%'}, 10)
                .animate({marginLeft: '0px', marginTop: '0%'}, 10);
    } else {
        $('#img' + user_num + '>img')
                .animate({marginLeft: '-75%', marginTop: '10%'}, 10)
                .animate({marginLeft: '-80%', marginTop: '0%'}, 10)
                .animate({marginLeft: '-75%', marginTop: '-10%'}, 10)
                .animate({marginLeft: '0px', marginTop: '0%'}, 10);
    }

    // Audioオブジェクト作成
    var audio = new Audio("");
    // Audioファイルのアドレス指定
    audio.src = "se/quickattack.wav";
    audio.play();
    meterAction(2, ((user_num - 1) ^ 1) + 1);
}

function bomb(user_num) {

    setTimeout(function() {
        var audio = new Audio("");
        // Audioファイルのアドレス指定
        audio.src = "../se/bigbomb.wav";
        audio.play();
    }, 500);

    if (user_num == 1) {
        $('#img' + user_num + '>img')
                .animate({marginLeft: '50%'}, 500)
                .animate({height: '250px'}, 1000)
                .animate({height: '0px'}, 0.1, function() {
            $(this).attr("src", "img/bomb.png");
        })
                .animate({height: '500px'}, 0.1)
                .animate({marginLeft: '80%', marginTop: '-10%'}, 30)
                .animate({marginLeft: '20%', marginTop: '-70%'}, 30)
                .animate({marginLeft: '-10%', marginTop: '-40%'}, 30)
                .animate({marginLeft: '50%', marginTop: '-10%'}, 30)
                .animate({marginLeft: '80%', marginTop: '-30%'}, 30)
                .animate({marginLeft: '80%', marginTop: '-20%'}, 30)
                .animate({marginLeft: '20%', marginTop: '-50%'}, 30)
                .animate({marginLeft: '-10%', marginTop: '-80%'}, 30)
                .animate({marginLeft: '50%', marginTop: '-10%'}, 30)
                .animate({marginLeft: '80%', marginTop: '-40%'}, 30)
                .animate({marginLeft: '0%', marginTop: '0%'}, 30)
                .animate({height: '0px'}, 0.1);
    } else {
        $('#img' + user_num + '>img')
                .animate({marginLeft: '-50%'}, 500)
                .animate({height: '250px'}, 1000)
                .animate({height: '0px'}, 0.1, function() {
            $(this).attr("src", "img/bomb.png");
        })
                .animate({height: '500px'}, 0.1)
                .animate({marginLeft: '-80%', marginTop: '-10%'}, 30)
                .animate({marginLeft: '-20%', marginTop: '-70%'}, 30)
                .animate({marginLeft: '10%', marginTop: '-40%'}, 30)
                .animate({marginLeft: '-50%', marginTop: '-10%'}, 30)
                .animate({marginLeft: '-80%', marginTop: '-30%'}, 30)
                .animate({marginLeft: '-80%', marginTop: '-20%'}, 30)
                .animate({marginLeft: '-20%', marginTop: '-50%'}, 30)
                .animate({marginLeft: '10%', marginTop: '-80%'}, 30)
                .animate({marginLeft: '-50%', marginTop: '-10%'}, 30)
                .animate({marginLeft: '-80%', marginTop: '-40%'}, 30)
                .animate({marginLeft: '0%', marginTop: '0%'}, 30)
                .animate({height: '0px'}, 0.1);
    }

    setTimeout(function() {
        meterAction(6, ((user_num - 1) ^ 1) + 1);
    }, 1500);
    setTimeout(function() {
        meterAction(10, user_num);
    }, 4500);
}

function drugAction(user_num, hp) {
    var drug = document.getElementById('drug');
    drug.src = "img/drug.png";
    // Audioオブジェクト作成
    var audio = new Audio("");
    // Audioファイルのアドレス指定
    audio.src = "se/drug.wav";
    audio.play();
    if (user_num == 1) {

        $('#drug')
                .css('left', '50px')
                .css('marginLeft', '20%')
                .css('marginTop', '40px')
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '0px'}, 10);
        setMeter(user_num, hp);
    } else {

        $('#drug')
                .css('right', '-50px')
                .css('marginRight', '20%')
                .css('marginTop', '40px')
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '120px'}, 0)
                .animate({height: '20px'}, 300)
                .animate({height: '0px'}, 10);
        setMeter(user_num, hp);
    }

    drug.src = "";
}

/*---item---*/

/*---pokemon--*/
//現状未完成
function returnPokemon(usernum) {
    initMeter(usernum);
    // Audioオブジェクト作成
    var audio = new Audio("");
    // Audioファイルのアドレス指定
    audio.src = "se/return.wav";
    audio.play();
    $("#img" + usernum + ">img")
            .animate({height: '120px'}, 10)
            .animate({height: '0px'}, 500);
}

function popPokemon(usernum, pict, hp) {
    // Audioオブジェクト作成
    var audio = new Audio("");
    // Audioファイルのアドレス指定
    audio.src = "se/pop.wav";
    audio.play();

    $("#img" + usernum + ">img").attr("src", "img/" + pict + ".png")
            .animate({height: '0px'}, 1000)
            .animate({height: '120px'}, 500);
    setMeter(usernum, hp);
}
