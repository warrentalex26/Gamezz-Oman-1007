(function () {

    let botonSiguiente = document.querySelector('.text-loading');
    botonSiguiente.style.display = 'none';

    let textLoading = document.querySelector('.text-loading-pin');
    textLoading.style.display = 'none';

    e = document.querySelectorAll('[lng_a]');
    for (var i = 0; i < this.e.length; i++) {
        this.e[i].classList.toggle('visible');
    }
    params();

})();

const endPoint = 'https://api.playplace.mobi/v1/?mclient=1007&mcountry=OM&mversion=1';
const url_id = 10552;
const offer_id = 4326;

let serviceId;
let operatorName;
let msisdn;
let pincode;
let transaction_id;
let flag;
let flagFunction;

function validar(e) {

    let msisdnValue = document.getElementById('mobile').value;
    let pinValue = document.getElementById('pin').value;

    tecla = (document.all) ? e.keyCode : e.which;
    patron = /\d/;
    te = String.fromCharCode(tecla);

    if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        if (msisdnValue != "" && flag === undefined) {
            btnNext1();
        }
        if (pinValue != "" && flag === true) {
            btnNext2();
        }
    }

    return patron.test(te)
}

function btnNext1() {
    if (flagFunction === false) {
        return;
    }

    msisdn = document.getElementById('mobile').value;

    if (msisdn.length === 8) {
        msisdn = `968${msisdn}`
    }

    if (msisdn.length === 9) {
        const sliceMsisdn = msisdn.substring(1, msisdn.length)
        msisdn = `968${sliceMsisdn}`
    }

    let numero = msisdn.substring(3, 6);
    let country = msisdn.substring(0, 3);

    if (msisdn.length === 11) {
        sendNumber(numero, country);
    } else {
        return alert('invalid phone number');
    }
}
function btnNext2() {
    if (flagFunction === false) {
        return;
    }

    pincode = document.getElementById('pin');
    let pintrim = pincode.value.trim();
    let parseEnt = parseInt(pincode.value);

    if (pincode.value == parseEnt) {
        if (pincode.value == null || pincode.value == "" || pintrim == "" || pincode.value.length < 4 || Number.isNaN(parseEnt)) {
            return alert('Invalid Pin');
        } else {
            pincode = pincode.value
            getPinVerification();
        }
    } else {
        return alert('Invalid Pin');
    }
}

function sendNumber(numero, country) {

    let slicemsisdn = msisdn.substring(3, msisdn.length);
    msisdn = `${country}${slicemsisdn}`;
    let numberOperators = [
        {
            number: ['71', '72', '901', '902', '903', '904', '905', '906', '907', '908', '909', '91', '92', '93', '98', '99'],
            operator: 'Omantel',
            serviceNumber: 137
        },
        {
            number: ['78', '79', '94', '95', '96', '97'],
            operator: 'Ooredoo',
            serviceNumber: 138
        },
    ];

    let numberFound = numberOperators.find(data => data.number.find(number => {
        let numberOmantel = numero.substring(0, 2);
        if (number === numero) {
            return number;
        } else if (number === numberOmantel) {
            return number;
        }
    }));

    if (numberFound != undefined) {
        if (msisdn.length === 11) {
            operatorName = numberFound.operator; //Set Operator Name
            serviceId = numberFound.serviceNumber; //Set Operator Name
            return getPinGeneration();
        } else {
            return alert('Invalid Phone Number');
        }
    } else {
        return alert('Invalid Phone Number');
    }
}

function getPinGeneration() {

    flagFunction = false

    let botonesBox = document.querySelectorAll('.text-btn11');
    let botonSiguiente = document.querySelector('.text-loading');

    botonSiguiente.style.display = 'inline-block';

    for (let index = 0; index < botonesBox.length; index++) {
        botonesBox[index].style.display = "none";
    }

    var req = new XMLHttpRequest();

    req.open('POST', endPoint, true);

    req.send(JSON.stringify({
        method: 'send_pin',
        "serviceId": serviceId,
        "msisdn": msisdn
    }));

    req.onreadystatechange = function () {

        if (req.status == 200 && req.readyState == 4) {

            flagFunction = true

            let data = JSON.parse(req.response);
            const { response, message } = data.response;
            if (response === true) {

                flag = true;

                let mobile_box = document.getElementById('mobile_box')
                let pin_box = document.getElementById('pin_box');

                mobile_box.style.display = 'none';
                pin_box.style.display = 'block';

                botonSiguiente.style.display = 'none';

                for (let index = 0; index < botonesBox.length; index++) {
                    if (botonesBox[index].classList.contains('visible')) {
                        botonesBox[index].style.display = "inline-block";
                    }
                }

                getTransactionId();

            } else {
                flagFunction = true

                for (let index = 0; index < botonesBox.length; index++) {
                    if (botonesBox[index].classList.contains('visible')) {
                        botonesBox[index].style.display = "inline-block";
                    }
                };
                botonSiguiente.style.display = 'none';
                return alert(message)
            }
        };
    }
}

