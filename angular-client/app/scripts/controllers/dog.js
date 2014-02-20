var app = angular.module('browserAppApp');

app.controller('DogController', [
	'$scope', 'Mapdata', 'ShowService', 'ProfileService', '$location', '$route', '$routeParams',
	function DogController($scope, Mapdata, ShowService, ProfileService, $location, $route, $routeParams) {
		"use strict";



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
		$scope.sexOptions = [
			{ name: 'Dog', value: 'Dog' },
			{ name: 'Bitch', value: 'Bitch' }
		];
		$scope.kcgradeOptions = [
			{ name: '1', value: 'KC Grade 1' },
			{ name: '2', value: 'KC Grade 2' },
			{ name: '3', value: 'KC Grade 3' },
			{ name: '4', value: 'KC Grade 4' },
			{ name: '5', value: 'KC Grade 5' },
			{ name: '6', value: 'KC Grade 6' },
			{ name: '7', value: 'KC Grade 7' },
			{ name: 'NFC', value: 'KC Grade NFC' }
		];
		$scope.kcheightOptions = [
			{ name: 'Small', value: 'Small' },
			{ name: 'Medium', value: 'Medium' },
			{ name: 'Large', value: 'Large' },
			{ name: 'To be measured', value: 'To be measured' }
		];
		$scope.breedOptions = [
			{ name: 'Affenpinscher', value: 'Affenpinscher' },
			{ name: 'Afghan Hound', value: 'Afghan Hound' },
			{ name: 'Airedale', value: 'Airedale' },
			{ name: 'Akita', value: 'Akita' },
			{ name: 'Akita Inu', value: 'Akita Inu' },
			{ name: 'Alaskan Klee Kai', value: 'Alaskan Klee Kai' },
			{ name: 'American Bulldog', value: 'American Bulldog' },
			{ name: 'American Cocker Spaniel', value: 'American Cocker Spaniel' },
			{ name: 'Australian Cattle Dog', value: 'Australian Cattle Dog' },
			{ name: 'Australian Kelpie', value: 'Australian Kelpie' },
			{ name: 'Australian Shepherd Dog', value: 'Australian Shepherd Dog' },
			{ name: 'Australian Terrier', value: 'Australian Terrier' },
			{ name: 'Basenji', value: 'Basenji' },
			{ name: 'Basset Fauve de Bretagne', value: 'Basset Fauve de Bretagne' },
			{ name: 'Basset Hound', value: 'Basset Hound' },
			{ name: 'Bavarian Mountain Hound', value: 'Bavarian Mountain Hound' },
			{ name: 'Beagle', value: 'Beagle' },
			{ name: 'Bearded Collie', value: 'Bearded Collie' },
			{ name: 'Bedlington Terrier', value: 'Bedlington Terrier' },
			{ name: 'Belgian Shepherd Dog', value: 'Belgian Shepherd Dog' },
			{ name: 'Bernese Mountain Dog', value: 'Bernese Mountain Dog' },
			{ name: 'Bichon Frise', value: 'Bichon Frise' },
			{ name: 'Bolognese', value: 'Bolognese' },
			{ name: 'Border Collie', value: 'Border Collie' },
			{ name: 'Border Terrier', value: 'Border Terrier' },
			{ name: 'Boston Terrier', value: 'Boston Terrier' },
			{ name: 'Bouvier de Flandres', value: 'Bouvier de Flandres' },
			{ name: 'Boxer', value: 'Boxer' },
			{ name: 'Bracco Italiano', value: 'Bracco Italiano' },
			{ name: 'Briard', value: 'Briard' },
			{ name: 'Brittany', value: 'Brittany' },
			{ name: 'Bull Mastiff', value: 'Bull Mastiff' },
			{ name: 'Cairn Terrier', value: 'Cairn Terrier' },
			{ name: 'Catalan Sheepdog', value: 'Catalan Sheepdog' },
			{ name: 'Cavalier King Charles Spaniel', value: 'Cavalier King Charles Spaniel' },
			{ name: 'Cesky Terrier', value: 'Cesky Terrier' },
			{ name: 'Chesapeake Bay Retriever', value: 'Chesapeake Bay Retriever' },
			{ name: 'Chihuahua', value: 'Chihuahua' },
			{ name: 'Chinese Crested', value: 'Chinese Crested' },
			{ name: 'Cocker Spaniel', value: 'Cocker Spaniel' },
			{ name: 'Collie X', value: 'Collie X' },
			{ name: 'Corgi', value: 'Corgi' },
			{ name: 'Croatian Sheepdog', value: 'Croatian Sheepdog' },
			{ name: 'Cross', value: 'Cross' },
			{ name: 'Curly Coated Retriever', value: 'Curly Coated Retriever' },
			{ name: 'Dachshund', value: 'Dachshund' },
			{ name: 'Dalmatian', value: 'Dalmatian' },
			{ name: 'Deerhound', value: 'Deerhound' },
			{ name: 'Doberman', value: 'Doberman' },
			{ name: 'English Bull Terrier', value: 'English Bull Terrier' },
			{ name: 'English Pointer', value: 'English Pointer' },
			{ name: 'English Setter', value: 'English Setter' },
			{ name: 'English Springer Spaniel', value: 'English Springer Spaniel' },
			{ name: 'English Toy Terrier', value: 'English Toy Terrier' },
			{ name: 'Estrella', value: 'Estrella' },
			{ name: 'Eurasier', value: 'Eurasier' },
			{ name: 'Fell Terrier', value: 'Fell Terrier' },
			{ name: 'Field Spaniel', value: 'Field Spaniel' },
			{ name: 'Finnish Lapphund', value: 'Finnish Lapphund' },
			{ name: 'Flat Coated Retriever', value: 'Flat Coated Retriever' },
			{ name: 'Fox Terrier (Smooth)', value: 'Fox Terrier (Smooth)' },
			{ name: 'Fox Terrier (Wire)', value: 'Fox Terrier (Wire)' },
			{ name: 'French Bulldog', value: 'French Bulldog' },
			{ name: 'German Long Haired Pointer', value: 'German Long Haired Pointer' },
			{ name: 'German Shepherd Dog', value: 'German Shepherd Dog' },
			{ name: 'German Short Haired Pointer', value: 'German Short Haired Pointer' },
			{ name: 'German Spitz', value: 'German Spitz' },
			{ name: 'German Wire Haired Pointer', value: 'German Wire Haired Pointer' },
			{ name: 'Giant Schnauzer', value: 'Giant Schnauzer' },
			{ name: 'Glen of Imaal Terrier', value: 'Glen of Imaal Terrier' },
			{ name: 'Golden Retriever', value: 'Golden Retriever' },
			{ name: 'Gordon Setter', value: 'Gordon Setter' },
			{ name: 'Great Dane', value: 'Great Dane' },
			{ name: 'Greyhound', value: 'Greyhound' },
			{ name: 'Griffon Bruxellois', value: 'Griffon Bruxellois' },
			{ name: 'Groenendael', value: 'Groenendael' },
			{ name: 'Hamiltonstovare', value: 'Hamiltonstovare' },
			{ name: 'Havenese', value: 'Havenese' },
			{ name: 'Hovawart', value: 'Hovawart' },
			{ name: 'Hungarian Puli', value: 'Hungarian Puli' },
			{ name: 'Hungarian Pumi', value: 'Hungarian Pumi' },
			{ name: 'Hungarian Stovare', value: 'Hungarian Stovare' },
			{ name: 'Hungarian Vizsla', value: 'Hungarian Vizsla' },
			{ name: 'Hungarian Wirehaired Vizsla', value: 'Hungarian Wirehaired Vizsla' },
			{ name: 'Husky', value: 'Husky' },
			{ name: 'Ibizan Hound', value: 'Ibizan Hound' },
			{ name: 'Irish Setter', value: 'Irish Setter' },
			{ name: 'Irish Terrier', value: 'Irish Terrier' },
			{ name: 'Irish Water Spaniel', value: 'Irish Water Spaniel' },
			{ name: 'Irish Wolfhound', value: 'Irish Wolfhound' },
			{ name: 'Italian Greyhound', value: 'Italian Greyhound' },
			{ name: 'Italian Spinoni', value: 'Italian Spinoni' },
			{ name: 'Italian Volpino', value: 'Italian Volpino' },
			{ name: 'Jack Russell Terrier', value: 'Jack Russell Terrier' },
			{ name: 'Japanese Shiba Inu', value: 'Japanese Shiba Inu' },
			{ name: 'Japanese Spitz', value: 'Japanese Spitz' },
			{ name: 'K Hondje', value: 'K Hondje' },
			{ name: 'Keeshond', value: 'Keeshond' },
			{ name: 'Kelpie', value: 'Kelpie' },
			{ name: 'Kooiker Hond', value: 'Kooiker Hond' },
			{ name: 'Korthals Griffon', value: 'Korthals Griffon' },
			{ name: 'Kromfohrlander', value: 'Kromfohrlander' },
			{ name: 'Labrador', value: 'Labrador' },
			{ name: 'Lagotto Romagnolo', value: 'Lagotto Romagnolo' },
			{ name: 'Lakeland Terrier', value: 'Lakeland Terrier' },
			{ name: 'Lancashire Heeler', value: 'Lancashire Heeler' },
			{ name: 'Large Munsterlander', value: 'Large Munsterlander' },
			{ name: 'Leonberger', value: 'Leonberger' },
			{ name: 'Lhaso Apso', value: 'Lhaso Apso' },
			{ name: 'Lowchen', value: 'Lowchen' },
			{ name: 'Lurcher', value: 'Lurcher' },
			{ name: 'Malamute', value: 'Malamute' },
			{ name: 'Malinois', value: 'Malinois' },
			{ name: 'Maltese', value: 'Maltese' },
			{ name: 'Manchester Terrier', value: 'Manchester Terrier' },
			{ name: 'Mexican Hairless', value: 'Mexican Hairless' },
			{ name: 'Miniature American Shepherd', value: 'Miniature American Shepherd' },
			{ name: 'Miniature Dachsund', value: 'Miniature Dachsund' },
			{ name: 'Miniature Pinscher', value: 'Miniature Pinscher' },
			{ name: 'Miniature Poodle', value: 'Miniature Poodle' },
			{ name: 'Miniature Schnauzer', value: 'Miniature Schnauzer' },
			{ name: 'Newfoundland', value: 'Newfoundland' },
			{ name: 'Norfolk Terrier', value: 'Norfolk Terrier' },
			{ name: 'Norwegian Buhund', value: 'Norwegian Buhund' },
			{ name: 'Norwegian Elkhound', value: 'Norwegian Elkhound' },
			{ name: 'Norwich Terrier', value: 'Norwich Terrier' },
			{ name: 'Nova Scotia Duck Tolling Retriever', value: 'Nova Scotia Duck Tolling Retriever' },
			{ name: 'NZ Huntaway', value: 'NZ Huntaway' },
			{ name: 'Old English Sheepdog', value: 'Old English Sheepdog' },
			{ name: 'Otterhound', value: 'Otterhound' },
			{ name: 'Papillon', value: 'Papillon' },
			{ name: 'Parsons Russell Terrier', value: 'Parsons Russell Terrier' },
			{ name: 'Patterdale Terrier', value: 'Patterdale Terrier' },
			{ name: 'Pekingese', value: 'Pekingese' },
			{ name: 'Pembrokeshire Corgi', value: 'Pembrokeshire Corgi' },
			{ name: 'Perdgueiro Portugues', value: 'Perdgueiro Portugues' },
			{ name: 'Petit Basset', value: 'Petit Basset' },
			{ name: 'Phalene', value: 'Phalene' },
			{ name: 'Pharoah Hound', value: 'Pharoah Hound' },
			{ name: 'Plummer Terrier', value: 'Plummer Terrier' },
			{ name: 'Polish Sheepdog', value: 'Polish Sheepdog' },
			{ name: 'Pomeranian', value: 'Pomeranian' },
			{ name: 'Portugese Podengo', value: 'Portugese Podengo' },
			{ name: 'Portugese Water Dog', value: 'Portugese Water Dog' },
			{ name: 'Pug', value: 'Pug' },
			{ name: 'Pyrenean Sheepdog', value: 'Pyrenean Sheepdog' },
			{ name: 'Red &amp; White Setter', value: 'Red &amp; White Setter' },
			{ name: 'Rhodesian Ridgeback', value: 'Rhodesian Ridgeback' },
			{ name: 'Rottweiler', value: 'Rottweiler' },
			{ name: 'Rough Collie', value: 'Rough Collie' },
			{ name: 'Russian Black Terrier', value: 'Russian Black Terrier' },
			{ name: 'Saluki', value: 'Saluki' },
			{ name: 'Samoyed', value: 'Samoyed' },
			{ name: 'Schapendoes', value: 'Schapendoes' },
			{ name: 'Schipperke', value: 'Schipperke' },
			{ name: 'Schnauzer', value: 'Schnauzer' },
			{ name: 'Scottish Terrier', value: 'Scottish Terrier' },
			{ name: 'Sealyham Terrier', value: 'Sealyham Terrier' },
			{ name: 'Segugio Ital', value: 'Segugio Ital' },
			{ name: 'Shar Pei', value: 'Shar Pei' },
			{ name: 'Shetland Sheepdog', value: 'Shetland Sheepdog' },
			{ name: 'Shih Tzu', value: 'Shih Tzu' },
			{ name: 'Skye Terrier', value: 'Skye Terrier' },
			{ name: 'Slovakian Rough Haired Pointer', value: 'Slovakian Rough Haired Pointer' },
			{ name: 'Small Munsterlander', value: 'Small Munsterlander' },
			{ name: 'Smooth Collie', value: 'Smooth Collie' },
			{ name: 'Spanish Water Dog', value: 'Spanish Water Dog' },
			{ name: 'Springer Spaniel', value: 'Springer Spaniel' },
			{ name: 'Staffordshire Bull Terrier', value: 'Staffordshire Bull Terrier' },
			{ name: 'Standard Poodle', value: 'Standard Poodle' },
			{ name: 'Sussex Spaniel', value: 'Sussex Spaniel' },
			{ name: 'Swedish Vallhund', value: 'Swedish Vallhund' },
			{ name: 'Terveuren', value: 'Terveuren' },
			{ name: 'Tibetan Mastiff', value: 'Tibetan Mastiff' },
			{ name: 'Tibetan Spaniel', value: 'Tibetan Spaniel' },
			{ name: 'Tibetan Terrier', value: 'Tibetan Terrier' },
			{ name: 'Toy Poodle', value: 'Toy Poodle' },
			{ name: 'Weimaraner', value: 'Weimaraner' },
			{ name: 'Welsh Sheepdog', value: 'Welsh Sheepdog' },
			{ name: 'Welsh Springer Spaniel', value: 'Welsh Springer Spaniel' },
			{ name: 'Welsh Terrier', value: 'Welsh Terrier' },
			{ name: 'West Highland White Terrier', value: 'West Highland White Terrier' },
			{ name: 'Wheaten Terrier', value: 'Wheaten Terrier' },
			{ name: 'Whippet', value: 'Whippet' },
			{ name: 'Working Beardie', value: 'Working Beardie' },
			{ name: 'Working Clumber Spaniel', value: 'Working Clumber Spaniel' },
			{ name: 'Working Cocker Spaniel', value: 'Working Cocker Spaniel' },
			{ name: 'Working Sheepdog', value: 'Working Sheepdog' },
			{ name: 'Working Springer Spaniel', value: 'Working Springer Spaniel' },
			{ name: 'Yorkshire Terrier', value: 'Yorkshire Terrier' }
		];




		/**
		 * Get the users profile
		 */

		function fetchProfile() {
			ProfileService.get(function (data) {
				$scope.profile = data;
			}, function (error) {

			});
		}




		$scope.deleteDog = function (dog) {
			ProfileService.deleteDog({
				_id: dog._id
			}, function (data) {
				$scope.profile = data;
			}, function (error) {
				console.log(error);
			});
		};




		$scope.saveDog = function () {
			var data = $scope.dog;

			ProfileService.addDog(data, function (data) {
				$location.path('/dogs');
				$scope.profile = data;
			}, function (error) {
				console.log(error);
			});
		};





		/**
		 * Main function
		 */

		function main() {
			var action = '';

			fetchProfile();

			if (typeof $route.current.$$route.action !== 'undefined') {
				action = $route.current.$$route.action;
			}

			console.log(action);
			console.log($location.href);
			console.log($routeParams.id);
			console.log('Dog Controller');

			switch (action) {
			case 'edit':
				console.log('Edit');

				$scope.$watch('profile', function () {
					_.each($scope.profile.Dogs, function (dogIterator) {
						if (dogIterator._id == $routeParams.id) {
							$scope.dog._id = dogIterator.id;
							$scope.dog.name = dogIterator.Profile.Name;
							$scope.dog.sex = dogIterator.Profile.Sex;
							$scope.dog.dateofbirth = dogIterator.Profile.DateOfBirth;
							$scope.dog.photo = dogIterator.Profile.Photo;
							$scope.dog.breed = dogIterator.Profile.Breed;
							if(angular.isDefined(dogIterator.Profile.KennelClub)) {
								$scope.dog.kcheight = dogIterator.Profile.KennelClub.Height;
								$scope.dog.kcgrade = dogIterator.Profile.KennelClub.Grade;
								$scope.dog.kcregisteredname = dogIterator.Profile.KennelClub.RegisteredName;
								$scope.dog.kcregisterednumber = dogIterator.Profile.KennelClub.RegisteredNumber;

							}
							$scope.dog.micrcohip = dogIterator.Profile.Microchip;
						}
					});
				});

				var profileDropzone = new Dropzone('div#addImage', {
					url: '/agility-diary/user/add-dog-profile-photo?id=' + $routeParams.id
				});

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					fetchProfile();
				});
				break;
			case 'details':
				console.log('Details');

				$scope.$watch('profile', function () {
					_.each($scope.profile.Dogs, function (dogIterator) {
						if (dogIterator._id == $routeParams.id) {
							$scope.dog = dogIterator;
						}
					});
				});

				var profileDropzone = new Dropzone('div#addImage', {
					url: '/agility-diary/user/add-dog-photo?id=' + $routeParams.id
				});

				profileDropzone.on('complete', function file() {
					profileDropzone.removeFile(file);
					profileDropzone.removeAllFiles();
					fetchProfile();
				});
			}
		}




		main();
	}
]);
