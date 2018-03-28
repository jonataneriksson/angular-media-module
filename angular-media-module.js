/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* !Config */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var plugin = angular.module('media-module', []);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* !Media Directive */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

plugin.directive('media', ['$timeout', function ($timeout) { return function ($scope, $element) {

  //Header
  var media;
  var args;

  //Initialize
  var init = function(){
    media = $element[0];
    args = { media: $element,  scope: $scope }
  }

  init();

  //Let the parents know that video is created
	$scope.$emit('mediacreated',  args);

	media.addEventListener('loadedmetadata', function (){
		//Let's check if the site is mobile.
    $scope.$emit('loadedmetadata', args);
	});

	//Play the video when it can play
	media.addEventListener('canplay', function (event){
		$scope.$emit('canplay', args);
    $element.removeClass('hidden-until-loaded');
	});

  //Play the video when it can play
	media.addEventListener('canplaythrough', function (event){
		$scope.$emit('canplaythrough', args);
	});

  //Play the video when it can play
	media.addEventListener('loadeddata', function (event){
		$scope.$emit('loadeddata', args);
	});

  //Load
	$scope.$on('load', function(){
		if(media.readyState <= 1 && media.currentSrc) {
			media.preload = 'auto';
      console.info('1A. Start loading:'+media.currentSrc);
    } else {
      console.info('1B. This video is already loaded:'+media.currentSrc);
      $scope.$emit('skiploading', args);
    }
	});

  //Load
	$scope.$on('loadorplay', function(){
		if(media.readyState <= 1) {
			media.preload = 'auto';
      $timeout(function(){$scope.$broadcast('loadorplay');}, 10);
		} else {
      $scope.$broadcast('play');
    }
	});

	//Play
	$scope.$on('play', function(event, args) {
		if(media.HAVE_ENOUGH_DATA > 3) {
      media.play();
		} else {
			console.error('Media didnt start playing');
		}
	});

  $scope.$on('go', function(event, point) {
    media.currentTime = point;
	});

	//Started
	media.addEventListener('playing', function (event){
		//Let's let the controller now that video is playing.
		$scope.$emit('playing', args);
	});

  //Started
	media.addEventListener('pause', function (event){
		//Let's let the controller now that video is playing.
		$scope.$emit('pause', args);
	});

	//Pause media
	$scope.$on('pause', function(event, args) {
		media.pause();
	});

  media.addEventListener('timeupdate', function() {
    $scope.$emit('timeupdate', args);
    if(media.duration-media.currentTime < 0.005){
      media.currentTime = 0;
      $scope.$emit('videoending', args);
    }
	});

}}]);
