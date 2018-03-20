var selectedLanguage;

var checkLanguage = function () {
    if (selectedLanguage === 'hi') {
        console.log('Hindi selected');
        document.getElementById('begin').href = "login_hindi.html";
    }
}

document.getElementById('englishtag').addEventListener("click", function () {
    selectedLanguage = 'en';
    checkLanguage();
})

document.getElementById('hinditag').addEventListener("click", function () {
    selectedLanguage = 'hi';
    checkLanguage();
})
