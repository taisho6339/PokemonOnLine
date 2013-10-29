
// Socket.IO Server�ɐڑ�����
var socket = io.connect("http://pokemonapp.herokuapp.com/:30000");
var user_mode = 0;
var now_poke = 10;
//�R�}���h���M���󂯕t���邩�ǂ����̃t���O
var active_flg = 0;

//�T�[�o�[����̃R�[���o�b�N�֐�

// �ڑ����̃C�x���g

socket.on("enter_ok", function(data) {
    waitCancel();
    user_mode = data.mode;
    select();
    selectreturn();
    connectionWaiting();
    enterTrainer();
});

//�ΐ�ґ҂����
socket.on("battle_wait", function() {

});

socket.on("battle_start", function() {
    active_flg = 1;
    startAnimation();
    bgmStart();
    //���̃^�C�~���O�Ń|�P������I�����Ă��������A�̂悤�ȃ��b�Z�[�W����ꂽ���B
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


//�A�N�V�������I���̂�҂��Ă��琳��Ɋ����������Ƃ��T�[�o�ɕ񍐂���
function waitAction(data) {
    setTimeout(function() {
        if (data.trainerNum == user_mode) {
            socket.emit("process_ok");
        }
    }, 3000);
}


//���[�U�ɂ�郊�N�G�X�g�֐�

function retireCommand() {
    if (user_mode != 0 && active_flg == 1) {
        selectSE();
        setTimeout(function() {
            socket.emit("battle_retire", {num: user_mode});
        }, 1000);
    }
}

/*�J�r�S����0,�|���S����1,�x���x���g��2�𑗐M*/
//�|�P�����̕ύX�R�}���h
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