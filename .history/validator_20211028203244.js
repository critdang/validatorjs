// Đối tượng `Validator`(constructor function)
function Validator(options) {
    //Hàm thực hiện validate 
    function validate(inputElement, rule) {
        //value: inputElement.value. khách hàng nhập
        //test func: rule.test là hàm nhận đối số inputElement.value(khách nhập) để check
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        if(errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            inputElement.parentElement.classList.add('invalid');
        }
    }
    //lấy element của form cần validate
    var formElement = document.querySelector(options);
    console.log(formElement)
    if(formElement) {
        options.rules.forEach (function (rule) {
            //tìm input theo formElement được query vào chứ không phải document
            var inputElement = formElement.querySelector(rule.selector)
            console.log(inputElement)
            if(inputElement) {
                //Xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    //hàm validate nhận rule 
                    validate(inputElement,rule);
                }
                //Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.add('invalid');
                }
            }
        });
    }
}

//Định nghĩa rules
// Validator vừa là function vừa là object
// Nguyên tắc của các rules:
// 1. Khi lỗi => message lỗi
// 2. Khi hợp lệ => Không trả gì (undefined)
// 3.
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    };
}
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regrex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regrex.test(value) ? undefined : 'Trường này phải là email';
        }
    };    
}
Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >=min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };    
}