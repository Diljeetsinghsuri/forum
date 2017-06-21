angular.module("forum").controller("lightboxCtrl",lightboxCtrl)

function lightboxCtrl( $uibModalInstance, imageUrl){
    var lightbox = this;
    // document.getElementsByClassName("modal-content")[0].style.background = "transparent";
    lightbox.url = imageUrl;
    lightbox.close = function(){
        $uibModalInstance.close();
    }
}