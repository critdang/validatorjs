// Đối tượng `Validator`(constructor function)
function Validator(options) {
    //options là object nhận từ index.html truyền tới
    //Hàm thực hiện validate 
    var selectorRules= {};

    function validate(inputElement, rule) {
        

        //value: inputElement.value. khách hàng nhập
        //test func: rule.test là hàm nhận đối số inputElement.value(khách nhập) để check
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        // var errorMessage = rule.test(inputElement.value) cách cũ
        var errorMessage;

        // Lấy ra các rules của các selector
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rule & check.
        // Nếu có lỗi thì dừng việc kiểm tra 
        //Vì rules là 1 mảng nên lọc qua và truyển vào inputElement của user
        for(var i=0; i<rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerHTML = '';
            inputElement.parentElement.classList.add('invalid');
        }
        return !errorMessage;
    }
    //lấy form chứa elements cần validate
    var formElement = document.querySelector(options.form);
    if(formElement) {
        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;
            // Lặp qua từng rules và validate
            options.rules.forEach (function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement,rule);
                if(!isValid) {
                    isFormValid = false;
                }
            });
           


            if(isFormValid) {
                if(typeof options.onSubmit === 'function') {

                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');

                    // enableInputs là nodelist và array.form convert sang array
                    var formValues = Array.from(enableInputs).reduce(function (values,input) {
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues);
                }
            }


        }


        //Lặp qua mỗi rules (Validator.isRequired) và lắng nghe(lăng nghe sự kiện blur,input,...)
        options.rules.forEach (function (rule) {
            // Lưu lại các rules cho mỗi input bằng rule.test(các functions)
            if(Array.isArray(selectorRules[rule.selector])) {
                //Nếu có hơn 2 phần tử chạy vào đây
                selectorRules[rule.selector].push(rule.test);
            }else {
                //Nếu có 1 phần tử đầu thì chạy vào đây
                selectorRules[rule.selector] = [rule.test]
            }
            
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
        console.log(selectorRules)
    }
}



//Định nghĩa rules
// Validator vừa là function vừa là object
// Nguyên tắc của các rules:
// 1. Khi lỗi => message lỗi
// 2. Khi hợp lệ => Không trả gì (undefined)
//isRequired cũng là function nhận object là Validator
//Định nghĩa rules
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}
//selector là tham số nhận từ index.html
Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regrex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regrex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };    
}
Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >=min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    };    
}
Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}