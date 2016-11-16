var apiKey = "rlthcid1aooa2e8s";
var loadedImages = [];
var urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au"];
var found = 0;


function apiArticles(searchTerm, searchZone) {
      var result = [];
      var searchTerm = searchTerm
      searchTerm = searchTerm.replace(/ /g, "%20");
      var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&encoding=json&zone=" + searchZone +
                    "&sortby=relevance" + "&q=" + searchTerm + "&s=0&n=5&include=articletext,pdf&encoding=json&callback=?";
      console.log(url);
      $.getJSON(url, function(data) {
              if (searchZone == "article") {
                        $.each(data.response.zone[0].records.work, function(index, value) {
                                    result.push({title: value.title, url: value.troveUrl});
                                  });
                      }
              else if (searchZone == "newspaper") {
                        $.each(data.response.zone[0].records.article, function(index, value) {
                                    result.push({title: value.heading, url: value.troveUrl, snippet: value.snippet});
                                  });
                      }
              else if (searchZone == "book") {
                        $.each(data.response.zone[0].records.work, function(index, value) {
                                    result.push({title: value.title, url: value.troveUrl, snippet: value.snippet});
                                  })
                      }
            });
      return result;
}

//+++++++++++++++++++++++++++++++++++++++++
function getImages(search) {
    
        loadedImages = [];
        found = 0;
        var searchTerm = search;
        searchTerm = searchTerm.replace(/ /g, "%20");
        var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&l-availability=y%2Ff&encoding=json&zone=picture&sortby=relevance&n=100&q=" + searchTerm + "&l-format=Photograph&callback=?";

        $.getJSON(url, function(data) {
                    $.each(data.response.zone[0].records.work, processImages);
                });
        return loadedImages;
}

function addFlickrItem(imgUrl, troveItem) {
        var flickr_key = "a4d0bf2f4bde0595521b7bd8317ec428";
        var flickr_secret = "efc7221b694ff55e";
        var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr_key + "&photo_id=";
        var url_comps = imgUrl.split("/");
        var photo_id = url_comps[url_comps.length - 1];

        $.getJSON(flickr_url + photo_id + "&format=json&nojsoncallback=1", function(data) {
                    if (data.stat == "ok") {
                                    var flickr_image_url = data.sizes.size[data.sizes.size.length - 1].source;
                                    loadedImages.push(flickr_image_url);
                                };
                });
}


function processImages(index, troveItem) {
        var imgUrl = troveItem.identifier[0].value;
        if (imgUrl.indexOf(urlPatterns[0]) >= 0) {
            found++;
            addFlickrItem(imgUrl, troveItem);
        } else if (imgUrl.indexOf(urlPatterns[1]) >= 0) {
                    found++;
                    loadedImages.push(imgUrl + "/representativeImage?wid=900");
        } else if (imgUrl.indexOf(urlPatterns[2]) >= 0) {
                    found++;
                    loadedImages.push("http://artsearch.nga.gov.au/IMAGES/LRG/" + getQueryVariable("IRN", imgUrl) + ".jpg");
        } else if (imgUrl.indexOf(urlPatterns[3]) >= 0) {
                    found++;
                    loadedImages.push("http://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?T=P&S=1&B=" + getQueryVariable("Number", imgUrl));
        } else if (imgUrl.indexOf(urlPatterns[4]) >= 0) {
                    found++;
                    loadedImages.push(imgUrl.slice(0, imgUrl.length - 3) + "jpg");
        } else {
        }
}

