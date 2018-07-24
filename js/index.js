var size = 4;
var score = 0;
var isMove = false;
var gameFlag = true;
var gameWidth = (Math.floor(window.screen.width / 100) * 100) > 400 ? 460 : (Math.floor(window.screen.width / 100) * 100);
var boxWidth = 0; //方块的宽度
var boxSumWidth = 0; //计算时方块宽度
var colorTable = ["#FFC43C", "#FF8228", "#FF4E3C", "#FF0808", "#D5DE51", "#DE6B51", "#E2AB9E", "#FF3C3C", "#FF3CB1", "#3C42FF", "#FF0000", "#ab3cff", "#9a30d0"];
var map = new Array(); //初始化地图 -1为空 其余正整数为方块的值
for (var i = 0; i < size; i++) {
    map[i] = new Array(size);
    for (var j = 0; j < size; j++) {
        map[i][j] = -1;
    }
}
var mergeMap = new Array(); //初始化缩放地图 false为不显示缩放动画
for (var i = 0; i < size; i++) {
    mergeMap[i] = new Array(size);
    for (var j = 0; j < size; j++) {
        mergeMap[i][j] = false;
    }
}

function findColor(val) { //根据方块内的值找出匹配颜色的index
    for (var i = 1; i < colorTable.length; i++) {
        if (val == Math.pow(2, i)) return i - 1;
    }
}
function createBox(y, x, val) { //生成方块  width:boxWidth+px 
    map[y][x] = val;
    var backgroundColor = "background-color:" + colorTable[findColor(val)] + ";";
	var boxNumClass="";
	if(gameWidth<400)
		boxNumClass="style=font-size:20px;"
    var tempTopBox;
    if (mergeMap[y][x]) tempTopBox = '<div class="game-top-box box-merge' + val + '" style="width: ' + boxWidth + 'px;height:' + boxWidth + 'px;' + backgroundColor + ';top:' + (y * boxSumWidth + 40) + 'px;left:' + (x * boxSumWidth + 40) + 'px;"><p '+ boxNumClass + '>' + val + '</p></div>';
    else tempTopBox = '<div class="game-top-box" style="width: ' + boxWidth + 'px;height:' + boxWidth + 'px;' + backgroundColor + 'top:' + (y * boxSumWidth + 40) + 'px;left:' + (x * boxSumWidth + 40) + 'px;"><p '+ boxNumClass + '>' + val + '</p></div>';
    $(".game-top").append(tempTopBox);
}
function updateMap() {
    $(".game-top").html(""); //清空地图
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (map[i][j] != -1) {
                createBox(i, j, map[i][j]);
            }
        }
    }
}
function clearMergeMap() {
    for (var i = 0; i < size; i++) for (var j = 0; j < size; j++) mergeMap[i][j] = false;
}

function isGameOver() {
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (map[i][j] == -1) {
                return false;
            }
        }
    }
    for (var i = 1; i < size - 1; i++) {
        for (var j = 1; j < size - 1; j++) {
            if (map[i][j] == map[i + 1][j] || map[i][j] == map[i - 1][j] || map[i][j] == map[i][j - 1] || map[i][j] == map[i][j + 1]) {
                return false;
            }
        }
    }
    for (var i = 0; i < size - 1; i++) {
        if (map[0][i] == map[0][i + 1] || map[3][i] == map[3][i + 1]) {
            return false;
        }

    }
    for (var i = 0; i < size - 1; i++) {
        if (map[i][0] == map[i + 1][0] || map[i][3] == map[i + 1][3]) {
            return false;
        }

    }
    return true;
}

function randBox() {
    var a = Math.floor(Math.random() * size);
    var b = Math.floor(Math.random() * size);
    if (map[a][b] == -1) {
        mergeMap[a][b] = true;
        map[a][b] = 2;
    } else {
        randBox();
        return;
    }
}

