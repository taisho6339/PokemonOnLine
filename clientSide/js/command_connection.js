
// Socket.IO Serverに接続する
var socket = io.connect("http://pokemonapp.herokuapp.com/:30000");
var user_mode = 0;
var now_poke = 10;
//コマンド送信を受け付けるかどうかのフラグ
var active_flg = 0;

//サーバーからのコールバック関数

// 接続時のイベント

socket.on("enter_ok", function(data) {
    waitCancel();
    user_mode = data.mode;
    select();
    selectreturn();
    connectionWaiting();
    enterTrainer();
});

//対戦者待ち状態
socket.on("battle_wait", function() {

});

socket.on("battle_start", function() {
    active_flg = 1;
    startAnimation();
    bgmStart();
    //このタイミングでポケモンを選択してください、のようなメッセージを入れたい。
});

socket.on("battle_result", function(data) {
    waitCancel();
    active_flg = 0;
    now_poke = -1;

    finishBattle(data);

});


socket.on("turn_wait", function() {
    active_flg = 0;
    wait();
});

socket.on("drug", function(data) {
    waitCancel();
    drugAction(data.trainerNum, data.HP);
    waitAction(data);
});

socket.on("dead", function(data) {
    waitCancel();
    active_flg = 1;
    if (data.trainer1) {
        returnPokemon(1);
        if (user_mode == 1) {
            now_poke = 10;
        }
    }
    if (data.trainer2) {
        returnPokemon(2);
        if (user_mode == 2) {
            now_poke = 10;
        }
    }
});

socket.on("command_ok", function() {
    active_flg = 1;
});

socket.on("pokemon_change", function(data) {
    waitCancel();

    if (now_poke != 10) {
        returnPokemon(data.trainerNum);
    }
    setTimeout(function() {
        popPokemon(data.trainerNum, data.changePict, data.pokemonHP);
    }, 1000);

    setTimeout(function() {
        if (data.trainerNum == user_mode) {
            now_poke = data.changeNum;
        }
        waitAction(data);
    }, 2000);
});


socket.on("attack", function(data) {
    waitCancel();
    tackle(data.trainerNum);
    waitAction(data);
});

socket.on("quick", function(data) {
    waitCancel();
    quickAttack(data.trainerNum);
    waitAction(data);
});

socket.on("bomb", function(data) {
    waitCancel();
    bomb(data.trainerNum);
    waitAction(data);
});


//アクションが終わるのを待ってから正常に完了したことをサーバに報告する
function waitAction(data) {
    setTimeout(function() {
        if (data.trainerNum == user_mode) {
            socket.emit("process_ok");
        }
    }, 3000);
}


//ユーザによるリクエスト関数

function retireCommand() {
    if (user_mode != 0 && active_flg == 1) {
        selectSE();
        setTimeout(function() {
            socket.emit("battle_retire", {num: user_mode});
        }, 1000);
    }
}

/*カビゴンは0,ポリゴンは1,ベロベルトは2を送信*/
//ポケモンの変更コマンド
function pokemonChange(pokemon_num) {
    // if (user_mode != 0 && (now_poke != pokemon_num) && active_flg == 1)
    selectSE();
    setTimeout(function() {
        if ((user_mode != 0 && (now_poke != pokemon_num) && active_flg == 1) || now_poke == 10)
            socket.emit("pokemon:change", {num: pokemon_num});
    }, 1000);
}

function attackCommand() {
    selectSE();
    setTimeout(function() {
        if (user_mode != 0 && active_flg == 1 && now_poke != 10) {
            socket.emit("command:attack");
        }
    }, 1000);
}

function quickCommand() {
    selectSE();
    setTimeout(function() {
        if (user_mode != 0 && active_flg == 1 && now_poke != 10) {
            socket.emit("command:quick");
        }
    }, 1000);
}

function bombCommand() {
    selectSE();
    setTimeout(function() {
        if (user_mode != 0 && active_flg == 1 && now_poke != 10) {
            socket.emit("command:bomb");
        }
    }, 1000);
}

function drugPokemon() {
    selectSE();
    setTimeout(function() {
        if (user_mode != 0 && active_flg == 1 && now_poke != 10) {
            socket.emit("command:drug");
        }
    }, 1000);
}