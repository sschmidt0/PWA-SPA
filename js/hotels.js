// variables for fetch request or to store urls
let urlHotels;
let idHotelDetail;
let idHotels = [];
let srcArray = [];
let urlCoverFoto = [];
// store urls in array to use for next and previous buttons
let urlArray = [];
let replaceUrl;

let adults1;
let currency = "EUR";
let locale = "es_ES";
let checkinDate;
let checkoutDate;
let checkIn;
let checkOut;

/*-----------------------------------------------------------------------------
	# content_hotels.html
------------------------------------------------------------------------------*/

// variables for error messages
let error_destination_hotel;
let error_in;
let error_out;

// variables to verify correctness of dates
let chITransformed;
let chOTransformed;
let now;


// search for hotels
$(document).on("click", "#searchHotel", () => {

	// variables to verify correctness of dates
	checkinDate = $("#checkIn").val();
	let checkinTransform = new Date(checkinDate);
	chITransformed = checkinTransform.getTime();

	checkoutDate = $("#checkOut").val();
	let checkoutTransform = new Date(checkoutDate);
	chOTransformed = checkoutTransform.getTime();

	now = Date.now();

	// transform data format
	let entryDate = checkinDate.split('/');
	checkIn = `${entryDate[2]}-${entryDate[0]}-${entryDate[1]}`;

	let outDate = checkoutDate.split('/');
	checkOut = `${outDate[2]}-${outDate[0]}-${outDate[1]}`;


	// get and establish rest of API parameters
	let destinationId = 1747049;
	let pageNumber = 1;
	let pageSize = 25;
	let sortOrder = "BEST_SELLER";
	adults1 = $("#adults1").val();

	// Validation of input data
	checkDestinationHotel();
	checkCheckIn();
	checkCheckOut();

	if (error_destination_hotel === false &&
		error_in === false &&
		error_out === false
	) {
		urlHotels = `https://hotels4.p.rapidapi.com/properties/list?currency=${currency}&locale=${locale}&sortOrder=${sortOrder}&destinationId=${destinationId}&pageNumber=${pageNumber}&checkIn=${checkIn}&checkOut=${checkOut}&pageSize=${pageSize}&adults1=${adults1}`;
		loadHotels();
		includeHotels();
		hideLoading();
	}
	else {
		event.preventDefault();
	}
});



// hotel date entry
function checkCheckIn() {
	if ((chITransformed !== "") && (chITransformed > now)) {
			$("#error_message_in").hide();
			error_in = false;
	} else {
			$("#error_message_in").html("Introduce una fecha válida");
			$("#error_message_in").show();
			error_in = true;
	}
}


// hotel date out
function checkCheckOut() {
	if ((chOTransformed !== "") && (chOTransformed > chITransformed)) {
			$("#error_message_out").hide();
			error_out = false;
	} else {
			$("#error_message_out").html("Introduce una fecha válida");
			$("#error_message_out").show();
			error_out = true;
	}
}


// include content into index.html
function includeHotels() {
	event.preventDefault();

	fetch("../html/content_hotels.html")
		.then(response => {
			return response.text();
		})
		.then(html => {
			$(".page-home").html(html);
			feather.replace();
		})
		.catch(error => {
			console.log(error);
		});
}


// fetch data from API
async function loadHotels() {
	event.preventDefault();
	showLoading();

	// executem la crida a servidor i guardem la resposta a una variable
	const response = await fetch(urlHotels, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "hotels4.p.rapidapi.com",
			"x-rapidapi-key": "30d40c3001msh527354931e78864p172a86jsn02a0d70e4f72"
		}
	});

	// convertim la resposta de servidor a json (és una petició asíncrona, igual que fetch)
	const jsonResponse = await response.json();

	// accions depenent de si hi ha o no errors
	if (response.ok) {
		let hotelCard = "";
		let shortURL = jsonResponse.data.body.searchResults.results;

		for (let i = 0; i < 25; i++) {
			let hotel = shortURL[i];
			let address = hotel.address;
			let street;
			let postalCode;
			let locality;
			let neighbourhood;

			// check if API contains properties
			if ("streetAddress" in address) street = hotel.address.streetAddress;
			else street = "";

			if ("postalCode" in address) postalCode = hotel.address.postalCode;
			else postalCode = "";

			if ("locality" in address) locality = hotel.address.locality;
			else locality = "Barcelona";

			if ("neighbourhood" in hotel) neighbourhood = hotel.neighbourhood;
			else neighbourhood = "";

			// generate hotel card and store hotel ids
			let hotelCode = generateHTML(i, hotel.thumbnailUrl, hotel.name, hotel.starRating, hotel.ratePlan.price.current, street, postalCode, locality, neighbourhood);
			idHotels.push(hotel.id);
			urlCoverFoto.push(hotel.thumbnailUrl);
			hotelCard += hotelCode;
		}
		$(".flex-content").html(hotelCard);
		feather.replace();
	} else {
		console.log(jsonResponse.error);
	}
}