function restart() {
    size = 4;
    score = 0;
    isMove = false;
    gameFlag = true;
    for (var i = 0; i < size; i++) for (var j = 0; j < size; j++) {
        map[i][j] = -1;
        mergeMap[i][j] = false;
    }
}
function gameRight() {
    var flag = false; //右面是否有滑块
    var lastIndex = size;
    //从左向右滑
    for (var i = 0; i < size; i++) {
        lastIndex = size;
        for (var j = size - 2; j >= 0; j--) {
            flag = false;
            if (map[i][j] == -1);
            else {
                for (var l = j + 1; l < lastIndex; l++) { //向右循环查找
                    if (map[i][l] == -1);
                    else if (map[i][l] == map[i][j]) { //找到右面第一个相等的值
                        map[i][j] = -1;
                        map[i][l] = map[i][l] * 2;
                        score += map[i][l];
                        mergeMap[i][l] = true;
                        lastIndex = l;
                        flag = true;
                        isMove = true;
                        break;
                    } else { //右面相邻的值与他不相等
                        flag = true;
                        if (l - 1 != j) {
                            map[i][l - 1] = map[i][j];
                            map[i][j] = -1;
                            isMove = true;
                        }
                        break;
                    }
                }
                if (!flag) {
                    map[i][lastIndex - 1] = map[i][j];
                    map[i][j] = -1;
                    isMove = true;
                }
            }
        }
    }
}

function gameLeft() {
    var flag = false; //左面是否有滑块
    var lastIndex = -1;
    //从右向右左
    for (var i = 0; i < size; i++) {
        lastIndex = -1;
        for (var j = 1; j < size; j++) {
            flag = false;
            if (map[i][j] == -1);
            else {
                for (var l = j - 1; l > lastIndex; l--) { //向左循环查找
                    if (map[i][l] == -1);
                    else if (map[i][l] == map[i][j]) { //找到左面第一个相等的值
                        map[i][j] = -1;
                        map[i][l] = map[i][l] * 2;
                        score += map[i][l];
                        mergeMap[i][l] = true;
                        isMove = true;
                        lastIndex = l;
                        flag = true;
                        break;
                    } else { //左面相邻的值与他不相等
                        flag = true;
                        if (l + 1 != j) {
                            map[i][l + 1] = map[i][j];
                            map[i][j] = -1;
                            isMove = true;
                        }
                        break;
                    }
                }
                if (!flag) {
                    map[i][lastIndex + 1] = map[i][j];
                    map[i][j] = -1;
                    isMove = true;
                }
            }
        }
    }
}

function gameUp() {
    var flag = false; //上面是否有滑块
    var lastIndex = -1;
    //从下向上滑
    for (var j = 0; j < size; j++) {
        lastIndex = -1;
        for (var i = 1; i < size; i++) {
            flag = false;
            if (map[i][j] == -1);
            else {
                for (var l = i - 1; l >= 0; l--) { //向上循环查找
                    if (map[l][j] == -1);
                    else if (map[l][j] == map[i][j]) { //找到上面第一个相等的值
                        map[i][j] = -1;
                        map[l][j] = map[l][j] * 2;
                        score += map[l][j];
                        mergeMap[l][j] = true;
                        isMove = true;
                        lastIndex = l;
                        flag = true;
                        break;
                    } else { //上面相邻的值与他不相等
                        flag = true;
                        if (l + 1 != i) {
                            map[l + 1][j] = map[i][j];
                            map[i][j] = -1;
                            isMove = true;
                        }
                        break;
                    }
                }
                if (!flag) {
                    map[0][j] = map[i][j];
                    map[i][j] = -1;
                    isMove = true;
                }
            }
        }
    }
}

function gameDown() {
    var flag = false; //下面是否有滑块
    var lastIndex = size;
    //从上向下滑
    for (var j = 0; j < size; j++) {
        lastIndex = size;
        for (var i = size - 2; i >= 0; i--) {
            flag = false;
            if (map[i][j] == -1);
            else {
                for (var l = i + 1; l < lastIndex; l++) { //向下循环查找
                    if (map[l][j] == -1);
                    else if (map[l][j] == map[i][j]) { //找到下面第一个相等的值
                        map[i][j] = -1;
                        map[l][j] = map[l][j] * 2;
                        score += map[l][j];
                        mergeMap[l][j] = true;
                        lastIndex = l;
                        flag = true;
                        isMove = true;
                        break;
                    } else { //下面相邻的值与他不相等
                        flag = true;
                        if (l - 1 != i) {
                            map[l - 1][j] = map[i][j];
                            map[i][j] = -1;
                            isMove = true;
                        }
                        break;
                    }
                }
                if (!flag) {
                    map[lastIndex - 1][j] = map[i][j];
                    map[i][j] = -1;
                    isMove = true;
                }
            }
        }
    }
}

