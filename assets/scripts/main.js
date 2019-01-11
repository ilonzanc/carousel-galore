(function(){
  //-- Config
  //-- 1. Select a carousel block
  //-- 2. Set window.itemIndex = 0;
  //-- 3. Initiate window.slideInterval if automatic carousel
  //-- 4. initCarousel(carousel, factorNumber)

  let fifthCarousel = document.querySelector('.fifth-carousel-block');

  window.fifthItemIndex = 0;

  window.fifthSlideInterval;

  initCarousel(fifthCarousel, 1, window.fifthItemIndex, 'infinite', true, window.fifthSlideInterval);

  function initCarousel(carouselBlock, factorNumber, index, carouselType, autoSlide, interval = null) {
    // carouselBlok: the carousel you want to initiate
    // factorNumber: how many items you want to be visible per slide
    // index: the window.itemIndex
    // carouselType: 'default' or 'infinite'
    // autoSlide: true or false
    // interval: window.slideInterval if there is one. Defaults to null

    let carouselContainer = carouselBlock.querySelector('.carousel-container');
    let carousel = carouselContainer.querySelector('.carousel');

    let carouselItems = carousel.querySelectorAll('.carousel-item');
    let carouselItemsCount = carouselItems.length;

    let carouselLeft = carouselContainer.querySelector('.carousel-navigation__left');
    let carouselRight = carouselContainer.querySelector('.carousel-navigation__right');

    setCarouselItemWidth(carouselContainer, carouselItems, factorNumber);
    setCarouselWidth(carouselItems, carousel);
    let carouselSlideWidth = setCarouselSlideWidth(carouselItems);



    if (carouselItemsCount > 1) {
      carouselLeft.addEventListener('click', function(e) {
        e.preventDefault();

        if (carouselType == 'default') {
          if (interval) {
            slideCarousel(carouselType, interval, 1);
          } else {
            index = shiftSlide(1, carouselItems, carousel, carouselSlideWidth, index);
          }

        } else if (carouselType == 'infinite') {
          if (interval) {
            slideCarousel(carouselType, interval, 1);
          } else {
            index = infiniteShiftSlide(1, carouselItems, carousel, carouselSlideWidth, index);
          }

        }

      });

      carouselRight.addEventListener('click', function(e) {
        e.preventDefault();

        if (carouselType == 'default') {
          if (interval) {
            slideCarousel(carouselType, interval, -1);
          } else {
            index = shiftSlide(-1, carouselItems, carousel, carouselSlideWidth, index);
          }
        } else if (carouselType == 'infinite') {
          if (interval) {
            slideCarousel(carouselType, interval, -1);
          } else {
            index = infiniteShiftSlide(-1, carouselItems, carousel, carouselSlideWidth, index);
          }

        }
      });



      if (window.innerWidth < 700) {
        factorNumber = 1;
      }

      else if (window.innerWidth < 800) {
        factorNumber = 2;
      }

      if (autoSlide == true) {
        interval = window.setTimeout(slideCarousel, 5000, carouselType, interval, -1);
      }



      if (carousel.dataset.bullets == "true") {
        let bullets = carouselBlock.querySelectorAll('.carousel-bullets span');
        for (let b = 0; b < bullets.length; b++) {
          bullets[b].onclick = e => {
            bullets[b].classList.remove('active');

            bullets.forEach(bullet => {
              bullet.classList.remove('active');
            })

            e.target.classList.add('active');

            console.log('index: ' + index);
            console.log('selected index: ' + e.target.dataset.carouselIndex);
            direction = index - parseInt(e.target.dataset.carouselIndex);
            console.log(direction);
            //index = e.target.dataset.carouselIndex;
            slideBulletsCarousel(carouselType, interval, direction);
          }
        }
      }



      window.addEventListener('resize', handleWindowResize);



      function slideCarousel(type, interval, direction) {
        if (type == 'default') {
          index = shiftSlide(direction, carouselItems, carousel, carouselSlideWidth, index);
        } else if (type == 'infinite') {
          index = infiniteShiftSlide(direction, carouselItems, carousel, carouselSlideWidth, index);
        }

        window.clearTimeout(interval);
        interval = window.setTimeout(slideCarousel, 5000, type, interval, -1);
      }

      function slideBulletsCarousel(type, interval, direction) {
        index = shiftBulletsSlide(direction, carouselItems, carousel, carouselSlideWidth, index);
        console.log('index after slide: ' + index);
        window.clearTimeout(interval);
        interval = window.setTimeout(slideCarousel, 5000, type, interval, -1);
      }
    }
  }

  function handleWindowResize() {
    setCarouselWidth();
  }

  function setCarouselItemWidth(container, items, factor) {
    let carouselContainerWidth = container.clientWidth;
    for (let i = 0; i < items.length; i++) {
      items[i].style.width = parseInt(carouselContainerWidth / factor) + 'px';
    }
  }

  function setCarouselWidth(items, carousel) {
    let carouselWidth = items[0].getBoundingClientRect().width * items.length;
    carousel.style.width = parseInt(carouselWidth) + 'px';
  }

  function setCarouselSlideWidth(items) {
    return carouselSlideWidth = items[0].getBoundingClientRect().width;
  }



  function slideToCarouselItemIndex(index) {
    for (let i = 0; i < carouselItems.length; i++ ) {
      let transformAmount = - index * carouselSlideWidth;
      carouselItems[i].style.transform = 'translateX(' + transformAmount + 'px)';
    }
  }

  function shiftSlide(direction, items, carousel, slideWidth, index) {
    let currentPosition = 0;
    [].forEach.call(items, el => {
      el.classList.remove("active");
    });
    if (direction === 1) {
      index--;
      if (index >= 0) {
        currentPosition = -(direction * slideWidth) * (index);
      } else if (index == -1) {
        index = items.length - 1;

        currentPosition = -(direction * slideWidth) * (index);
      }

    } else if (direction === -1) {
      index++;
      if (index < items.length) {
        currentPosition = (direction * slideWidth) * index;
      } else if (index == items.length) {
        index = 0;
        currentPosition = 0;
      }
    }

    carousel.classList.add('transition');
    carousel.style.transform = 'translateX(' + currentPosition + 'px)';
    items[index].classList.add('active');

    setTimeout(function(){
      carousel.classList.remove('transition');
    }, 700);

    return index;
  }



  function infiniteShiftSlide(direction, items, carousel, slideWidth, index) {

    [].forEach.call(items, el => {
      el.classList.remove("active");
    });

    [].forEach.call(document.querySelectorAll('.carousel-bullets span'), bullet => {
      bullet.classList.remove("active");
    });

    if (direction === 1) {
      index--;

      let lastItem = carousel.querySelector('.carousel-item:last-child');
      lastItem.parentNode.prepend(lastItem);

      carousel.style.transform = 'translateX(' + (-direction * slideWidth) + 'px)';

      setTimeout(function(){
        carousel.classList.add('transition');
        carousel.style.transform = 'translateX( 0px)';
      }, 100);

      setTimeout(function(){
        carousel.classList.remove('transition');
      }, 800);

      carousel.querySelector('.carousel-item:nth-child(1)').classList.add('active');

    } else if (direction === -1) {
      index++;

      carousel.classList.add('transition');
      carousel.style.transform = 'translateX(' + (direction * slideWidth) + 'px)';

      setTimeout(function(){
        let firstItem = carousel.querySelector('.carousel-item:first-child');
        firstItem.parentNode.appendChild(firstItem);

        carousel.classList.remove('transition');
        carousel.style.transform = 'translateX(0px)';
      },700);

      carousel.querySelector('.carousel-item:nth-child(2)').classList.add('active');
    }
    if (index == items.length) {
      index = 0;
    }
    console.log('.carousel-bullets span:nth-child(' + (index + 1) +')');
    if (document.querySelector('.carousel-bullets span:nth-child(' + (index + 1) +')')) {
      document.querySelector('.carousel-bullets span:nth-child(' + (index + 1) +')').classList.add('active');
    } else {
      document.querySelector('.carousel-bullets span:nth-child(1)').classList.add('active');
    }
    console.log(index);
    return index;
  }

  function shiftBulletsSlide(direction, items, carousel, slideWidth, index) {
    [].forEach.call(items, el => {
      el.classList.remove("active");
    });

    index = index - direction;
    if (direction > 0) {
      for (let i = 0; i < direction; i++) {
        let lastItem = carousel.querySelector('.carousel-item:last-child');
        lastItem.parentNode.prepend(lastItem);
      }

      carousel.style.transform = 'translateX(' + (-direction * slideWidth) + 'px)';

      setTimeout(function(){
        carousel.classList.add('transition');
        carousel.style.transform = 'translateX( 0px)';
      }, 100);

      setTimeout(function(){
        carousel.classList.remove('transition');
      }, 800);

      carousel.querySelector('.carousel-item:nth-child(1)').classList.add('active');

    } else if (direction < -1) {

      carousel.classList.add('transition');
      carousel.style.transform = 'translateX(' + (direction * slideWidth) + 'px)';

      setTimeout(function(){
        direction = -(direction);
        for (let i = 0; i < direction; i++) {
          let firstItem = carousel.querySelector('.carousel-item:first-child');
          firstItem.parentNode.appendChild(firstItem);
        }
        carousel.classList.remove('transition');
        carousel.style.transform = 'translateX(0px)';
      },700);

      carousel.querySelector('.carousel-item:nth-child(2)').classList.add('active');
    }
    return index;
  }
})();

