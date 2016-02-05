angular.module('routerApp', ['routerRoutes', 'ngAnimate','ngImgur', 'itemService', 'userService'])

// create the controller and inject Angular's 
// this will be the controller for the ENTIRE site
.controller('mainController', function($scope, $location, $rootScope, $route, AuthService) {

    var vm = this;

    // create a bigMessage variable to display in our view
    vm.bigMessage = 'A smooth sea never made a skilled sailor.';

   $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.access.restricted && AuthService.isLoggedIn() === false) {
      $location.path('/login');
        }

    if (AuthService.isLoggedIn() === true){
        vm.isLoggedIn = true;
    }

    else {
        vm.isLoggedIn = false;
    }  

    console.log("are we logged in?: " + vm.isLoggedIn);
    
  });

    $scope.logout = function () {

        console.log("bye");

      console.log(AuthService.getUserStatus());

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/');
          vm.isLoggedIn = false;
        });

    };

})

// home page specific controller
.controller('homeController', function() {

    var vm = this;

    vm.message = 'This is the home page!';
})

// about page controller
.controller('closetController', function($rootScope, $location, Item) {

    var vm = this;

    vm.message = 'Look! I am an about page.';

    console.log("we loaded the closet page");
    console.log(Item);

    Item.all()
        .success(function(data) {

            console.log("it worked!");

            // bind the users that come back to vm.items
            vm.items = data;

            console.log(vm.items);
        })

})

