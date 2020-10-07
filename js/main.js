//************  loading main content dynamically ************/

// when page is loading and click on logo
$(window).on("load", loadHome);
$("#logo").on("click", loadHome);

function loadHome(e) {
    (e || window.event).preventDefault();
    showLoading();

    fetch("../html/content_home.html")
        .then(response => {
            return response.text();
        })
        .then(html => {
            $(".page-home").html(html);
            hideLoading();
            feather.replace();
        })
        .catch(error => {
            console.log(error);
        });
}



/*-----------------------------------------------------------------------------
	# Icon carregar pàgina
------------------------------------------------------------------------------*/

function showLoading() {
	$(".loader").css("display", "block");
}

function hideLoading() {
	$(".loader").css("display", "none");
}
