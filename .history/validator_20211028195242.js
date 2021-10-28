// Đối tượng `Validator`(constructor function)
function Validator(options) {
    //thực hiện validate 
    function validate(inputElement, rule) {
        //value: inputElement.value. khách hàng nhập
        //test func: rule.test là hàm nhận đối số inputElement.value(khách nhập) để check
        var errorMessage = rule.test(inputElement.value)
        var errorElement = inputElement.parentElement.querySelector('.form-message');

        if(errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            inputElement.parentElement.classList.add('invalid');
        }
    }

    var formElement = document.querySelector(options.form);

    if(formElement) {
        options.rules.forEach (function (rule) {
            //tìm input theo formElement được query vào chứ không phải document
            var inputElement = formElement.querySelector(rule.selector)

            if(inputElement) {
                //lắng nghe onblur
                inputElement.onblur = function () {
                    validate(inputElement,rule);

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
        test: function() {
            
        }
    };    
}