function getQueryVariable(variable, url) {
        var query = url.split("?");
        var vars = query[1].split("&");
        for (var i = 0; i < vars.length; i++) {
                        var pair = vars[i].split("=");
                        if (pair[0] == variable) {
                                                return pair[1];
                                        }
                }
        return (false);
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function getMousePos(evt) {
        var bound = context.canvas.getBoundingClientRect();
        var root = document.documentElement;
        input.mouseLoc.x = evt.clientX - bound.left - root.scrollLeft;
        input.mouseLoc.y = evt.clientY - bound.top - root.scrollTop;
}

var playerInput = function() {
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.mouseLoc = {x: 0, y: 0};
};

function enableControls() {
    window.input = new playerInput(); 
    $(document).keydown(function(action) {
        if (action.keyCode == 37 || action.keyCode == 65) {input.left = true;}
        if (action.keyCode == 39 || action.keyCode == 68) {input.right = true;}
        if (action.keyCode == 38 || action.keyCode == 87) {input.up = true;}
        if (action.keyCode == 40 || action.keyCode == 83) {input.down = true;}
    });
    
    $(document).keyup(function(action) {
        if (action.keyCode == 37 || action.keyCode == 65) {input.left = false;}
        if (action.keyCode == 39 || action.keyCode == 68) {input.right = false;}
        if (action.keyCode == 38 || action.keyCode == 87) {input.up = false;}
        if (action.keyCode == 40 || action.keyCode == 83) {input.down = false;}
    });

    context.canvas.addEventListener('mousedown', function(evt) {
        getMousePos(evt);
        console.log(input.mouseLoc.x, input.mouseLoc.y);
        if (gameState == "inWorld" || gameState == "home") {
            if (input.mouseLoc.x > 430 && input.mouseLoc.x < 578 && input.mouseLoc.y > 494 && input.mouseLoc.y < 533) {
                //context.context.drawImage(this.bgHelp, 0, 480, 832, 128);
            } else if (input.mouseLoc.x > 430 && input.mouseLoc.x < 578 && input.mouseLoc.y > 532 && input.mouseLoc.y < 569) {
                //context.context.drawImage(this.bgSettings, 0, 480, 832, 128); 
            } else if (input.mouseLoc.x > 430 && input.mouseLoc.x < 578 && input.mouseLoc.y > 568 && input.mouseLoc.y < 606) {
                playerScreen_x = 64;
                playerScreen_y = 32;
                playerMap_x = 64;
                playerMap_y = 32;
                map_x_offset = 0; 
                map_y_offset = 0; 
                charSel = 0;
                gameState = "startMenu";
            } else if (input.mouseLoc.x > 576 && input.mouseLoc.x < 722 && input.mouseLoc.y > 494 && input.mouseLoc.y < 533) {
                //context.context.drawImage(this.bgAnimals, 0, 480, 832, 128); 
            } else if (input.mouseLoc.x > 576 && input.mouseLoc.x < 722 && input.mouseLoc.y > 532 && input.mouseLoc.y < 569) {
                playerScreen_x = 64;
                playerScreen_y = 32;
                playerMap_x = 64;
                playerMap_y = 32;
                map_x_offset = 0; 
                map_y_offset = 0; 
                gameState = "home";
            } else if (input.mouseLoc.x > 576 && input.mouseLoc.x < 722 && input.mouseLoc.y > 568 && input.mouseLoc.y < 606) {
                //context.context.drawImage(this.bgStats, 0, 480, 832, 128); 
            } else if (input.mouseLoc.x > 721 && input.mouseLoc.x < 829 && input.mouseLoc.y > 494 && input.mouseLoc.y < 606) {
                //context.context.drawImage(this.bgBackpack, 0, 480, 832, 128);  
            } 
        }
        if (catchingAnimal == true) {
            if (input.mouseLoc.x > 408 && input.mouseLoc.x < 468 && input.mouseLoc.y > 386 && input.mouseLoc.y < 446) {
                score = score + 10;
                gameState = "inWorld";
            }
        } 
        if (gameState == "animalFound") {
            if (input.mouseLoc.x > 792 && input.mouseLoc.x < 832 && input.mouseLoc.y > 10 && input.mouseLoc.y < 46) {
                gameState = "inWorld";
                catchingAnimal = false;
            }
            if (catchingAnimal == false) {
                if (input.mouseLoc.x > 418 && input.mouseLoc.x < 768 && input.mouseLoc.y > 368 && input.mouseLoc.y < 474) {
                    gameState = "inWorld";
                }       
            }
            if (input.mouseLoc.x > 74 && input.mouseLoc.x < 419 && input.mouseLoc.y > 368 && input.mouseLoc.y < 474) {
                catchingAnimal = true;
            }
        }

        if (gameState == "startMenu") {
            if (input.mouseLoc.x > 252 && input.mouseLoc.x < 597 && input.mouseLoc.y > 235 && input.mouseLoc.y < 307) {
                gameState = "charSelect";    
            } else if (input.mouseLoc.x > 252 && input.mouseLoc.x < 597 && input.mouseLoc.y > 337 && input.mouseLoc.y < 414) {
            } else if (input.mouseLoc.x > 252 && input.mouseLoc.x < 597 && input.mouseLoc.y > 439 && input.mouseLoc.y < 516)    {
            }
        }

        if (gameState == "charSelect") {
            
            if (input.mouseLoc.x > 792 && input.mouseLoc.x < 832 && input.mouseLoc.y > 10 && input.mouseLoc.y < 46) {
                
                charSel = 0;
                gameState = "startMenu";
            }

            if (input.mouseLoc.x > 159 && input.mouseLoc.x < 426 && input.mouseLoc.y > 96 && input.mouseLoc.y < 365) {
                charSel = 1;
            } else if (input.mouseLoc.x > 425 && input.mouseLoc.x < 692 && input.mouseLoc.y > 96 && input.mouseLoc.y < 365) {
                charSel = 2;
            } else if (input.mouseLoc.x > 168 && input.mouseLoc.x < 400 && input.mouseLoc.y > 395 && input.mouseLoc.y < 476) {
                charSel = 0;
                gameState = "startMenu";
            } else if (input.mouseLoc.x > 452 && input.mouseLoc.x < 683 && input.mouseLoc.y > 395 && input.mouseLoc.y < 476) {
                if (charSel == 0) {
                    charSel = 1;
                } else {
                    if (charSel == 1) {
                        player = new sprite("images/male-player.png", 64, 64, 13);
                    } else if (charSel = 2) {
                        player = new sprite("images/female-player.png", 64, 64, 13);
                    }
                    gameState = "home"; 
                }
            }
        }

    });

    context.canvas.addEventListener('mousemove', function(evt) {
        getMousePos(evt);
    });
}

//<=========================================================================>\\

function i2xy(index, mapWidth) {
            var x = index % mapWidth;
            var y = Math.floor(index/mapWidth);
            return [x, y];
}

function xy2i(x, y, mapWidth) {
            return y * mapWidth + x;
}

//<=========================================================================>\\

var setupGame =  function(canvasId, width, height) {
    document.documentElement.style.overflow = 'hidden'; 
    document.body.scroll = "no";
    this.width = width;
    this.height = height;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    $(this.canvas).attr({width: this.width, height: this.height, style: 'width:' + this.width + 'px;' + 'height:' + this.height + 'px;' + 'z-index:' + '0;' + "border:4px solid purple;"});
};

//<=========================================================================>\\

var animate = function(aniWait, aniIndexCounter, aniFrame) {
    this.aniWait = aniWait;
    this.aniIndexCounter = aniIndexCounter;
    this.aniFrame = aniFrame;
};

var AnimationCounterIndex = 0;
var AnimationCounter = new Array();

function InitializeAnimationCounters() {
    for (var i = 0; i < 100; i++) {
        AnimationCounter[i] = new animate(0, 0, 0);
    }
}

//<=========================================================================>\\

var gameplayUI = function() {
    this.bg = new Image();
    this.bg.src = "images/ui-bg.png";
    this.bgHelp = new Image();
    this.bgHelp.src = "images/ui-bg-help.png";
    this.bgSettings = new Image();
    this.bgSettings.src = "images/ui-bg-settings.png";
    this.bgMenu = new Image();
    this.bgMenu.src = "images/ui-bg-menu.png";
    this.bgAnimals = new Image();
    this.bgAnimals.src = "images/ui-bg-animals.png";
    this.bgHome = new Image();
    this.bgHome.src = "images/ui-bg-home.png";
    this.bgStats = new Image();
    this.bgStats.src = "images/ui-bg-stats.png";
    this.bgBackpack = new Image();
    this.bgBackpack.src = "images/ui-bg-backpack.png";
    this.backPack = new Image();
    this.backPack.src = "images/backpack.png";
    this.home = new Image();
    this.home.src = "images/homeIco.png";
    this.animals = new Image();
    this.animals.src = "images/animalsIco.png";
    this.help = new Image();
    this.help.src = "images/helpIco.png";
    this.stats = new Image();
    this.stats.src = "images/statsIco.png";
    this.settings = new Image();
    this.settings.src = "images/settingsIco.png";
    this.menu = new Image();
    this.menu.src = "images/menuIco.png";
    
    this.draw = function() {
        if (input.mouseLoc.x > 430 && input.mouseLoc.x < 578 && input.mouseLoc.y > 494 && input.mouseLoc.y < 533) {
            context.context.drawImage(this.bgHelp, 0, 480, 832, 128);
        } else if (input.mouseLoc.x > 430 && input.mouseLoc.x < 578 && input.mouseLoc.y > 532 && input.mouseLoc.y < 569) {
            context.context.drawImage(this.bgSettings, 0, 480, 832, 128); 
        } else if (input.mouseLoc.x > 430 && input.mouseLoc.x < 578 && input.mouseLoc.y > 568 && input.mouseLoc.y < 606) {
            context.context.drawImage(this.bgMenu, 0, 480, 832, 128);  
        } else if (input.mouseLoc.x > 576 && input.mouseLoc.x < 722 && input.mouseLoc.y > 494 && input.mouseLoc.y < 533) {
            context.context.drawImage(this.bgAnimals, 0, 480, 832, 128); 
        } else if (input.mouseLoc.x > 576 && input.mouseLoc.x < 722 && input.mouseLoc.y > 532 && input.mouseLoc.y < 569) {
            context.context.drawImage(this.bgHome, 0, 480, 832, 128);  
        } else if (input.mouseLoc.x > 576 && input.mouseLoc.x < 722 && input.mouseLoc.y > 568 && input.mouseLoc.y < 606) {
            context.context.drawImage(this.bgStats, 0, 480, 832, 128); 
        } else if (input.mouseLoc.x > 721 && input.mouseLoc.x < 829 && input.mouseLoc.y > 494 && input.mouseLoc.y < 606) {
            context.context.drawImage(this.bgBackpack, 0, 480, 832, 128);  
        } else {
            context.context.drawImage(this.bg, 0, 480, 832, 128);
        }
        context.context.drawImage(this.backPack, 720, 494, 100, 100);
        context.context.fillStyle = "rgb(255,255,255)";
        if (catchingAnimal == false) {
            context.context.font = "24px sans-serif";
            context.context.fillText("Quests:", 30, 516);
            context.context.font = "16px sans-serif";
            context.context.fillText("1. Read the Quests... congrats you did it.", 45, 544);
        } else {
            context.context.font = "24px sans-serif";
            context.context.fillText("[Article] Wombats in the wild", 30, 516);
            context.context.font = "16px sans-serif";
            context.context.fillText("... Wombats and an australian animal", 45, 544);
            context.context.fillText("", 45, 565);
            context.context.fillText("", 45, 586);

        } 
        context.context.font = "24px sans-serif";
        context.context.drawImage(this.help, 430, 493, 30, 30);
        context.context.fillText("Help", 468, 516);
        context.context.drawImage(this.settings, 430, 529, 30, 30);
        context.context.fillText("Settings", 468, 554);
        context.context.drawImage(this.menu, 430, 565, 30, 30);
        context.context.fillText("Menu", 468, 590);
        context.context.drawImage(this.animals, 578, 493, 30, 30);
        context.context.fillText("Animals", 616, 516);
        context.context.drawImage(this.home, 578, 530, 30, 30);
        context.context.fillText("Home", 616, 554);
        context.context.drawImage(this.stats, 578, 565, 30, 30);
        context.context.fillText("Stats", 616, 590);
    }
}

var sprite = function(fn, spr_x, spr_y, sprSheetLen) {
     
    this.image = new Image();
    this.image.src = fn;
    this.spr_x = spr_x;
    this.spr_y = spr_y;
    this.sprSheetLen = sprSheetLen; 
     
    this.draw = function(x, y, seq, sprSheetLen) {
        if ($.isNumeric(seq) && seq >= 0) {
            var res = i2xy(seq, this.sprSheetLen);
            context.context.drawImage(this.image, res[0]*this.spr_x, res[1]*this.spr_y, this.spr_x, this.spr_y, x, y, this.spr_x, this.spr_y); 
        } else if (seq.length != undefined && seq.length > 0) {
            if (AnimationCounter[AnimationCounterIndex].aniWait++ >= 3) {
                AnimationCounter[AnimationCounterIndex].aniWait = 0;
                AnimationCounter[AnimationCounterIndex].aniIndexCounter++;
                if (AnimationCounter[AnimationCounterIndex].aniIndexCounter >= seq.length) {
                    AnimationCounter[AnimationCounterIndex].aniIndexCounter = 0;
                }
                AnimationCounter[AnimationCounterIndex].aniFrame = seq[AnimationCounter[AnimationCounterIndex].aniIndexCounter];
            }
            var res = i2xy(AnimationCounter[AnimationCounterIndex].aniFrame, this.sprSheetLen);
            context.context.drawImage(this.image, res[0]*this.spr_x, res[1]*this.spr_y, this.spr_x, this.spr_y, x, y, this.spr_x, this.spr_y);

            AnimationCounterIndex++;
        }
    };
};

//<=========================================================================>\\
function bubbleSort(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
        for(var j = 1; j<=i; j++){
            if(arr[j-1][0]<arr[j][0]){
                var temp = arr[j-1];
                arr[j-1] = arr[j];
                arr[j] = temp;
            }
        }
    }
}

