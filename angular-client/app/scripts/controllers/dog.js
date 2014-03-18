var app = angular.module('browserAppApp');

app.controller('DogController', [
	'$rootScope', '$scope', 'Mapdata', 'ShowService', 'ProfileService', '$location', '$route', '$routeParams', 'DogConstants',
	function DogController($rootScope, $scope, Mapdata, ShowService, ProfileService, $location, $route, $routeParams, DogConstants) {
		"use strict";


		/**
		 * Module level variables
		 */
		$rootScope.homeSectionClass = 'active';
		$rootScope.showsSectionClass = '';
		$rootScope.mapSectionClass = '';
		$rootScope.venuesSectionClass = '';
		$rootScope.peopleSectionClass = '';
		$rootScope.clubsSectionClass = '';
		$rootScope.accountSectionClass = '';

		/**
		 * Module level variables
		 */
		$scope.dog = {
			name: '',
			breed: '',
			kcheight: '',
			kcgrade: '',
			kcregisteredname: '',
			kcregisterednumber: '',
			dateofbirth: '',
			sex: '',
			microchip: '',
			tattoo: '',
			photo: ''

		};
		$scope.controls = {};
		$scope.sexOptions = DogConstants.sexes;
		$scope.kcgradeOptions = DogConstants.kennelClub.gradeOptions;
		$scope.kcheightOptions = DogConstants.kennelClub.heightOptions;
		$scope.breedOptions = DogConstants.kennelClub.breedOptions;
		$scope.classTypeOptions = DogConstants.classTypeOptions;
		$scope.controls.saveRecord = saveRecord;
		$scope.showData = {};
		$scope.showDataFiltered = {};
		$scope.controls.showFilterText = '';

		function receivedShows(data) {
			$scope.showData = data;
		}

		ShowService.upcomingShows(receivedShows, receivedShows);

		function filterShows() {
			$scope.showDataFiltered = [];

			if($scope.controls.showFilterText.length > 2) {

				_.each($scope.showData, function (item) {
					var showThis = false;

					if (item.Name.toLowerCase().indexOf($scope.controls.showFilterText.toLowerCase()) !== -1) {
						showThis = true;
					}

					if (showThis === true) {
						$scope.showDataFiltered.push(item);
					}

				});
			}
		}

		$scope.filterShows = filterShows;


		$scope.deleteDog = function (dog) {
			ProfileService.deleteDog({
				_id: dog._id
			}, function (data) {
				$scope.fetchProfile();
				$location.path('/account/dogs');
			}, function (error) {
				console.log(error);
			});
		};




		$scope.saveDog = function () {
			var data = $scope.dog;

			if (angular.isDefined($scope.dog._id)) {
				var dogData = {
					_id: $scope.dog._id,
					breed: $scope.dog.breed.value,
					dateofbirth: $scope.dog.dateofbirth,
					kcgrade: $scope.dog.kcgrade.value,
					kcheight: $scope.dog.kcheight.value,
					kcregisteredname: $scope.dog.kcregisteredname,
					kcregisterednumber: $scope.dog.kcregisterednumber,
					microchip: $scope.dog.microchip,
					name: $scope.dog.name,
					photo: $scope.dog.photo,
					sex: $scope.dog.sex.value,
					tattoo: $scope.dog.tattoo
				};

				ProfileService.updateDog(dogData, function (data) {
					$location.path('/account/dogs/' + $scope.dog._id);
					$scope.fetchProfile();
				}, function (error) {
					console.log(error);
				});
			} else {
				var dogData = {
					breed: $scope.dog.breed.value,
					dateofbirth: $scope.dog.dateofbirth,
					kcgrade: $scope.dog.kcgrade.value,
					kcheight: $scope.dog.kcheight.value,
					kcregisteredname: $scope.dog.kcregisteredname,
					kcregisterednumber: $scope.dog.kcregisterednumber,
					microchip: $scope.dog.microchip,
					name: $scope.dog.name,
					photo: $scope.dog.photo,
					sex: $scope.dog.sex.value,
					tattoo: $scope.dog.tattoo
				};

				ProfileService.addDog(dogData, function (data) {
					$location.path('/account/dogs');
					$scope.fetchProfile();
				}, function (error) {
					console.log(error);
				});
			}
		};




		function lookupId(id) {
			var result = id;

			if (angular.isDefined($scope.profile) && ($scope.profile !== null)) {
				_.each($scope.profile.Dogs, function (dogIterator) {
					if (dogIterator.Profile.Name.toLowerCase() == id.toLowerCase()) {
						result = dogIterator._id;
					}
				});
			}

			return result;
		}




		function saveRecordError(response) {
		}




		function saveRecord() {
			if (!$scope.form.$valid) {
				return;
			}

			var data = {
				dogId: lookupId($routeParams.id),
				showId: $scope.controls.showId,
				date: $scope.controls.date,
				show: $scope.controls.show,
				classnumber: $scope.controls.classnumber,
				classtype: $scope.controls.classtype,
				classname: $scope.controls.classname,
				time: $scope.controls.time,
				faults: $scope.controls.faults,
				place: $scope.controls.place,
				judge: $scope.controls.judge,
				points: $scope.controls.points,
				notes: $scope.controls.notes
			};

			ProfileService.addResult(data)
				.success(function() {
					$scope.fetchProfile();
					$location.path('/dogs/' + $routeParams.id + '/viewResults');
				})
				.error(saveRecordError);
		}





		/**
		 * Main function
		 */

		function main() {
			var action = '';

			if (typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}

			console.log(action);
			console.log($location.href);
			console.log($routeParams.id);
			console.log('Dog Controller');

			switch (action) {
			case 'list':

				break;

			case 'add':
				$scope.message = 'Add dog';
				break;

			case 'edit':
				$scope.message = 'Edit dog';
				console.log('Edit dog');

				$scope.$watch('profile', function () {
					if (angular.isDefined($scope.profile) && ($scope.profile !== null)) {
						_.each($scope.profile.Dogs, function (dogIterator) {
							if (dogIterator._id == $routeParams.id) {
								$scope.dog._id = dogIterator._id;
								$scope.dog.name = dogIterator.Profile.Name;
								$scope.dog.sex = _.findWhere(DogConstants.sexes, { value: dogIterator.Profile.Sex });
								$scope.dog.dateofbirth = dogIterator.Profile.DateOfBirth;
								$scope.dog.photo = dogIterator.Profile.Photo;
								$scope.dog.breed = _.findWhere(DogConstants.kennelClub.breedOptions, { value: dogIterator.Profile.Breed });

								if (angular.isDefined(dogIterator.Profile.KennelClub)) {
									$scope.dog.kcheight = _.findWhere(DogConstants.kennelClub.heightOptions, { value: dogIterator.Profile.KennelClub.Height });
									$scope.dog.kcgrade = _.findWhere(DogConstants.kennelClub.gradeOptions, { value: dogIterator.Profile.KennelClub.Grade });
									$scope.dog.kcregisteredname = dogIterator.Profile.KennelClub.RegisteredName;
									$scope.dog.kcregisterednumber = dogIterator.Profile.KennelClub.RegisteredNumber;
								}

								$scope.dog.microchip = dogIterator.Profile.Microchip;
								$scope.dog.tattoo = dogIterator.Profile.Tattoo;
							}
						});
					}
				});

				if (document.querySelector('div#addImage') !== null) {
					var profileDropzone = new Dropzone('div#addImage', {
						url: '/agility-diary/user/add-dog-profile-photo?id=' + $routeParams.id
					});

					profileDropzone.on('complete', function file() {
						profileDropzone.removeFile(file);
						profileDropzone.removeAllFiles();
						$scope.fetchProfile();
					});
				}
				break;

			case 'results':
			case 'details':
				console.log('Details');

				$scope.$watch('profile', function () {
					if (angular.isDefined($scope.profile) && ($scope.profile !== null)) {
						_.each($scope.profile.Dogs, function (dogIterator) {
							if (dogIterator._id == lookupId($routeParams.id)) {
								$scope.dog = dogIterator;
							}
						});
					}
				});

				if (document.querySelector('div#addImage') !== null) {
					var profileDropzone = new Dropzone('div#addImage', {
						url: '/agility-diary/user/add-dog-photo?id=' + lookupId($routeParams.id)
					});

					profileDropzone.on('complete', function file() {
						profileDropzone.removeFile(file);
						profileDropzone.removeAllFiles();
						$scope.fetchProfile();
					});
				}
			}
		}




		main();
	}
]);
