/////////////////////////////////////////////////////
// Game DOM Handler
/////////////////////////////////////////////////////
Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

var GameDOMHandler = function (gameHandler) {

    function setLife(life) {
        document.getElementById('life').innerHTML = life;
    }

    function setPlayers(players) {
        document.getElementById('players').innerHTML = players;
    }

    function setScore(score) {
        document.getElementById('score').innerHTML = score;
    }

    function updateRoomsList(roomsList) {
        if (roomsList.length === 0) {
            document.getElementById('gameRoom-list').innerHTML = "<li>" + "No results" + "<\li>";
        } else {
            var roomHTML = "";
            var roomId;
            while (roomId = roomsList.shift()) {
                roomHTML = roomHTML + "<li data-id='" + roomId + "'>" + roomId + "<\li>";
            }

            document.getElementById('gameRoom-list').innerHTML = roomHTML;
        }
    }

    function showComponentGameType() {
        hideComponentGameRoom();
        document.getElementById('gameType').className = '';
    }

    function hideComponentGameType () {
        document.getElementById('gameType').className = 'hidden';
    }

    function showComponentGameRoom () {
        hideComponentGameType();
        document.getElementById('gameRoom').className = '';
    }

    function hideComponentGameRoom () {
        document.getElementById('gameRoom').className = 'hidden';
    }

    function init() {
        if (!gameHandler.isMultiplayer) {
            hideComponentGameType();
        } else {
            document.getElementById('gameType-singlePlayer').addEventListener('click', function () {
                console.log("Single Player game type selected");
                hideComponentGameType();
                gameHandler.stop("Loading ...");
                gameHandler.start();
            });

            document.getElementById('gameType-multiPlayer').addEventListener('click', function () {
                console.log("Multiplayer game type selected");
                gameHandler.server.connect();
                gameHandler.server.send('rooms_list');
                showComponentGameRoom();

                document.getElementById('gameRoom-join').addEventListener('click', function () {
                    hideComponentGameRoom();
                    gameHandler.stop("Loading ...");
                    gameHandler.start();
                });

                document.getElementById('gameRoom-create').addEventListener('click', function () {
                    hideComponentGameRoom();
                    gameHandler.server.send('room_add');
                    gameHandler.stop("Loading ...");
                    gameHandler.start();
                });

                document.getElementById('gameRoom-list').addEventListener('click', function (e) {
                    if (e.target && e.target.nodeName == "LI") {
                        // Deselect all other nodes
                        var tmp = document.getElementById('gameRoom-list').getElementsByTagName('li');
                        for (var i = 0; i < tmp.length; i++) {
                            tmp[i].className = "";
                        }

                        // Select current node
                        e.target.className = "selected";
                    }
                });
            });
        }

        while (document.getElementsByTagName('canvas').length) {
            document.getElementsByTagName('canvas')[0].remove();
        }

        document.body.appendChild(gameHandler.renderer.domElement);

        clearMessage();
        resetLife();
        resetScore();
    }

    function resetLife() {
        setLife(gameHandler.maxLife);
    }

    function resetScore() {
        setScore(0);
    }

    function setMessage(msg) {
        document.getElementById('message').className = '';
        document.getElementById('message').innerHTML = msg;
    }

    function clearMessage() {
        document.getElementById('message').className = 'hidden';
        document.getElementById('message').innerHTML = '';
    }

    // Module Pattern
    return {
        init: init,
        setLife: setLife,
        setPlayers: setPlayers,
        setScore: setScore,
        resetLife: resetLife,
        resetScore: resetScore,
        setMessage: setMessage,
        clearMessage: clearMessage,
        updateRoomsList: updateRoomsList
    }
};