function findSeed(mapIndex, seedMap, map_x, map_y) {
    var stack = [];
    if (seedMap[mapIndex[0]][mapIndex[1]][0] > 0) { return 0;}
    var baseDist = 64;
    while(true){
        stack.push([baseDist, -1 * (baseDist / 32), 0]);
        for (var i = 1; i <= baseDist / 32; i++) {
            stack.push([Math.sqrt(Math.pow(i*32, 2) + Math.pow(baseDist,2)), -1*i, -1*(baseDist/32)]);
        } 
        bubbleSort(stack);   
        if (stack[stack.length - 1][0] <= baseDist + 32) { 
            var checkVals = stack.pop();
            if (checkVals[2] == 0){
                if (mapIndex[0] + checkVals[1] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1]][0] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]+1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1]+1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1]][0])*100;
                    break;
                }
                if (mapIndex[1] + checkVals[1] > 0 && seedMap[mapIndex[0]][mapIndex[1] + checkVals[1]][0] > 0 && seedMap[mapIndex[0]][mapIndex[1] + checkVals[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]][0] = (seedMap[mapIndex[0]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]+1][0] = (seedMap[mapIndex[0]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1]+1][0] = (seedMap[mapIndex[0]][mapIndex[1] + checkVals[1]][0])*100;
                    break;0
                }
                if (mapIndex[0] - checkVals[1] < map_x - 2 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1]][0] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]+1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1]+1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1]][0])*100;
                    break;
                }
                if (mapIndex[1] - checkVals[1] < map_y - 2 && seedMap[mapIndex[0]][mapIndex[1] - checkVals[1]][0] > 0 && seedMap[mapIndex[0]][mapIndex[1] - checkVals[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]][0] = (seedMap[mapIndex[0]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]+1][0] = (seedMap[mapIndex[0]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1]+1][0] = (seedMap[mapIndex[0]][mapIndex[1] - checkVals[1]][0])*100;
                    break;
                }
            } else if (checkVals[1] == checkVals[2]) {
                if (mapIndex[0] + checkVals[1] > 0 && mapIndex[1] + checkVals[2] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0]+1][mapIndex[1]+1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1]+1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    break;
                }
                if (mapIndex[0] - checkVals[1] < map_x - 2 && mapIndex[1] + checkVals[2] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1]+1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    break;
                }
                if (mapIndex[0] - checkVals[1] < map_x - 2 && mapIndex[1] - checkVals[2] < map_y - 2 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    break;
                }
                if (mapIndex[0] + checkVals[1] > 0 && mapIndex[1] - checkVals[2] < map_y - 2 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    break;
                } 
            } else {
                if (mapIndex[0] + checkVals[1] > 0 && mapIndex[1] + checkVals[2] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    break;
                }
                if (mapIndex[0] + checkVals[2] > 0 && mapIndex[1] + checkVals[1] > 0 && seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] + checkVals[1]][0] > 0 && seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] + checkVals[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    break;
                }
                
                if (mapIndex[0] - checkVals[1] < map_x - 2 && mapIndex[1] + checkVals[2] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] + checkVals[2]][0])*100;
                    break;
                }
                if (mapIndex[0] - checkVals[2] < map_x - 2 && mapIndex[1] + checkVals[1] > 0 && seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] + checkVals[1]][0] > 0 && seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] + checkVals[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] + checkVals[1]][0])*100;
                    break;
                }
                
                if (mapIndex[0] - checkVals[1] < map_x - 2 && mapIndex[1] - checkVals[2] < map_y - 2 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0] > 0 && seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    break;
                }
                if (mapIndex[0] - checkVals[2] < map_x - 2 && mapIndex[1] - checkVals[1] < map_y - 2 && seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] - checkVals[1]][0] > 0 && seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] - checkVals[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] - checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    break;
                }
                
                if (mapIndex[0] + checkVals[1] > 0 && mapIndex[1] - checkVals[2] < map_y - 2 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0] > 0 && seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[1]][mapIndex[1] - checkVals[2]][0])*100;
                    break;
                }            
                if (mapIndex[0] + checkVals[2] > 0 && mapIndex[1] - checkVals[1] < map_y - 2 && seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] - checkVals[1]][0] > 0 && seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] - checkVals[1]][0] < 10) {
                    seedMap[mapIndex[0]][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1]][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0] + 1][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    seedMap[mapIndex[0]][mapIndex[1] + 1][0] = (seedMap[mapIndex[0] + checkVals[2]][mapIndex[1] - checkVals[1]][0])*100;
                    break;
                }            
            }
        }
        baseDist += 64;
    }
}

function setOverlay(STIndex, OTIndex, type, map) {
    map[OTIndex[0]][OTIndex[1]][0] = map[OTIndex[0]][OTIndex[1]][0] + (((map[STIndex[0]][STIndex[1]][0] - map[OTIndex[0]][OTIndex[1]][0]) / 100) * 12) - (12 - type);
}


