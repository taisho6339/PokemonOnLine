var io = require('socket.io').listen(30000);
var user_count = 0;


//ポケモンを表わすクラス
var Pokemon = (function() {
    this.name;
    this.hp;
    this.status;
    this.pict_name;

    //コンストラクタ
    function Pokemon(name, pict_name) {
        this.name = name;
        this.hp = 10;
        this.status = "normal";
        this.pict_name = pict_name;
    }
    return Pokemon;
}());

//トレーナーを表わすクラス
var Trainer = (function() {
    this.t_Num;
    this.pokemons;
    this.nowPoke;
    this.connection;
    this.command;
    this.quick_flg;
    this.change_flg = 0;
    this.change_num;
    this.dead_count;

    function Trainer(socket, num) {
        this.connection = socket;
        this.t_Num = num;
        this.drug_flg = 1;
        this.quick_flg = 0;
        this.dead_count = 0;
        this.nowPoke = new Pokemon(null, "kabi");
        this.pokemons = new Array(
                new Pokemon("kabigon", "kabi" + num),
                new Pokemon("porigon", "porigon" + num),
                new Pokemon("berobelt", "berobelt" + num)
                );
    }
    return Trainer;
}());


//トレーナーを毎ターン一時的に格納するためのキュー
var TrainerQueue = (function() {

    function TrainerQueue() {
    }

    var queue = new Array();

    TrainerQueue.enqueue = function(trainer) {
        queue.push(trainer);
    };

    TrainerQueue.dequeue = function() {
        if (queue.length > 0) {
            return queue.shift();
        }
        return null;
    };

    TrainerQueue.size = function() {
        return queue.length;
    };

    return TrainerQueue;
}());

//バトルルームを管理する静的クラス
var RoomManager = (function() {

    var trainers = new Array(2);

    function RoomManager() {
    }

    RoomManager.initRoom = function() {
        trainers[0] = null;
        trainers[1] = null;
    };


    //トレーナメモリに空きがあれば格納し、１を返し、それ以外は観戦者として０を返す。
    RoomManager.setTrainer = function(socket) {
        if (!(trainers[0])) {
            trainers[0] = new Trainer(socket, 1);
            return 1;
        }
        else if (!(trainers[1])) {
            trainers[1] = new Trainer(socket, 2);
            return 2;
        }
        return 0;
    };

    RoomManager.deleteTrainer = function(socket) {
        if (trainers[0].connection === socket) {
            delete trainers[0];
            trainers[0] = null;
            console.log("DELETE_USER");
        }
        else if (trainers[1].connection === socket) {
            delete trainers[1];
            trainers[1] = null;
            console.log("DELETE_USER");
        }
    };

    //コネクションを元にトレーナーを検出して返す関数
    RoomManager.getTrainer = function(socket) {
        if (trainers[0].connection === socket)
            return trainers[0];
        else if (trainers[1].connection === socket)
            return trainers[1];
        return null;
    };

    RoomManager.getTrainerByIndex = function(index) {
        return trainers[index];
    };

    //バトル準備可能かを示す
    RoomManager.isReady = function() {
        return trainers[0] && trainers[1];
    };

    return RoomManager;
}());

//バトルのターン管理、演算を行うクラス