function generateHTML(i, thumbnailUrl, name, starRating, price, street, postalCode, locality, neighbourhood) {
	return `
	  <article class="card hotel-card" id="${i}">
			<a class="card-link" href="#">
				<img class="card-img-top" src="${thumbnailUrl}" alt="Card image">
				<div class="card-body">
					<h4 class="card-title">${name}</h4>
					<p class="card-text starRate">${insertStars(starRating)}</p>
					<p class="card-text price">${price}</p>
					<div class="card-text address">
						<p>${street}</p>
						<p>
							<span>${postalCode}</span>
							<span>${locality}</span>
						</p>
					</div>
					<p class="card-text neighbourhood">${neighbourhood}</p>
				</div>
			</a>
		</article>
  `;
}


function insertStars(number) {
	let stars = " ";

	for (let i = 0; i < number; i++) {
		let icon = '<i class="fa fa-star"></i>';
		stars += icon;

	}
	return stars;
}






/*-----------------------------------------------------------------------------
	# content_detail.html
------------------------------------------------------------------------------*/

/******************************************
**** BUTTON BACK
*******************************************/

// to return to hotel list
$(document).on("click", ".btn-back", () => {
	showLoading();
	loadHotels();
	includeHotels();
	hideLoading();

	// empty urlArray with fotos stored
	urlArray = [];
});


/******************************************
**** CLICK ON HOTEL CARD - FETCH API
*******************************************/

// selecting one hotel card
$(document).on("click", ".hotel-card", async function() {
	showLoading();
	// include HTML template
	includeHotelDetails();

	// prepare content to be replaced
	let id = $(this).attr("id");
	idHotelDetail = idHotels[id];
	console.log("id hotel: ", idHotelDetail);
	const locale ="es_ES";

	const url = `https://hotels4.p.rapidapi.com/properties/get-details?locale=${locale}&currency=${currency}&checkOut=${checkOut}&adults1=${adults1}&checkIn=${checkIn}&id=${idHotelDetail}`;
	const response = await fetch(url, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "hotels4.p.rapidapi.com",
			"x-rapidapi-key": "30d40c3001msh527354931e78864p172a86jsn02a0d70e4f72"
		}
	});

	const urlPhotos = `https://hotels4.p.rapidapi.com/properties/get-hotel-photos?id=${idHotelDetail}`;
	const responsePhotos = await fetch(urlPhotos, {
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "hotels4.p.rapidapi.com",
			"x-rapidapi-key": "30d40c3001msh527354931e78864p172a86jsn02a0d70e4f72"
		}
	});

	// convertim la resposta de servidor a json (és una petició asíncrona, igual que fetch)
	const jsonResponse = await response.json();

	if (response.ok) loadDetailPage(jsonResponse);
	else console.log(jsonResponse.error);


	const jsonResponsePhotos = await responsePhotos.json();

	if (responsePhotos.ok) loadPhotosToPage(jsonResponsePhotos);
	else console.log(jsonResponsePhotos.error);

	if (response.ok && responsePhotos.ok) hideLoading();
});



/******************************************
**** INCLUDE CONTENT INTO INDEX.HTML
*******************************************/

// include content into index.html
function includeHotelDetails() {

	fetch("../html/content_detail.html")
		.then(response => {
			return response.text();
		})
		.then(html => {
			$(".page-home").html(html);
			feather.replace();
		})
		.catch(error => {
			console.log(error);
		});
}


/******************************************
**** FUNCTIONS EXECUTED WHEN FETCH RESPONSE IS POSITIVE
*******************************************/