function overlayTiles(index, map, map_x, map_y){
    if (index[0] % 2 > 0 && index[1] % 2 > 0) {
        if (index[0] - 1 > 0 && index[1] - 1 > 0) {
            if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1]][0] >= 0 && map[index[0]][index[1]][0] - map[index[0] - 1][index[1] - 1][0] >= 0 && map[index[0]][index[1]][0] - map[index[0]][index[1] - 1][0] >= 0 ) {
                var flags = [0,0,0];
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] - 1][0] > 0) {flags[0] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1] - 1][0] > 0) {flags[1] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1]][0] > 0) {flags[2] = 1;};
                
               if (flags[0] == 1 && flags[1] == 1 && flags[2] == 0) {
                    if (map[index[0]][index[1] - 1][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0],index[1] - 1], 9, map);
                    }
                } else if (flags[0] == 0 && flags[1] == 1 && flags[2] == 1) {
                    if (map[index[0] - 1][index[1]][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 12, map);
                    }
                } else if (flags[0] == 1 && flags[1] == 1 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0], index[1] - 1], 9, map);
                    setOverlay([index[0],index[1]], [index[0] - 1, index[1]], 12, map);
                    setOverlay([index[0],index[1]], [index[0] - 1, index[1] - 1], 5, map);
                }
                
            } 
        } else if (index[0] - 1 > 0) {   
            if (map[index[0] - 1][index[1]][0] % 100 == 0) { 
                if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1]][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 12, map);
                }
            }
        } else if (index[1] - 1 > 0) {   
            if (map[index[0]][index[1] - 1][0] % 100 == 0) { 
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] - 1][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0],index[1] - 1], 9, map);
                }
            }
        }    
   
    } else if (index[0] % 2 == 0 && index[1] % 2 > 0) {
        if (index[0] + 1 < map_x - 1 && index[1] - 1 > 0) {
            if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1]][0] >= 0 && map[index[0]][index[1]][0] - map[index[0] + 1][index[1] - 1][0] >= 0 && map[index[0]][index[1]][0] - map[index[0]][index[1] - 1][0] >= 0 ) {
                var flags = [0,0,0];
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] - 1][0] > 0) {flags[0] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1] - 1][0] > 0) {flags[1] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1]][0] > 0) {flags[2] = 1;};
                
               if (flags[0] == 1 && flags[1] == 1 && flags[2] == 0) {
                    if (map[index[0]][index[1] - 1][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0],index[1] - 1], 9, map);
                    }
                } else if (flags[0] == 0 && flags[1] == 1 && flags[2] == 1) {
                    if (map[index[0] + 1][index[1]][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0] + 1,index[1]], 10, map);
                    }
                } else if (flags[0] == 1 && flags[1] == 1 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0], index[1] - 1], 9, map);
                    setOverlay([index[0],index[1]], [index[0] + 1, index[1]], 10, map);
                    setOverlay([index[0],index[1]], [index[0] + 1, index[1] - 1], 6, map);
                }
                
            } 
        } else if (index[0] + 1 < map_x - 1) {   
            if (map[index[0] + 1][index[1]][0] % 100 == 0) { 
                if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1]][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0] + 1,index[1]], 10, map);
                }
            }
        } else if (index[1] - 1 > 0) {   
            if (map[index[0]][index[1] - 1][0] % 100 == 0) { 
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] - 1][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0],index[1] - 1], 9, map);
                }
            }
        }     
    } else if (index[0] % 2 > 0 && index[1] % 2 == 0) { //Bottom LEft
        if (index[0] - 1 > 1 && index[1] + 1 < map_y - 2) {
            if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1]][0] >= 0 && map[index[0]][index[1]][0] - map[index[0] - 1][index[1] + 1][0] >= 0 && map[index[0]][index[1]][0] - map[index[0]][index[1] + 1][0] >= 0 ) {
                var flags = [0,0,0];
                if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1]][0] > 0) {flags[0] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1] + 1][0] > 0) {flags[1] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] + 1][0] > 0) {flags[2] = 1;};
            
                if (flags[0] == 1 && flags[1] == 0 && flags[2] == 0) {
                    if (map[index[0] - 1][index[1]][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 1, map);
                    }
                } else if (flags[0] == 0 && flags[1] == 0 && flags[2] == 1) {
                    if (map[index[0]][index[1] + 1][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0],index[1] + 1], 4, map);
                    }
                } else if (flags[0] == 1 && flags[1] == 1 && flags[2] == 0) {
                    setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 12, map);
                } else if (flags[0] == 0 && flags[1] == 1 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 11, map);
                } else if (flags[0] == 1 && flags[1] == 0 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 1, map);
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 4, map);
                } else if (flags[0] == 1 && flags[1] == 1 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 11, map);
                    setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 12, map);
                    setOverlay([index[0],index[1]], [index[0] - 1,index[1] + 1], 7, map);
                }

            } 
        } else if (index[0] - 1 > 0) {   
            if (map[index[0] - 1][index[1]][0] % 100 == 0) { 
                if (map[index[0]][index[1]][0] - map[index[0] - 1][index[1]][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0] - 1,index[1]], 12, map);
                }
            }
        } else if (index[1] + 1 < map_y - 2) {
            if (map[index[0]][index[1] + 1][0] % 100 == 0) {
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] + 1][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 11, map);
                }
            }
        }
    } else if (index[0] % 2 == 0 && index[1] % 2 == 0) {
        if (index[0] + 1 < map_x - 1 && index[1] + 1 < map_y - 1) {   
            if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1]][0] >= 0 && map[index[0]][index[1]][0] - map[index[0] + 1][index[1] + 1][0] >= 0 && map[index[0]][index[1]][0] - map[index[0]][index[1] + 1][0] >= 0 ) {
                var flags = [0,0,0];
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] + 1][0] > 0) {flags[0] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1] + 1][0] > 0) {flags[1] = 1;};
                if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1]][0] > 0) {flags[2] = 1;};
                
                if (flags[0] == 1 && flags[1] == 0 && flags[2] == 0) {
                    if (map[index[0]][index[1] + 1][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0],index[1] + 1], 3, map);
                    }
                } else if (flags[0] == 0 && flags[1] == 0 && flags[2] == 1) {
                    if (map[index[0] + 1][index[1]][0] % 100 == 0) {
                        setOverlay([index[0],index[1]], [index[0] + 1,index[1]], 2, map);
                    }
                } else if (flags[0] == 1 && flags[1] == 1 && flags[2] == 0) {
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 11, map);
                } else if (flags[0] == 0 && flags[1] == 1 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0] + 1,index[1]], 10, map);
                } else if (flags[0] == 1 && flags[1] == 0 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0] + 1,index[1]], 2, map);
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 3, map);
                } else if (flags[0] == 1 && flags[1] == 1 && flags[2] == 1) {
                    setOverlay([index[0],index[1]], [index[0], index[1] + 1], 11, map);
                    setOverlay([index[0],index[1]], [index[0] + 1, index[1]], 10, map);
                    setOverlay([index[0],index[1]], [index[0] + 1, index[1] + 1], 8, map);
                }
                
            } 
            
        } else if (index[0] + 1 < map_x - 1) {   
            if (map[index[0] + 1][index[1]][0] % 100 == 0) { 
                if (map[index[0]][index[1]][0] - map[index[0] + 1][index[1]][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0] + 1,index[1]], 10, map);
                }
            }
        } else if (index[1] + 1 < map_y - 1) {
            if (map[index[0]][index[1] + 1][0] % 100 == 0) {
                if (map[index[0]][index[1]][0] - map[index[0]][index[1] + 1][0] > 0) {
                    setOverlay([index[0],index[1]], [index[0],index[1] + 1], 11, map);
                }
            }
        }    
    }
}