var CycleManager = (function() {

    //トレーナを一時的に格納しておくレジスタ
    var register = new Array();
    var index = 0;
    //トレーナ二人をキューに格納できる状態かどうかのフラグ
    var ready_flg = 0;
    //コンストラクタ
    function CycleManager() {
    }

    //トレーナーからのリクエストを受けてトレーナーをレジスタに格納する関数
    CycleManager.receiveRequest = function(player, func) {
        console.log("receiveRequest");
        player.command = func;
        if (index < 2)
            register[index++] = player;
        if (index == 2)
            CycleManager.readyTurn();
    };


    //両トレーナーからのリクエストを受け付けたときにトレーナーをキューに乱数順に格納する
    CycleManager.readyTurn = function() {

        if (register[0] != null && register[1] != null) {
            console.log("readyTurn");
            if (register[0].change_flg == 1 || register[1].change_flg == 1) {
                var t_num;
                if (register[0].change_flg == 1) {
                    t_num = 0;
                } else {
                    t_num = 1;
                }
                TrainerQueue.enqueue(register[t_num]);
                register[t_num].change_flg = 0;
                register[t_num] = null;
                TrainerQueue.enqueue(register[t_num ^ 1]);
                register[t_num ^ 1].change_flg = 0;
                register[t_num ^ 1] = null;
                index = 0;
                ready_flg = 1;
            }
            //0か1を返す乱数。この順にトレーナーをキューに入れる。
            else if (register[0].quick_flg == register[1].quick_flg) {
                var random = parseInt(Math.random() * 10) % 2;
                TrainerQueue.enqueue(register[random]);
                register[random].quick_flg = 0;
                register[random] = null;
                TrainerQueue.enqueue(register[random ^ 1]);
                register[random ^ 1].quick_flg = 0;
                register[random ^ 1] = null;
                index = 0;
                ready_flg = 1;
            }
            else {
                if (register[0].quick_flg == 1) {
                    TrainerQueue.enqueue(register[0]);
                    register[0].quick_flg = 0;
                    register[0] = null;
                    TrainerQueue.enqueue(register[1]);
                    register[1].quick_flg = 0;
                    register[1] = null;
                    index = 0;
                    ready_flg = 1;
                }
                else {
                    TrainerQueue.enqueue(register[1]);
                    register[1] = 0;
                    register[1].quick_flg = null;
                    TrainerQueue.enqueue(register[0]);
                    register[0].quick_flg = 0;
                    register[0] = null;
                    index = 0;
                    ready_flg = 1;
                }
            }
        }
    };

    //ターンの演算を開始してよいかどうかのフラグ
    CycleManager.isReady = function() {
        return ready_flg == 1;
    };

//キューに格納されたトレーナのコマンドを一つ読み込む
    CycleManager.readCommand = function() {
        var trainer = TrainerQueue.dequeue();
        console.log("gettingTrainer");
        if (TrainerQueue.size() == 0) {
            ready_flg = 0;
        }
        if (trainer) {
            trainer.command(trainer);
        }
        console.log("TrainerQueueSize:" + TrainerQueue.size());
    };

    CycleManager.changePokemon = function(trainer) {
        console.log("changePokemon" + trainer.change_num);
        console.log("ReadTrainer:" + trainer.t_Num);
        trainer.nowPoke = trainer.pokemons[trainer.change_num];
        var pokemon = trainer.nowPoke;
        return pokemon.pict_name;
    };

    CycleManager.drugPokemon = function(trainer) {
        console.log("DrugPokemon:" + trainer.t_Num);
        trainer.nowPoke.hp += 5;
        if (trainer.nowPoke.hp >= 10)
            trainer.nowPoke.hp = 10;
        console.log("DrugPokemonHP:" + trainer.nowPoke.hp);
    };

    CycleManager.attackPokemon = function(trainer) {
        console.log("attackPokemon");
        console.log("ReadTrainer:" + trainer.t_Num);
        var enemy_index = (trainer.t_Num - 1) ^ 1;
        var enemy = RoomManager.getTrainerByIndex(enemy_index);
        enemy.nowPoke.hp -= 3;
        console.log("ENEMY_DAMAGE:" + enemy.nowPoke.hp);
        if (enemy.nowPoke.hp <= 0) {
            enemy.nowPoke.hp = 0;
            enemy.nowPoke.status = 'dead';
            enemy.dead_count += 1;
            TrainerQueue.dequeue();
        }
    };

    CycleManager.quickPokemon = function(trainer) {
        console.log("quickPokemon");
        console.log("ReadTrainer:" + trainer.t_Num);
        var enemy_index = (trainer.t_Num - 1) ^ 1;
        var enemy = RoomManager.getTrainerByIndex(enemy_index);
        enemy.nowPoke.hp -= 2;
        if (enemy.nowPoke.hp <= 0) {
            enemy.nowPoke.hp = 0;
            enemy.nowPoke.status = 'dead';
            enemy.dead_count += 1;
            TrainerQueue.dequeue();
        }
    };

//自爆はターンを強制終了する効果もあり
    CycleManager.bombPokemon = function(trainer) {
        console.log("bombPokemon");
        console.log("ReadTrainer:" + trainer.t_Num);
        var enemy_index = (trainer.t_Num - 1) ^ 1;
        var enemy = RoomManager.getTrainerByIndex(enemy_index);
        enemy.nowPoke.hp -= 6;
        if (enemy.nowPoke.hp <= 0) {
            enemy.nowPoke.hp = 0;
            enemy.nowPoke.status = 'dead';
            enemy.dead_count += 1;
        }
        trainer.nowPoke.hp = 0;
        trainer.nowPoke.status = "dead";
        ready_flg = 0;
        trainer.dead_count += 1;
        TrainerQueue.dequeue();
    };

    CycleManager.isDead = function() {
        trainer1 = RoomManager.getTrainerByIndex(0);
        trainer2 = RoomManager.getTrainerByIndex(1);
        if (trainer1.nowPoke.status == 'dead' || trainer2.nowPoke.status == 'dead')
            return true;

        return false;
    };

    CycleManager.isChangeable = function(num, socket) {
        trainer = RoomManager.getTrainer(socket);
        return trainer.pokemons[num].status != 'dead';
    };

    return CycleManager;
}());


//ルームの初期化
RoomManager.initRoom();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*バトルフロー
 * 
 * コマンドを受け付ける
 * 
 * コマンドに合わせて関数を生成し、トレーナに格納
 * 
 * レジスタにトレーナを入る
 * 
 * レジスタに２人揃ったらキューにトレーナを入れる
 * 
 * キューにトレーナがそろったら一人ずつポップしコマンドを読み込む
 * 
 * クライアントからのOKを認証し、さらにコマンドを読む
 * 
 * OKが来ればコマンド受付ロックを解除し、次ターンへ
 * 
 */

