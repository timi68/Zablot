
$(document).ready(($)=>{
    $('#show_hide_signin').click((e)=>{
        
    })
    const show_hide_password1 = document.querySelector('#show_hide_signup');
    const show_hide_password2 = document.querySelector('#show_hide_signin');
    const password1 = document.querySelector('#userPassword_sign_up');
    const password2 = document.querySelector('#userPassword_sign_in');
    const auth = document.querySelector('.auth');
    


    show_hide_password1.onclick = ()=>{
        if(password1.type == "password"){
            password1.type = "text";
        }
        else{
            password1.type = "password"
        }
    
        if(show_hide_password1.classList.contains('ion-md-eye-off')){
            show_hide_password1.classList.replace('ion-md-eye-off',"ion-md-eye")
            show_hide_password1.style.color = "var(--color-logo)"
        }
        else if(show_hide_password1.classList.contains('ion-md-eye')){
            show_hide_password1.classList.replace("ion-md-eye",'ion-md-eye-off');
            show_hide_password1.style.color = "";
        }
        
        password1.focus();
        
    }
    show_hide_password2.onclick = ()=>{
        if(password2.type == "password"){
            password2.type = "text";
        }
        else{
            password2.type = "password";
        }
    
        if(show_hide_password2.classList.contains('ion-md-eye-off')){
            show_hide_password2.classList.replace('ion-md-eye-off',"ion-md-eye")
            show_hide_password1.style.color = "var(--color-logo)";
        }
        else if(show_hide_password2.classList.contains('ion-md-eye')){
            show_hide_password2.classList.replace("ion-md-eye",'ion-md-eye-off')
            show_hide_password1.style.color = "";
        }
        
        password2.focus();
    }

    $('.sign_in').click(()=>{        
        $('.wrapper_sign_in').toggleClass('active')       
    })
    $('.sign_up').click(()=>{       
        $('.wrapper_sign_up').toggleClass('active')
    })

    $('.login_in').click((e)=>{
        e.preventDefault()
        if($('.wrapper_sign_up').hasClass('active')){
            if($('.wrapper_sign_up').toggleClass('active')){
                setTimeout(()=>{
                    $('.wrapper_sign_in').toggleClass('active')
                },500)
            }
        }
        else{
            $('.wrapper_sign_in').toggleClass('active')
        }
    })
    $('.Create').click((e)=>{
        e.preventDefault()
        if($('.wrapper_sign_in').hasClass('active')){
            if($('.wrapper_sign_in').toggleClass('active')){
                setTimeout(()=>{
                    $('.wrapper_sign_up').toggleClass('active')
                },500)
            }
        }
        else{
            $('.wrapper_sign_up').toggleClass('active')
        }
    })
  
    
    !function(e){
        e('.username').focus(()=>{
            let msg = '<span style="color:rgb(125 124 124)">Minimum length is 5</span>';
            if(e('.username').html() === "Enter your username"){
                e('.username_feedback').show().html(msg)
            }
        }),
        e('.username').on('keyup',()=>{
            
            let text = e('.username').val();
            let reg = new RegExp(/[\W]/);
            let check = text.match(reg);
            
            if(text.length < 5){
                let msg = '<span style="color:rgb(125 124 124)">Minimum length is 5</span>';
                e('.username_feedback').show().html(msg);
            }
            
            var data = {
                value: text
            };
            if(check === null && text.length >= 5){
                var check2 = text.match(/[a-zA-Z]/g)
                if(check2 === null || check2.length < 3){
                    let msg = '<span style="color: red">Username must have at least three letters and Digit</span>';
                    e('.username_feedback').show().html(msg);
                    return
                }
               (async function() {
                    const fetcher = await fetch('/check/username',{
                        method:"POST",
                        body:JSON.stringify(data),
                        headers:{
                            "Content-Type":"application/json"
                        }
                    });

                    const res = await fetcher.text();

                    if(res !== "true"){
                        let msg = '<span style="color:red">Username not Available</span>';
                        e('.username_feedback').show().html(msg) ;
                    }else{ 
                        let msg = '<span style="color:#2ebd2e">Checked</span>';
                        e('.username_feedback').show().html(msg);
                    }
                })()
            }else if(check !== null){
                e('.username_feedback').show().html('Only digits, alphabet & "_" is allowed').css('color',"red") ;
            }
        }),
        e('.signup_submit_button').click((ev)=>{
            ev.preventDefault();
            var form = document.querySelector('.sign_up_form');
            if(!form.checkValidity()){
                e('.sign_up_form').addClass('was-validated');
                return
            }
   
            var formdata =  e(form).serialize()
            var sendData = async ()=>{
                var sending_data = await fetch(`/home/signup`, {
                    method: 'POST',
                    body: formdata,
                    headers: new Headers({
                        "Content-Type":"application/x-www-form-urlencoded"
                    })
                   })
                var response = await sending_data.text()
                switch (response) {
                    case "dsi":
                        let msg = '<p style="color: green">Account registerd successfully, you can now login</p>';
                        e('.login_in').click();
                        e('.sign_in_error_container').html(msg)
                        e('.sign_up_wrapper input').each((i , el)=>{
                            e(el).val('');
                        })
                        break;
                    case "eae":
                        e('.sign_up_error_messsage').html('Email already exist');
                        break
                    default:
                        break;
                }
            }
            sendData();   
            console.log("sent")
        }),

        e('.sign_in_submit_button').click(ev =>{
            ev.preventDefault();
            const form = document.querySelector('.sign_in_form');
            if(!form.checkValidity()){
                e('.sign_in_form').addClass('was-validated');
                return
            }
            const auth = async () => {
                const fetcher = await fetch('/users/login',{
                    method:"POST",
                    body: e('.sign_in_form').serialize(),
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                })
                const fetcher_res = await fetcher.text();

                console.log(fetcher_res)
            }

            auth();

        })
        
    
    }(jQuery)
})