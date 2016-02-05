angular.module('mirrorCtrl', [])

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


        imgur.setAPIKey('Client-ID 40dbfe0cfea73a7');


        imgur.upload(blob).then(function then(model) {
            console.log('Your adorable cat be here: ' + model.link);
            $scope.getApi(model.link);
        });

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

    $http.defaults.headers.common.Authorization = 'CloudSight 51RAGqz9_ED1ExMzVG4I7Q'

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
                    vm.identity = data;
                    console.log(vm.identity);




                }
            })
            .error(function(err) {
                console.log(err);
            })
    }



});