function genHome(map_x, map_y) {
    var mapBuild = new Array(map_x);
    for (var x = 0; x < map_x; x++) {
        mapBuild[x] = new Array(map_y);
        for (var y = 0; y < map_y; y++) {
            mapBuild[x][y] = new Array();
            if (x == 0) {
                mapBuild[x][y][0] = 500;
            } else if (y == 0) {
                if (x == 12 || x == 13) {
                    mapBuild[x][y][0] = 200;
                } else {
                    mapBuild[x][y][0] = 500;
                }

            } else if (x == map_x - 1) {
                mapBuild[x][y][0] = 500;
            } else if (y == map_y - 1) {
                mapBuild[x][y][0] = 500;
            } else {
                mapBuild[x][y][0] = 99; 
            }
        }
    } 
    
    mapBuild[9][1][1] = 7;
    mapBuild[10][1][1] = 7;
    mapBuild[11][1][1] = 8;
    mapBuild[11][2][1] = 7;
    mapBuild[14][1][1] = 8;
    mapBuild[14][2][1] = 7;
    mapBuild[15][1][1] = 7;
    mapBuild[16][1][1] = 7;
    mapBuild[19][1][1] = 24;
    mapBuild[5][5][1] = 25;
    mapBuild[1][0][1] = 26;
    mapBuild[5][0][1] = 26;
    mapBuild[5][5][1] = 25;
    mapBuild[7][7][1] = 25;
    mapBuild[9][9][1] = 25;
    mapBuild[11][7][1] = 25;
    mapBuild[13][5][1] = 25;
    mapBuild[15][7][1] = 25;
    mapBuild[17][9][1] = 25;
    mapBuild[19][7][1] = 25;
    mapBuild[21][5][1] = 25;    
    return mapBuild;
}

function genMap(map_x, map_y) {
    var mapBuild = new Array(map_x);
    for (var x = 0; x < map_x; x++) {
        mapBuild[x] = new Array(map_y);
        for (var y = 0; y < map_y; y++) {
            mapBuild[x][y] = new Array();
            if (x == 0) {
                mapBuild[x][y][0] = 500;
            } else if (y == 0) {
                mapBuild[x][y][0] = 500;
            } else if (x == map_x - 1) {
                mapBuild[x][y][0] = 500;
            } else if (y == map_y - 1) {
                mapBuild[x][y][0] = 500;
            }
        }
    } 
     
    for (var y = 1; y < map_y - 1; y++) {
        for (var x = 1; x < map_x - 1; x++) {
            if (x % 2 != 0 && y % 2 != 0 && Math.round(Math.random()*50) == 1){ //desert
                mapBuild[x][y][0] = 1;
            } else if (x % 2 != 0 && y % 2 != 0 && Math.round(Math.random()*50) == 1){ //forest
                mapBuild[x][y][0] = 2;
            } else if (x % 2 != 0 && y % 2 != 0 && Math.round(Math.random()*50) == 1){ // bushland
               mapBuild[x][y][0] = 3;
            } else if (x % 2 != 0 && y % 2 != 0 && Math.round(Math.random()*50) == 1){ //water
              mapBuild[x][y][0] = 4;              
            }
        }
    }
    
    for (var y = 1; y < map_y - 2; y = y + 2) {
        for (var x = 1; x < map_x - 2; x = x + 2) {
                findSeed([x,y], mapBuild, map_x, map_y);
        }
    }
   
    for (var y = 1; y < map_y - 2; y = y + 2) {
        for (var x = 1; x < map_x - 2; x = x + 2) {
            if (mapBuild[x][y][0] < 10) {
                mapBuild[x][y][0] = mapBuild[x][y][0] * 100;
                mapBuild[x+1][y][0] = mapBuild[x][y][0];
                mapBuild[x+1][y + 1][0] = mapBuild[x][y][0];
                mapBuild[x][y + 1][0] = mapBuild[x][y][0];
            }
        }
    }
   
    for (var y = 1; y < map_y - 1; y++) {
        for (var x = 1; x < map_x - 1; x++) { 
            if (mapBuild[x][y] % 100 == 0) {
                overlayTiles([x,y], mapBuild, map_x, map_y);                
            }              
        }
    }
    
    mapBuild[0][1][0] = 99;
    mapBuild[0][2][0] = 99;
    mapBuild[1][1][0] = 99;
    mapBuild[1][2][0] = 99;
    mapBuild[2][1][0] = 99;
    mapBuild[2][2][0] = 99;
    mapBuild[1][3][0] = 99;
    mapBuild[2][3][0] = 99;
    mapBuild[3][3][0] = 99;
    mapBuild[4][3][0] = 99;
    mapBuild[4][1][0] = 99;
    mapBuild[3][1][0] = 99;
    mapBuild[4][2][0] = 99;
    mapBuild[3][2][0] = 99;
    mapBuild[3][2][1] = 25;
  
    for (var x = 1; x < map_x - 1; x++) {
        for (var y = 1; y < map_y - 1; y++) {
            if (mapBuild[x][y][0] >= 100 && mapBuild[x][y][0] < 128) {
                if (Math.round(Math.random()*50)  == 1) {
                    mapBuild[x][y].push(17);                
                } else if (Math.round(Math.random()*50) == 1) {
                    mapBuild[x][y].push(18);
                } else if (Math.round(Math.random()*100) == 1) {
                    mapBuild[x][y].push(19);
                } else if (Math.round(Math.random()*100) == 1) {
                    mapBuild[x][y].push(20);
                } else if (Math.round(Math.random()*75) == 1) {
                    mapBuild[x][y].push(9);
                } else if (Math.round(Math.random()*75) == 1) {
                    mapBuild[x][y].push(10);
                } else if (Math.round(Math.random()*200) == 1) {
                    mapBuild[x][y].push(21);
                } else if (Math.round(Math.random()*200)  == 1) {
                    mapBuild[x][y].push(3);
                }
            } else if (mapBuild[x][y][0] >= 200 && mapBuild[x][y][0] < 213) {
                
                if (Math.round(Math.random()*10)  == 1) {
                    mapBuild[x][y].push(1);                
                } else if (Math.round(Math.random()*10) == 1) {
                    mapBuild[x][y].push(2);
                } else if (Math.round(Math.random()*10) == 1) {
                    mapBuild[x][y].push(4);
                } else if (Math.round(Math.random()*10) == 1) {
                    mapBuild[x][y].push(5);
                } else if (Math.round(Math.random()*30) == 1) {
                    mapBuild[x][y].push(6);
                } else if (Math.round(Math.random()*10) == 1) {
                    mapBuild[x][y].push(7);
                } else if (Math.round(Math.random()*30) == 1) {
                    mapBuild[x][y].push(8);
                } else if (Math.round(Math.random()*50)  == 1) {
                    mapBuild[x][y].push(12);
                } else if (Math.round(Math.random()*50)  == 1) {
                    mapBuild[x][y].push(13);
                } else if (Math.round(Math.random()*200)  == 1) {
                    mapBuild[x][y].push(14);
                } else if (Math.round(Math.random()*200)  == 1) {
                    mapBuild[x][y].push(15);
                } else if (Math.round(Math.random()*200)  == 1) {
                    mapBuild[x][y].push(16);
                }
            } else if (mapBuild[x][y][0] == 300) {
                if (Math.round(Math.random()*200)  == 1) {
                    mapBuild[x][y].push(4);                
                } else if (Math.round(Math.random()*50) == 1) {
                    mapBuild[x][y].push(6);
                } else if (Math.round(Math.random()*30) == 1) {
                    mapBuild[x][y].push(11);
                } 
            } else if (mapBuild[x][y][0] >= 400 && mapBuild[x][y][0] < 500) {
            }
        }
    }
    return mapBuild;
}