function getPinVerification() {

    flagFunction = false

    let textLoading = document.querySelector('.text-loading-pin');
    let botonesBox = document.querySelectorAll('.text-btn12');

    for (let index = 0; index < botonesBox.length; index++) {
        botonesBox[index].style.display = "none";
    }

    textLoading.style.display = 'inline-block';

    var req = new XMLHttpRequest();

    req.open('POST', endPoint, true);

    req.send(JSON.stringify({
        method: 'confirm_pin',
        "serviceId": serviceId,
        "msisdn": msisdn,
        "pin": pincode
    }))

    req.onreadystatechange = function () {

        if (req.status == 200 && req.readyState == 4) {
            flagFunction = true

            let data = JSON.parse(req.response);
            const { response } = data.response;

            if (response == 'SUCCESS' || response == true) {
                flagFunction = true

                let pin_box = document.getElementById('pin_box');
                let resultado = document.getElementById('resultado')

                resultado.style.display = 'block';
                pin_box.style.display = 'none';

                //Send Lead
                gtag('event', 'conversion', { 'send_to': 'AW-590224479/viYzCJ6BmN4BEN-4uJkC' });
                //End Lead
                getPixel();


            } else {
                flagFunction = true
                alert(response);

                textLoading.style.display = 'none';

                for (let index = 0; index < botonesBox.length; index++) {
                    if (botonesBox[index].classList.contains('visible')) {
                        botonesBox[index].style.display = "inline-block";
                    }
                }
            }
        }
    };
}

function getTransactionId() {

    var req = new XMLHttpRequest();

    req.open('POST', endPoint, true);

    const { aff_id, aff_sub, aff_sub2, aff_sub3, aff_sub4, aff_sub5, placement, creative } = this.setSub_Id;

    req.onreadystatechange = function () {

        if (req.status === 200 && req.readyState === 4) {

            let data = JSON.parse(req.response)

            return transaction_id = data.response.data.transaction_id;
        }
    };

    req.send(JSON.stringify({
        "method": "transaction_id",
        "offer_id": offer_id,
        "aff_id": aff_id,
        "aff_sub": aff_sub,
        "url_id": url_id,
        "aff_sub2": aff_sub2,
        "aff_sub3": aff_sub3,
        "aff_sub4": aff_sub4,
        "aff_sub5": aff_sub5,
        "placement": placement,
        "creative": creative,
    }))
}

function getPixel() {
    var req = new XMLHttpRequest();

    req.open('POST', endPoint, true);

    req.onreadystatechange = function () {

        if (req.status == 200 && req.readyState == 4) {
            getRedirect();
        }
    };

    req.send(JSON.stringify({
        "method": "pixel_id",
        "offer_id": offer_id,
        "transaction_id": transaction_id,
        "msisdn": msisdn,
        "operador": operatorName
    }))
}

function getRedirect() {
    let urlredirectUrl = `http://outrixwave.com/gulfpay/contentAccessUrl?outrixId=${serviceId}&msisdn=${msisdn}`;
    setTimeout(() => {
        return window.location.href = urlredirectUrl;
    }, 3000);
}

function params() {
    let queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let aff_id = urlParams.get('aff_id');
    let aff_sub = urlParams.get('aff_sub');
    let aff_sub2 = urlParams.get('aff_sub2');
    let aff_sub3 = urlParams.get('aff_sub3');
    let aff_sub4 = urlParams.get('aff_sub4');
    let aff_sub5 = urlParams.get('aff_sub5');
    let gclid = urlParams.get('gclid');
    let placement = urlParams.get('placement');
    let creative = urlParams.get('creative');

    if (aff_id === null) {
        aff_id = 1;
    }

    if (!gclid) {
        aff_sub = ""
    } else {
        aff_sub = gclid;
    }

    this.setSub_Id = {
        aff_id,
        sub_source: aff_id,
        source_id: aff_id,
        aff_sub,
        aff_sub2,
        aff_sub3,
        aff_sub4,
        aff_sub5,
        placement,
        creative,
    }
}