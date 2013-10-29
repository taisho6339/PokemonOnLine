<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" type="text/css" href="css/reset.css" media="all">
        <link rel="stylesheet" type="text/css" href="css/style.css" media="all">
        <link href='http://fonts.googleapis.com/css?family=Roboto+Slab' rel='stylesheet' type='text/css'>
        <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
        <script src="http://pokemonapp.herokuapp.com:30000/socket.io/socket.io.js"></script>
        <script src="js/command_connection.js" type="text/javascript"></script>
        <script src="js/action.js" type="text/javascript"></script> 

        <title>Pokemon Battle</title>

    </head>

    <body>

        <article id="normal">			
            <section class="stanby" id="plset1"><div class="black" id="black1"><img src="img/wait1.png"></div><div id ="open1" class="open"><img src="img/stanby1.png"></div></section>
            <section class="stanby" id="plset2"><div class="black" id="black2"><img src="img/wait2.png"></div><div id ="open2" class="open"><img src="img/stanby2.png"></div></section>
        </article>

        <article id="finish" style="display:none;">			
            <section class="fin" id="fplset1"><img id="fimg1" src=""></section>
            <section class="fin" id="fplset2"><img id="fimg2" src=""></section>
        </article>

        <article id="battle" style="display:none;" >

            <section id="podata"><!---the data about pokemon--->
                <div id="pokemon1">
                    <p class="poname">1P</p>
                    <p class="hp">HP</p>
                    <meter id="pokemeter1" value="0" min="0" max="100" low="40" high="70" optimum="100">
                    </meter>
                </div>
                <div id="vsicon">
                    <img src="img/vs.png">
                </div>
                <div id="pokemon2">	
                    <p class="poname">2P</p>
                    <p class="hp">HP</p>
                    <meter id="pokemeter2" value="0" min="0" max="100" low="40" high="70" optimum="100">
                    </meter>
                </div>
            </section>

            <section id="field"><!--pokemon image---->
                <div id="img1">
                    <img src="">
                </div>
                <div id="img2">
                    <img src="">
                </div>
                <img id="w_wait" src="img/wait.png">
                <img id="drug" src="">
            </section>

            <section id="pldata"><!---the data about player--->
                <div id="player1">
                    <img src="img/player1.jpg">
                    <div class="detail">
                        <p class="plname">PLAYER1</p>
                    </div>
                </div>
                <div id="cmd">
                    <ul id="list">
                        <li onClick="selectSE();">fight</li>
                        <li onClick="selectSE();">item</li>
                        <li onClick="selectSE();">pokemon</li>
                        <li onClick="selectSE();">surrender</li>
                        <div class="clear"></div>
                    </ul>
                    <ul id="det0">
                        <li onClick="attackCommand();">Tackle</li>
                        <li onClick="bombCommand();">Bomb</li>
                        <li onClick="quickCommand();">Quick&nbsp;Attack</li>
                        <li class="back">back</li>
                        <div class="clear"></div>				
                    </ul>
                    <ul id="det1">
                        <li onClick="drugPokemon();">drug</li>
                        <li>poison&nbsp;bomb</li>
                        <li>mini&nbsp;bomb</li>
                        <li class="back">back</li>
                        <div class="clear"></div>				
                    </ul>
                    <ul id="det2">
                        <li onClick="pokemonChange(1);">porigonZ</li>
                        <li onClick="pokemonChange(0);">kabigon</li>
                        <li onClick="pokemonChange(2);">berobelt</li>
                        <li class="back">back</li>
                        <div class="clear"></div>				
                    </ul>
                    <ul id="det3">
                        <li style="width:100%;">Are&nbsp;you&nbsp;really&nbsp;give&nbsp;up??</li>
                        <li onClick="retireCommand();">yes</li>
                        <li class="back">no(back)</li>
                        <div class="clear"></div>				
                    </ul>		
                </div>
                <div id="watch">
                    <p>Watching Mode</p>
                </div>
                <div id="action">
                    <p>ƒJƒrƒSƒ“‚Ì‘Ì“–‚½‚è</p>
                </div>
                <div id="player2">
                    <div class="detail">
                        <p class="plname">PLAYER2</p>
                    </div>
                    <img src="img/player2.jpg">
                </div>
            </section>
        </article>
    </body>
</html>