function drawWindow() {
    
    if (gameState == "startMenu") {
        this.bg = new Image();
        this.bg.src = "images/startBg.png";
        this.title = new Image();
        this.title.src = "images/mainTitle.png";
        this.blueBtn = new Image();
        this.blueBtn.src = "images/blueButton.png";
        this.orangeBtn = new Image();
        this.orangeBtn.src = "images/orangeButton.png";
        context.context.drawImage(this.bg, 0, 0, 832, 608);  
        context.context.drawImage(this.title, 266, 30, 300, 175);
        context.context.drawImage(this.blueBtn,  248, 230, 345, 72);
        context.context.drawImage(this.blueBtn,  248, 332, 345, 72);
        context.context.drawImage(this.blueBtn,  248, 434, 345, 72);
        if (input.mouseLoc.x > 252 && input.mouseLoc.x < 597 && input.mouseLoc.y > 235 && input.mouseLoc.y < 307) {
            context.context.drawImage(this.orangeBtn,  248, 230, 345, 72);
        } else if (input.mouseLoc.x > 252 && input.mouseLoc.x < 597 && input.mouseLoc.y > 337 && input.mouseLoc.y < 414) {
            context.context.drawImage(this.orangeBtn,  248, 332, 345, 72);
        } else if (input.mouseLoc.x > 252 && input.mouseLoc.x < 597 && input.mouseLoc.y > 439 && input.mouseLoc.y < 516)    {
            context.context.drawImage(this.orangeBtn,  248, 434, 345, 72);
        }
        context.context.fillStyle = "rgb(255,255,255)";
        context.context.font = "56px sans-serif";
        context.context.fillText("Start", 350, 285);
        context.context.fillText("Help", 355, 383);
        context.context.fillText("Settings", 310, 485); 
    } else if (gameState == "charSelect") {
        this.bg = new Image();
        this.bg.src = "images/aniBg.jpg";
        this.title = new Image();
        this.title.src = "images/charSelectTitle.png";
        this.charBg = new Image();
        this.charBg.src = "images/charChoiceBg.png";
        this.charBg1 = new Image();
        this.charBg1.src = "images/charChoice1.png";
        this.charBg2 = new Image();
        this.charBg2.src = "images/charChoice2.png";
        this.greyBtn = new Image();
        this.greyBtn.src = "images/greyButtonSm.png";
        this.blueBtn = new Image();
        this.blueBtn.src = "images/blueButtonSm.png";
        this.orangeBtn = new Image();
        this.orangeBtn.src = "images/orangeButtonSm.png";
        this.x = new Image();
        this.x.src = "images/x.png";
        context.context.drawImage(this.bg, 0, 0, 832, 608);  
        context.context.drawImage(this.charBg, 155, 90, 532, 270);
        context.context.drawImage(this.title,  113, 0, 618, 75);
        context.context.drawImage(this.greyBtn,  165, 390, 230, 80);
        context.context.drawImage(this.blueBtn,  448, 390, 230, 80);
        context.context.drawImage(this.x, 792, 10, 32, 32);
        
        if (charSel == 1) {
            context.context.drawImage(this.charBg1, 155, 90, 532, 270);
            selMale.draw(166,120,[0,1,2,3,4,5,6,7,8]);        
            selFemale.draw(431,120,[0]);        

        } else if (charSel == 2) {
            context.context.drawImage(this.charBg2, 155, 90, 532, 270);
            selFemale.draw(431,120,[0,1,2,3,4,5,6,7,8]);        
            selMale.draw(166,120,[0]);        
        } else {
            selFemale.draw(431,120,[0]);        
            selMale.draw(166,120,[0]);        
        }
         
        if (input.mouseLoc.x > 159 && input.mouseLoc.x < 426 && input.mouseLoc.y > 96 && input.mouseLoc.y < 365) {
            context.context.drawImage(this.charBg1, 155, 90, 532, 270);
            selMale.draw(166,120,[0,1,2,3,4,5,6,7,8]);        
            selFemale.draw(431,120,[0]);        

        } else if (input.mouseLoc.x > 425 && input.mouseLoc.x < 692 && input.mouseLoc.y > 96 && input.mouseLoc.y < 365) {
            context.context.drawImage(this.charBg2, 155, 90, 532, 270);
            selFemale.draw(431,120,[0,1,2,3,4,5,6,7,8]);        
            selMale.draw(166,120,[0]);        
        } else if (input.mouseLoc.x > 168 && input.mouseLoc.x < 400 && input.mouseLoc.y > 395 && input.mouseLoc.y < 476)    {
            context.context.drawImage(this.orangeBtn,  165, 390, 230, 80);
        } else if (input.mouseLoc.x > 452 && input.mouseLoc.x < 683 && input.mouseLoc.y > 395 && input.mouseLoc.y < 476)    {
            context.context.drawImage(this.orangeBtn,  448, 390, 230, 80);
        }

        context.context.fillStyle = "rgb(255,255,255)";
        context.context.font = "56px sans-serif";
        context.context.fillText("Back", 210, 449);
        context.context.fillText("Play", 505, 449);
    } else if (gameState == "inWorld" || gameState == "home") {
        var map = mapWorld;
        if (gameState == "home") {
            map = mapHome;
        }
        for (var y=0; y<16; y++) {
            for (var x=0; x<27; x++) {
                var tile_x = x * BLOCK_W - (map_x_offset % 32);
                var tile_y = y * BLOCK_H - (map_y_offset % 32);
                var mapXIndex = (x + Math.floor(map_x_offset / 32)) > map.length - 1 ? map.length - 1 : x + Math.floor(map_x_offset / 32);
                var mapYIndex = (y + Math.floor(map_y_offset / 32)) > map[0].length - 1 ? map[0].length - 1 : y + Math.floor(map_y_offset / 32);
            
                for (var i=0; i < map[mapXIndex][mapYIndex].length; i++) {
                    var tileType = map[mapXIndex][mapYIndex][i];
                    if (tileType == 99) {tiles.draw(tile_x, tile_y, 5); continue;};
                    if (tileType == 100) {tiles.draw(tile_x, tile_y, 0); continue;} 
                    if (tileType > 100 && tileType <= 112) {tiles.draw(tile_x, tile_y, 11 + tileType - 100); continue;}
                    if (tileType > 112 && tileType <= 124) {tiles.draw(tile_x, tile_y, 23 + tileType - 112); continue;}
                    if (tileType > 124 && tileType <= 136) {tiles.draw(tile_x, tile_y, 35 + tileType - 124); continue;}
                    if (tileType == 200) {tiles.draw(tile_x, tile_y, 1); continue;}
                    if (tileType > 200 && tileType <= 212) {tiles.draw(tile_x, tile_y, 47 + tileType - 200); continue;}
                    if (tileType > 212 && tileType <= 224) {tiles.draw(tile_x, tile_y, 59 + tileType - 212); continue;}
                    if (tileType == 300) {tiles.draw(tile_x, tile_y, 2); continue;}
                    if (tileType > 300 && tileType <= 312) {tiles.draw(tile_x, tile_y, 71 + tileType - 300); continue;}
                    if (tileType == 400) {tiles.draw(tile_x, tile_y, 3); continue;}
                    if (tileType == 500) {tiles.draw(tile_x, tile_y, 4); continue;}
                }
                if (map[mapXIndex][mapYIndex][1] == 11) {
                    tiles.draw(tile_x, tile_y, 90);
                } 
                if (map[mapXIndex][mapYIndex][1] == 25) {
                    tilesBig.draw(tile_x - 32, tile_y - 32, 29);

                } 
            }
        }


        playerActions();
        if (gameState == "home") {
            context.context.fillStyle = "rgb(255,255,255)";
            context.context.font = "72px sans-serif";
            context.context.fillText("Score: " + score, 90, 442);
        }

        for (var y=0; y<17; y++) {
            for (var x=0; x<28; x++) {
                var tile_x = x * BLOCK_W - (map_x_offset % 32);
                var tile_y = y * BLOCK_H - (map_y_offset % 32);
                var mapXIndex = (x + Math.floor(map_x_offset / 32)) > map.length - 1 ? map.length - 1 : x + Math.floor(map_x_offset / 32);
                var mapYIndex = (y + Math.floor(map_y_offset / 32)) > map[0].length - 1 ? map[0].length - 1 : y + Math.floor(map_y_offset / 32);
   
                for (var i=1; i < map[mapXIndex][mapYIndex].length; i++) {
                    var tileType = map[mapXIndex][mapYIndex][i];
                    if (tileType == 0) {
                    } else if (tileType == 1) {
                        tilesBig.draw(tile_x - 32, tile_y - 32, 24);
                    } else if (tileType == 2) {
                        tilesBig.draw(tile_x - 32, tile_y - 32, 25);
                    } else if (tileType == 3) {
                        tilesBig.draw(tile_x - 32, tile_y - 32, 26);
                    } else if (tileType == 4) {
                        tilesTall.draw(tile_x, tile_y - 32, 56);
                    } else if (tileType == 5) {
                        tiles.draw(tile_x, tile_y, 84);
                    } else if (tileType == 6) {
                        tiles.draw(tile_x, tile_y, 85);
                    } else if (tileType == 7) {
                        tiles.draw(tile_x, tile_y, 86);
                    } else if (tileType == 8) {
                        tiles.draw(tile_x, tile_y, 87);
                    } else if (tileType == 9) {
                        tiles.draw(tile_x, tile_y, 88);
                    } else if (tileType == 10) {
                        tiles.draw(tile_x, tile_y, 89);
                    } else if (tileType == 12) {
                        tiles.draw(tile_x, tile_y, 91);
                    } else if (tileType == 13) {
                        tiles.draw(tile_x, tile_y, 92);
                    } else if (tileType == 14) {
                        tiles.draw(tile_x, tile_y, 93);
                    } else if (tileType == 15) {
                        tiles.draw(tile_x, tile_y, 94);
                    } else if (tileType == 16) {
                        tiles.draw(tile_x, tile_y, 95);
                    } else if (tileType == 17) {
                        tiles.draw(tile_x, tile_y, 6);
                    } else if (tileType == 18) {
                        tiles.draw(tile_x, tile_y, 7);
                    } else if (tileType == 19) {
                        tiles.draw(tile_x, tile_y, 8);
                    } else if (tileType == 20) {
                        tiles.draw(tile_x, tile_y, 9);
                    } else if (tileType == 21) {
                        tilesBig.draw(tile_x - 32, tile_y - 32, 27);
                    } else if (tileType == 22) {
                        tiles.draw(tile_x, tile_y, 10);
                    } else if (tileType == 23) {
                        tiles.draw(tile_x, tile_y, 11);
                    } else if (tileType == 24) {
                        tilesTall.draw(tile_x, tile_y - 32, 57);
                    } else if (tileType == 26) {
                        tilesSuperBig.draw(tile_x, tile_y, 15);
                    }
                }    
                if (Math.floor(playerScreen_x / 32) == x && Math.floor(playerScreen_y / 32)  + 2 == y) {
                    player.draw(playerScreen_x, playerScreen_y, player_seq);
                }  
            }
        }
        gameUI.draw();
    } else if (gameState == "animalFound") {
        this.bg = new Image();
        this.bg.src = "images/aniBg.jpg";
        this.x = new Image();
        this.x.src = "images/x.png";
        this.animal = new Image();
        this.animal.src = findAnimals[imgIndex];
        this.choiceBg = new Image();
        this.choiceBg.src = "images/aniChoiceBg.png";
        this.choiceBgCatch = new Image();
        this.choiceBgCatch.src = "images/aniChoiceCatch.png";
        this.choiceBgLeave = new Image();
        this.choiceBgLeave.src = "images/aniChoiceLeave.png";
        this.optionsBg = new Image();
        this.optionsBg.src = "images/aniOptionsBg.png";
        this.food1 = new Image();
        this.food1.src = "images/aniPlants.png";
        this.food2 = new Image();
        this.food2.src = "images/aniMeats.png";
        this.food3 = new Image();
        this.food3.src = "images/aniBoth.png";
        
        var aniImgWidth = (animal.width / animal.height) * 304;

        context.context.drawImage(this.bg, 0, 0, 832, 544);  
        context.context.drawImage(this.x, 792, 10, 32, 32);
        context.context.drawImage(this.animal, (832-aniImgWidth) / 2, 48, aniImgWidth, 304);
        
        context.context.fillStyle = "rgb(255,255,255)";
        var foundText = "Never trust a dolphin";
        if (catchingAnimal == true) {
            foundText = "Catch the Wombat!"
            context.context.drawImage(this.optionsBg, 64, 362, 704, 108);
            context.context.font = "32px sans-serif";
            context.context.fillText("What does a", 80, 405);
            context.context.fillText("Wombat eat?", 80, 442);
            context.context.font = "16px sans-serif";
            context.context.drawImage(this.food1, 400, 378, 65, 65);
            context.context.fillText("Plants", 405, 458);
            context.context.drawImage(this.food2, 495, 378, 65, 65);
            context.context.fillText("Meat", 508, 458);
            context.context.drawImage(this.food3, 605, 378, 65, 65);
            context.context.fillText("Plants + Meat", 580, 458);
            
        } else {
            foundText = "You found a Wombat!";
            if (input.mouseLoc.x > 74 && input.mouseLoc.x < 419 && input.mouseLoc.y > 368 && input.mouseLoc.y < 474) {
                context.context.drawImage(this.choiceBgCatch, 64, 362, 704, 108);
            } else if (input.mouseLoc.x > 418 && input.mouseLoc.x < 768 && input.mouseLoc.y > 368 && input.mouseLoc.y < 474) {
                context.context.drawImage(this.choiceBgLeave, 64, 362, 704, 108);
            } else {
                context.context.drawImage(this.choiceBg, 64, 362, 704, 108);
            }
        
            context.context.font = "72px sans-serif";
            context.context.fillText("Catch it!", 90, 442);
            context.context.fillText("Leave it", 446, 442);
        }
        context.context.font = "32px sans-serif";
        context.context.fillText(foundText, (832 - context.context.measureText(foundText).width) / 2, 32);
        gameUI.draw();
    }
}

