(function(){
  //-- Config
  let firstCarousel = document.querySelector('.first-carousel-block');
  /* let secondCarousel = document.querySelector('.second-carousel-block');
  let thirdCarousel = document.querySelector('.third-carousel-block');
  let fourthCarousel = document.querySelector('.fourth-carousel-block'); */

  window.firstItemIndex = 0;
  /* window.secondItemIndex = 0;
  window.thirdItemIndex = 0;
  window.fourthItemIndex = 0; */

  /* window.thirdSlideInterval;
  window.fourthSlideInterval; */

  initCarousel(firstCarousel, 1, window.firstItemIndex, 'default', false);
  /* initCarousel(secondCarousel, 1, window.secondItemIndex, 'infinite', false);
  initCarousel(thirdCarousel, 1, window.thirdItemIndex, 'default', true, window.thirdSlideInterval);
  initCarousel(fourthCarousel, 1, window.fourthItemIndex, 'infinite', true, window.fourthSlideInterval); */

  function initCarousel(carouselBlock, factorNumber, index, carouselType, autoSlide, interval = null) {
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

        index--

        if (carouselType == 'default') {
          index = shiftSlide(1, carouselItems, carousel, carouselSlideWidth, index);
        } else if (carouselType == 'infinite') {
          index = infiniteShiftSlide(1, carouselItems, carousel, carouselSlideWidth, index);
        }

      });

      carouselRight.addEventListener('click', function(e) {
        e.preventDefault();

        index++

        if (carouselType == 'default') {
          index = shiftSlide(-1, carouselItems, carousel, carouselSlideWidth, index);
        } else if (carouselType == 'infinite') {
          index = infiniteShiftSlide(-1, carouselItems, carousel, carouselSlideWidth, index);
        }
      });

      if (window.innerWidth < 700) {
        factorNumber = 1;
      }

      else if (window.innerWidth < 800) {
        factorNumber = 2;
      }



      if (autoSlide == true) {
        interval = window.setTimeout(slideCarousel, 2000, carouselType, interval);
      }


      window.addEventListener('resize', handleWindowResize);

      function slideCarousel(type, interval) {
        console.log(type);

        if (type == 'default') {
          index++;
          index = shiftSlide(-1, carouselItems, carousel, carouselSlideWidth, index);
        } else if (type == 'infinite') {
          index--;
          index = infiniteShiftSlide(1, carouselItems, carousel, carouselSlideWidth, index);
        }

        window.clearTimeout(interval);
        interval = window.setTimeout(slideCarousel, 2000, type, interval);
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
      console.log('we go left');
      console.log(index);
      if (index >= 0) {
        currentPosition = -(direction * slideWidth) * (index);
        console.log('prev');
      } else if (index == -1) {
        console.log('last');
        index = items.length - 1;

        currentPosition = -(direction * slideWidth) * (index);
      }

    } else if (direction === -1) {
      console.log('we go right');
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

    if (direction === 1) {
      console.log('left');

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
      console.log('right');

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
  }
})();

