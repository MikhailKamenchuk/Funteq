const formEl = document.querySelector('.form');
const searchFieldEl = document.querySelector('.form__search-field');
const frameWrapper = document.querySelector('.frame-wrapper');
const baseURL = 'https://vipsearch.guru/g.php?q=';

const sendRequest = params => fetch(`${baseURL}${params}`)
    .then(res => {
        if(res.ok){
            return res.json()
        }
        throw new Error('Something went wrong...')
    })
    .catch(error => console.log(error.message))

const createIframe = src => {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.style.width = "600px";
    iframe.style.opacity = '0';
    frameWrapper.appendChild(iframe);
}

formEl.addEventListener('submit', e => {
    e.preventDefault();
    frameWrapper.innerHTML = '';
    const searchParam = encodeURI(searchFieldEl.value);
    sendRequest(searchParam).then(
        data => {
            const {status, url} = data;
            if(status === 'success'){
                createIframe(url)
            }
        }
    );
}, false)

const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
const eventer = window[eventMethod];
const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function(e) {
    const key = e.message ? "message" : "data";
    const data = e[key];
    const { ad_height, status, found_ad } = data;
    if(status === 'success' && found_ad){
        const iFrame = document.querySelector('iframe')
        iFrame.style.height = `${ad_height}px`;
        iFrame.style.opacity = '1';
    }else{
        frameWrapper.innerHTML = 'No ads found...'
    }
},false);