function loadDetailPage(data) {
	let shortURL = data.data.body;

	// hotel name
	let hotelName = shortURL.propertyDescription.name;
	$(".hotel-name").html(hotelName);

	// hotel stars
	let starRating = shortURL.propertyDescription.starRating;
	let starsTotal = insertStars(starRating);
	$(".star-rate").html(starsTotal);

	// hotel address
	let hotelStreet = shortURL.propertyDescription.address.addressLine1;
	let hotelPC = shortURL.propertyDescription.address.postalCode;
	let hotelCity = shortURL.propertyDescription.address.cityName;
	let hotelAddress = `${hotelStreet}, ${hotelPC} ${hotelCity}`;
	$(".hotel-address").html(hotelAddress);

	// hotel rewards
	let hotelReward;
	if (shortURL.hotelWelcomeRewards.info !== "") {
		hotelReward = shortURL.hotelWelcomeRewards.info;
		$(".item-reward").html(hotelReward);
		$(".hotel-reward").css("background-color", "#960018");
	} else {
		hotelReward = "";
		$(".hotel-reward").css("background-color", "#fff");
	}

	// hotel guest review average score
	if (typeof shortURL.guestReviews.brands !== "undefined") {
		if ("formattedRating" in shortURL.guestReviews.brands) {
			let guestText;
			if ("badgeText" in shortURL.guestReviews.brands) guestText = shortURL.guestReviews.brands.badgeText;
			else guestText = "";

			let guestRating = shortURL.guestReviews.brands.formattedRating;
			let numberVotes = shortURL.guestReviews.brands.total;
			let htmlHotelReview = generateReviewHotel(guestText, guestRating, numberVotes);
			$(".container-review-hotel").html(htmlHotelReview);
		}
	}

	// hotel guest review different category scores
	let htmlItems = "";

	if (typeof shortURL.guestReviews.brands !== "undefined") {
		let reviewItemsLength = shortURL.guestReviews.trustYouReviews.length;
		if (reviewItemsLength !== 0) {
			for (let i = 0; i < reviewItemsLength; i++) {
				let reviewItemCategory = shortURL.guestReviews.trustYouReviews[i].categoryName;
				let reviewItemPercentage = shortURL.guestReviews.trustYouReviews[i].percentage;
				let reviewItemText = shortURL.guestReviews.trustYouReviews[i].text;
				let item = generateReviewItemCat(reviewItemPercentage, reviewItemCategory, reviewItemText);
				htmlItems += item;
			}
			$(".container-review-items").html(htmlItems);
		}
	}

	// hotel amenities / facilities
	let facilities = shortURL.amenities;

	// hotel facilities
	let facilitiesTypes = "";

	if (facilities.length !== 0) {
		let facilityCat1 = facilities[0].heading;
		$("#facilityCat1").html(facilityCat1);

		for (let i = 0; i < facilities[0].listItems.length; i++) {
			let facilityListTitle = facilities[0].listItems[i].heading;
			let innerListLength = facilities[0].listItems[i].listItems.length;
			let listElements = generateHTMLLists(facilityListTitle, innerListLength, facilities[0].listItems[i].listItems);
			facilitiesTypes += listElements;
		}
		$("#catList1").html(facilitiesTypes);
	}

	// room facilities
	let facilitiesTypes2 = "";

	if (facilities.length > 1) {
		let facilityCat2 = facilities[1].heading;
		$("#facilityCat2").html(facilityCat2);

		for (let i = 0; i < facilities[1].listItems.length; i++) {
			let facilityListTitle2 = facilities[1].listItems[i].heading;
			let innerListLength2 = facilities[1].listItems[i].listItems.length;
			let listElements2 = generateHTMLLists(facilityListTitle2, innerListLength2, facilities[1].listItems[i].listItems);
			facilitiesTypes2 += listElements2;
		}
		$("#catList2").html(facilitiesTypes2);
	}

	// heighbourhood description
	let neighbourhoodName;
	let neighborhoodDescription;

	if ("neighborhood" in data) {
		if ("neighborhoodName" in data.neighborhood) {
			neighbourhoodName = data.neighborhood.neighborhoodName;
			$(".neighbourhood-title").css("color", "$uoc_dark");
		} else {
			neighbourhoodName = "";
			$(".neighbourhood-title").css("color", "#fff");
		}

		if ("neighborhoodLongDescription" in data.neighborhood) neighborhoodDescription = data.neighborhood.neighborhoodLongDescription;
		else neighborhoodDescription = "";
	}
	$(".neighbourhood-hotelTitle").html(neighbourhoodName);
	$(".neighbourhood-description").html(neighborhoodDescription);


	feather.replace();
}



