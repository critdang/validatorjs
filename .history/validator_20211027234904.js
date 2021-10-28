// Đối tượng `Validator`(constructor function)
function Validator(options) {
    var formElement = document.querySelector(options.form);

    if(formElement) {
        options.rules.forEach (function (rule) {
            //tìm input theo formElement được query vào chứ không phải document
            var inputElement = formElement.querySelector(rule.selector)
        });
    }
}

//Định nghĩa rules
// Validator vừa là function vừa là object
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function() {

        }
    };
}
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function() {
            
        }
    };    
}