function collisionCheck(dir){
    var map = mapWorld;
    if (gameState == "home") {
        map = mapHome;
    }
    
    if (dir == "left"){
        var nextTile = map[Math.floor((playerMap_x - 1) / 32)][Math.ceil((playerMap_y + 32) / 32)][0]; 
       if (nextTile >= 400) {
            return 1;
        }
    } else if (dir == "right"){
        var nextTile = map[Math.floor((playerMap_x + 64) / 32)][Math.ceil((playerMap_y + 32) / 32)][0];
        if (nextTile >= 400) {
            return 1;
        }
    } else if (dir == "up"){
        var nextTile = map[Math.floor((playerMap_x + 32) / 32)][Math.ceil((playerMap_y - 1) / 32)][0];
       if (nextTile >= 400) {
            return 1;
        }
    } else if (dir == "down"){
        var nextTile = map[Math.floor((playerMap_x + 32) / 32)][Math.ceil((playerMap_y + 50) / 32)][0];
       if (nextTile >= 400) {
            return 1;
        }
    }
    if (gameState == "inWorld" && Math.round(Math.random()*500) == 1) {
        gameState = "animalFound";
        imgIndex = Math.floor(Math.random()*50);
    }
    return 0;
}

function playerActions() {
    if (gameState == "inWorld" || gameState == "home") {
        var map = mapWorld;
        if (gameState == "home") {
            map = mapHome;
        }
        
        player_direction = 0;                    
        player_seq = 0;
        if (input.left) {
            if (collisionCheck("left") == 1) {
            } else if (playerMap_x < 224) {
                playerMap_x -= 1;
                playerScreen_x = playerMap_x;
            } else if (playerScreen_x == 224){
                playerMap_x -= 1;
                map_x_offset -= 1;
                if (map_x_offset < 0) {map_x_offset = 0;}
                if (playerMap_x < 224) {playerScreen_x--;}
            } else if (playerScreen_x > 224){
                playerMap_x -= 1;
                playerScreen_x -= 1;
            }       
            player_direction |= DIR_W;
            if (gameState == "inWorld") {
                if (playerMap_x < 1) {
                    if (playerMap_y > 0 && playerMap_y < 33) {
                        playerMap_y = 20;
                        playerMap_x = 372;
                        playerScreen_y = playerMap_y;
                        playerScreen_x = playerMap_x;
                        gameState = "home";
                    }
                    playerMap_x += 1;
                    playerScreen_x = playerMap_x;
                }
            }

        }
                    
        if (input.right) {
            if (collisionCheck("right") == 1) {
            } else if (playerMap_x > ((map.length - 9)*BLOCK_W)) {
                playerMap_x += 1;
                playerScreen_x += 1;
            } else if (playerScreen_x == (17*BLOCK_W)){
                playerMap_x += 1;
                map_x_offset += 1;
            } else if (playerScreen_x < (17*BLOCK_W)){
                playerMap_x += 1;
                playerScreen_x += 1;
            }
            player_direction |= DIR_E; 
        }
      
        if (input.up) {
            if (collisionCheck("up") == 1) {
            } else if (playerMap_y < 5*32) {
                playerMap_y -= 1;
                playerScreen_y = playerMap_y;
            } else if (playerScreen_y == 5*32){
                playerMap_y -= 1;
                map_y_offset -= 1;
                if (map_y_offset < 0) {map_y_offset = 0;}
                if (playerMap_y < 5*32) {playerScreen_y--;}
            } else if (playerScreen_y > 5*32){
                playerMap_y -= 1;
                playerScreen_y -= 1;
            }
            player_direction |= DIR_N;
            
            if (gameState == "home") {
                if (playerMap_y < -30) {
                    if (playerMap_x > 351 && playerMap_x < 417) {
                        mapWorld = genMap(MAP_BW, MAP_BH);
                        playerMap_y = 32;
                        playerMap_x = 64;
                        playerScreen_y = playerMap_y;
                        playerScreen_x = playerMap_x;
                        gameState = "inWorld";
                    }
                    playerMap_y += 1;
                    playerScreen_y = playerMap_y;
                }
            }
        }

        if (input.down) {
            if (collisionCheck("down") == 1) {
            } else if (playerMap_y > ((map[0].length - 5)*BLOCK_H)) {
                playerMap_y += 1;
                playerScreen_y += 1;
            } else if (playerScreen_y == (10*BLOCK_H)){
                playerMap_y += 1;
                map_y_offset += 1;
            } else if (playerScreen_y < (10*BLOCK_H)){
                playerMap_y += 1;
                playerScreen_y += 1;
            }
            player_direction |= DIR_S;
        }

        if (player_direction != 0) {
            if (player_direction & DIR_N) player_seq = [105,106,107,108,109,110,111,112];
            if (player_direction & DIR_S) player_seq = [131,132,133,134,135,136,137,138]; 
            if (player_direction & DIR_W) player_seq = [118,119,120,121,122,123,124,125];
            if (player_direction & DIR_E) player_seq = [144,145,146,147,148,149,150,151];
        } else {
            player_seq = [27];
        }
    }
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//global vars

var context = null;
var BLOCK_W = 32; //Map tile width size (in px).
var BLOCK_H = 32; //Map tile height size (in px).
var MAP_BW = 100;
var MAP_BH = 100;

var playerScreen_x = 64;
var playerScreen_y = 32;
var playerMap_x = 64;
var playerMap_y = 32;
var selMale = new sprite("images/maleWalk.png", 256, 256, 9);
var selFemale = new sprite("images/femaleWalk.png", 256, 256, 9);

var player = new sprite("images/male-player.png", 64, 64, 13);
var tiles = new sprite("images/tiles.png", 32, 32, 12);
var tilesTall = new sprite("images/tiles.png", 32, 64, 12);
var tilesBig = new sprite("images/tiles.png", 64, 64, 6);
var tilesSuperBig = new sprite("images/tiles.png", 96, 64, 3);

var charSel = 0;

var player_is_moving = false;
var player_direction = 0;
var player_seq = 0;

var mapHome = genHome(26, 15);
var mapWorld = genMap(MAP_BW, MAP_BH);
var map_x_offset = 0; 
var map_y_offset = 0; 
var gameState = "startMenu";
var catchingAnimal = false;
var gameUI = new gameplayUI();

var animals = new Array();
var score = 0;

var DIR_E = 1;
var DIR_N = 2;
var DIR_W = 4;
var DIR_S = 8;

var findAnimals = getImages("Wombat");
var imgIndex = Math.floor(Math.random()*10);
var findAnimalArt = apiArticles("wombat", "article")[0];

window.input = null;


function getAnimals(){
 var data = "Goanna,Australian Goanna,Both,Desert.Bushland,Very Large Cage,Reptile.quest4\nRed-Belly Black Snake,Red-Belly Black Snack,Meat,Desert.Water.Bushland,Small Cage,Reptile.quest2\nGreen Tree Frog,Green Tree Frog,Plant,Water.Forest,Small Net,Reptile.quest5\nSnapping Turtle,Southern Snapping Turtle,Plant,Water,Small Cage,Reptile.quest2\nKookaburra,Kookaburra,Meat,Forest,Small Net,Bird.quest1\nEastern Curlew,Eastern Curlew Bird,Plant,Water,Small Cage,Bird.quest1\nChristmas Island Frigate Bird,Frigatebird,Both,Forest.Bushland,Small Net,Bird.quest1.quest5\nKoala,Koala,Plant,Forest.Bushland,Small Cage,Mammal.quest6\nEchidna,Echidna,Plant,Forest.Bushland.Desert,Small Cage,Mammal\nWombat,Wombat Animal,Plant,Forest.Bushland,Very Large Cage,Mammal.quest6\nMountain Pygmy Possum,Pygmy Possum,Plant,Forest.Bushland,Small Cage,Mammal.quest6\nHuntsman,Huntsman Spider,Meat,Desert.Bushland.Forest,Small Net,Insect.quest2.quest5\nStick Insect,Stick Insect,Plant,Forest.Bushland.Desert,Small Net,Insect.quest5\n";

    var lines = data.split('\n');
    animals = new Array(lines.length);
    for (var i = 0; i < lines.length; i++) {
        var fields = lines[i].split(",");
        animals[i] = new Array(fields.length);
        for (var j = 0; j < fields.length; j++) {
            var values = fields[j].split(".");
            animals[i][j] = values;
        }
    }
}



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$(document).ready(function() {
    context = new setupGame("game", 832, 608);
    getAnimals();
    console.log(animals);
    enableControls();
    InitializeAnimationCounters();
});

setInterval(function() {
    AnimationCounterIndex = 0;
    drawWindow();
}, 12);