function loadPhotosToPage(data) {
	//console.log("photo data: ", data);
	let fotoItems = "";
	let url_s;
	let url_z;

	// iterate through hotel fotos
	if ("hotelImages" in data) {
		let hotelImagesLength = data.hotelImages.length;
		if (hotelImagesLength !== 0) {
			for (let i = 0; i < hotelImagesLength; i++) {
				let baseURLH = data.hotelImages[i].baseUrl;
				let urlH_s = baseURLH.replace("{size}", "s");

				// include url of foto if it does not already exist in array
				if (urlArray.indexOf(urlH_s) === -1) urlArray.push(urlH_s);
				url_s = data.hotelImages[0].baseUrl;
			}
		}
	}

	// iterate through room fotos
	if ("roomImages" in data) {
		let roomImagesLength = data.roomImages.length;
		if (roomImagesLength !== 0) {
			// loop through roomImages
			for (let i = 0; i < roomImagesLength; i++) {
				// loop through every item of roomImages - several images per room
				let eachRoomLength = data.roomImages[i].images.length;
				for (let j = 0; j < eachRoomLength; j++) {
					let baseURLR = data.roomImages[i].images[j].baseUrl;
					let urlR_s = baseURLR.replace("{size}", "s");

					// include url of foto if it does not already exist in array
					if (urlArray.indexOf(urlR_s) === -1) urlArray.push(urlR_s);
					urlArray.push(urlR_s);
				}
			}
		}
	}

	// generate HTML block from urlArray
	let arrayLength = urlArray.length;
	for (let i = 0; i < arrayLength; i++) {
		let fotoHTML = generateHtmlFotos(urlArray[i]);
		fotoItems += fotoHTML;
	}
	$("#hotel-fotos").html(fotoItems);

	// show first result as huge foto
	url_z = url_s.replace("{size}", "z");
	if ("hotelImages" in data) $("#fotoStart").attr("src", url_z);
	else $("#fotoStart").attr("src", urlCoverFoto[idHotelDetail]);
}

// Change src of huge foto to be shown
$(document).on("click", ".image-grid-item .hotel-image", function() {
	let elemURL = $(this).attr("src");
	replaceUrl = elemURL.replace("_s", "_z");

	//if there are no fotos from API, show foto from hotel-card
	if ($("#hotel-fotos").length > 0) $("#fotoStart").attr("src", replaceUrl);
	event.preventDefault();
});

// Show next or previous foto when corresponding buttons clicked
$(document).on("click", ".grid-left", function() {
	let newURL;
	let currentURL = $("#fotoStart").attr("src");
	let currentUrl_s = currentURL.replace("_z", "_s");
	let indexElem = urlArray.indexOf(currentUrl_s);

	if ((indexElem) !== 0) newURL = urlArray[indexElem - 1].replace("_s", "_z");
	else newURL = urlArray[urlArray.length - 1].replace("_s", "_z");

	$("#fotoStart").attr("src", newURL);
});

$(document).on("click", ".grid-right", function() {
	let newURL
	let currentURL = $("#fotoStart").attr("src");
	let currentUrl_s = currentURL.replace("_z", "_s");
	let indexElem = urlArray.indexOf(currentUrl_s);

	if ((indexElem + 1) !== urlArray.length) newURL = urlArray[indexElem + 1].replace("_s", "_z");
	else newURL = urlArray[0].replace("_s", "_z");

	$("#fotoStart").attr("src", newURL);
});



/******************************************
**** FUNCTIONS GENERATING HTML BLOCK
*******************************************/

function generateReviewHotel(text, rating, votes) {
	return `
		<div class="guest-review review-hotel">
			<p class="average">${rating}</p>
			<p class="badge-text">${text}</p>
			<p class="detail"><span class="total-votes">${votes}</span> votos</p>
		</div>
	`;
}

function generateReviewItemCat(percentage, category, text) {
	return `
		<!-- EVALUATION CATEGORY REVIEW -->
		<div class="guest-review review-items">
			<p class="average">${percentage}</p>
			<p class="badge-text">${category}</p>
			<p class="detail">${text}</p>
		</div>
	`;
}

function generateHTMLLists(title, numberLi, liText) {
	return `
		<div class="facility-list">
		<ul>
			<h4>${title}</h4>
			${insertLiElements(numberLi, liText)}
		</ul>
	</div>
	`;
}

function insertLiElements(numberLi, liText) {
	let li = "";

	for (let i = 0; i < numberLi; i++) {
		let liElement = `<li>${liText[i]}</li>`;
		li += liElement;

	}
	return li;
}

function generateHtmlFotos(url_s) {
	return `
		<div class="image-grid-item">
			<img class="hotel-image" src="${url_s}" alt="Foto of hotel and rooms">
		</div>
	`;
}
