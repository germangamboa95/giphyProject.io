const StorageCtrl = (function() {

  myStorage = window.localStorage;

  const store = {
    categories: []
  }

  const setToLocal = function() {
    const parsedStore = JSON.stringify(store);
    console.log(parsedStore);
    myStorage.setItem('store',parsedStore);
  }



  return {
    storeCategory: store,
    setToLocal: setToLocal
  }


})()

const UICtrl = (function(StorageCtrl) {




  const onScreen = {
    keyword: 'Cats',
    limit: 12,
    offset: 0,

  }

  const htmlHooks = {
    modalStore: 'modals',
    pagination: '.pagination',
    searchBar: '#search',
    categorySection: '.categories',
    currentPage: document.querySelector('.starter')
  }


  //Row Generator and cardTemplate take care of generating the gallery as needed.
  const rowGenerator = function(data) {

    let container = document.createElement('div');
    let node = document.createElement('div');
    node.classList.add('row');
    data.forEach((item, index) => {
      node.innerHTML += cardTemplate(item);
    });
    container.appendChild(node);

    return container;
  }

  const cardTemplate = function(data) {
    const info = {
      imgStill: data.images['480w_still'].url,
      imgGif: data.images['downsized'].url,
      id: data.id,
      rating: data.rating,
      createdDate: data.import_datetime
    }
    let cardMarkUp =
      `
      <div  class="card mb-3 mx-auto mx-md-0 p-0 col-md-3" data-id="${info.id}">
        <img data-toggle="modal" data-target="#${info.id}"  src="${info.imgStill}"
          alt="Card image">
        <div class="card-body">
          <p class="card-text">Rating: ${info.rating.toUpperCase()}</p>
          <p class="card-text">Date Added: ${info.createdDate}</p>
          <butto data-id="${info.id}"  class="btn btn-primary save-me">Save</button>
        </div>



      </div>
      `;

    let modal = `<div class="modal" id='${info.id}'>
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <img data-toggle="modal" data-target="" style="height: auto; width: 100%; display: block;" src="${info.imgGif}"
            alt="Card image">

        </div>
      </div></div>`;

    $(htmlHooks.modalStore).append(modal);

    return cardMarkUp;
  };
  //getSearchImages automatically calls the functions that generate the gallery
  const getSearchImages = function() {
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=YqLensbIWv5skyGVSr6ZPFClfQImMmX4&q=${onScreen.keyword}&limit=${onScreen.limit}&offset=${onScreen.offset}&rating=G&lang=en`)
      .then(res => res.json())
      .then(data => {
        let foo = rowGenerator(data.data);
        $('.img-gal').html(foo);
        saveCategories();
        $('.save-me').on('click', function(e) {
          console.log(this);
          let val = $(this).attr('data-id')




        });
      });
  }

  const categoryBtn = function() {
    $('.categories .row').append(`<button data-word="${onScreen.keyword}" class="btn btn-large btn-info  col-3 col-md-3 m-1">${onScreen.keyword}</button>`);
  }

  const searchListUpdate = function() {
    $('.search-list').append(`<li class="list-group-item p-0 pt-2">${onScreen.keyword}</li>`);
  }

  const saveCategories = function() {
    let key  = onScreen.keyword.toLowerCase();
    if(StorageCtrl.storeCategory.categories.indexOf(key) == -1) {
      StorageCtrl.storeCategory.categories.push(key);
      StorageCtrl.setToLocal();

    }
    console.log(StorageCtrl.storeCategory.categories);

  }

  // Event listners
  $(htmlHooks.pagination).on('click', '.page-item', function() {
    htmlHooks.currentPage.classList.remove('active');
    htmlHooks.currentPage = this;
    this.classList.add('active');
    const value = this.attributes.value.value;
    onScreen.offset = value * onScreen.limit;
    getSearchImages();
  });

  $(htmlHooks.searchBar).on('submit', function(e) {
    e.preventDefault();
    let query = e.target[1].value;
    onScreen.keyword = query;
    getSearchImages();
    e.target[1].value = '';
    searchListUpdate();
    categoryBtn();
  });

  $(htmlHooks.categorySection).on('click', '.btn', function() {
    let word = $(this).attr('data-word');
    onScreen.keyword = word;
    getSearchImages();


  });



  //Public Methods
  return {
    init: getSearchImages
  }

})(StorageCtrl);





UICtrl.init();
