let PAGE_NOT_FOUND = document.querySelector(".caution__tape .PAGE_NOT_FOUND")
    let tape__center = document.getElementById("caution__tape__center")
    let tape__left = document.getElementById("caution__tape__left")
    let ERROR = document.querySelector(".caution__tape .ERROR")
    let body_Width = document.getElementById("body").clientWidth
    let warning_len = ((body_Width / PAGE_NOT_FOUND.clientWidth) / 1.8) - 1;
    let caution_len = ((body_Width / ERROR.clientWidth) / 1.8) - 1;
    for (let i = 0; i < warning_len; i++) {
        tape__center.innerHTML += PAGE_NOT_FOUND.outerHTML;
    }
    for (let i = 0; i < caution_len; i++) {
        tape__left.innerHTML += ERROR.outerHTML;
    }
    window.addEventListener("deviceorientation",function (e) {
        tape__left.style.transform = "translate(" + (e.gamma /3) +"px ," + (e.beta/3) + "px) rotateZ(-45deg)"
        tape__center.style.transform = "translate(" + (e.gamma/2) +"px ," + (e.beta/2) + "px) scale(1.5) rotateZ(5deg)"
    } )
    window.addEventListener("mousemove",function (e) {
        tape__left.style.transform = "translate(" + e.pageX /30 +"px ," +e.pageY/30 + "px) rotateZ(-45deg)"
        tape__center.style.transform = "translate(" + e.pageX /10 +"px ," +e.pageY/10 + "px) scale(1.5) rotateZ(5deg)"
    })