var change_comp = 0;

function commandReceive(client, player, func) {
    CycleManager.receiveRequest(player, func);
    client.emit("turn_wait");
    if (CycleManager.isReady())
        CycleManager.readCommand();
}


//クライアントとの通信
io.sockets.on('connection', function(client) {

    console.log("gettingClient");
    var user_mode = RoomManager.setTrainer(client);
    client.emit("enter_ok", {mode: user_mode});

    //トレーナが二人揃い、バトルできる状態かどうかの分岐
    if (RoomManager.isReady()) {
        io.sockets.emit("battle_start");
    }
    else {
        client.emit("battle_wait");
    }

    client.on("battle_retire", function(data) {
        if (data.num == 1) {
            io.sockets.emit('battle_result', {trainer1: true, trainer2: false});
        } else {
            io.sockets.emit('battle_result', {trainer1: false, trainer2: true});
        }
    });

//コマンドを入力したユーザの処理は待つが相手側のユーザは待っていない。課題点
//コマンドOKを受けたときにどちらかがひんしの状態にあれば次の処理は行わず、ポケモンを選択させる。
    client.on("process_ok", function() {
        console.log("ActionOK\n");
        if (CycleManager.isDead() && change_comp == 0) {
            trainer1 = RoomManager.getTrainerByIndex(0);
            trainer2 = RoomManager.getTrainerByIndex(1);
            console.log("dead_count:" + trainer1.dead_count);
            console.log("dead_count:" + trainer2.dead_count);

            if (trainer1.dead_count >= 3 || trainer2.dead_count >= 3) {
                if (trainer1.dead_count >= 3 && trainer2.dead_count >= 3) {
                    io.sockets.emit('battle_result', {trainer1: true, trainer2: true});
                } else if (trainer1.dead_count >= 3) {
                    io.sockets.emit('battle_result', {trainer1: true, trainer2: false});
                } else {
                    io.sockets.emit('battle_result', {trainer1: false, trainer2: true});
                }

            }
            else if (trainer1.nowPoke.status == 'dead' && trainer2.nowPoke.status == 'dead') {
                io.sockets.emit('dead', {trainer1: true, trainer2: true});
                change_comp = 1;
            }
            else if (trainer1.nowPoke.status == 'dead')
                io.sockets.emit('dead', {trainer1: true, trainer2: false});

            else if (trainer2.nowPoke.status == 'dead')
                io.sockets.emit('dead', {trainer1: false, trainer2: true});
        }

        else if (CycleManager.isReady()) {
            CycleManager.readCommand();
            change_comp = 0;
        }
        else {
            change_comp = 0;
            io.sockets.emit("command_ok");
        }
    });

    client.on("pokemon:change", function(data) {

        if (CycleManager.isChangeable(data.num, client)) {
            var func = function(player) {
                var change = CycleManager.changePokemon(player);
                console.log("NomePoke:" + player.t_Num + ":" + player.nowPoke.hp);
                io.sockets.emit("pokemon_change", {trainerNum: player.t_Num, changeNum: player.change_num, changePict: change,
                    pokemonHP: player.nowPoke.hp});
            };
            var player = RoomManager.getTrainer(client);
            player.change_num = data.num;
            player.change_flg = 1;
            commandReceive(client, player, func);
        }
        else {
            client.emit("command_ok");
        }
    });

    client.on("command:drug", function() {
        trainer = RoomManager.getTrainer(client);
        if (trainer.drug_flg == 1) {
            trainer.drug_flg = 0;
            var func = function(player) {
                CycleManager.drugPokemon(player);
                io.sockets.emit("drug", {trainerNum: player.t_Num, HP: player.nowPoke.hp});
            };
            commandReceive(client, trainer, func);
        } else {
            client.emit("command_ok");
        }
    });

    client.on('command:attack', function(data) {

        var func = function(player) {
            CycleManager.attackPokemon(player);
            io.sockets.emit("attack", {trainerNum: player.t_Num});
        };
        var player = RoomManager.getTrainer(client);
        commandReceive(client, player, func);
    });

    client.on('command:quick', function(data) {
        var func = function(player) {
            CycleManager.quickPokemon(player);
            io.sockets.emit("quick", {trainerNum: player.t_Num});
        };
        var player = RoomManager.getTrainer(client);
        player.quick_flg = 1;
        commandReceive(client, player, func);
    });

    client.on('command:bomb', function(data) {
        var func = function(player) {
            CycleManager.bombPokemon(player);
            io.sockets.emit("bomb", {trainerNum: player.t_Num});
        };
        var player = RoomManager.getTrainer(client);
        commandReceive(client, player, func);
    });

    client.on("disconnect", function() {
        RoomManager.deleteTrainer(client);
    });

});



