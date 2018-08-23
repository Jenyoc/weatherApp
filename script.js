window.onload = function () {
  var changeCityButton = document.querySelector('.changeCityButton'),
    weatherBox = document.querySelector('.weatherBox'),
    arrowBackBox = document.querySelector('.back'),
    arrowForwardBox = document.querySelector('.forward'),
    timelistBox = document.querySelector('.timeListBox'),
    newPageButtonBox = document.querySelector('.newPageButtonBox'),
    main = document.querySelector('.main'),
    pickerBox = document.querySelector('.pickerBox'),
    header = document.querySelector('.header'),
    cityList = document.querySelector('.cityList'),
    flexCol = document.querySelector('.flexCol'),
    sources, check = 0,
    cities = ['Minsk', 'Navapolatsk', 'Hrodna', 'Brest'],
    targetCity, citySpan, timeBlock, dayBlock, allDaysBox,
    weatherHours = [0, 1, 2, 3, 4, 5, 6, 7],
    weatherDate = 0, weatherRequest = new XMLHttpRequest();

  function addCitiesToList() {
    cities.forEach(function (city) {
        citySpan = createElement('option', {text: city, value: city});
        cityList.add(citySpan);
      }
    );
  }

  addCitiesToList();

  function setEvent() {
    if (check === 0) {
      cityList.addEventListener('change', showWeather);
    }
    else {
      cityList.addEventListener('change', newPageOpen);
    }
  }

  setEvent();

  var url = 'https:/api.openweathermap.org/data/2.5/forecast?q=Minsk,by&APPID=05b4798836b87272780eca72486a4dab';

  weatherRequest.open('GET', url);
  weatherRequest.send();
  if (weatherRequest === undefined) {
    targetCity = cityList.value;
    weatherRequest.open('GET', url);
    weatherRequest.send();
  }
  showLoadingAnimation();
  weatherRequest.onload = function () {
    weatherBox.innerHTML = '';
    sources = JSON.parse(weatherRequest.response).list;
    timelistBox.innerHTML = '';
    weatherHours.forEach(function (item) {
        timeBlock = createElement('span', {
          id: weatherDate,
          innerText: convertUTCDateToLocalDate(new Date(sources[weatherDate].dt_txt)).getHours() + ':00',
          className: 'timeBlock btn' + item
        });
        timelistBox.appendChild(timeBlock);
        timeBlock.addEventListener('click', setWeatherHour);
        weatherDate++;
      }
    );
    newPageButtonBox.innerHTML = '<button class="newPageButton">Go to full forecast</button>';
    var newPageButton = document.querySelector('.newPageButton');
    newPageButton.addEventListener('click', newPageOpen);
    weatherDate = 0;
    showWeather();
  };

  function showDate() {
    return parseInt(convertUTCDateToLocalDate(new Date(sources[weatherDate].dt_txt)).getDate());
  }

  function showPlusOrMinus() {

    if (sources[weatherDate].main.temp < 273) {
      return '-';
    }

    else if (sources[weatherDate].main.temp > 273) {
      return '+';
    }

    else {
      return '';
    }
  }

  function showWeatherIcon() {
    if (sources[weatherDate].weather[0].main = 'Clouds') {
      return '<img src="https://png.icons8.com/metro/27/EEE8AA/clouds.png">';
    }
    else if (sources[weatherDate].weather[0].main = 'Rain') {
      return '<img src="https://png.icons8.com/ios/27/EEE8AA/rain.png">'
    }
    else {
      return '<img src="https://png.icons8.com/ios/27/EEE8AA/sun-filled.png">';
    }
  }

  function showLoadingAnimation() {
    weatherBox.innerHTML = '<div class="loader"></div><p class="loaderText">Loading</p>';
  }

  function showArrows() {
    arrowBackBox.innerHTML = '<div class="arrow left">' + '<' + '</div>';
    arrowForwardBox.innerHTML = '<div class="arrow right">' + '>' + '</div>';
    var arrowBack = document.querySelector('.left'),
      arrowForward = document.querySelector('.right');
    arrowBack.addEventListener('click', clickBack);
    arrowForward.addEventListener('click', clickForward);
  }

  function clearLeftArrow() {
    arrowBackBox.innerHTML = '';
  }

  function clearRightArrow() {
    arrowForwardBox.innerHTML = '';
  }

  function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

  function showWeather(event) {
    weatherBox.innerHTML = '';
    if (check === 0) {
      timeBlock.classList.remove('btnBorder');
      if (weatherDate >= 0 && weatherDate < 8) {
        timeBlock = document.querySelector('.btn' + weatherDate);
      }
      else if (weatherDate >= 8 && weatherDate < 16) {
        timeBlock = document.querySelector('.btn' + parseInt(weatherDate - 8));
      }
      else if (weatherDate >= 16 && weatherDate < 24) {
        timeBlock = document.querySelector('.btn' + parseInt(weatherDate - 16));
      }
      else if (weatherDate >= 24 && weatherDate < 32) {
        timeBlock = document.querySelector('.btn' + parseInt(weatherDate - 24));
      }
      else {
        timeBlock = document.querySelector('.btn' + parseInt(weatherDate - 32));
      }
      timeBlock.classList.add('btnBorder');
    }
    if (event === undefined && targetCity === undefined) {
      targetCity = 'Minsk';
    }

    else if (event === undefined) {
      targetCity = cityList.value;
    }

    else {
      targetCity = cityList.value;
    }

    var url = 'https:/api.openweathermap.org/data/2.5/forecast?q=' + targetCity + ',by&APPID=05b4798836b87272780eca72486a4dab';

    weatherRequest.open('GET', url);
    weatherRequest.send();
    if (weatherRequest === undefined) {
      targetCity = cityList.value;
      weatherRequest.open('GET', url);
      weatherRequest.send();
    }
    showLoadingAnimation();
    weatherRequest.onload = function () {
      weatherBox.innerHTML = '';
      sources = JSON.parse(weatherRequest.response).list;
      renderWeather();
    };
  }

  function renderWeather() {
    var weatherBlock = createElement('div', {className: 'weatherBlock'});
    weatherBlock.innerHTML =
      '<h1 class="head1">' + cityList.value + '</h1>' +
      '<h2 class="head2">' +
      showDate() + '.' +
      parseInt(convertUTCDateToLocalDate(new Date(sources[weatherDate].dt_txt)).getMonth() + 1) + '.' +
      convertUTCDateToLocalDate(new Date(sources[weatherDate].dt_txt)).getFullYear() +
      '</h2>' +
      '<p class="string">' + showPlusOrMinus() + parseInt(sources[weatherDate].main.temp - 273) + '°</p>' +
      '<p class="string">' + 'wind speed: ' + sources[weatherDate].wind.speed + '</p>' +
      showWeatherIcon() + '<p class="string">' + sources[weatherDate].weather[0].main + '</p>';
    weatherBox.appendChild(weatherBlock);
    showArrows();
  }

  function createElement(elemName, options, attributes) {
    attributes = attributes || {};
    var elem = document.createElement(elemName);
    Object.assign(elem, options);
    Object.keys(attributes).forEach(function (key) {
      elem.setAttribute(key, attributes[key]);
    });
    return elem;
  }

  function setWeatherHour(event) {
    if (weatherDate >= 0 && weatherDate < 8) {
      weatherDate = parseInt(event.target.getAttribute('id'));
    }
    else if (weatherDate >= 8 && weatherDate < 16) {
      weatherDate = parseInt(event.target.getAttribute('id') + 8);
    }
    else if (weatherDate >= 16 && weatherDate < 24) {
      weatherDate = parseInt(event.target.getAttribute('id') + 16);
    }
    else if (weatherDate >= 24 && weatherDate < 32) {
      weatherDate = parseInt(event.target.getAttribute('id') + 24);
    }
    else {
      weatherDate = parseInt(event.target.getAttribute('id') + 32);
    }


    if (weatherDate < 0 || weatherDate > 39) {
      weatherDate = 0;
    }
    showWeather();
  }

  function reload() {
    window.location.reload();
  }

  function setWeatherDate() {
    weatherRequest.abort();
    clearRightArrow();
    clearLeftArrow();
    weatherDate = parseInt(((picker.dateSelected - Date.now()) / 1000 / 60 / 60 / 24) * 8);
    if (weatherDate <= 39 && weatherDate >= 0) {
      showWeather();
    }
    else {
      weatherBox.innerHTML = '<div class="errorBox">' + '<h1>' +
        picker.dateSelected.getDate() + '.' +
        parseInt(picker.dateSelected.getMonth() + 1) + '.' +
        picker.dateSelected.getFullYear() +
        '</h1>' +
        '<h2>' + '(NO DATA)' + '</h2>' + '</div>';
    }
  }

  function clickBack() {

    weatherRequest.abort();
    clearLeftArrow();
    var i = picker.dateSelected.getDate();
    weatherDate = weatherDate - 8;
    if (weatherDate >= 0 && weatherDate <= 39) {
      i--;
      picker.dateSelected.setDate(i);
      showWeather();
    }

    else {
      picker.dateSelected.setDate(i);
      weatherBox.innerHTML = '<div class="errorBox">' + '<h1>' +
        parseInt(picker.dateSelected.getDate() - 1) + '.' +
        parseInt(picker.dateSelected.getMonth() + 1) + '.' +
        picker.dateSelected.getFullYear() +
        '</h1>' +
        '<h2>' + '(NO DATA)' + '</h2>' + '</div>';
    }
  }

  function clickForward() {
    weatherRequest.abort();
    clearRightArrow();
    var i = picker.dateSelected.getDate();
    weatherDate = weatherDate + 8;
    if (weatherDate <= 39 && weatherDate >= 0) {
      i++;
      picker.dateSelected.setDate(i);
      showWeather();
    }

    else {
      if (weatherDate === 47) {
        i++
      }
      picker.dateSelected.setDate(i);
      weatherBox.innerHTML = '<div class="errorBox">' + '<h1>' +
        parseInt(picker.dateSelected.getDate() + 1) + '.' +
        parseInt(picker.dateSelected.getMonth() + 1) + '.' +
        picker.dateSelected.getFullYear() +
        '</h1>' +
        '<h2>' + '(NO DATA)' + '</h2>' + '</div>';
    }
  }

  function newPageOpen(event) {
    targetCity = cityList.value;
    var url = 'https:/api.openweathermap.org/data/2.5/forecast?q=' + targetCity + ',by&APPID=05b4798836b87272780eca72486a4dab';
    weatherRequest.open('GET', url);
    weatherRequest.send();

    showLoadingAnimation();

    weatherRequest.onload = function () {
      document.body.setAttribute('class', 'cityBg');
      timelistBox.innerHTML = '';
      header.removeChild(pickerBox);
      newPageButtonBox.innerHTML = '<button class="homeButton">HOME</button>';
      var homeButton = document.querySelector('.homeButton');
      homeButton.addEventListener('click', reload);
      sources = JSON.parse(weatherRequest.response).list;
      check = 1;
      setEvent();
      flexCol.innerHTML = '<section class="allDaysBox"></section>';
      var allDays = [0, 8, 16, 24, 32];
      allDaysBox = document.querySelector('.allDaysBox');
      allDays.forEach(function (day) {
        dayBlock = createElement('div', {className: 'dayBlock'});
        dayBlock.innerHTML =
          '<h1 class="head1">' + cityList.value + '</h1>' +
          '<h2 class="head2">' +
          parseInt(convertUTCDateToLocalDate(new Date(sources[day].dt_txt)).getDate()) + '.' +
          parseInt(convertUTCDateToLocalDate(new Date(sources[day].dt_txt)).getMonth() + 1) + '.' +
          convertUTCDateToLocalDate(new Date(sources[day].dt_txt)).getFullYear() +
          '</h2>' +
          '<p class="string">' + showPlusOrMinus() + parseInt(sources[day].main.temp - 273) + '°</p>' +
          '<p class="string">' + 'wind speed: ' + sources[day].wind.speed + '</p>' +
          showWeatherIcon() + '<p class="string">' + sources[day].weather[0].main + '</p>';
        allDaysBox.appendChild(dayBlock);
      });
    };
    picker=undefined;
  }

  var day = new Date(),
    hour = day.getHours();

  if (hour >= 5 && hour < 12) {
    document.body.setAttribute('class', 'bgMorning');
  } else if (hour >= 12 && hour < 17) {
    document.body.setAttribute('class', 'bgDay');
  } else if (hour >= 17 && hour < 22) {
    document.body.setAttribute('class', 'bgEvening');
  } else {
    document.body.setAttribute('class', 'bgNight');
  }
  var picker = datepicker('.datepicker', {
    dateSelected: new Date,
    position: 'br',
    onSelect: setWeatherDate,
    startDay: 1
  })
};