var mX = null;
var mY = null;

function intiGame() {
    randBox();
    randBox();
    //map[0][0]=256;
    //map[0][1]=8;
    //map[0][2]=4;
    //map[0][3]=2;
    //map[1][0]=2;
    //map[1][1]=32;
    //map[1][2]=8;
    //map[1][3]=64;
    //map[2][0]=8;
    //map[2][1]=2;
    //map[2][2]=4;
    //map[2][3]=8;
    //map[3][0]=2;
    //map[3][1]=4;
    //map[3][2]=128;
    //map[3][3]=-1;
    //map[0][0]=2;
    //map[0][1]=2;
    //map[0][2]=-1;
    // map[0][3]=4;
    updateMap();
    $("#score-board").text("分数：" + score);
}
$(function() {
    var divBox = '<div class="game-box" ></div>';
    for (var i = 0; i < size * size; i++) {
        $(".game-content").append(divBox);
    }

    $(".main").width(gameWidth);
    $(".game-content").width(gameWidth - 40);
    $(".game-content").height(gameWidth - 40);
    boxSumWidth = ($(".game-content").width() - 20) / size;
    boxWidth = boxSumWidth - 20;
    $(".game-box").width(boxWidth);
    $(".game-box").height(boxWidth);
    $(".game-top-box").width(boxWidth);
    $(".game-top-box").height(boxWidth);
    intiGame();
    document.addEventListener("keydown", cKeypress);
    document.addEventListener('touchstart', mTouchStart, false);
    document.addEventListener('touchmove', mTouchMove, false);
    function cKeypress(event) {
        var whichKey = event.which;
        isMove = false;
        event.preventDefault();
        switch (whichKey) {
        case 37:
            gameLeft();
            break;
        case 38:
            gameUp();
            break;
        case 39:
            gameRight();
            break;
        case 40:
            gameDown();
            break;
        }

        if (isMove) randBox();
        
        updateMap();
	if (isGameOver()) alert("Game Over!");
        clearMergeMap();
        $("#score-board").text("分数：" + score);
    }

    function mTouchStart(evt) {
        mX = evt.touches[0].clientX;
        mY = evt.touches[0].clientY;
    };

    function mTouchMove(evt) {
        if (!mX || !mY) {
            return;
        }
        isMove = false;
        var xUp = evt.touches[0].clientX;
        var yUp = evt.touches[0].clientY;

        var xDiff = mX - xUp;
        var yDiff = mY - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                gameLeft();
            } else {
                gameRight();
            }
        } else {
            if (yDiff > 0) {
                gameUp();
            } else {
                gameDown();
            }
        }
        if (isMove) randBox();
        
        updateMap();
	if (isGameOver()) alert("Game Over!");
        clearMergeMap();
        $("#score-board").text("分数：" + score);
        mX = null;
        mY = null;
    };

    $("#restart").click(function() {
        restart();
        intiGame();
    });

});
//rgb(255, 196, 60)2 #FFC43C
//rgb(255, 130, 40)4 #FF8228
//rgb(255, 78, 24)8 #FF4E3C
//rgb(220, 8, 8)16 #FF0808
//rgb(213, 222, 81)32 #D5DE51
//rgb(222, 107, 81)64 #DE6B51
//rgb(226, 171, 158)128 #E2AB9E
//rgb(255, 60, 60)256; #FF3C3C
//rgb(255, 60, 177) 512; #FF3CB1
//rgb(60, 66, 255)1024 #3C42FF
//rgb(255, 0, 0)2048 #FF0000
//4096 #ab3cff
//8192 #9a30d0