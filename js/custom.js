document.body.onload = function() {
    let typed,
        boxer = $('.boxer');
    setTimeout(() => {
        $('.preloader').css({ 'display': 'none' });
        $('.page').addClass('loaded');
    }, 1000)

    // particles library
    particlesJS.load('particles-js', 'js/particles.json');

    // actions for desktops
    if (window.matchMedia('(min-width: 992px)').matches) {
        // background animation
        (function() {
            const el = document.querySelector(".header");
            el.addEventListener("mousemove", (e) => {
                let x = e.clientX / window.innerWidth;
                let y = e.clientY / window.innerHeight;
                el.style.backgroundPosition = 'bottom, ' + x * -50 + 'px ' + y * -50 + 'px';
            });
        })();
        // mouse cursor animation
        (function() {
            // get the mouse element
            const mouse = document.querySelector(".mouse");
            mouse.style.display = 'block';
            // get all links
            const links = document.querySelectorAll("a");
            // variable that add bounce to the circle
            const bounce = "bounce";
            // the variable that disable the animation
            const inactive = "inactive";
            
            // function that make the circle follows the mouse pointer
            function moveMouse(e) {
                const x = e.clientX;
                const y = e.clientY;
                mouse.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
            }

            // function that turn on / off the animation

            function disableAnimation() {
                const hasBounceClass = mouse.classList.contains(bounce);

                if (hasBounceClass) {
                    mouse.classList.add(inactive);
                    mouse.classList.remove(bounce);
                } else {
                    mouse.classList.add(bounce);
                    mouse.classList.remove(inactive);
                }
            }

            // check for when the mouse is being moving
            document.addEventListener("mousemove", moveMouse);
            // check wether the user hover / leave a link
            links.forEach(link => link.addEventListener("mouseover", disableAnimation));
            links.forEach(link => link.addEventListener("mouseleave", disableAnimation));
        })()
    }
    typed = new Typed('.greeting', {
        strings: ["Hello everybody!"],
        startDelay: 2000,
        typeSpeed: 80,
        onComplete: nextOne,
        delay: 300,
        onStringTyped: function() {
            return $('.typed-cursor').remove();
        }
    })

    function nextOne() {
        return new Typed('.element', {
            strings: ["My name is Asryan Babken ^500\nI am Front-End Web-Developer ^400\n&#128513;&#128526;"],
            typeSpeed: 80
        });
    }
    $('.boxer').click(function(e) {
        let target = e.target;
        if (target.className === 'yellow')  {
            boxer.addClass('icon');
            $('.boxer > *').fadeOut(100);
                anime({
                targets: '.boxer',
                padding: 0,
                top: ['50%','90%'],
                borderRadius: [10, '50%'],
                width: 70,
                height: 70,
                easing: 'spring(1, 90, 10, 0)'
            }); 
            setTimeout(()=> {
                boxer.css(
                    {
                        'backgroundImage': 'url(../img/console2.png)'
                    }
                )
            }, 200)
        } else if(target.className === 'boxer icon') {
            boxer.css(
                {
                    'backgroundImage': 'none'
                }
            )
            anime({
                targets: '.boxer',
                padding: '35px 10px 10px',
                top: ['90%','50%'],
                borderRadius: ['50%', '10px'],
                width: 550,
                height: 280,
                easing: 'spring(0, 100, 100, 0)'
            });
            $('.boxer > *').delay(400).fadeIn(100);
            boxer.removeClass('icon');
        } else if (target.className === 'red') {
            $('.boxer').animate({
                'opacity': 0
            }, 100);
            setTimeout(()=>{
                $('.boxer > *').fadeOut(100);
                boxer.addClass('icon');
                anime({
                    targets: '.boxer',
                    padding: 0,
                    top: ['50%','90%'],
                    borderRadius: [10, '50%'],
                    width: 70,
                    height: 70,
                    easing: 'spring(0, 100, 100, 0)'
                });
            },300)
            
            setTimeout(()=> {
                boxer.css(
                    {
                        'backgroundImage': 'url(../img/console2.png)',
                        'opacity': 1

                    }
                )
            }, 700)
        } else {
            return;
        }
        
    })
    
  
    
}