.controller('mirrorController', function($scope,$http,imgur, Item) {

    var vm = this;

    $scope.photoBooth = function() {

        navigator.getUserMedia ||
            (navigator.getUserMedia = navigator.mozGetUserMedia ||
                navigator.webkitGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true,
                audio: false
            }, onSuccess, onError);
        } else {
            alert('Your browser is not supported');
        }

        function onSuccess(stream) {
            var vidContainer = document.getElementById('photoBooth');
            var vidStream;

            if (window.URL) {
                vidStream = window.URL.createObjectURL(stream);
            } else {

                vidStream = stream;

            }

            vidContainer.autoplay = true;
            vidContainer.src = vidStream;

        }

        function onError() {
            alert('Houston, we have a problem');

        }

        vm.photobooth = true;


    }


    $scope.picCapture = function() {
        var vidContainer = document.getElementById('photoBooth');
        var picture = document.getElementById('photoCap'),
            context = picture.getContext('2d');


        picture.width = "300";
        picture.height = "225";

        context.drawImage(vidContainer, 0, 0, picture.width, picture.height);
        console.log(picture)

        var dataURL = picture.toDataURL("image/jpeg", .5);
        var blob = $scope.dataURLToBlob(dataURL);
        console.log(blob)

        document.getElementById('canvasImg').src = dataURL;

        vm.photobooth = false;


        imgur.setAPIKey('Client-ID 40dbfe0cfea73a7');


        imgur.upload(blob).then(function then(model) {
            console.log('Your adorable cat be here: ' + model.link);
            $scope.getApi(model.link);
        });

    }

    vm.pasteLink = "Paste Link Here";

    $scope.imageLink = function(){
    	

    	$scope.getApi(vm.pasteLink);

    	vm.pasteLink = "paste link here!";


    }

    

    $scope.uploadFile = function(){

        //set API for imgur API

        imgur.setAPIKey('putClientIDHere');

      // get file from input
         
    var file = document.getElementById('fileinput').files[0];

       // turn file into blob and upload via imgur 
 
    var fileReader = new FileReader();
  
    fileReader.onloadend = function (e) {
    var arrayBuffer = e.target.result;
    var fileType = "image/*";
    
    blobUtil.arrayBufferToBlob(arrayBuffer, fileType).then(function (blob) {
      
      console.log("we made a blob!");
      imgur.upload(blob).then(function then(model) {
            console.log('Your adorable cat be here: ' + model.link);
            // $scope.getApi(model.link);
        });

    });
  };
    fileReader.readAsArrayBuffer(file);

}
    
    $scope.dataURLToBlob = function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);

            return new Blob([raw], {
                type: contentType
            });
        }

        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {
            type: contentType
        });
    }

    $http.defaults.headers.common.Authorization = 'CloudsightTokenHere'

    $scope.getApi = function(remoteUrl) {


        console.log($scope.dataUrl);
        // $scope.upload($scope.dataUrl);


        var args = {

            locale: 'en-US',
            remote_image_url: remoteUrl
        }


        $http.post('https://api.cloudsightapi.com/image_requests', args)
            .success(function(data) {
                console.log("sucess!");
                console.log(data);
                $scope.value(data.token)
            })
            .error(function(err) {
                console.log("fail");
                console.log(err);
            })



    }

    $scope.value = function(token) {
        console.log(token);
        $http.get('https://api.cloudsightapi.com/image_responses/' + token)
            .success(function(data) {


                if (data.status !== 'completed') {

                    setTimeout(function() {

                        $scope.value(token);



                    }, 1000);


                } else {
                    console.log(data.name)
                    vm.identity = data.name;
                    console.log(vm.identity);
                    $scope.createKeywords(vm.identity);




                }
            })
            .error(function(err) {
                console.log(err);
            })
    }


    $scope.createKeywords = function(identity){

    var response = identity;

    console.log(response);

    var descripArray = response.split(" ");

    var tempGender;
    var tempColor;
    var tempType;
    var tempDescription1;
    var tempDescription2;

    console.log(descripArray);

    var possibleColors = ["black", "red", "green", "blue", "yellow", "white", "gray", "grey", "brown", "orange", "pink", "purple", "taupe", "beige"];

    var possibleTypes = ["t-shirt", "shirt", "dress", "shorts", "pants", "jeans", "romper", "hoodie", "tee", "suit", "jacket", "cardigan", "blouse", "sweater", "dress shirt", "hoodie", "khakis", "vest"];

    var possibleDescriptions = ["sleeveless", "longsleeve", "striped", "v-neck", "plaid", "collared", "printed", "knit"];





      for (var i = 0; i < descripArray.length; i++) {


        if( descripArray[i] == "women's" || descripArray[i] == "men's") {

          tempGender = "women";
        }

        if(descripArray[i]=="woman's" || descripArray[i] == "girl's"){

          tempGender = "women";
        }

        if(descripArray == "man's" || descripArray == "boy's"){

          tempGender = "men";
        }




        for (var j = 0; j < possibleColors.length; j++) {
           
          if(descripArray[i] == possibleColors[j]) {
            tempColor = descripArray[i];
          }
        };

        // Main type assignment //
        
        for (var k = 0; k < possibleTypes.length; k++) {
           
          if(descripArray[i] == possibleTypes[k]) {
            tempType = descripArray[i];
          }

        };

        // Exceptions //

        if (descripArray[i-1] == "t" && descripArray[i] == "shirt") {
             tempType = "t shirt";
        }

        if (tempType =="t-shirt") {

            tempType = "t shirt"

        }

        if (tempType == "tee"){
            tempType = "t shirt";
        }




        if (descripArray[i] == "top") {
            tempType = descripArray[i-1] + " " + descripArray[i];

        if (descripArray[i] == "dress" && descripArray[i+1] == "shirt"){
          tempType = "dress shirt";
        }    
          }


        // Main description assignments //

        for (var l = 0; l < possibleDescriptions.length; l++) {
           
          if(descripArray[i] == possibleDescriptions[l]) {

            
             tempDescription2 = descripArray[i];
          }


        // Exceptions // 

          if (descripArray[i] == "up" && descripArray[i-1] == "zip"){

                tempDescription2 = "zip up";
            
        }

        if (descripArray[i] == "up" && descripArray[i-1] == "button"){

                tempDescription2 = "button up";
            
        }
  


        if (descripArray[i] == "sleeved" || descripArray[i]=="sleeve"){
            if(tempDescription2!= null){
          tempDescription2 = descripArray[i-1] + " sleeve";
            }
        }

         if (descripArray[i] == "neck") {
          tempDescription1 = descripArray[i-1] + " " + descripArray[i];
        }

        if(tempType == "t shirt" && tempDescription2 == "long sleeve"){
            tempType = "shirt";
        }

        if (tempColor == "grey"){
            tempColor = "gray";
        }

         if (tempColor == "taupe" || tempColor == "beige"){
            tempColor = "tan";
        }




        };



      };

    console.log(tempGender);
    console.log (tempColor);
    console.log (tempType);
    console.log(tempDescription1);
    console.log(tempDescription2);

    var keywords = {
        gender: tempGender,
        color: tempColor,
        type: tempType,
        description: tempDescription1,
        description2: tempDescription2
    };

    

        Item.singleItem(keywords)
            .success(function(data) {

            console.log("it worked!");
            console.log(data);


            //bind the users that come back to vm.items
            vm.matches = data;



            
        })


    };
})

.controller('loginController', function($scope, $location, AuthService){

    var vm = this;

    console.log(AuthService.getUserStatus());

    $scope.loggingIn = function(){

        console.log("we called it");

        // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

})

.controller('registerController', function($scope, $location, AuthService){

    var vm = this;

    console.log(AuthService.getUserStatus());

    $scope.registeration = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.email,$scope.registerForm.username, $scope.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

});







